import { npms, bp, gh } from "./get";
import { d, b } from "./format";

const clrs = {
  r: "\x1b[31m",
  y: "\x1b[33m",
  d: "\x1b[2m",
};
const clr = (v: string | number, c: string) => `${clrs[c]}${v}\x1b[0m`;
const log = (v?: string) => console.log(v ? `\t${v}` : "");
export const err = (v: string) => log(clr(v, "r"));
export const op = ({
  title: t,
  description: d,
  entries: e,
}: {
  title: string;
  description: string;
  entries: (string | number)[][];
}) => {
  log();
  log(`${t}`);
  log(clr(`${d}`, "d"));

  e.map(([l, v]) =>
    l === "" ? log() : v ? log(`${clr(l, "y")}: ${v.toLocaleString()}`) : null
  );
};

const parse = async (npm, bp) => {
  const { m, dl, g } = npm;
  const { s, gz } = bp;
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
      ["Repo", r],
      [""],
      ["Liscnce", m.license],
      [""],
    ],
  });
};

export const init = async (v: string[]) => {
  const [p]: string[] = v.slice(2);
  if (!p) {
    err("Package name required");
    return;
  }

  const n = await npms(p);
  const b = await bp(p);

  n && b ? await parse(n, b) : null;
};
