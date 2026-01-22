import { describe, it, expect } from "vitest";
import { removeExtraCommas, parseValue, cleanTags } from "../src/helpers";

describe("removeExtraCommas", () => {
  it("should remove leading and trailing commas", () => {
    expect(removeExtraCommas(",hello,world,")).toBe("hello,world");
  });

  it("should replace multiple consecutive commas with a single comma", () => {
    expect(removeExtraCommas("hello,,,world")).toBe("hello,world");
  });

  it("should handle a string with no extra commas", () => {
    expect(removeExtraCommas("hello,world")).toBe("hello,world");
  });

  it("should handle a string with only commas", () => {
    expect(removeExtraCommas(",,,")).toBe("");
  });

  it("should handle an empty string", () => {
    expect(removeExtraCommas("")).toBe("");
  });

  it("should handle a combination of leading, trailing, and multiple commas", () => {
    expect(removeExtraCommas(",,hello,,,world,,")).toBe("hello,world");
  });
});

describe("parseValue", () => {
  it("should parse HTML text input into text", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "text");
    element.value = "testing";
    expect(parseValue(element, "text")).toBe("testing");
  });

  it("should parse HTML numeric input into a number", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "number");
    element.value = "9";
    expect(parseValue(element, "number")).toBe(9);
  });

  it("should parse HTML checkbox into a boolean", () => {
    const element = document.createElement("input");
    element.setAttribute("type", "checkbox");
    element.value = "off";
    expect(parseValue(element, "checkbox")).toBe(false);
  });
});

describe("cleanTags", () => {
  it("should remove any characters deemed invalid for tags by Obsidian", () => {
    const str = "#‒a%&b+=c";
    expect(cleanTags(str)).toBe("abc");
  });
  it("should leave valid tags alone", () => {
    const str = "abc";
    expect(cleanTags(str)).toBe("abc");
  });
});
