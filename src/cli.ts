import u from "./utils";
import * as readline from "readline";
let [pkgName] = process.argv.slice(2);

const lookup = async (name) => {
  const npms: any = await u.request([
    "api.npms.io",
    `/v2/package/${encodeURIComponent(name)}`,
  ]);
  npms.code && u.log(u.color(npms.message, "r"));
  const {
    collected: { metadata, github, npm },
  } = npms;
  const bp: any = await u.request([
    "bundlephobia.com",
    `/api/size?package=${name}`,
  ]);
  let repo;
  let gh;

  if (metadata.links.repository) {
    repo = metadata.links.repository.split("/");
    if (repo[2] === "github.com") {
      gh = await u.request([
        "api.github.com",
        `/search/issues?q=repo:${repo[3]}/${repo[4]}+is:pr+state:open&per_page=1`,
      ]);
    }
  }

  u.log();
  u.log(
    `${metadata.name} - v${metadata.version} (Published ${u.date(
      new Date(metadata.date)
    )})`
  );
  u.log(u.color(metadata.description, "d"));
  u.log();
  u.log(
    `${u.label("Size / Gzipped") + u.formatBytes(bp.size)} / ${u.formatBytes(
      bp.gzip
    )}`
  );
  u.log(
    `${
      u.label("Downloads") +
      npm.downloads[npm.downloads.length - 1].count.toLocaleString()
    }`
  );

  if (metadata.links.repository && repo[2] === "github.com") {
    u.log(
      `${u.label("Open issues / PRs") + github.issues.openCount} / ${
        gh.total_count
      }`
    );
    u.log(`${u.label("Github Stars") + github.starsCount.toLocaleString()}`);
  }
  u.log();
  u.log(`${u.label("NPM") + metadata.links.npm}`);
  metadata.links.homepage &&
    u.log(`${u.label("Homepage") + metadata.links.homepage}`);
  metadata.links.repository &&
    u.log(`${u.label("Repo") + metadata.links.repository}`);
  u.log();
  u.log(`${u.label("Liscnce") + metadata.license}`);
};

if (!pkgName) {
  const rl = readline.createInterface(process.stdin, process.stdout);

  rl.question("Provide name of package: ", (name) => {
    name && lookup(name);
    rl.close();
  });
} else {
  lookup(pkgName);
}
