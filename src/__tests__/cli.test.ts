import { cli } from "../utils";

test("Output expected amount of console.logs", async () => {
  console.log = jest.fn();
  await cli(["", "", "preact"]);
  expect(console.log).toHaveBeenCalledTimes(15);
});

test("Handle no package name", async () => {
  console.log = jest.fn();
  await cli([]);
  expect(console.log).toHaveBeenCalledTimes(1);
});
