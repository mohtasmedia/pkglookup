import nock from "nock";
import { req, gh, npms } from "../get";

const name = "pkg-lookup";

test("req response", async () => {
  nock("https://example.com").get(`/${name}`).reply(200, {
    name,
  });

  const res = await req(["example.com", `/${name}`]).then((r) => r);

  expect(res.name).toEqual(name);
});

test("npms error response", async () => {
  console.log = jest.fn();
  const err = { code: 400, message: "Not found" };

  nock("https://api.npms.io").get("/v2/package/nope").reply(err.code, err);

  await npms("nope");
  expect(console.log).toBeCalledTimes(1);
});

test("npms response without github repo", async () => {
  nock("https://api.npms.io")
    .get(`/v2/package/${name}`)
    .reply(200, {
      collected: {
        metadata: {
          name,
        },
        npm: { downloads: [{ count: 100 }] },
      },
    });

  const res = await npms(name);
  expect(res).toEqual({
    m: { name },
    g: undefined,
    dl: 100,
  });
});

test("npms error response", async () => {
  const res = await gh(`https://example.com/${name}`);
  expect(res).toEqual(0);
});
