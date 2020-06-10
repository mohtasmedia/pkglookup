import * as https from "https";
import { err } from "./utils";

import { NpmsInterface, BpInterface } from "./types";

const req = ([hostname, path]): Promise<any> =>
  new Promise((res) => {
    https.get({ hostname, path, headers: { "User-Agent": "" } }, (r) => {
      const d = [];
      r.on("data", (f) => d.push(f));
      r.on("end", () => res(JSON.parse(Buffer.concat(d).toString())));
    });
  }).catch((e) => e);

export const npms = async (n: string): Promise<NpmsInterface> =>
  await req(["api.npms.io", `/v2/package/${encodeURIComponent(n)}`]).then(
    (r) => {
      if (r.code) {
        err(r.message);
        process.exit();
      }

      const {
        collected: {
          metadata: m,
          github,
          npm: { downloads: dl },
        },
      } = r;

      return {
        m,
        g: {
          issues: github?.issues.openCount,
          stars: github?.starsCount,
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
    ]).then((r) => r.total_count || 0);
  }

  return 0;
};
