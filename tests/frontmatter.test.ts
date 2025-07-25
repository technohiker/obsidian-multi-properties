import { describe, it, expect, vi } from 'vitest';
import { addProperties } from '../src/frontmatter';
import { TFile } from 'obsidian';

describe('addProperties', () => {
  it('should add new properties to the frontmatter', () => {
    const file = { path: 'test.md' } as TFile;
    const props = new Map();
    props.set('newProp', { type: 'text', data: 'newValue' });

    const fileProcessor = (file: TFile, callback: (frontmatter: any) => void) => {
      const frontmatter = {};
      callback(frontmatter);
      expect(frontmatter).toEqual({ newProp: 'newValue' });
    };

    addProperties(fileProcessor, file, props, false, {});
  });

  it('should overwrite existing properties when overwrite is true', () => {
    const file = { path: 'test.md' } as TFile;
    const props = new Map();
    props.set('existingProp', { type: 'text', data: 'newValue' });

    const fileProcessor = (file: TFile, callback: (frontmatter: any) => void) => {
      const frontmatter = { existingProp: 'oldValue' };
      callback(frontmatter);
      expect(frontmatter).toEqual({ existingProp: 'newValue' });
    };

    addProperties(fileProcessor, file, props, true, {});
  });

  it('should append to existing properties when overwrite is false and types are compatible', () => {
    const file = { path: 'test.md' } as TFile;
    const props = new Map();
    props.set('existingProp', { type: 'text', data: 'newValue' });

    const fileProcessor = (file: TFile, callback: (frontmatter: any) => void) => {
      const frontmatter = { existingProp: 'oldValue' };
      callback(frontmatter);
      expect(frontmatter).toEqual({ existingProp: ['oldValue', 'newValue'] });
    };

    addProperties(fileProcessor, file, props, false, { existingprop: { type: 'text' } });
  });
});
