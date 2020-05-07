#!/usr/bin/env node
"use strict";
const https = require("https");
const [pkgName] = process.argv.slice(2);
const colors = {
  r: "\x1b[0m",
  y: "\x1b[33m",
  d: "\x1b[2m",
};
const request = ([hostname, path]) =>
  new Promise((resolve, reject) => {
    https.get({ hostname, path, headers: { "User-Agent": "" } }, (response) => {
      const data = [];
      response.on("data", (fragment) => data.push(fragment));
      response.on("end", () => resolve(JSON.parse(Buffer.concat(data))));
      response.on("error", (error) => reject(error));
    });
  }).catch((e) => console.error(e));
const color = (v, c) => `${colors[c] + v + colors.r}`;
const label = (v) => `${color(v, "y")} `;
const date = (v) => `${v.getDate()}/${v.getMonth() + 1}/${v.getFullYear()}`;
const formatBytes = (v) => (v >= 1024 ? `${(v / 1024).toFixed(1)}KB` : `${v}B`);
const log = (v) => console.log(v ? `    ${v}` : "");

(async () => {
  const npms = await request([
    "api.npms.io",
    `/v2/package/${encodeURIComponent(pkgName)}`,
  ]);
  if (npms.code) {
    return log(npms.message);
  }
  const {
    collected: { metadata, github, npm },
  } = npms;
  const bp = await request([
    "bundlephobia.com",
    `/api/size?package=${pkgName}`,
  ]);
  const repo = metadata.links.repository.split("/");
  const { total_count: prCount } = await request([
    "api.github.com",
    `/search/issues?q=repo:${repo[3]}/${repo[4]}+is:pr+state:open&per_page=1`,
  ]);
  log();
  log(
    `${metadata.name} - v${metadata.version} (Published ${date(
      new Date(metadata.date)
    )})`
  );
  log(color(metadata.description, "d"));
  log();
  log(
    `${label("Size / Gzipped")}   ${formatBytes(bp.size)} / ${formatBytes(
      bp.gzip
    )}`
  );
  log(
    `${label("Downloads")}        ${npm.downloads[
      npm.downloads.length - 1
    ].count.toLocaleString()}`
  );
  log(`${label("Open issues / PRs") + github.issues.openCount} / ${prCount}`);
  log(`${label("Github Stars")}     ${github.starsCount.toLocaleString()}`);
  log();
  log(`${label("NPM")}     ${metadata.links.npm}`);
  log(`${label("Homepage") + metadata.links.homepage}`);
  log(`${label("Repo")}    ${metadata.links.repository}`);
  log();
  log(`${label("Liscnce") + metadata.license}`);
})();
