import { fuzzySearch } from './search';

describe('fuzzySearch', () => {
  it('should return true when needle matches haystack exactly', () => {
    expect(fuzzySearch('test', 'test')).toBe(true);
  });

  it('should return true when needle characters appear in order in haystack', () => {
    expect(fuzzySearch('tst', 'test')).toBe(true);
    expect(fuzzySearch('ct', 'cat')).toBe(true);
    expect(fuzzySearch('abc', 'a1b2c3')).toBe(true);
  });

  it('should return false when needle is longer than haystack', () => {
    expect(fuzzySearch('testing', 'test')).toBe(false);
  });

  it('should return false when needle characters do not appear in order', () => {
    expect(fuzzySearch('tset', 'test')).toBe(false);
  });

  it('should return false when needle characters are not in haystack', () => {
    expect(fuzzySearch('xyz', 'test')).toBe(false);
  });

  it('should handle empty strings', () => {
    expect(fuzzySearch('', '')).toBe(true);
    expect(fuzzySearch('', 'test')).toBe(true);
    expect(fuzzySearch('test', '')).toBe(false);
  });

  it('should be case sensitive', () => {
    expect(fuzzySearch('Test', 'test')).toBe(false);
    expect(fuzzySearch('TEST', 'test')).toBe(false);
  });

  it('should handle special characters', () => {
    expect(fuzzySearch('h!', 'hello!')).toBe(true);
    expect(fuzzySearch('@#$', '@testing#here$')).toBe(true);
  });

  it('should handle repeating characters', () => {
    expect(fuzzySearch('aaa', 'aaaa')).toBe(true);
    expect(fuzzySearch('aaa', 'aa')).toBe(false);
  });
});
