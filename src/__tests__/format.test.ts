import { b, d } from "../format";

describe("Byte formatter", () => {
  test("Format bytes", () => {
    const bytes = b(900);
    expect(bytes).toEqual("900B");
  });

  test("Format kilobytes", () => {
    const bytes = b(2000);
    expect(bytes).toEqual("2.0KB");
  });
});

describe("Date formatter", () => {
  test("Format date", () => {
    const date = d(new Date("2020-03-10T12:00:00.000Z"));
    expect(date).toEqual("10/3/2020");
  });
});
