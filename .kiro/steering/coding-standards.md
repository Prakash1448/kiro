---
inclusion: auto
---

# Coding Standards - Kiro Project Intelligence Assistant

## TypeScript Conventions

### File Organization

```typescript
// 1. Imports (external, then internal)
import { readFile } from 'fs/promises';
import { glob } from 'glob';

import { FileType } from '../shared/types.js';
import { isTestFile } from '../shared/file-utils.js';

// 2. Types and interfaces
interface AnalysisOptions {
  maxDepth?: number;
  excludePatterns?: string[];
}

// 3. Constants
const DEFAULT_MAX_DEPTH = 5;
const EXCLUDED_DIRS = ['node_modules', '.git', 'dist'];

// 4. Functions (exported first, then internal helpers)
export async function analyzeProject(path: string): Promise<ProjectAnalysis> {
  // Implementation
}

function isExcluded(path: string): boolean {
  // Helper implementation
}
```

### Naming Conventions

#### Files and Directories
- **Source files**: `kebab-case.ts` (e.g., `file-utils.ts`, `project-analyzer.ts`)
- **Test files**: `*.test.ts` (e.g., `analyzer.test.ts`)
- **Type definitions**: Match source file name
- **Directories**: `kebab-case` (e.g., `test-generator/`)

#### Code Elements
```typescript
// Interfaces: PascalCase
interface ProjectAnalysis {
  totalFiles: number;
}

// Types: PascalCase
type FileType = 'source' | 'test' | 'other';

// Classes: PascalCase
class ReviewEngine {
  private rules: Rule[];
}

// Functions: camelCase
function calculateMetrics(data: AnalysisData): Metrics {
  // Implementation
}

// Constants: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 10000;
const DEFAULT_TIMEOUT = 5000;

// Variables: camelCase
let fileCount = 0;
const projectPath = './src';

// Private class members: camelCase with underscore prefix
class Analyzer {
  private _cache: Map<string, any>;
}
```

### Type Safety

#### Always Use Explicit Types
```typescript
// ✅ Good
function processFile(path: string): Promise<FileInfo> {
  // Implementation
}

// ❌ Bad
function processFile(path) {
  // Implementation
}
```

#### Prefer Interfaces for Objects
```typescript
// ✅ Good
interface ReviewResult {
  issues: Issue[];
  score: number;
}

// ❌ Bad (unless specifically need union types)
type ReviewResult = {
  issues: Issue[];
  score: number;
}
```

#### Use Enums for Fixed Sets
```typescript
// ✅ Good
enum Severity {
  Error = 'error',
  Warning = 'warning',
  Info = 'info'
}

// Also acceptable for simple cases
type Severity = 'error' | 'warning' | 'info';
```

#### Avoid `any`
```typescript
// ✅ Good
function parseJson<T>(content: string): T {
  return JSON.parse(content) as T;
}

// ❌ Bad
function parseJson(content: string): any {
  return JSON.parse(content);
}

// If truly unknown, use `unknown` and narrow
function processUnknown(data: unknown): string {
  if (typeof data === 'string') {
    return data;
  }
  return String(data);
}
```

### Error Handling

#### Use Custom Error Classes
```typescript
// Define custom errors
export class InvalidPathError extends Error {
  constructor(path: string) {
    super(`Invalid path: ${path}`);
    this.name = 'InvalidPathError';
  }
}

// Throw with context
if (!existsSync(path)) {
  throw new InvalidPathError(path);
}
```

#### Always Handle Promises
```typescript
// ✅ Good
try {
  const result = await analyzeProject(path);
  return result;
} catch (error) {
  if (error instanceof InvalidPathError) {
    return { success: false, error: error.message };
  }
  throw error; // Re-throw unexpected errors
}

// ❌ Bad (unhandled rejection)
const result = await analyzeProject(path);
return result;
```

#### Return Error Objects for Expected Failures
```typescript
// ✅ Good for expected failures
interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function safeParse(content: string): Result<object> {
  try {
    return { success: true, data: JSON.parse(content) };
  } catch {
    return { success: false, error: 'Invalid JSON' };
  }
}

// ✅ Throw for unexpected failures
function readConfig(path: string): Config {
  if (!existsSync(path)) {
    throw new Error(`Config file not found: ${path}`);
  }
  // ...
}
```

### Async/Await Best Practices

