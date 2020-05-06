import { terser } from "rollup-plugin-terser";
import fs from "fs";

const pkg = JSON.parse(fs.readFileSync("./package.json"));

export default {
  input: "src/index.js",
  plugins: [terser()],
  output: [
    { file: pkg.main, format: "cjs" },
    { file: pkg.module, format: "es" },
    { file: pkg["umd:main"], format: "umd", name: pkg.name },
  ],
};
