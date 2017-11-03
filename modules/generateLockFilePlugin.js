const fs = require('fs')

const typeAlias = {
  StringTypeAnnotation: 'String',
  StringLiteral: 'String',
  NumberTypeAnnotation: 'Number',
  NumericLiteral: 'Number',
  ArrayExpression: 'Array',
  BooleanLiteral: 'Boolean'
}

const MISSING_TYPE = 'MISSING_TYPE'

module.exports = function() {
  const typeFile = {}
  let fileName = ''

  const functionTraverse = (path, state) => {
    const functionName = path.node.id ? path.node.id.name : path.node.key.name

    const paramTypes = path.node.params.map(param => {
      if (param.typeAnnotation) {
        return typeAlias[param.typeAnnotation.typeAnnotation.type]
      } else {
        console.log(
          `Parameter "${param.name}" in "${functionName}" (${fileName}) is missing type annotations.`
        )
        return MISSING_TYPE
      }
    })

    let returnType = path.node.returnType.typeAnnotation.type

    const shape = {
      name: functionName,
      params: paramTypes
    }

    if (returnType === 'GenericTypeAnnotation') {
      const innerTypes = {}

      path.traverse({
        ReturnStatement(returnPath) {
          returnPath.traverse({
            ObjectProperty(propPath) {
              innerTypes[propPath.node.key.name] =
                typeAlias[propPath.node.value.type]
            },
            ObjectMethod(methPath) {
              innerTypes[methPath.node.key.name] = functionTraverse(methPath)
            }
          })
        }
      })

      shape.return = innerTypes
    } else {
      shape.return = typeAlias[returnType]
    }

    return shape
  }
  return {
    inherits: require('babel-plugin-syntax-flow'),

    visitor: {
      Program: {
        enter(path, state) {
          fileName = state.file.opts.sourceFileName

          if (!typeFile[fileName]) {
            typeFile[fileName] = []
          }
        },
        exit(path, state) {
          if (Object.keys(typeFile[fileName]).length === 0) {
            delete typeFile[fileName]
          }

          fs.writeFile(
            '.types-lock.json',
            JSON.stringify(typeFile, null, 2),
            err => {
              if (err) throw err

              console.log(`Types for ${fileName} added to .types-lock.json.`)
            }
          )
        }
      },
      FunctionDeclaration(path, state) {
        typeFile[fileName].push(functionTraverse(path))
      }
    }
  }
}
