import { describe, it, expect, beforeEach, vi } from "vitest";
import MultiPropPlugin from "../src/main";
import { MockApp, MockVault, TFile, TFolder } from "./obsidian-mocks";

vi.mock("../src/AddPropModal", () => {
  return {
    PropModal: class {
      open() {}
    },
  };
});

vi.mock("../src/RemoveModal", () => {
  return {
    RemoveModal: class {
      open() {}
    },
  };
});

describe("MultiPropPlugin", () => {
  let app: MockApp;
  let plugin: MultiPropPlugin;

  beforeEach(() => {
    app = new MockApp();
    // @ts-ignore
    plugin = new MultiPropPlugin(app, {
      id: "test-plugin",
      name: "Test Plugin",
      version: "1.0.0",
    });
    plugin.onload();
  });

  it('should register "Add props to tabs in active window" command', () => {
    const command = app.commands.find((cmd) => cmd.id === "add-props-to-window-tabs");
    expect(command).toBeDefined();
    expect(command.name).toBe("Add props to tabs in active window");
  });

  it('should register "Remove props from tabs in active window" command', () => {
    const command = app.commands.find((cmd) => cmd.id === "remove-props-from-window-tabs");
    expect(command).toBeDefined();
    expect(command.name).toBe("Remove props from tabs in active window");
  });

  describe("File Iteration", () => {
    let vault: MockVault;

    beforeEach(() => {
      vault = app.vault as MockVault;
    });

    it("searchFiles should iterate over a list of files", async () => {
      const files = [new TFile("file1.md"), new TFile("file2.md")];
      const callback = vi.fn();

      // @ts-ignore
      await plugin.searchFiles(files, callback);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(files[0]);
      expect(callback).toHaveBeenCalledWith(files[1]);
    });

    it("searchFolders should iterate recursively through folders", async () => {
      const file1 = new TFile("file1.md");
      const file2 = new TFile("file2.md");
      const subFolder = new TFolder("sub", [file2]);
      const rootFolder = new TFolder("root", [file1, subFolder]);
      const callback = vi.fn();

      plugin.settings.recursive = true;
      // @ts-ignore
      await plugin.searchFolders(rootFolder, callback);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(file1);
      expect(callback).toHaveBeenCalledWith(file2);
    });

    it("searchFolders should not iterate recursively when setting is off", async () => {
      const file1 = new TFile("file1.md");
      const file2 = new TFile("file2.md");
      const subFolder = new TFolder("sub", [file2]);
      const rootFolder = new TFolder("root", [file1, subFolder]);
      const callback = vi.fn();

      plugin.settings.recursive = false;
      // @ts-ignore
      await plugin.searchFolders(rootFolder, callback);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(file1);
    });
  });
});