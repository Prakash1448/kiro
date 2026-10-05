// Shared type definitions for Kiro Project Intelligence Assistant

export type FileType = 'source' | 'test' | 'other';

export type Severity = 'error' | 'warning' | 'info';

export interface DirectoryNode {
  name: string;
  type: 'file' | 'directory';
  children?: DirectoryNode[];
}

export interface ProjectAnalysis {
  totalFiles: number;
  sourceFiles: number;
  testFiles: number;
  filesByExtension: Record<string, number>;
  largeFiles: Array<{ path: string; lines: number }>;
  directoryTree: DirectoryNode;
  analyzedAt: string;
}

export interface Issue {
  severity: Severity;
  category: string;
  line?: number;
  message: string;
  recommendation: string;
}

export interface ReviewResult {
  filePath: string;
  issues: Issue[];
  summary: {
    errors: number;
    warnings: number;
    info: number;
  };
  score: number;
}

export interface TestCase {
  name: string;
  scenario: string;
  type: 'happy-path' | 'edge-case' | 'error-case';
}

export interface FunctionInfo {
  name: string;
  line: number;
  isAsync: boolean;
  paramCount: number;
}

export interface TestSuggestion {
  functionName: string;
  description: string;
  testCases: TestCase[];
}

export interface TestSuggestions {
  sourceFile: string;
  suggestedTestFile: string;
  testSuggestions: TestSuggestion[];
}

export interface Metrics {
  totalFiles: number;
  sourceFiles: number;
  testFiles: number;
  totalLines: number;
  largestFiles: Array<{ path: string; lines: number }>;
  todoCount: number;
  debugStatementCount: number;
  testToSourceRatio: number;
  healthScore: number;
  issuesSummary: {
    errors: number;
    warnings: number;
    info: number;
  };
}

export interface IntelligenceReport {
  projectPath: string;
  timestamp: string;
  analysis: ProjectAnalysis;
  reviews: ReviewResult[];
  testSuggestions: TestSuggestions[];
  metrics: Metrics;
  recommendations: string[];
}

export interface AnalysisOptions {
  maxDepth?: number;
  excludePatterns?: string[];
  includePatterns?: string[];
}

export interface ReportOptions {
  includeReviews?: boolean;
  includeTestSuggestions?: boolean;
  maxFilesToReview?: number;
}
