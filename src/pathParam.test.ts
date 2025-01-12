import { describe, expect, test } from "bun:test";
import { parsePathParam } from "./pathParam";

describe("pathParam", () => {
  const cases = [
    [
      "/api/rooms/:roomId",
      "/api/rooms/012c-1930-31dff1aab",
      { roomId: "012c-1930-31dff1aab" },
    ],
    ["/api/rooms", "/api/rooms", {}],
    ["/api/rooms/:roomId", "/api/items", undefined],
  ] as [string, string, Record<string, string> | undefined][];

  test.each(cases)("parsePathParam(%p, %p) should be %p", (a, b, expected) => {
    const actual = parsePathParam(a, b);

    expect<Record<string, string> | undefined>(actual).toEqual(expected);
  });
});
