<h1 align="center">
  🔍 <br/>
  PkgLookup

[![npm](https://img.shields.io/npm/v/pkglookup.svg?style=flat-square)](https://www.npmjs.com/package/pkglookup)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/pkglookup.svg?style=flat-square)](https://www.npmjs.com/package/pkglookup)
![](https://img.shields.io/badge/licence-MIT-blue.svg?style=flat-square)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

</h1>

PkgLookup is a simple CLI tool to help get details on NPM packages.

## Install

```sh
yarn global add pkglookup

# or

npm install -g pkglookup
```

## Usage

The easiest way to use PkgLookup is via `npx`, the below command will return a short summary of the package, including is size (minifed and gzipped).

```sh
npx pkglookup react
```

There is two level of verbosity to provide more information on the package

```sh
npx pkglookup preact -v

# or

npm pkglookup vue -vv
```
