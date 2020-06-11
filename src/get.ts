import * as https from "https";
import { err } from "./utils";

import { NpmsInterface, BpInterface } from "./types";

export const req = ([hostname, path]): Promise<any> =>
  new Promise((res) => {
    https.get({ hostname, path, headers: { "User-Agent": "" } }, (r) => {
      const d = [];
      r.on("data", (f) => d.push(f));
      r.on("end", () => res(JSON.parse(Buffer.concat(d).toString())));
    });
  });

export const npms = async (n: string): Promise<NpmsInterface | void> =>
  await req(["api.npms.io", `/v2/package/${encodeURIComponent(n)}`]).then(
    (r) => {
      if (r.code) {
        err(r.message);
        return;
      }

      const {
        collected: {
          metadata: m,
          github: gh,
          npm: { downloads: dl },
        },
      } = r;

      return {
        m,
        g: gh && {
          issues: gh.issues.openCount,
          stars: gh.starsCount,
        },
        dl: dl[dl.length - 1].count,
      };
    }
  );

export const bp = async (n: string): Promise<BpInterface> =>
  await req([
    "bundlephobia.com",
    `/api/size?package=${n}`,
  ]).then(({ size: s, gzip: gz }) => ({ s, gz }));

export const gh = async (v: string): Promise<number> => {
  const s: string[] = v.split("/");
  if (s[2] === "github.com") {
    return await req([
      "api.github.com",
      `/search/issues?q=repo:${s[3]}/${s[4]}+is:pr+state:open&per_page=1`,
    ]).then((r) => r.total_count);
  }

  return 0;
};
