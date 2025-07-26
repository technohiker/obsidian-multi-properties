import { describe, it, expect, beforeEach, vi } from 'vitest';
import { addProperties, removeProperties, addPropToSet } from '../src/frontmatter';

const mocks = vi.hoisted(() => {
    class MockTFile {
        frontmatter: any;
        constructor(public path: string, frontmatter = {}) {
            this.frontmatter = frontmatter;
        }
        get name() { return this.path.split('/').pop() || ''; }
    }
    return {
        TFile: MockTFile,
    };
});

vi.mock('obsidian', () => mocks);

describe('Frontmatter Utilities', () => {
  let fileManager: any;
  let file: any;

  beforeEach(() => {
    fileManager = {
        processFrontMatter: vi.fn(async (f: any, cb: (fm: any) => void) => {
            cb(f.frontmatter);
        })
    };
    file = new mocks.TFile('test.md', {
        existingProp: 'initial value',
        tags: ['tag1', 'tag2'],
    });
  });

  describe('addProperties', () => {
    it('should add new properties to the frontmatter', async () => {
        const props = new Map<string, any>([['newProp', { data: 'new value' }]]);
        await addProperties(fileManager.processFrontMatter, file, props, false, {});
        expect(file.frontmatter.newProp).toBe('new value');
    });
  });

  describe('removeProperties', () => {
    it('should remove a property from the frontmatter', async () => {
        await removeProperties(fileManager.processFrontMatter, file, ['existingProp']);
        expect(file.frontmatter).not.toHaveProperty('existingProp');
    });
  });

  describe('addPropToSet', () => {
    it('should add all properties from a file to a set', async () => {
        const names = new Set<string>();
        await addPropToSet(fileManager.processFrontMatter, names, file);
        expect(names).toContain('existingProp');
        expect(names).toContain('tags');
    });
  });
});