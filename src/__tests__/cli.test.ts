import { cli } from "../utils";

test("Output expected amount of console.logs", async () => {
  console.log = jest.fn();
  await cli(["", "", "preact"]);
  expect(console.log).toHaveBeenCalledTimes(14);
});

test("Prompt for package name", async () => {
  console.log = jest.fn();
  await cli([""]);
  expect(console.log).toHaveBeenCalledWith("Provide name of package: ");
});
