import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  addProperties,
  removeProperties,
  addPropToSet,
} from "../src/frontmatter";
import type { PropertyInfos } from "src/types/custom";

const mocks = vi.hoisted(() => {
  class MockTFile {
    frontmatter: any;
    constructor(
      public path: string,
      frontmatter = {},
    ) {
      this.frontmatter = frontmatter;
    }
    get name() {
      return this.path.split("/").pop() || "";
    }
  }
  return {
    TFile: MockTFile,
  };
});

vi.mock("obsidian", () => mocks);

describe("Frontmatter Utilities", () => {
  let fileManager: any;
  let file: any;
  let propertyInfo: PropertyInfos;

  beforeEach(() => {
    fileManager = {
      processFrontMatter: vi.fn(async (f: any, cb: (fm: any) => void) => {
        cb(f.frontmatter);
      }),
    };
    file = new mocks.TFile("test.md", {
      existingProp: "initial value",
      tags: ["tag1", "tag2"],
      numeric: 69,
      ISREAL: false,
      dateTest: "05/05/2020",
      datetimeTest: "2015-03-25T12:00:00Z",
    });
    propertyInfo = {
      existingprop: {
        name: "existingProp",
        occurrences: 1,
        widget: "text",
      },
      tags: {
        name: "tags",
        occurrences: 1,
        widget: "tags",
      },
      numeric: {
        name: "numeric",
        occurrences: 1,
        widget: "number",
      },
      isreal: {
        name: "ISREAL",
        occurrences: 1,
        widget: "checkbox",
      },
      datetest: {
        name: "dateTest",
        occurrences: 1,
        widget: "date",
      },
      datetimetest: {
        name: "datetimeTest",
        occurrences: 1,
        widget: "datetime",
      },
    };
  });

  describe("addProperties", () => {
    it("should add new properties to the frontmatter", async () => {
      const props = new Map<string, any>([
        ["newText", { data: "new value" }],
        ["newList", {data: ["item1", "item2"] }],
        ["newNumber", { data: 5 }],
        ["newBoolean", { data: true }],
        ["newDate", { data: "01/01/2021" }],
        ["newDateTime", { data: "2021-01-01T12:00:00Z" }],
      ]);
      await addProperties(
        fileManager.processFrontMatter,
        file,
        props,
        "append",
        propertyInfo,
      );
      //Make sure old properties are unaffected.
      expect(file.frontmatter.existingProp).toBe("initial value");
      expect(file.frontmatter.tags).toStrictEqual(["tag1", "tag2"]);
      expect(file.frontmatter.numeric).toBe(69);
      expect(file.frontmatter.ISREAL).toBe(false);
      expect(file.frontmatter.dateTest).toBe("05/05/2020");
      expect(file.frontmatter.datetimeTest).toBe("2015-03-25T12:00:00Z");

      //Check new properties.
      expect(file.frontmatter.newText).toBe("new value");
      expect(file.frontmatter.newList).toStrictEqual(["item1", "item2"]);
      expect(file.frontmatter.newNumber).toBe(5);
      expect(file.frontmatter.newBoolean).toBe(true);
      expect(file.frontmatter.newDate).toBe("01/01/2021");
      expect(file.frontmatter.newDateTime).toBe("2021-01-01T12:00:00Z");
    });

    it("should append to existing properties if specified", async () => {
      const props = new Map<string, any>([
        ["existingProp", { data: "new value" }],
      ]);
      await addProperties(
        fileManager.processFrontMatter,
        file,
        props,
        "append",
        propertyInfo,
      );
      expect(file.frontmatter.existingProp).toStrictEqual([
        "initial value",
        "new value",
      ]);
    });
    it("should overwrite new properties if specified", async () => {
      const props = new Map<string, any>([
        ["existingProp", { data: "new value" }],
      ]);
      await addProperties(
        fileManager.processFrontMatter,
        file,
        props,
        "overwrite",
        propertyInfo,
      );
      expect(file.frontmatter.existingProp).toBe("new value");
    });
    it("should ignore existing properties if specified", async () => {
      const props = new Map<string, any>([
        ["newProp", { data: "new value" }],
        ["initialProp", { data: "newValue" }],
      ]);
      await addProperties(
        fileManager.processFrontMatter,
        file,
        props,
        "ignore",
        propertyInfo,
      );
      expect(file.frontmatter.newProp).toBe("new value");
      expect(file.frontmatter.existingProp).toBe("initial value");
    });
  });

  describe("removeProperties", () => {
    it("should remove a property from the frontmatter", async () => {
      await removeProperties(fileManager.processFrontMatter, file, [
        "existingProp",
      ]);
      expect(file.frontmatter.existingProp).toBeUndefined();
      expect(file.frontmatter.tags).toBeDefined();
    });
    it("should not do anything if there is no value", async () => {
      await removeProperties(fileManager.processFrontMatter, file, [""]);
      expect(file.frontmatter.existingProp).toBeDefined();
      expect(file.frontmatter.tags).toBeDefined();
    });
  });

  describe("addPropToSet", () => {
    it("should add all properties from a file to a set", async () => {
      const names = new Set<string>();
      await addPropToSet(fileManager.processFrontMatter, names, file);
      expect(names).toContain("existingProp");
      expect(names).toContain("tags");
    });
  });
});
