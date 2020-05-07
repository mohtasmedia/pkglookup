#!/usr/bin/env node
"use strict";
const https = require("https");
const [pkgName, ...flags] = process.argv.slice(2);
const request = ([hostname, path]) =>
  new Promise((resolve, reject) => {
    https.get({ hostname, path, headers: { "User-Agent": "" } }, (response) => {
      const data = [];
      response.on("data", (fragment) => data.push(fragment));
      response.on("end", () => resolve(JSON.parse(Buffer.concat(data))));
      response.on("error", (error) => reject(error));
    });
  }).catch((e) => console.error(e));
const color = (v, c) => {
  const colors = {
    reset: "\x1b[0m",
    underline: "\x1b[4m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    dim: "\x1b[2m",
  };

  return `${colors[c] + v + colors.reset}`;
};
const label = (v) => `${color(v, "yellow")}: `;
const date = (v) => `${v.getDate()}/${v.getMonth() + 1}/${v.getFullYear()}`;
const formatBytes = (v) => (v >= 1024 ? `${(v / 1024).toFixed(1)}KB` : `${v}B`);
const log = (v) => console.log(`    ${v ? v : ""}`);

(async () => {
  try {
    const npm = await request([
      "api.npms.io",
      `/v2/package/${encodeURIComponent(pkgName)}`,
    ]);

    if (npm.code === "NOT_FOUND") {
      return console.log(npm.message);
    }

    const {
      collected: {
        metadata,
        github,
        npm: { downloads },
      },
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

    log();
    log(
      `${metadata.name} - v${metadata.version} (Published ${date(
        new Date(metadata.date)
      )})`
    );
    log(color(metadata.description, "dim"));
    log();
    log(
      `${label("Size / Gzipped") + formatBytes(bp.size)} / ${formatBytes(
        bp.gzip
      )}`
    );
    log(
      `${
        label("Total Downloads") +
        downloads[downloads.length - 1].count.toLocaleString()
      }`
    );
    log(`${label("Open issues / PRs") + github.issues.openCount} / ${prCount}`);
    log(`${label("Github Stars") + github.starsCount.toLocaleString()}`);
    log();
    log(`${label("NPM") + color(metadata.links.npm, "underline")}`);
    log(`${label("Homepage") + color(metadata.links.homepage, "underline")}`);
    log(`${label("Repo") + color(metadata.links.repository, "underline")}`);
    log();
    log(`${label("Liscnce") + metadata.license}`);
    log();
  } catch (e) {
    console.error(e);
  }
})();
