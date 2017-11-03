const fs = require("fs");

const typeAlias = {
  StringTypeAnnotation: "String",
  StringLiteral: "String",
  NumberTypeAnnotation: "Number",
  NumericLiteral: "Number",
  ArrayExpression: "Array",
  BooleanLiteral: "Boolean"
};

module.exports = function() {
  const typeFile = {};

  const functionTraverse = (path, state) => {
    const paramTypes = path.node.params.map(
      param => typeAlias[param.typeAnnotation.typeAnnotation.type]
    );

    let returnType = path.node.returnType.typeAnnotation.type;

    const shape = {
      name: path.node.id ? path.node.id.name : path.node.key.name,
      params: paramTypes
    };

    if (returnType === "GenericTypeAnnotation") {
      const innerTypes = {};

      path.traverse({
        ReturnStatement(returnPath) {
          returnPath.traverse({
            ObjectProperty(propPath) {
              innerTypes[propPath.node.key.name] =
                typeAlias[propPath.node.value.type];
            },
            ObjectMethod(methPath) {
              innerTypes[methPath.node.key.name] = functionTraverse(methPath);
            }
          });
        }
      });

      shape.return = innerTypes;
    } else {
      shape.return = typeAlias[returnType];
    }

    return shape;
  };
  return {
    inherits: require("babel-plugin-syntax-flow"),

    visitor: {
      Program: {
        enter(path, state) {
          const relativeFilename = state.file.opts.sourceFileName;

          if (!typeFile[relativeFilename]) {
            typeFile[relativeFilename] = [];
          }
        },
        exit(path, state) {
          const relativeFilename = state.file.opts.sourceFileName;

          if (Object.keys(typeFile[relativeFilename]).length === 0) {
            delete typeFile[relativeFilename];
          }

          fs.writeFile(
            ".types-lock.json",
            JSON.stringify(typeFile, null, 2),
            err => {
              if (err) throw err;

              console.log(
                "Types for " + relativeFilename + " added to .types-lock.json."
              );
            }
          );
        }
      },
      FunctionDeclaration(path, state) {
        const relativeFilename = state.file.opts.sourceFileName;

        typeFile[relativeFilename].push(functionTraverse(path, state));
      }
    }
  };
};
