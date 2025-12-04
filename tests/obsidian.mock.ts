import { vi } from "vitest";

class MockTFile {
  constructor(public path: string, public extension: string = "md") { }
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
  constructor() { }
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
  constructor() { }
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
  on(name: "search:results-menu",
    callback: (menu: any, leaf: any) => any,
    ctx?: any){}
}

class MockMetadataCache {
  constructor() {}
  getAllPropertyInfos() {
    return [{name: "test", widget: "text",occurences: 1}]
  }
}

class MockApp {
  workspace = new MockWorkspace();
  metadataCache = new MockMetadataCache();
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

export const App = MockApp;
export const Workspace = MockWorkspace;
export const MetdataCache = MockMetadataCache;
export const WorkspaceLeaf = MockWorkspaceLeaf;
export const WorkspaceTabs = MockWorkspaceTabs;
export const TFile = MockTFile;
export const TFolder = MockTFolder;
export const FileView = class { };
export const Notice = vi.fn();
export const Plugin = class {
  app: any;
  constructor(app: any, manifest: any) {
    this.app = app;
  }
  async loadData() {
    return {};
  }
  addSettingTab() { }
  addCommand(command: any) {
    this.app.commands.push(command);
  }
  registerEvent(eventRef: any){}
};
export const Modal = class {
  constructor(app: any) { }
  open() { }
  close() { }
};
export const PluginSettingTab = class {
  constructor(app: any, plugin: any) { }
  display() { }
};
export const Setting = class {
  setName() {
    return this;
  }
  setDesc() {
    return this;
  }
  addText() {
    return this;
  }
  addToggle() {
    return this;
  }
};
