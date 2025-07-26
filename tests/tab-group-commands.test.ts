import { vi, expect, test, beforeEach, describe } from 'vitest';

const mocks = vi.hoisted(async () => {
  return await import('./obsidian.mock');
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

  beforeEach(async () => {
    vi.clearAllMocks();
    const resolvedMocks = await mocks;
    app = new resolvedMocks.App();
    // @ts-ignore
    plugin = new MultiPropPlugin(app, {});
    await plugin.onload();
  });

  test('should add props only to tabs in the active tab group', async () => {
    const resolvedMocks = await mocks;
    const tabGroup1 = new resolvedMocks.WorkspaceTabs();
    const tabGroup2 = new resolvedMocks.WorkspaceTabs();

    const file1 = new resolvedMocks.TFile('file1.md');
    const leaf1 = new resolvedMocks.WorkspaceLeaf();
    leaf1.view = { file: file1 };
    leaf1.setParent(tabGroup1);
    app.workspace.addLeaf(leaf1);

    const file2 = new resolvedMocks.TFile('file2.md');
    const leaf2 = new resolvedMocks.WorkspaceLeaf();
    leaf2.view = { file: file2 };
    leaf2.setParent(tabGroup1);
    app.workspace.addLeaf(leaf2);

    const file3 = new resolvedMocks.TFile('file3.md');
    const leaf3 = new resolvedMocks.WorkspaceLeaf();
    leaf3.view = { file: file3 };
    leaf3.setParent(tabGroup2);
    app.workspace.addLeaf(leaf3);

    app.workspace.activeLeaf = leaf1;

    vi.spyOn(plugin as any, '_getFilesFromTabGroup').mockReturnValue([file1, file2]);

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
