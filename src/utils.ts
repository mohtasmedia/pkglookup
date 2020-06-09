import * as https from "https";
import * as readline from "readline";

const { stdin, stdout } = process;
const rl = readline.createInterface(stdin, stdout);

const colors = {
  r: "\x1b[31m",
  y: "\x1b[33m",
  d: "\x1b[2m",
};
const request = ([hostname, path]) =>
  new Promise((res) => {
    https.get({ hostname, path, headers: { "User-Agent": "" } }, (r) => {
      let d = [];
      r.on("data", (f) => d.push(f));
      r.on("end", () => res(JSON.parse(Buffer.concat(d).toString())));
    });
  }).catch((e) => e);
const color = (v, c) => `${colors[c] + v}\x1b[0m`;
const date = (v) => `${v.getDate()}/${v.getMonth() + 1}/${v.getFullYear()}`;
const bytes = (v) => (v >= 1024 ? `${(v / 1024).toFixed(1)}KB` : `${v}B`);
const log = (v?: string) => console.log(v ? `    ${v}` : "");
const entry = (t: string, d: string) => log(`${color(t, "y")}: ${d}`);
const output = ({ title: t, description: d, entries: e }: any) => {
  log();
  log(`${t}`);
  log(color(`${d}\n`, "d"));

  e.map(([l, v]) => {
    v = typeof v === "number" ? v.toLocaleString() : v;

    !l ? log() : entry(l, v);
  });
  log();
};
const ask = (q) => new Promise((res) => rl.question(q, (i) => res(i)));

const getNpms = async (n) =>
  await request(["api.npms.io", `/v2/package/${encodeURIComponent(n)}`]).then(
    (r: any) => {
      if (r.code) {
        log(color(r.message, "r"));
        process.exit();
      } else {
        const {
          collected: { metadata: m, github: gh, npm },
        } = r;

        return {
          m,
          gh,
          dl: npm.downloads,
        };
      }
    }
  );

const getBp = async (n) =>
  await request([
    "bundlephobia.com",
    `/api/size?package=${n}`,
  ]).then(({ size: s, gzip: g }: any) => ({ s, g }));

const getGh = async (r) => {
  r = r.split("/");
  if (r[2] === "github.com") {
    return await request([
      "api.github.com",
      `/search/issues?q=repo:${r[3]}/${r[4]}+is:pr+state:open&per_page=1`,
    ]).then((r: any) => r.total_count);
  }

  return;
};

const lookup = async (n) => {
  const { m, dl, gh } = await getNpms(n);
  const { s, g }: any = await getBp(n);
  const r = m.links.repository;
  let prs;

  if (r) prs = await getGh(r);

  return {
    m,
    s,
    g,
    dl: dl[dl.length - 1].count,
    gh: {
      issues: gh.issues.openCount,
      stars: gh.starsCount,
      prs,
    },
  };
};

export default async (args) => {
  let [n] = args.slice(2);
  while (!n) n = await ask("Provide name of package: ");
  rl.close();

  const { m, s, g, dl, gh }: any = await lookup(n);

  output({
    title: `${m.name} - v${m.version} (Published ${date(new Date(m.date))})`,
    description: m.description,
    entries: [
      ["Size / Gzipped", `${bytes(s)} / ${bytes(g)}`],
      ["Downloads", dl],
      ["Issues / PRs", `${gh.issues} / ${gh.prs}`],
      ["Stars", gh.stars],
      [],
      ["NPM", m.links.npm],
      ["Homepage", m.links.homepage],
      ["Repo", m.links.repository],
      [],
      ["Liscnce", m.license],
    ],
  });
};
