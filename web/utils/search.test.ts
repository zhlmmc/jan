import { fuzzySearch } from './search';

describe('fuzzySearch', () => {
  it('should return true when needle is empty string', () => {
    expect(fuzzySearch('', 'test')).toBe(true);
  });

  it('should return true when needle and haystack are equal', () => {
    expect(fuzzySearch('test', 'test')).toBe(true);
  });

  it('should return false when needle is longer than haystack', () => {
    expect(fuzzySearch('testing', 'test')).toBe(false);
  });

  it('should return true when needle characters appear in order in haystack', () => {
    expect(fuzzySearch('tst', 'test')).toBe(true);
    expect(fuzzySearch('tt', 'test')).toBe(true);
    expect(fuzzySearch('est', 'test')).toBe(true);
  });

  it('should return false when needle characters do not appear in order in haystack', () => {
    expect(fuzzySearch('tts', 'test')).toBe(false);
    expect(fuzzySearch('set', 'test')).toBe(false);
  });

  it('should handle case sensitivity correctly', () => {
    expect(fuzzySearch('TEST', 'test')).toBe(false);
    expect(fuzzySearch('test', 'TEST')).toBe(false);
  });

  it('should handle special characters', () => {
    expect(fuzzySearch('t@st', 't@st')).toBe(true);
    expect(fuzzySearch('@#$', 't@#$est')).toBe(true);
  });

  it('should handle numbers', () => {
    expect(fuzzySearch('123', '12345')).toBe(true);
    expect(fuzzySearch('135', '12345')).toBe(true);
    expect(fuzzySearch('531', '12345')).toBe(false);
  });

  it('should handle spaces', () => {
    expect(fuzzySearch('t s', 'test string')).toBe(true);
    expect(fuzzySearch('test string', 'test string')).toBe(true);
  });
});
