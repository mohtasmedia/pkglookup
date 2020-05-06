#!/usr/bin/env node
const https = require("https");
const [pkgName] = process.argv.slice(2);
const kb = 1024;

const request = async ([hostname, path]) =>
  new Promise((res, rej) => {
    https.get({ hostname, path, headers: { "User-Agent": "" } }, (r) => {
      const data = [];
      r.on("data", (f) => data.push(f));
      r.on("end", () => res(JSON.parse(Buffer.concat(data))));
      r.on("error", (e) => rej(e));
    });
  }).catch((e) => e);
const date = (v) => `${v.getDay()}/${v.getMonth() + 1}/${v.getFullYear()}`;
const formatBytes = (v) => (v >= kb ? `${(v / kb).toFixed(1)}KB` : `${v}B`);
const log = (t, v) =>
  console.log(`    ${t ? `\x1b[31m${t}\x1b[0m: ` : ""}${v}`);

(async () => {
  const npm = await request([
    "api.npms.io",
    `/v2/package/${encodeURIComponent(pkgName)}`,
  ]);

  if (npm.code === "NOT_FOUND") {
    return console.log(npm.message);
  }

  const {
    collected: { metadata, github },
  } = npm;

  const bp = await request([
    "bundlephobia.com",
    `/api/size?package=${pkgName}`,
  ]);
  const repo = metadata.links.repository.split("/");
  const { total_count: prCount } = await request([
    "api.github.com",
    `/search/issues?q=repo:${repo[3]}/${repo[4]}+is:pr+state:open&per_page=1`,
  ]);

  console.log();
  log(null, `${metadata.name} - v${metadata.version}`);
  log(null, metadata.description);
  console.log();
  log("Size / Gzipped", `${formatBytes(bp.size)} / ${formatBytes(bp.gzip)}`);
  log("Open issues / PRs", `${github.issues.openCount} / ${prCount}`);
  log("Last updated", date(new Date(metadata.date)));
  log("Liscnce", metadata.license);
  console.log();
  log("NPM", metadata.links.npm);
  log("Homepage", metadata.links.homepage);
  log("Repo", metadata.links.repository);
})();
