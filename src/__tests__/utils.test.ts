const nock = require("nock");
import { init, op } from "../utils";

describe("Utils", () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  test("Output expected amount of console.logs", async () => {
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
