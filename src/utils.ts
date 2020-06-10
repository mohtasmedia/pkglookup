import { npms, bp, gh } from "./get";
import { d, b } from "./format";

const clrs = {
  r: "\x1b[31m",
  y: "\x1b[33m",
  d: "\x1b[2m",
};
const clr = (v: string, c: string) => `${clrs[c]}${v}\x1b[0m`;
const log = (v?: string) => console.log(v ? `    ${v}` : "");
export const err = (v: string) => log(clr(v, "r"));
const op = ({ title: t, description: d, entries: e }: any) => {
  log();
  log(`${t}`);
  log(clr(`${d}`, "d"));

  e.map(([l, v]) =>
    l === "" ? log() : v ? log(`${clr(l, "y")}: ${v.toLocaleString()}`) : null
  );
};

const init = async (n: string) => {
  const { m, dl, g } = await npms(n);
  const { s, gz } = await bp(n);
  const r = m.links.repository;
  const prs = await gh(r);

  op({
    title: `${m.name} - v${m.version} (Last publish: ${d(new Date(m.date))})`,
    description: m.description,
    entries: [
      [""],
      ["Size / Gzipped", `${b(s)} / ${b(gz)}`],
      ["Downloads", dl],
      ["Issues / PRs", `${g.issues} / ${prs}`],
      ["Stars", g.stars],
      [""],
      ["NPM", m.links.npm],
      ["Homepage", m.links.homepage],
      ["Repo", m.links.repository],
      [""],
      ["Liscnce", m.license],
      [""],
    ],
  });
};

export const cli = async (v) => {
  const [n] = v.slice(2);
  if (!n) {
    err("Package name required");
    return;
  }

  await init(n);

  return;
};
