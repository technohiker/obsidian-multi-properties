import { vi } from "vitest";

// Create a comprehensive mock factory
export const createObsidianMocks = () => {
  class MockTFile {
    constructor(public path: string, public extension: string = "md") {}
    get name() {
      return this.path.split("/").pop() || "";
    }
  }

  class MockTFolder {
    children: any[];
    constructor(public path: string, children: any[] = []) {
      this.children = children;
    }
    get name() {
      return this.path.split("/").pop() || "";
    }
  }

  class MockWorkspaceLeaf {
    parent: any = null;
    view: any = {};
    constructor() {}
    getContainer = vi.fn();
    getRoot = vi.fn(() => this.root);
    root: any = null;
    setParent(parent: any) {
      this.parent = parent;
    }
    setRoot(root: any) {
      this.root = root;
    }
  }

  class MockWorkspaceTabs {
    children: any[] = [];
    containerEl = { id: "mock-tabs" };
    constructor() {}
  }

  class MockWorkspace {
    activeLeaf: MockWorkspaceLeaf | null = null;
    iterateAllLeaves = vi.fn((callback) => {
      this.leaves.forEach(callback);
    });
    leaves: MockWorkspaceLeaf[] = [];
    addLeaf(leaf: MockWorkspaceLeaf) {
      this.leaves.push(leaf);
    }
  }

  class MockApp {
    workspace = new MockWorkspace();
    fileManager = {
      processFrontMatter: vi.fn(),
    };
    vault = {
      getAbstractFileByPath: vi.fn(),
    };
    commands: any[] = [];
    addCommand = vi.fn((cmd) => {
      this.commands.push(cmd);
    });
  }

  return {
    App: MockApp,
    Workspace: MockWorkspace,
    WorkspaceLeaf: MockWorkspaceLeaf,
    WorkspaceTabs: MockWorkspaceTabs,
    TFile: MockTFile,
    TFolder: MockTFolder,
    FileView: class {},
    Notice: vi.fn(),
    Plugin: class {
      constructor(app: any, manifest: any) {}
    },
    Modal: class {},
  };
};