#### Use Async/Await, Not Callbacks
```typescript
// ✅ Good
async function readFiles(paths: string[]): Promise<string[]> {
  const contents = await Promise.all(paths.map(p => readFile(p, 'utf-8')));
  return contents;
}

// ❌ Bad
function readFiles(paths: string[], callback: (err: Error | null, data?: string[]) => void) {
  // Callback hell
}
```

#### Parallelize Independent Operations
```typescript
// ✅ Good - parallel
const [analysis, reviews, tests] = await Promise.all([
  analyzeProject(path),
  reviewFiles(files),
  generateTests(files)
]);

// ❌ Bad - sequential when unnecessary
const analysis = await analyzeProject(path);
const reviews = await reviewFiles(files);
const tests = await generateTests(files);
```

### Function Design

#### Keep Functions Small and Focused
```typescript
// ✅ Good - single responsibility
function countSourceFiles(files: string[]): number {
  return files.filter(f => isSourceFile(f)).length;
}

function countTestFiles(files: string[]): number {
  return files.filter(f => isTestFile(f)).length;
}

// ❌ Bad - doing too much
function analyzeEverything(path: string) {
  // 500 lines of mixed concerns
}
```

#### Pure Functions When Possible
```typescript
// ✅ Good - pure, testable
function calculateScore(issues: Issue[]): number {
  const errors = issues.filter(i => i.severity === 'error').length;
  const warnings = issues.filter(i => i.severity === 'warning').length;
  return Math.max(0, 100 - (errors * 10) - (warnings * 5));
}

// ❌ Bad - side effects hidden
let globalScore = 100;
function calculateScore(issues: Issue[]): void {
  issues.forEach(issue => {
    if (issue.severity === 'error') globalScore -= 10;
  });
}
```

#### Document Complex Logic
```typescript
/**
 * Calculates project health score based on multiple factors.
 * 
 * Algorithm:
 * - Base score: 100
 * - Deduct 30 if no tests exist
 * - Deduct 10 per error (max 50)
 * - Deduct 5 per warning (max 25)
 * 
 * @param metrics - Project metrics including file counts and issues
 * @returns Health score between 0 and 100
 */
function calculateHealthScore(metrics: Metrics): number {
  let score = 100;
  
  if (metrics.testFiles === 0) {
    score -= 30;
  }
  
  score -= Math.min(50, metrics.errors * 10);
  score -= Math.min(25, metrics.warnings * 5);
  
  return Math.max(0, score);
}
```

## Testing Expectations

### Test File Structure
```typescript
import { describe, it, expect } from '@jest/globals';
import { analyzeProject } from '../src/analyzer/index.js';

describe('analyzeProject', () => {
  describe('happy path', () => {
    it('should analyze valid project', async () => {
      const result = await analyzeProject('./test-fixtures/valid-project');
      expect(result.totalFiles).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('should handle empty directory', async () => {
      const result = await analyzeProject('./test-fixtures/empty');
      expect(result.totalFiles).toBe(0);
    });
  });

  describe('error cases', () => {
    it('should throw for invalid path', async () => {
      await expect(analyzeProject('/nonexistent')).rejects.toThrow();
    });
  });
});
```

### Test Coverage Goals
- **Core modules**: >80% coverage
- **Utilities**: >90% coverage
- **Integration points**: 100% of public APIs
- **Property-based tests**: All critical invariants

