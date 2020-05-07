import { preserveShebangs } from "rollup-plugin-preserve-shebangs";
import { terser } from "rollup-plugin-terser";
import fs from "fs";

const pkg = JSON.parse(fs.readFileSync("./package.json"));

export default {
  input: "src/cli.js",
  plugins: [terser(), preserveShebangs()],
  output: [
    { file: pkg.main, format: "cjs" },
    { file: pkg.module, format: "es" },
    { file: pkg["umd:main"], format: "umd", name: pkg.name },
  ],
};
