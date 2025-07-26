import { describe, it, expect, beforeEach, vi } from 'vitest';
import MultiPropPlugin from '../src/main';
import { MockApp } from './obsidian-mocks';

vi.mock('../src/AddPropModal', () => {
  return {
    PropModal: class {
      open() {}
    },
  };
});

vi.mock('../src/RemoveModal', () => {
  return {
    RemoveModal: class {
      open() {}
    },
  };
});

describe('MultiPropPlugin', () => {
  let app: MockApp;
  let plugin: MultiPropPlugin;

  beforeEach(() => {
    app = new MockApp();
    plugin = new MultiPropPlugin(app as any, { id: 'test-plugin', name: 'Test Plugin', version: '1.0.0' } as any);
    plugin.onload();
  });

  it('should register "Add props to open tabs" command', () => {
    const command = app.commands.find(cmd => cmd.id === 'add-props-to-open-tabs');
    expect(command).toBeDefined();
    expect(command.name).toBe('Add props to open tabs');
  });

  it('should register "Remove props from open tabs" command', () => {
    const command = app.commands.find(cmd => cmd.id === 'remove-props-from-open-tabs');
    expect(command).toBeDefined();
    expect(command.name).toBe('Remove props from open tabs');
  });
});
