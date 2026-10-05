// Property-based tests for Test Generator module

import { describe, it, expect } from '@jest/globals';
import fc from 'fast-check';
import { generateTests, detectFunctions, suggestTestFilePath } from '../../src/test-generator/index.js';
import { mkdtemp, writeFile, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

describe('Test Generator Property-Based Tests', () => {
  describe('Function Detection Properties', () => {
    it('should always return array of function info', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 500 }),
          (content) => {
            const result = detectFunctions(content);
            expect(Array.isArray(result)).toBe(true);
            result.forEach(func => {
              expect(func.name).toBeDefined();
              expect(typeof func.name).toBe('string');
              expect(typeof func.line).toBe('number');
              expect(typeof func.isAsync).toBe('boolean');
              expect(typeof func.paramCount).toBe('number');
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have non-negative line numbers and param counts', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 500 }),
          (content) => {
            const functions = detectFunctions(content);
            functions.forEach(func => {
              expect(func.line).toBeGreaterThan(0);
              expect(func.paramCount).toBeGreaterThanOrEqual(0);
            });
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should detect named functions', () => {
      const content = 'function testFunc() { return 1; }';
      const functions = detectFunctions(content);
      
      expect(functions.length).toBeGreaterThan(0);
      expect(functions.some(f => f.name === 'testFunc')).toBe(true);
    });

    it('should detect arrow functions', () => {
      const content = 'const myFunc = () => { return 1; }';
      const functions = detectFunctions(content);
      
      expect(functions.length).toBeGreaterThan(0);
      expect(functions.some(f => f.name === 'myFunc')).toBe(true);
    });

    it('should detect async functions', () => {
      const content = 'async function asyncFunc() { return 1; }';
      const functions = detectFunctions(content);
      
      expect(functions.length).toBeGreaterThan(0);
      const asyncFunc = functions.find(f => f.name === 'asyncFunc');
      expect(asyncFunc?.isAsync).toBe(true);
    });

    it('should not include duplicate function names', () => {
      const content = `
        function test() {}
        function test() {}
      `;
      const functions = detectFunctions(content);
      const testFuncs = functions.filter(f => f.name === 'test');
      
      expect(testFuncs.length).toBeLessThanOrEqual(1);
    });
  });

  describe('Test Suggestions Properties', () => {
    it('should always return valid structure', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 10, maxLength: 300 }),
          async (content) => {
            const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
            const filePath = join(tempDir, 'source.ts');
            
            try {
              await writeFile(filePath, content);
              const result = await generateTests(filePath);
              
              expect(result.sourceFile).toBe(filePath);
              expect(result.suggestedTestFile).toBeDefined();
              expect(Array.isArray(result.testSuggestions)).toBe(true);
            } finally {
              await rm(tempDir, { recursive: true, force: true });
            }
          }
        ),
        { numRuns: 30 }
      );
    });

    it('should generate at least 3 test cases per function', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      const filePath = join(tempDir, 'source.ts');
      
      try {
        await writeFile(filePath, 'export function add(a: number, b: number) { return a + b; }');
        const result = await generateTests(filePath);
        
        result.testSuggestions.forEach(suggestion => {
          expect(suggestion.testCases.length).toBeGreaterThanOrEqual(3);
        });
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it('should have valid test case types', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      const filePath = join(tempDir, 'source.ts');
      
      try {
        await writeFile(filePath, 'function test() {}');
        const result = await generateTests(filePath);
        
        result.testSuggestions.forEach(suggestion => {
          suggestion.testCases.forEach(testCase => {
            expect(['happy-path', 'edge-case', 'error-case']).toContain(testCase.type);
            expect(testCase.name).toBeDefined();
            expect(testCase.scenario).toBeDefined();
            expect(typeof testCase.name).toBe('string');
            expect(typeof testCase.scenario).toBe('string');
          });
        });
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it('should include at least one happy-path test', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      const filePath = join(tempDir, 'source.ts');
      
      try {
        await writeFile(filePath, 'export const myFunc = (x: number) => x * 2;');
        const result = await generateTests(filePath);
        
        result.testSuggestions.forEach(suggestion => {
          const happyPath = suggestion.testCases.filter(tc => tc.type === 'happy-path');
          expect(happyPath.length).toBeGreaterThan(0);
        });
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it('should have unique test case names within a suggestion', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      const filePath = join(tempDir, 'source.ts');
      
      try {
        await writeFile(filePath, 'function calc(x: number) { return x; }');
        const result = await generateTests(filePath);
        
        result.testSuggestions.forEach(suggestion => {
          const names = suggestion.testCases.map(tc => tc.name);
          const uniqueNames = new Set(names);
          expect(uniqueNames.size).toBe(names.length);
        });
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });
  });

  describe('Test File Path Properties', () => {
    it('should generate valid test file paths', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('src/utils/calc.ts', 'src/services/user.ts', 'src/index.ts'),
          (sourcePath) => {
            const testPath = suggestTestFilePath(sourcePath);
            expect(testPath).toContain('test');
            expect(testPath.endsWith('.ts')).toBe(true);
          }
        ),
        { numRuns: 20 }
      );
    });

    it('should include test directory in path', () => {
      const sourcePath = 'src/utils/helper.ts';
      const testPath = suggestTestFilePath(sourcePath);
      
      expect(testPath).toContain('tests');
    });

    it('should preserve file extension', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('.ts', '.tsx', '.js', '.jsx'),
          (ext) => {
            const sourcePath = `src/module${ext}`;
            const testPath = suggestTestFilePath(sourcePath);
            expect(testPath).toContain(ext);
          }
        ),
        { numRuns: 10 }
      );
    });
  });

  describe('Idempotency Properties', () => {
    it('should generate same suggestions for repeated calls', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      const filePath = join(tempDir, 'source.ts');
      
      try {
        await writeFile(filePath, 'function add(a: number, b: number) { return a + b; }');
        
        const result1 = await generateTests(filePath);
        const result2 = await generateTests(filePath);
        
        expect(result1.testSuggestions.length).toBe(result2.testSuggestions.length);
        expect(result1.suggestedTestFile).toBe(result2.suggestedTestFile);
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle files with no functions', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      const filePath = join(tempDir, 'empty.ts');
      
      try {
        await writeFile(filePath, 'const x = 1;');
        const result = await generateTests(filePath);
        
        expect(result.testSuggestions.length).toBe(0);
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it('should handle empty files', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      const filePath = join(tempDir, 'empty.ts');
      
      try {
        await writeFile(filePath, '');
        const result = await generateTests(filePath);
        
        expect(result.sourceFile).toBe(filePath);
        expect(result.testSuggestions).toEqual([]);
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });
  });

  describe('Function Parameter Count Properties', () => {
    it('should correctly count function parameters', () => {
      const testCases = [
        { code: 'function noParams() {}', expected: 0 },
        { code: 'function oneParam(x) {}', expected: 1 },
        { code: 'function twoParams(x, y) {}', expected: 2 },
        { code: 'const arrow = (a, b, c) => {}', expected: 3 }
      ];
      
      testCases.forEach(({ code, expected }) => {
        const functions = detectFunctions(code);
        if (functions.length > 0) {
          expect(functions[0].paramCount).toBe(expected);
        }
      });
    });
  });
});