### Property-Based Test Requirements
Use `fast-check` for:
- Invariants (e.g., file counts never negative)
- Commutativity (e.g., order shouldn't matter)
- Idempotency (e.g., analyzing twice gives same result)
- Consistency (e.g., totals match sums)

```typescript
import fc from 'fast-check';

describe('property-based tests', () => {
  it('file counts are never negative', () => {
    fc.assert(
      fc.asyncProperty(
        fc.array(fc.string()),
        async (files) => {
          const result = await analyzeFiles(files);
          expect(result.totalFiles).toBeGreaterThanOrEqual(0);
          expect(result.sourceFiles).toBeGreaterThanOrEqual(0);
          expect(result.testFiles).toBeGreaterThanOrEqual(0);
        }
      )
    );
  });
});
```

## Code Quality Rules

### No Console Statements in Source
```typescript
// ❌ Bad
function processData(data: any) {
  console.log('Processing:', data);
  return transform(data);
}

// ✅ Good - use proper logging or remove
function processData(data: any) {
  return transform(data);
}
```

### Handle All Error Cases
```typescript
// ❌ Bad - empty catch
try {
  riskyOperation();
} catch (error) {
  // Silent failure
}

// ✅ Good
try {
  riskyOperation();
} catch (error) {
  logger.error('Operation failed:', error);
  throw new OperationError('Failed to complete operation', { cause: error });
}
```

### No TODO Comments in Main Branch
```typescript
// ❌ Bad
function incomplete() {
  // TODO: Implement this
  return null;
}

// ✅ Good - complete implementation or create issue
function complete() {
  return calculateResult();
}
```

### Prefer Const Over Let
```typescript
// ✅ Good
const maxSize = 1000;
const items = [1, 2, 3];

// ❌ Bad (when not reassigned)
let maxSize = 1000;
let items = [1, 2, 3];
```

## Dependency Rules

### External Dependencies
- Minimize external dependencies
- Prefer standard library when possible
- Document why each dependency is needed
- Pin versions in package.json

### Internal Dependencies
- No circular dependencies
- Shared code goes in `src/shared/`
- Modules should not import from siblings
- Import from parent or shared only

```
✅ Good dependency flow:
src/cli/ → src/report/ → src/analyzer/
                      → src/reviewer/
                      → src/shared/

❌ Bad (circular):
src/analyzer/ → src/reviewer/ → src/analyzer/
```

## Performance Guidelines

### Avoid N+1 Problems
```typescript
// ❌ Bad - N+1 file reads
for (const file of files) {
  const content = await readFile(file);
  process(content);
}

// ✅ Good - parallel reads
const contents = await Promise.all(
  files.map(file => readFile(file))
);
contents.forEach(process);
```

### Stream Large Files
```typescript
// ✅ Good for large files
import { createReadStream } from 'fs';

function countLines(path: string): Promise<number> {
  return new Promise((resolve, reject) => {
    let count = 0;
    createReadStream(path)
      .on('data', chunk => {
        count += chunk.toString().split('\n').length;
      })
      .on('end', () => resolve(count))
      .on('error', reject);
  });
}
```

### Set Reasonable Limits
```typescript
const MAX_FILE_SIZE = 10_000_000; // 10MB
const MAX_FILES = 100_000;
const ANALYSIS_TIMEOUT = 30_000; // 30 seconds

if (fileSize > MAX_FILE_SIZE) {
  return { skipped: true, reason: 'File too large' };
}
```

## Documentation Standards

### Public API Documentation
```typescript
/**
 * Analyzes a project directory and returns comprehensive intelligence report.
 * 
 * This function orchestrates the complete analysis pipeline including:
 * - Project structure scanning
 * - Code quality review
 * - Test coverage analysis
 * - Metrics calculation
 * 
 * @param projectPath - Absolute or relative path to project root directory
 * @param options - Optional configuration for analysis behavior
 * @returns Promise resolving to complete intelligence report
 * @throws {InvalidPathError} If projectPath does not exist or is not a directory
 * @throws {AnalysisError} If analysis fails for any reason
 * 
 * @example
 * ```typescript
 * const report = await generateReport('./my-project');
 * console.log(`Health Score: ${report.metrics.healthScore}`);
 * ```
 */
export async function generateReport(
  projectPath: string,
  options?: ReportOptions
): Promise<IntelligenceReport> {
  // Implementation
}
```

### Inline Comments for Complex Logic
```typescript
// Use comments to explain WHY, not WHAT
// ✅ Good
// Sort by severity first (error > warning > info), then by line number
issues.sort((a, b) => {
  if (a.severity !== b.severity) {
    return SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
  }
  return (a.line || 0) - (b.line || 0);
});

// ❌ Bad (obvious from code)
// Loop through issues
for (const issue of issues) {
  // Add to array
  results.push(issue);
}
```

## Git Commit Standards

### Commit Message Format
```
type(scope): brief description

Longer explanation if needed.

- Bullet points for multiple changes
- Reference issues: Fixes #123
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructuring
- `test`: Adding tests
- `docs`: Documentation
- `chore`: Build/tooling

### Examples
```
feat(analyzer): add large file detection
fix(reviewer): handle empty catch blocks correctly
test(analyzer): add property-based tests for file classification
docs(readme): add Kiro University lessons explanation
```

## Summary

These standards ensure:
- **Consistency**: Code looks like one person wrote it
- **Quality**: High standards maintained throughout
- **Maintainability**: Easy to understand and modify
- **Testability**: Designed for comprehensive testing

When in doubt, prioritize clarity and simplicity over cleverness.
