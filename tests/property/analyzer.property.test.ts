// Property-based tests for Analyzer module

import { describe, it, expect } from '@jest/globals';
import fc from 'fast-check';
import { analyzeProject, classifyFile } from '../../src/analyzer/index.js';
import { mkdtemp, writeFile, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

describe('Analyzer Property-Based Tests', () => {
  describe('File Classification Properties', () => {
    it('should always return one of three valid types', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          (fileName) => {
            const result = classifyFile(fileName);
            expect(['source', 'test', 'other']).toContain(result);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should classify test files consistently', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('.test.ts', '.spec.ts', '_test.js', '.test.jsx'),
          fc.string({ minLength: 3, maxLength: 20 }),
          (testSuffix, baseName) => {
            const fileName = `${baseName}${testSuffix}`;
            const result = classifyFile(fileName);
            expect(result).toBe('test');
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should classify source files with standard extensions', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('.ts', '.tsx', '.js', '.jsx'),
          fc.string({ minLength: 3, maxLength: 20 }).filter(s => !s.includes('test') && !s.includes('spec')),
          (ext, baseName) => {
            const fileName = `src/${baseName}${ext}`;
            const result = classifyFile(fileName);
            expect(result).toBe('source');
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Project Analysis Properties', () => {
    it('should never return negative file counts', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      
      try {
        const analysis = await analyzeProject(tempDir);
        
        expect(analysis.totalFiles).toBeGreaterThanOrEqual(0);
        expect(analysis.sourceFiles).toBeGreaterThanOrEqual(0);
        expect(analysis.testFiles).toBeGreaterThanOrEqual(0);
        expect(analysis.largeFiles.length).toBeGreaterThanOrEqual(0);
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it('should maintain consistency: totalFiles >= sourceFiles + testFiles', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      
      try {
        // Create some test files
        await writeFile(join(tempDir, 'file1.ts'), 'export const x = 1;');
        await writeFile(join(tempDir, 'file2.test.ts'), 'test("x", () => {});');
        await writeFile(join(tempDir, 'readme.md'), '# README');
        
        const analysis = await analyzeProject(tempDir);
        
        // Total files should be >= sum of source and test files
        expect(analysis.totalFiles).toBeGreaterThanOrEqual(
          analysis.sourceFiles + analysis.testFiles
        );
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it('should produce identical results for repeated analysis (idempotency)', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      
      try {
        await writeFile(join(tempDir, 'test.ts'), 'const x = 1;');
        
        const analysis1 = await analyzeProject(tempDir);
        const analysis2 = await analyzeProject(tempDir);
        
        expect(analysis1.totalFiles).toBe(analysis2.totalFiles);
        expect(analysis1.sourceFiles).toBe(analysis2.sourceFiles);
        expect(analysis1.testFiles).toBe(analysis2.testFiles);
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it('should have directory tree root node', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      
      try {
        const analysis = await analyzeProject(tempDir);
        
        expect(analysis.directoryTree).toBeDefined();
        expect(analysis.directoryTree.type).toBe('directory');
        expect(analysis.directoryTree.name).toBeDefined();
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it('should have valid timestamp in ISO format', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      
      try {
        const analysis = await analyzeProject(tempDir);
        
        expect(analysis.analyzedAt).toBeDefined();
        expect(() => new Date(analysis.analyzedAt)).not.toThrow();
        expect(new Date(analysis.analyzedAt).toISOString()).toBe(analysis.analyzedAt);
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it('should sort large files by line count descending', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      
      try {
        // Create files with different line counts
        await writeFile(join(tempDir, 'small.ts'), 'const x = 1;\n'.repeat(10));
        await writeFile(join(tempDir, 'large.ts'), 'const x = 1;\n'.repeat(600));
        await writeFile(join(tempDir, 'medium.ts'), 'const x = 1;\n'.repeat(550));
        
        const analysis = await analyzeProject(tempDir);
        
        // Verify descending order
        for (let i = 0; i < analysis.largeFiles.length - 1; i++) {
          expect(analysis.largeFiles[i].lines).toBeGreaterThanOrEqual(
            analysis.largeFiles[i + 1].lines
          );
        }
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });
  });

  describe('File Extension Counting Properties', () => {
    it('should count extensions correctly', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      
      try {
        await writeFile(join(tempDir, 'file1.ts'), 'content');
        await writeFile(join(tempDir, 'file2.ts'), 'content');
        await writeFile(join(tempDir, 'file3.js'), 'content');
        
        const analysis = await analyzeProject(tempDir);
        
        expect(analysis.filesByExtension['.ts']).toBe(2);
        expect(analysis.filesByExtension['.js']).toBe(1);
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it('should have non-negative extension counts', async () => {
      const tempDir = await mkdtemp(join(tmpdir(), 'test-'));
      
      try {
        const analysis = await analyzeProject(tempDir);
        
        Object.values(analysis.filesByExtension).forEach(count => {
          expect(count).toBeGreaterThan(0); // Should only include extensions that exist
        });
      } finally {
        await rm(tempDir, { recursive: true, force: true });
      }
    });
  });
});
