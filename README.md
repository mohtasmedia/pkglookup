<h1 align="center">
  🔍 <br/>
  pkg-Lookup

[![npm](https://img.shields.io/npm/v/pkg-lookup.svg?style=flat-square)](https://www.npmjs.com/package/pkg-lookup)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/pkg-lookup.svg?style=flat-square)](https://www.npmjs.com/package/pkg-lookup)
[![Maintainability](https://api.codeclimate.com/v1/badges/9e1c94798c83e9d394df/maintainability)](https://codeclimate.com/github/mohtasmedia/pkg-lookup/maintainability)
![](https://img.shields.io/badge/licence-MIT-blue.svg?style=flat-square)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

</h1>

`pkg-lookup` is a simple CLI tool to help get details on NPM packages.

## Install

```sh
yarn global add pkg-lookup

# or

npm install -g pkg-lookup
```

## Usage

The easiest way to use PkgLookup is via `npx`, the below command will return a short summary of the package, including is size (minifed and gzipped).

```sh
npx pkg-lookup react
```

There is two level of verbosity to provide more information on the package

```sh
npx pkg-lookup preact -v

# or

npm pkg-lookup vue -vv
```
