import * as https from "https";

const colors = {
  r: "",
  y: "\x1b[33m",
  d: "\x1b[2m",
};
const request = ([hostname, path]) =>
  new Promise((resolve, reject) => {
    https.get({ hostname, path, headers: { "User-Agent": "" } }, (response) => {
      let data = [];
      response.on("data", (fragment) => data.push(fragment));
      response.on("end", () =>
        resolve(JSON.parse(Buffer.concat(data).toString()))
      );
      response.on("error", (error) => reject(error));
    });
  }).catch((e) => console.error(e));
const color = (v, c) => `${colors[c] + v}\x1b[0m`;
const label = (v) => `${color(v, "y")}: `;
const date = (v) => `${v.getDate()}/${v.getMonth() + 1}/${v.getFullYear()}`;
const formatBytes = (v) => (v >= 1024 ? `${(v / 1024).toFixed(1)}KB` : `${v}B`);
const log = (v?: string) => console.log(v ? `    ${v}` : "");

export default {
  request,
  color,
  label,
  date,
  formatBytes,
  log,
};
