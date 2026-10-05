// Unit tests for file utilities

import { describe, it, expect } from '@jest/globals';
import { isTestFile, isSourceFile, getFileExtension } from '../../src/shared/file-utils.js';

describe('File Utils', () => {
  describe('isTestFile', () => {
    it('should identify .test.ts files', () => {
      expect(isTestFile('calculator.test.ts')).toBe(true);
      expect(isTestFile('src/utils/helper.test.ts')).toBe(true);
    });

    it('should identify .spec.ts files', () => {
      expect(isTestFile('component.spec.ts')).toBe(true);
    });

    it('should identify files in __tests__ directory', () => {
      expect(isTestFile('src/__tests__/helper.ts')).toBe(true);
    });

    it('should not identify regular source files as tests', () => {
      expect(isTestFile('calculator.ts')).toBe(false);
      expect(isTestFile('src/utils/helper.ts')).toBe(false);
    });
  });

  describe('isSourceFile', () => {
    it('should identify TypeScript source files', () => {
      expect(isSourceFile('calculator.ts')).toBe(true);
      expect(isSourceFile('component.tsx')).toBe(true);
    });

    it('should identify JavaScript source files', () => {
      expect(isSourceFile('utils.js')).toBe(true);
      expect(isSourceFile('component.jsx')).toBe(true);
    });

    it('should not identify test files as source', () => {
      expect(isSourceFile('calculator.test.ts')).toBe(false);
      expect(isSourceFile('component.spec.tsx')).toBe(false);
    });

    it('should not identify non-source extensions', () => {
      expect(isSourceFile('README.md')).toBe(false);
      expect(isSourceFile('package.json')).toBe(false);
    });
  });

  describe('getFileExtension', () => {
    it('should extract file extensions', () => {
      expect(getFileExtension('file.ts')).toBe('.ts');
      expect(getFileExtension('file.test.js')).toBe('.js');
      expect(getFileExtension('README.md')).toBe('.md');
    });

    it('should handle files without extension', () => {
      expect(getFileExtension('Makefile')).toBe('');
    });

    it('should return lowercase extensions', () => {
      expect(getFileExtension('FILE.TS')).toBe('.ts');
    });
  });
});
