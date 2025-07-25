import { describe, it, expect } from 'vitest';
import { removeExtraCommas } from '../src/helpers';

describe('removeExtraCommas', () => {
  it('should remove leading and trailing commas', () => {
    expect(removeExtraCommas(',hello,world,')).toBe('hello,world');
  });

  it('should replace multiple consecutive commas with a single comma', () => {
    expect(removeExtraCommas('hello,,,world')).toBe('hello,world');
  });

  it('should handle a string with no extra commas', () => {
    expect(removeExtraCommas('hello,world')).toBe('hello,world');
  });

  it('should handle a string with only commas', () => {
    expect(removeExtraCommas(',,,')).toBe('');
  });

  it('should handle an empty string', () => {
    expect(removeExtraCommas('')).toBe('');
  });

  it('should handle a combination of leading, trailing, and multiple commas', () => {
    expect(removeExtraCommas(',,hello,,,world,,')).toBe('hello,world');
  });
});
