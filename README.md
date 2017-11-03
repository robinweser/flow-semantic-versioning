> **Caution**: Highly experimental WIP!

# lorren

Lorren is a tool that aims to enforce semantic versioning.<br>
It generates a `.types-lock.json` based on your Flow types which is later used to compare versions and propose the next version.

## Benefits
* enforces SemVer using Flow
* keeps track of changes automatically
* helps to evaluate changes

## Caveats
* only works with 100% Flow coverage
  - at least for public API
* might not catch all edge cases
* doesn't (yet) support TypeScript

## Installation
```sh
yarn add --dev lorren
```
Alternatively use `npm i --save-dev lorren`.

## Usage
