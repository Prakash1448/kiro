// Property-based tests for Metrics module

import { describe, it, expect } from '@jest/globals';
import fc from 'fast-check';
import { calculateMetrics, generateRecommendations } from '../../src/metrics/index.js';
import { ProjectAnalysis, ReviewResult, Metrics } from '../../src/shared/types.js';

describe('Metrics Property-Based Tests', () => {
  // Helper to create mock project analysis
  const createMockAnalysis = (overrides: Partial<ProjectAnalysis> = {}): ProjectAnalysis => ({
    totalFiles: 100,
    sourceFiles: 60,
    testFiles: 30,
    filesByExtension: { '.ts': 90, '.js': 10 },
    largeFiles: [],
    directoryTree: { name: 'root', type: 'directory' },
    analyzedAt: new Date().toISOString(),
    ...overrides
  });

  // Helper to create mock review result
  const createMockReview = (errors = 0, warnings = 0, info = 0): ReviewResult => ({
    filePath: 'test.ts',
    issues: [
      ...Array(errors).fill({ severity: 'error', category: 'Error', message: 'error', recommendation: 'fix' }),
      ...Array(warnings).fill({ severity: 'warning', category: 'Warning', message: 'warning', recommendation: 'fix' }),
      ...Array(info).fill({ severity: 'info', category: 'Info', message: 'info', recommendation: 'fix' })
    ] as any,
    summary: { errors, warnings, info },
    score: 100 - (errors * 10) - (warnings * 5) - info
  });

  describe('Health Score Properties', () => {
    it('should always return score between 0 and 100', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100 }),
          fc.integer({ min: 0, max: 100 }),
          fc.integer({ min: 0, max: 50 }),
          (sourceFiles, testFiles, errors) => {
            const analysis = createMockAnalysis({ sourceFiles, testFiles });
            const reviews = [createMockReview(errors, 0, 0)];
            
            const metrics = calculateMetrics(analysis, reviews);
            
            expect(metrics.healthScore).toBeGreaterThanOrEqual(0);
            expect(metrics.healthScore).toBeLessThanOrEqual(100);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should decrease with more errors', () => {
      const analysis = createMockAnalysis({ sourceFiles: 10, testFiles: 5 });
      
      const noErrorsMetrics = calculateMetrics(analysis, [createMockReview(0, 0, 0)]);
      const fewErrorsMetrics = calculateMetrics(analysis, [createMockReview(2, 0, 0)]);
      const manyErrorsMetrics = calculateMetrics(analysis, [createMockReview(10, 0, 0)]);
      
      expect(fewErrorsMetrics.healthScore).toBeLessThan(noErrorsMetrics.healthScore);
      expect(manyErrorsMetrics.healthScore).toBeLessThan(fewErrorsMetrics.healthScore);
    });

    it('should be lower with no tests than with tests', () => {
      const noTests = createMockAnalysis({ sourceFiles: 10, testFiles: 0 });
      const withTests = createMockAnalysis({ sourceFiles: 10, testFiles: 5 });
      
      const noTestsMetrics = calculateMetrics(noTests, []);
      const withTestsMetrics = calculateMetrics(withTests, []);
      
      expect(noTestsMetrics.healthScore).toBeLessThan(withTestsMetrics.healthScore);
    });
  });

  describe('Metrics Structure Properties', () => {
    it('should always return all required fields', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100 }),
          fc.integer({ min: 0, max: 100 }),
          (totalFiles, sourceFiles) => {
            const analysis = createMockAnalysis({ totalFiles, sourceFiles });
            const metrics = calculateMetrics(analysis, []);
            
            expect(metrics.totalFiles).toBeDefined();
            expect(metrics.sourceFiles).toBeDefined();
            expect(metrics.testFiles).toBeDefined();
            expect(metrics.totalLines).toBeDefined();
            expect(metrics.largestFiles).toBeDefined();
            expect(metrics.todoCount).toBeDefined();
            expect(metrics.debugStatementCount).toBeDefined();
            expect(metrics.testToSourceRatio).toBeDefined();
            expect(metrics.healthScore).toBeDefined();
            expect(metrics.issuesSummary).toBeDefined();
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should have non-negative counts', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100 }),
          fc.integer({ min: 0, max: 100 }),
          (sourceFiles, testFiles) => {
            const analysis = createMockAnalysis({ sourceFiles, testFiles });
            const metrics = calculateMetrics(analysis, []);
            
            expect(metrics.totalFiles).toBeGreaterThanOrEqual(0);
            expect(metrics.sourceFiles).toBeGreaterThanOrEqual(0);
            expect(metrics.testFiles).toBeGreaterThanOrEqual(0);
            expect(metrics.totalLines).toBeGreaterThanOrEqual(0);
            expect(metrics.todoCount).toBeGreaterThanOrEqual(0);
            expect(metrics.debugStatementCount).toBeGreaterThanOrEqual(0);
            expect(metrics.testToSourceRatio).toBeGreaterThanOrEqual(0);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should have issues summary matching review aggregation', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 10 }),
          fc.integer({ min: 0, max: 10 }),
          fc.integer({ min: 0, max: 10 }),
          (errors, warnings, info) => {
            const analysis = createMockAnalysis();
            const reviews = [createMockReview(errors, warnings, info)];
            
            const metrics = calculateMetrics(analysis, reviews);
            
            expect(metrics.issuesSummary.errors).toBe(errors);
            expect(metrics.issuesSummary.warnings).toBe(warnings);
            expect(metrics.issuesSummary.info).toBe(info);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Test-to-Source Ratio Properties', () => {
    it('should be 0 when no source files', () => {
      const analysis = createMockAnalysis({ sourceFiles: 0, testFiles: 0 });
      const metrics = calculateMetrics(analysis, []);
      
      expect(metrics.testToSourceRatio).toBe(0);
    });

    it('should equal testFiles / sourceFiles when both present', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 50 }),
          fc.integer({ min: 0, max: 50 }),
          (sourceFiles, testFiles) => {
            const analysis = createMockAnalysis({ sourceFiles, testFiles });
            const metrics = calculateMetrics(analysis, []);
            
            const expectedRatio = Math.round((testFiles / sourceFiles) * 100) / 100;
            expect(metrics.testToSourceRatio).toBeCloseTo(expectedRatio, 2);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should never be negative', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100 }),
          fc.integer({ min: 0, max: 100 }),
          (sourceFiles, testFiles) => {
            const analysis = createMockAnalysis({ sourceFiles, testFiles });
            const metrics = calculateMetrics(analysis, []);
            
            expect(metrics.testToSourceRatio).toBeGreaterThanOrEqual(0);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Recommendations Properties', () => {
    it('should always return array of strings', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100 }),
          fc.integer({ min: 0, max: 100 }),
          (sourceFiles, testFiles) => {
            const analysis = createMockAnalysis({ sourceFiles, testFiles });
            const metrics = calculateMetrics(analysis, []);
            const recommendations = generateRecommendations(metrics, []);
            
            expect(Array.isArray(recommendations)).toBe(true);
            recommendations.forEach(rec => {
              expect(typeof rec).toBe('string');
              expect(rec.length).toBeGreaterThan(0);
            });
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should include test coverage recommendation when no tests', () => {
      const analysis = createMockAnalysis({ sourceFiles: 10, testFiles: 0 });
      const metrics = calculateMetrics(analysis, []);
      const recommendations = generateRecommendations(metrics, []);
      
      const hasTestRecommendation = recommendations.some(r => 
        r.toLowerCase().includes('test') || r.toLowerCase().includes('coverage')
      );
      expect(hasTestRecommendation).toBe(true);
    });

    it('should mention errors when errors exist', () => {
      const analysis = createMockAnalysis();
      const reviews = [createMockReview(5, 0, 0)];
      const metrics = calculateMetrics(analysis, reviews);
      const recommendations = generateRecommendations(metrics, reviews);
      
      const hasErrorRecommendation = recommendations.some(r => 
        r.toLowerCase().includes('error')
      );
      expect(hasErrorRecommendation).toBe(true);
    });

    it('should have at least one recommendation', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 50 }),
          fc.integer({ min: 0, max: 50 }),
          (sourceFiles, testFiles) => {
            const analysis = createMockAnalysis({ sourceFiles, testFiles });
            const metrics = calculateMetrics(analysis, []);
            const recommendations = generateRecommendations(metrics, []);
            
            expect(recommendations.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 30 }
      );
    });
  });

  describe('Largest Files Properties', () => {
    it('should limit to top 5 files', () => {
      const largeFiles = Array.from({ length: 10 }, (_, i) => ({
        path: `file${i}.ts`,
        lines: 1000 - i * 10
      }));
      
      const analysis = createMockAnalysis({ largeFiles });
      const metrics = calculateMetrics(analysis, []);
      
      expect(metrics.largestFiles.length).toBeLessThanOrEqual(5);
    });

    it('should preserve descending order', () => {
      const largeFiles = [
        { path: 'file1.ts', lines: 800 },
        { path: 'file2.ts', lines: 600 },
        { path: 'file3.ts', lines: 550 }
      ];
      
      const analysis = createMockAnalysis({ largeFiles });
      const metrics = calculateMetrics(analysis, []);
      
      for (let i = 0; i < metrics.largestFiles.length - 1; i++) {
        expect(metrics.largestFiles[i].lines).toBeGreaterThanOrEqual(
          metrics.largestFiles[i + 1].lines
        );
      }
    });
  });
});
