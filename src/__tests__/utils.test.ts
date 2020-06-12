import nock from "nock";
import { init, op } from "../utils";

describe("Utils", () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  test("Output expected amount of console.logs", async () => {
    nock("https://api.npms.io")
      .get("/v2/package/preact")
      .reply(200, {
        collected: {
          metadata: {
            name: "preact",
            description: "some description",
            version: "1.0.0",
            date: "2020-03-01T12:00:00.000Z",
            license: "MIT",
            links: {
              npm: "npm.org/preact",
              homepage: "preact.com",
              repository: "https://github.com/preactjs/preact",
            },
          },
          github: {
            issues: {
              openCount: 10,
            },
            starsCount: 10,
          },
          npm: {
            downloads: [{ count: 100 }],
          },
        },
      });
    nock("https://bundlephobia.com")
      .get("/api/size?package=preact")
      .reply(200, {
        size: 100,
        gzip: 100,
      });
    nock("https://api.github.com")
      .get("/search/issues?q=repo:preactjs/preact+is:pr+state:open&per_page=1")
      .reply(200, {
        total_count: 10,
      });

    await init(["", "", "preact"]);
    expect(console.log).toHaveBeenCalledTimes(15);
  });

  test("Handle no package name", async () => {
    await init([]);
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  test("Handle no response", async () => {
    nock("https://api.npms.io")
      .get("/v2/package/preact")
      .reply(200, { code: 200, message: null });

    nock("https://bundlephobia.com")
      .get("/api/size?package=preact")
      .reply(200, {});

    const res = await init(["", "", "preact"]);
    expect(res).toBeUndefined();
  });

  test("Skip entry if value is null", async () => {
    await op({
      title: "title",
      description: "description",
      entries: [["label"]],
    });
    expect(console.log).toHaveBeenCalledTimes(3);
  });
});
