import { vi, expect, test, beforeEach, describe } from "vitest";
import { App, TFile, TFolder } from "./obsidian.mock";
import MultiPropPlugin from "../src/main";
//vi.mock("obsidian", () => mocks);

describe("MultiPropPlugin Tests", () => {
  let app: InstanceType<typeof App>;
  let plugin: MultiPropPlugin;

  beforeEach(async () => {
    vi.clearAllMocks();
    app = new App();
    // @ts-ignore
    plugin = new MultiPropPlugin(app, {});
    await plugin.onload();
  });

  test('should register "Add props to current note" command', () => {
    const command = app.commands.find(
      (cmd: any) => cmd.id === "add-props-to-current-note"
    );
    expect(command).toBeDefined();
  });

  test('should register "Remove props from current note" command', () => {
    const command = app.commands.find(
      (cmd: any) => cmd.id === "remove-props-from-current-note"
    );
    expect(command).toBeDefined();
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
      const files = [new TFile("file1.md"), new TFile("file2.md")];
      const callback = vi.fn();
      // @ts-ignore
      await plugin.searchFolders(files, callback);
      expect(callback).toHaveBeenCalledTimes(2);
    });

    test("searchFolders should iterate recursively through folders", async () => {
      const file1 = new TFile("file1.md");
      const file2 = new TFile("file2.md");
      const subFolder = new TFolder("sub", [file2]);
      const rootFolder = new TFolder("root", [file1, subFolder]);
      const callback = vi.fn();
      plugin.settings.recursive = true;
      // @ts-ignore
      await plugin.searchFolders(rootFolder, callback);
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });
});
