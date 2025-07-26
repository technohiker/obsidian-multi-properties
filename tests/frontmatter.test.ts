import { describe, it, expect, beforeEach } from "vitest";
import { addProperties, removeProperties, addPropToSet } from "../src/frontmatter";
import { TFile } from "obsidian";
import { MockFileManager } from "./obsidian-mocks";

describe("Frontmatter Utilities", () => {
  let fileManager: MockFileManager;
  let file: TFile;

  beforeEach(() => {
    fileManager = new MockFileManager();
    file = {
      path: "test.md",
      frontmatter: {
        existingProp: "oldValue",
        tags: ["a", "b"],
      },
    } as TFile;
  });

  describe("addProperties", () => {
    it("should add new properties to the frontmatter", async () => {
      const props = new Map();
      props.set("newProp", { type: "text", data: "newValue" });

      await addProperties(fileManager.processFrontMatter.bind(fileManager), file, props, false, {});
      expect(file.frontmatter).toEqual({
        existingProp: "oldValue",
        tags: ["a", "b"],
        newProp: "newValue",
      });
    });

    it("should overwrite existing properties when overwrite is true", async () => {
      const props = new Map();
      props.set("existingProp", { type: "text", data: "newValue" });

      await addProperties(fileManager.processFrontMatter.bind(fileManager), file, props, true, {});
      expect(file.frontmatter.existingProp).toBe("newValue");
    });

    it("should not overwrite existing properties when overwrite is false", async () => {
      const props = new Map();
      props.set("existingProp", { type: "text", data: "newValue" });
      const propCache = { existingprop: { type: "text" } };

      await addProperties(fileManager.processFrontMatter.bind(fileManager), file, props, false, propCache);
      expect(file.frontmatter.existingProp).toEqual(["oldValue", "newValue"]);
    });

    it("should merge tags correctly", async () => {
      const props = new Map();
      props.set("tags", { type: "tag", data: "c" });

      await addProperties(fileManager.processFrontMatter.bind(fileManager), file, props, false, {});
      expect(file.frontmatter.tags).toEqual(["a", "b", "c"]);
    });
  });

  describe("removeProperties", () => {
    it("should remove a property from the frontmatter", async () => {
      const propsToRemove = ["existingProp"];
      await removeProperties(fileManager.processFrontMatter.bind(fileManager), file, propsToRemove);
      expect(file.frontmatter.existingProp).toBeUndefined();
    });

    it("should remove multiple properties from the frontmatter", async () => {
      file.frontmatter.anotherProp = "anotherValue";
      const propsToRemove = ["existingProp", "tags"];
      await removeProperties(fileManager.processFrontMatter.bind(fileManager), file, propsToRemove);
      expect(file.frontmatter.existingProp).toBeUndefined();
      expect(file.frontmatter.tags).toBeUndefined();
      expect(file.frontmatter.anotherProp).toBe("anotherValue");
    });
  });

  describe("addPropToSet", () => {
    it("should add all properties from a file to a set", async () => {
      const propSet = new Set<string>();
      await addPropToSet(fileManager.processFrontMatter.bind(fileManager), propSet, file);
      expect(propSet).toContain("existingProp");
      expect(propSet).toContain("tags");
    });
  });
});