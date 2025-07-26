import { describe, it, expect, beforeEach, vi } from "vitest";
import MultiPropPlugin from "../src/main";
import {
  MockApp,
  MockWorkspace,
  MockWorkspaceLeaf,
  MockWorkspaceSplit,
  TFile,
} from "./obsidian-mocks";
import { PropModal } from "../src/AddPropModal";

vi.mock("../src/AddPropModal", () => {
  const PropModal = vi.fn();
  PropModal.prototype.open = vi.fn();
  return { PropModal };
});

describe("Tab Group-specific Commands", () => {
  let app: MockApp;
  let workspace: MockWorkspace;
  let plugin: MultiPropPlugin;

  beforeEach(() => {
    app = new MockApp();
    workspace = app.workspace;
    plugin = new MultiPropPlugin(app as any, {} as any);
    plugin.onload();
    vi.clearAllMocks();
  });

  it("should add props only to tabs in the active tab group", async () => {
    // Setup two tab groups (roots)
    const tabGroup1 = new MockWorkspaceSplit("tabGroup1");
    const tabGroup2 = new MockWorkspaceSplit("tabGroup2");

    // Setup files and leaves for tab group 1
    const file1 = new TFile("file1.md");
    const leaf1 = new MockWorkspaceLeaf("leaf1", file1, app);
    workspace.addLeaf(leaf1, tabGroup1);

    const file2 = new TFile("file2.md");
    const leaf2 = new MockWorkspaceLeaf("leaf2", file2, app);
    workspace.addLeaf(leaf2, tabGroup1);

    // Setup files and leaves for tab group 2
    const file3 = new TFile("file3.md");
    const leaf3 = new MockWorkspaceLeaf("leaf3", file3, app);
    workspace.addLeaf(leaf3, tabGroup2);

    // Set active leaf to be in the first tab group
    workspace.activeLeaf = leaf1;

    const createPropModalSpy = vi.spyOn(plugin, "createPropModal");

    // Find and execute the command
    const command = app.commands.find(
      (cmd) => cmd.id === "add-props-to-tab-group"
    );
    expect(command).toBeDefined();
    await command.callback();

    // Expect the PropModal to be created with files from the active tab group only
    expect(createPropModalSpy).toHaveBeenCalledTimes(1);
    expect(createPropModalSpy).toHaveBeenCalledWith([file1, file2]);
  });
});
