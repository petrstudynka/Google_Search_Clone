import { SimpleHttpClient } from "./../../src/http/SimpleHttpClient";

describe("Test async get", () => {
  //TODO
});

describe("Test url parsing", () => {
  const client = new SimpleHttpClient();

  test("With empty url", () => {
    expect(client.getURL("", {})).toBe("");
  });

  test("With url and empty queryObject", () => {
    const resultUrl = client.getURL("https://google.com/hello/word", {});

    expect(resultUrl).toBe("https://google.com/hello/word");
  });

  test("With valid queryObject", () => {
    const url = "https://google.com";
    const validQueryObject = { a: "1", b: "bb2bb", c: 3 };
    const expectedResultUrl = "https://google.com?a=1&b=bb2bb&c=3";

    const actualResultUrl = client.getURL(url, validQueryObject);

    expect(actualResultUrl).toBe(expectedResultUrl);
  });

  test("With invalid queryObject", () => {
    const url = "https://google.com";
    const invalidQueryObject = { a: { a: "1" }, b: "bb2bb", c: 3 };

    expect(() => {
      client.getURL(url, invalidQueryObject);
    }).toThrowError();
  });
});
