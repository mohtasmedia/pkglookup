#!/usr/bin/env node
const https = require("https");
const [pkgName] = process.argv.slice(2);
const colors = {
  r: "",
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
const color = (v, c) => `${colors[c] + v}\x1b[0m`;
const label = (v) => `${color(v, "y")}: `;
const date = (v) => `${v.getDate()}/${v.getMonth() + 1}/${v.getFullYear()}`;
const formatBytes = (v) => (v >= 1024 ? `${(v / 1024).toFixed(1)}KB` : `${v}B`);
const log = (v) => console.log(v ? `    ${v}` : "");

(async () => {
  const npms = await request([
    "api.npms.io",
    `/v2/package/${encodeURIComponent(pkgName)}`,
  ]);
  npms.code && log(npms.message, "r");
  const {
    collected: { metadata, github, npm },
  } = npms;
  const bp = await request([
    "bundlephobia.com",
    `/api/size?package=${pkgName}`,
  ]);
  let repo;
  let gh;

  if (metadata.links.repository) {
    repo = metadata.links.repository.split("/");
    if (repo[2] === "github.com") {
      gh = await request([
        "api.github.com",
        `/search/issues?q=repo:${repo[3]}/${repo[4]}+is:pr+state:open&per_page=1`,
      ]);
    }
  }

  log();
  log(
    `${metadata.name} - v${metadata.version} (Published ${date(
      new Date(metadata.date)
    )})`
  );
  log(color(metadata.description, "d"));
  log();
  log(
    `${label("Size / Gzipped") + formatBytes(bp.size)} / ${formatBytes(
      bp.gzip
    )}`
  );
  log(
    `${
      label("Downloads") +
      npm.downloads[npm.downloads.length - 1].count.toLocaleString()
    }`
  );

  if (metadata.links.repository && repo[2] === "github.com") {
    log(
      `${label("Open issues / PRs") + github.issues.openCount} / ${
        gh.total_count
      }`
    );
    log(`${label("Github Stars") + github.starsCount.toLocaleString()}`);
  }
  log();
  log(`${label("NPM") + metadata.links.npm}`);
  metadata.links.homepage &&
    log(`${label("Homepage") + metadata.links.homepage}`);
  metadata.links.repository &&
    log(`${label("Repo") + metadata.links.repository}`);
  log();
  log(`${label("Liscnce") + metadata.license}`);
})();
