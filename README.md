> **Caution**: Highly experimental WIP!

# lorren

Lorren is a tool that aims to enforce semantic versioning.<br>
It generates a `.types-lock.json` based on your Flow types which is later used to compare versions and propose the next version.

## Why?
I am maintaining Fela, a CSS in JS solution with a huge ecosystem. It is a monorepo with more than 25 packages which have inner dependencies. Manually keeping up with all the changes and correct version updates is nearly impossible without proper tooling.<br>
The result is breaking changes within patch-releases which can destroy your whole project.

## How it works

Interally we use webpack to walk through your code starting at a given entry point. It uses a babel plugin to extract parameter and return types from your APIs starting at the top-level public APIs.<br>
It then generates a JSON-based lock-file containing all types grouped by filename.

This lock-file can then be used to compare your API changes. Depending on what and how your APIs change, we can then propose the correct version following semantic versioning.


| Benefits | Caveats |
| -------- | ------- |
| • enforces SemVer using Flow<br>• keeps track of changes automatically<br>• helps to evaluate changes<br> | • only works with 100% Flow coverage<br> &nbsp;&nbsp; - at least for public API<br>• might not catch all edge cases<br>• doesn't (yet) support TypeScript |

## Installation
```sh
yarn add --dev lorren
```
Alternatively use `npm i --save-dev lorren`.

## Usage
Not usable yet, coming soon.

## API