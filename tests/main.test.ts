import { vi, expect, test, beforeEach, describe } from 'vitest';

const mocks = vi.hoisted(() => {
    class MockTFile {
        constructor(public path: string, public extension: string = 'md') {}
        get name() { return this.path.split('/').pop() || ''; }
    }
    class MockTFolder {
        children: any[];
        constructor(public path: string, children: any[] = []) { this.children = children; }
        get name() { return this.path.split('/').pop() || ''; }
    }
    class MockApp {
        workspace = {
            activeLeaf: null,
            iterateAllLeaves: vi.fn(),
        };
        fileManager = { processFrontMatter: vi.fn() };
        vault = { getAbstractFileByPath: vi.fn() };
        commands: any[] = [];
        addCommand = vi.fn((cmd) => { this.commands.push(cmd); });
    }
    return {
        TFile: MockTFile,
        TFolder: MockTFolder,
        Notice: vi.fn(),
        Plugin: class { constructor(app: any, manifest: any) {} },
        Modal: class {},
        FileView: class {},
        WorkspaceLeaf: class {},
        WorkspaceTabs: class {},
        App: MockApp,
    };
});

vi.mock('obsidian', () => mocks);

import MultiPropPlugin from '../src/main';
import { TFile, TFolder } from 'obsidian';

describe('MultiPropPlugin Tests', () => {
  let app: any;
  let plugin: MultiPropPlugin;

  beforeEach(() => {
    vi.clearAllMocks();
    app = new mocks.App();
    // @ts-ignore
    plugin = new MultiPropPlugin(app, {});
    plugin.onload();
  });

  test('should register "Add props to tabs in active tab group" command', () => {
    const command = app.commands.find((cmd: any) => cmd.id === 'add-props-to-tab-group');
    expect(command).toBeDefined();
  });

  test('should register "Remove props from tabs in active tab group" command', () => {
    const command = app.commands.find((cmd: any) => cmd.id === 'remove-props-from-tab-group');
    expect(command).toBeDefined();
  });

  describe('File Iteration', () => {
    test('searchFiles should iterate over a list of files', async () => {
      const files = [new TFile('file1.md'), new TFile('file2.md')];
      const callback = vi.fn();
      // @ts-ignore
      await plugin.searchFiles(files, callback);
      expect(callback).toHaveBeenCalledTimes(2);
    });

    test('searchFolders should iterate recursively through folders', async () => {
      const file1 = new TFile('file1.md');
      const file2 = new TFile('file2.md');
      const subFolder = new TFolder('sub', [file2]);
      const rootFolder = new TFolder('root', [file1, subFolder]);
      const callback = vi.fn();
      plugin.settings.recursive = true;
      // @ts-ignore
      await plugin.searchFolders(rootFolder, callback);
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });
});