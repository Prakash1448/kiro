// Property-based tests for Reviewer module

import { describe, it, expect } from '@jest/globals';
import fc from 'fast-check';
import { reviewFile } from '../../src/reviewer/index.js';
import { mkdtemp, writeFile, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

describe('Reviewer Property-Based Tests', () => {
  describe('Review Score Properties', () => {
    it('should always return score between 0 and 100', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 0, maxLength: 1000 }),
          async (content) => {
            const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
            const filePath = join(tempDir, 'test.ts');
            
            try {
              await writeFile(filePath, content);
              const result = await reviewFile(filePath);
              
              expect(result.score).toBeGreaterThanOrEqual(0);
              expect(result.score).toBeLessThanOrEqual(100);
            } finally {
              await rm(tempDir, { recursive: true, force: true });
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should have score of 100 for perfect code', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      const filePath = join(tempDir, 'perfect.ts');
      
      try {
        // Code with no issues
        await writeFile(filePath, `
export function add(a: number, b: number): number {
  return a + b;
}
        `);
        
        const result = await reviewFile(filePath);
        expect(result.score).toBe(100);
        expect(result.issues.length).toBe(0);
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it('should decrease score when issues are present', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      const perfectFile = join(tempDir, 'perfect.ts');
      const flawedFile = join(tempDir, 'flawed.ts');
      
      try {
        await writeFile(perfectFile, 'export const x = 1;');
        await writeFile(flawedFile, 'console.log("debug"); // TODO: fix\nexport const x = 1;');
        
        const perfectResult = await reviewFile(perfectFile);
        const flawedResult = await reviewFile(flawedFile);
        
        expect(flawedResult.score).toBeLessThan(perfectResult.score);
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });
  });

  describe('Review Result Structure Properties', () => {
    it('should always return valid severity values', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 0, maxLength: 500 }),
          async (content) => {
            const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
            const filePath = join(tempDir, 'test.ts');
            
            try {
              await writeFile(filePath, content);
              const result = await reviewFile(filePath);
              
              result.issues.forEach(issue => {
                expect(['error', 'warning', 'info']).toContain(issue.severity);
              });
            } finally {
              await rm(tempDir, { recursive: true, force: true });
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should have summary counts matching issues array', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 0, maxLength: 500 }),
          async (content) => {
            const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
            const filePath = join(tempDir, 'test.ts');
            
            try {
              await writeFile(filePath, content);
              const result = await reviewFile(filePath);
              
              const actualErrors = result.issues.filter(i => i.severity === 'error').length;
              const actualWarnings = result.issues.filter(i => i.severity === 'warning').length;
              const actualInfo = result.issues.filter(i => i.severity === 'info').length;
              
              expect(result.summary.errors).toBe(actualErrors);
              expect(result.summary.warnings).toBe(actualWarnings);
              expect(result.summary.info).toBe(actualInfo);
            } finally {
              await rm(tempDir, { recursive: true, force: true });
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should have all required issue fields', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      const filePath = join(tempDir, 'test.ts');
      
      try {
        await writeFile(filePath, 'console.log("test"); // TODO: fix');
        const result = await reviewFile(filePath);
        
        result.issues.forEach(issue => {
          expect(issue.severity).toBeDefined();
          expect(issue.category).toBeDefined();
          expect(issue.message).toBeDefined();
          expect(issue.recommendation).toBeDefined();
          expect(typeof issue.severity).toBe('string');
          expect(typeof issue.category).toBe('string');
          expect(typeof issue.message).toBe('string');
          expect(typeof issue.recommendation).toBe('string');
        });
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it('should include filePath in result', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      const filePath = join(tempDir, 'test.ts');
      
      try {
        await writeFile(filePath, 'const x = 1;');
        const result = await reviewFile(filePath);
        
        expect(result.filePath).toBe(filePath);
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });
  });

  describe('Issue Detection Properties', () => {
    it('should detect console.log statements', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      const filePath = join(tempDir, 'test.ts');
      
      try {
        await writeFile(filePath, 'console.log("debug");');
        const result = await reviewFile(filePath);
        
        const debugIssues = result.issues.filter(i => i.category === 'Debug Code');
        expect(debugIssues.length).toBeGreaterThan(0);
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it('should detect TODO comments', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      const filePath = join(tempDir, 'test.ts');
      
      try {
        await writeFile(filePath, '// TODO: implement this');
        const result = await reviewFile(filePath);
        
        const todoIssues = result.issues.filter(i => i.category === 'Technical Debt');
        expect(todoIssues.length).toBeGreaterThan(0);
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it('should detect empty catch blocks', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      const filePath = join(tempDir, 'test.ts');
      
      try {
        await writeFile(filePath, 'try { doSomething(); } catch (e) { }');
        const result = await reviewFile(filePath);
        
        const errorHandlingIssues = result.issues.filter(i => i.category === 'Error Handling');
        expect(errorHandlingIssues.length).toBeGreaterThan(0);
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });
  });

  describe('Idempotency Properties', () => {
    it('should produce identical results for repeated reviews', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      const filePath = join(tempDir, 'test.ts');
      
      try {
        await writeFile(filePath, 'console.log("test"); // TODO: fix');
        
        const result1 = await reviewFile(filePath);
        const result2 = await reviewFile(filePath);
        
        expect(result1.score).toBe(result2.score);
        expect(result1.issues.length).toBe(result2.issues.length);
        expect(result1.summary).toEqual(result2.summary);
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });
  });

  describe('Summary Consistency Properties', () => {
    it('should have non-negative summary counts', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 0, maxLength: 300 }),
          async (content) => {
            const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
            const filePath = join(tempDir, 'test.ts');
            
            try {
              await writeFile(filePath, content);
              const result = await reviewFile(filePath);
              
              expect(result.summary.errors).toBeGreaterThanOrEqual(0);
              expect(result.summary.warnings).toBeGreaterThanOrEqual(0);
              expect(result.summary.info).toBeGreaterThanOrEqual(0);
            } finally {
              await rm(tempDir, { recursive: true, force: true });
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should have total issues equal sum of summary', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      const filePath = join(tempDir, 'test.ts');
      
      try {
        await writeFile(filePath, 'console.log("x"); // TODO: fix\ntry {} catch(e) {}');
        const result = await reviewFile(filePath);
        
        const totalFromSummary = result.summary.errors + result.summary.warnings + result.summary.info;
        expect(result.issues.length).toBe(totalFromSummary);
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });
  });
});
