import * as https from "https";
import * as readline from "readline";

const { stdin, stdout } = process;
const rl = readline.createInterface(stdin, stdout);

const colors = {
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
const date = (v) => `${v.getDate()}/${v.getMonth() + 1}/${v.getFullYear()}`;
const bytes = (v) => (v >= 1024 ? `${(v / 1024).toFixed(1)}KB` : `${v}B`);
const log = (v?: string) => console.log(v ? `    ${v}` : "");
const entry = (t: string, d: string) => log(`${color(t, "y")}: ${d}`);
const output = ({ title, description, entries }: any) => {
  log();
  log(title);
  log(color(description, "d"));
  log();

  entries.map(({ label, val }) => {
    const value = typeof val === "number" ? val.toLocaleString() : val;

    !label ? console.log() : entry(label, value);
  });
  log();
};
const prompt = (q) =>
  new Promise((res) => rl.question(q, (input) => res(input)));

const getNpms = async (name) => {
  const res: any = await request([
    "api.npms.io",
    `/v2/package/${encodeURIComponent(name)}`,
  ]);

  if (res.code) {
    log(color(res.message, "r"));
    return;
  }
  const {
    collected: { metadata, github, npm },
  } = res;

  return {
    metadata,
    github,
    npm,
  };
};

const getBp = async (name) =>
  await request(["bundlephobia.com", `/api/size?package=${name}`]);

const getGh = async (repo) => {
  repo = repo.split("/");
  if (repo[2] === "github.com") {
    return await request([
      "api.github.com",
      `/search/issues?q=repo:${repo[3]}/${repo[4]}+is:pr+state:open&per_page=1`,
    ]);
  }

  return;
};

const lookup = async (name) => {
  const { metadata, npm, github } = await getNpms(name);
  const bp: any = await getBp(name);
  const repo = metadata.links.repository;
  let gh;

  if (repo) gh = await getGh(repo);

  return {
    details: metadata,
    size: bp.size,
    gzip: bp.gzip,
    downloads: npm.downloads[npm.downloads.length - 1].count,
    gh: {
      issues: github.issues.openCount,
      stars: github.starsCount,
      prs: gh.total_count,
    },
    links: metadata.links,
  };
};

export default async (args) => {
  let [name] = args.slice(2);
  while (!name) name = await prompt("Provide name of package: ");
  rl.close();

  const { details, size, gzip, downloads, gh, links }: any = await lookup(name);

  output({
    title: `${details.name} - v${details.version} (Published ${date(
      new Date(details.date)
    )})`,
    description: details.description,
    entries: [
      { label: "Size / Gzipped", val: `${bytes(size)} / ${bytes(gzip)}` },
      { label: "Downloads", val: downloads },
      { label: "Issues / PRs", val: `${gh.issues} / ${gh.prs}` },
      { label: "Stars", val: gh.stars },
      {},
      { label: "NPM", val: links.npm },
      { label: "Homepage", val: links.homepage },
      { label: "Repo", val: links.repository },
      {},
      { label: "Liscnce", val: details.license },
    ],
  });
};
