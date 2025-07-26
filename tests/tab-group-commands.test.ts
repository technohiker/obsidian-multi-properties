import { vi, expect, test, beforeEach, describe } from 'vitest';

const mocks = vi.hoisted(() => {
    class MockTFile {
        constructor(public path: string, public extension: string = 'md') {}
        get name() { return this.path.split('/').pop() || ''; }
    }
    class MockWorkspaceLeaf {
        parent: any = null;
        view: any = {};
        root: any = null;
        constructor() {}
        getContainer = vi.fn();
        getRoot = vi.fn(() => this.root);
        setParent(parent: any) { this.parent = parent; }
        setRoot(root: any) { this.root = root; }
    }
    class MockWorkspaceTabs {
        children: any[] = [];
        containerEl = { id: 'mock-tabs' };
        constructor() {}
    }
    class MockApp {
        workspace = {
            activeLeaf: null,
            leaves: [] as any[],
            iterateAllLeaves: vi.fn((cb) => {
                (this as any).workspace.leaves.forEach(cb);
            }),
            addLeaf: (leaf: any) => {
                (this as any).workspace.leaves.push(leaf);
            }
        };
        commands: any[] = [];
        addCommand = vi.fn((cmd) => { this.commands.push(cmd); });
    }
    return {
        TFile: MockTFile,
        WorkspaceLeaf: MockWorkspaceLeaf,
        WorkspaceTabs: MockWorkspaceTabs,
        FileView: class {},
        Notice: vi.fn(),
        Plugin: class { constructor(app: any, manifest: any) {} },
        App: MockApp,
    };
});

vi.mock('obsidian', () => mocks);

vi.mock('../src/AddPropModal', () => {
    const PropModal = vi.fn();
    PropModal.prototype.open = vi.fn();
    return { PropModal };
});

import MultiPropPlugin from '../src/main';
import { TFile } from 'obsidian';

describe('Tab Group-specific Commands', () => {
  let app: any;
  let plugin: MultiPropPlugin;

  beforeEach(() => {
    vi.clearAllMocks();
    app = new mocks.App();
    // @ts-ignore
    plugin = new MultiPropPlugin(app, {});
    plugin.onload();
  });

  test('should add props only to tabs in the active tab group', async () => {
    const tabGroup1 = new mocks.WorkspaceTabs();
    const tabGroup2 = new mocks.WorkspaceTabs();

    const file1 = new TFile('file1.md');
    const leaf1 = new mocks.WorkspaceLeaf();
    leaf1.view = { file: file1 };
    leaf1.setParent(tabGroup1);
    app.workspace.addLeaf(leaf1);

    const file2 = new TFile('file2.md');
    const leaf2 = new mocks.WorkspaceLeaf();
    leaf2.view = { file: file2 };
    leaf2.setParent(tabGroup1);
    app.workspace.addLeaf(leaf2);

    const file3 = new TFile('file3.md');
    const leaf3 = new mocks.WorkspaceLeaf();
    leaf3.view = { file: file3 };
    leaf3.setParent(tabGroup2);
    app.workspace.addLeaf(leaf3);

    app.workspace.activeLeaf = leaf1;

    const createPropModalSpy = vi.spyOn(plugin, 'createPropModal');

    const command = app.commands.find(
      (cmd: any) => cmd.id === 'add-props-to-tab-group'
    );
    await command.callback();

    expect(createPropModalSpy).toHaveBeenCalledTimes(1);
    // @ts-ignore
    expect(createPropModalSpy).toHaveBeenCalledWith([file1, file2]);
  });
});
