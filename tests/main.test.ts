import { vi, expect, test, beforeEach, describe } from "vitest";

const mocks = vi.hoisted(async () => {
  return await import("./obsidian.mock");
});

vi.mock("obsidian", () => mocks);

import MultiPropPlugin from "../src/main";
import { TFile, TFolder } from "obsidian";

describe("MultiPropPlugin Tests", () => {
  let app: any;
  let plugin: MultiPropPlugin;

  beforeEach(async () => {
    vi.clearAllMocks();
    const resolvedMocks = await mocks;
    app = new resolvedMocks.App();
    // @ts-ignore
    plugin = new MultiPropPlugin(app, {});
    await plugin.onload();
  });

  test('should register "Add props to tabs in active tab group" command', () => {
    const command = app.commands.find(
      (cmd: any) => cmd.id === "add-props-to-tab-group"
    );
    expect(command).toBeDefined();
  });

  test('should register "Remove props from tabs in active tab group" command', () => {
    const command = app.commands.find(
      (cmd: any) => cmd.id === "remove-props-from-tab-group"
    );
    expect(command).toBeDefined();
  });

  describe("File Iteration", () => {
    test("searchFiles should iterate over a list of files", async () => {
      const resolvedMocks = await mocks;
      const files = [
        new resolvedMocks.TFile("file1.md"),
        new resolvedMocks.TFile("file2.md"),
      ];
      const callback = vi.fn();
      // @ts-ignore
      await plugin.searchFiles(files, callback);
      expect(callback).toHaveBeenCalledTimes(2);
    });

    test("searchFolders should iterate recursively through folders", async () => {
      const resolvedMocks = await mocks;
      const file1 = new resolvedMocks.TFile("file1.md");
      const file2 = new resolvedMocks.TFile("file2.md");
      const subFolder = new resolvedMocks.TFolder("sub", [file2]);
      const rootFolder = new resolvedMocks.TFolder("root", [file1, subFolder]);
      const callback = vi.fn();
      plugin.settings.recursive = true;
      // @ts-ignore
      await plugin.searchFolders(rootFolder, callback);
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });
});
