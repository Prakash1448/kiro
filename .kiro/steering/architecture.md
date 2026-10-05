---
inclusion: auto
---

# Architecture Guide - Kiro Project Intelligence Assistant

## System Architecture

### High-Level Design

```
┌──────────────────────────────────────────────────────────┐
│                    External Interfaces                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │   CLI    │  │   MCP    │  │  Power   │  │  Agent   │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘ │
└───────┼─────────────┼─────────────┼─────────────┼────────┘
        │             │             │             │
┌───────▼─────────────▼─────────────▼─────────────▼────────┐
│              Application Core (src/core/)                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │           Report Generator (Orchestrator)         │   │
│  └──┬───────┬────────┬──────────┬─────────┬─────────┘   │
│     │       │        │          │         │              │
│  ┌──▼──┐ ┌──▼───┐ ┌─▼────┐ ┌───▼────┐ ┌──▼─────┐       │
│  │Analyz││Review││Test  ││Metrics ││Shared  │       │
│  │er   ││er    ││Gen   ││        ││Utils   │       │
│  └─────┘ └──────┘ └──────┘ └────────┘ └────────┘       │
└───────────────────────────────────────────────────────────┘
```

## Module Responsibilities

### 1. Analyzer Module (`src/analyzer/`)

**Purpose**: Scans project directory and extracts structural information

**Responsibilities**:
- Recursively discover all files in project
- Classify files by type (source, test, other)
- Count lines of code
- Identify large files (>500 lines)
- Build directory tree structure
- Exclude irrelevant directories (node_modules, .git, etc.)

**Key Functions**:
- `analyzeProject(path: string): Promise<ProjectAnalysis>`
- `classifyFile(filePath: string): FileType`
- `countLines(filePath: string): Promise<number>`
- `buildDirectoryTree(path: string): DirectoryNode`

**Data Flow**:
```
Input: Project Path
  ↓
Glob file discovery
  ↓
File classification
  ↓
Parallel line counting
  ↓
Tree structure building
  ↓
Output: ProjectAnalysis
```

### 2. Reviewer Module (`src/reviewer/`)

**Purpose**: Analyzes source code for quality issues

**Responsibilities**:
- Parse source file content
- Apply quality rules (long functions, debug statements, TODOs, etc.)
- Generate structured issues with severity and recommendations
- Calculate file quality score
- Aggregate issue summaries

**Key Functions**:
- `reviewFile(filePath: string): Promise<ReviewResult>`
- `applyRule(content: string, rule: Rule): Issue[]`
- `calculateScore(issues: Issue[]): number`

**Rule Engine**:
```typescript
interface Rule {
  name: string;
  pattern: RegExp;
  severity: 'error' | 'warning' | 'info';
  category: string;
  getMessage: (match: RegExpMatchArray) => string;
  getRecommendation: () => string;
}
```

**Data Flow**:
```
Input: File Path
  ↓
Read file content
  ↓
Apply each rule
  ↓
Collect issues
  ↓
Calculate score
  ↓
Output: ReviewResult
```

### 3. Test Generator Module (`src/test-generator/`)

**Purpose**: Suggests test cases for source code

**Responsibilities**:
- Detect functions in source files
- Generate test case descriptions
- Suggest test file paths
- Create test templates

**Key Functions**:
- `generateTests(sourceFile: string): Promise<TestSuggestions>`
- `detectFunctions(content: string): FunctionInfo[]`
- `createTestCases(func: FunctionInfo): TestCase[]`
- `suggestTestFilePath(sourceFile: string): string`

**Generation Strategy**:
- Use regex to find function declarations
- Generate 3-5 test cases per function:
  - 1 happy path
  - 2-3 edge cases (null, empty, large inputs)
  - 1-2 error cases

**Data Flow**:
```
Input: Source File
  ↓
Read content
  ↓
Detect functions
  ↓
Generate test cases for each
  ↓
Format suggestions
  ↓
Output: TestSuggestions
```

### 4. Metrics Module (`src/metrics/`)

**Purpose**: Calculates aggregate project metrics

**Responsibilities**:
- Aggregate file counts
- Calculate test-to-source ratio
- Count technical debt indicators (TODOs, debug statements)
- Identify largest files
- Calculate overall health score

**Key Functions**:
- `calculateMetrics(analysis: ProjectAnalysis, reviews: ReviewResult[]): Metrics`
- `calculateHealthScore(metrics: Metrics): number`
- `aggregateIssues(reviews: ReviewResult[]): IssueSummary`

**Health Score Algorithm**:
```
Base Score: 100

Deductions:
- No tests: -30
- Low test ratio (<0.3): -15
- Many debug statements (>10): -10
- Many TODOs (>20): -5
- Large files (>5): -5 per file (max -15)
- Code quality issues: -1 per error, -0.5 per warning

Minimum: 0
Maximum: 100
```

**Data Flow**:
```
Input: ProjectAnalysis + ReviewResults[]
  ↓
Aggregate statistics
  ↓
Calculate ratios
  ↓
Apply health scoring
  ↓
Output: Metrics
```

### 5. Report Generator Module (`src/report/`)

**Purpose**: Orchestrates analysis pipeline and generates final report

**Responsibilities**:
- Coordinate all analysis modules
- Handle errors gracefully
- Format final JSON output
- Add metadata (timestamp, version, etc.)
- Prioritize recommendations

**Key Functions**:
- `generateReport(projectPath: string): Promise<IntelligenceReport>`
- `orchestrateAnalysis(path: string): Promise<AnalysisResults>`
- `prioritizeRecommendations(issues: Issue[]): Recommendation[]`

**Pipeline Flow**:
```
Input: Project Path
  ↓
1. Validate path exists
  ↓
2. Run Analyzer (parallel with next steps where possible)
  ↓
3. Get source file list
  ↓
4. Run Reviewer on each source file (parallel)
  ↓
5. Run Test Generator on source files (parallel)
  ↓
6. Calculate Metrics
  ↓
7. Combine results
  ↓
8. Prioritize recommendations
  ↓
9. Format report
  ↓
Output: IntelligenceReport JSON
```

## Shared Utilities (`src/shared/`)

### Types (`types.ts`)
- All TypeScript interfaces and types
- Ensures consistency across modules

### File Utils (`file-utils.ts`)
- `readFile(path: string): Promise<string>`
- `fileExists(path: string): boolean`
- `getFileExtension(path: string): string`
- `isTestFile(path: string): boolean`

### Error Handling (`errors.ts`)
- Custom error classes
- Error formatting
- Graceful degradation

## Design Principles

### 1. Separation of Concerns
- Each module has single, clear responsibility
- No circular dependencies
- Minimal coupling between modules

### 2. Pure Functions Where Possible
- Prefer pure functions for business logic
- Side effects isolated to I/O boundaries
- Easier testing and reasoning

### 3. Fail Gracefully
- Invalid inputs return errors, don't crash
- Partial results better than no results
- Clear error messages for users

### 4. Performance Conscious
- Parallel processing where beneficial
- Stream large files
- Early termination for unreasonable inputs

### 5. Testability
- Small, focused functions
- Dependency injection for file I/O
- Clear interfaces between modules

## Data Flow Example

### Full Analysis Pipeline

```
User: npm run analyze -- ./my-project
  │
  ├──> CLI parses arguments
  │
  ├──> Report Generator starts
  │     │
  │     ├──> Analyzer scans ./my-project
  │     │     └──> Returns: 150 files, 50 source, 20 test
  │     │
  │     ├──> Reviewer analyzes 50 source files (parallel)
  │     │     └──> Returns: 45 issues found
  │     │
  │     ├──> Test Generator processes source files (parallel)
  │     │     └──> Returns: 120 test suggestions
  │     │
  │     ├──> Metrics calculates aggregates
  │     │     └──> Returns: Health score 75
  │     │
  │     └──> Combine into final report
  │
  └──> Output JSON to console
```

## Integration Points

### CLI Integration (`src/cli/`)
```typescript
// Entry point for command-line usage
import { generateReport } from '../report/index.js';

const projectPath = process.argv[2];
const report = await generateReport(projectPath);
console.log(JSON.stringify(report, null, 2));
```

### MCP Server Integration (`mcp/server/`)
```typescript
// Tools wrap core modules
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'analyze_project') {
    return await generateReport(request.params.arguments.path);
  }
  // ... other tools
});
```

### Power Integration (`powers/intelligence-suite/`)
- Power workflows invoke CLI or use MCP tools
- Steering files guide usage patterns
- Configuration for Kiro IDE integration

### Custom Agent Integration (`.kiro/agents/`)
- Agent uses MCP tools for analysis
- Follows structured workflow
- Produces formatted intelligence reports

## Error Handling Strategy

### Error Categories

1. **User Errors** (Exit code 1)
   - Invalid path provided
   - No permissions to read directory
   - Path is not a directory

2. **Partial Failures** (Exit code 0, warnings in output)
   - Some files unreadable
   - Binary files skipped
   - Malformed source files

3. **System Errors** (Exit code 2)
   - Out of memory
   - System I/O errors
   - Unexpected exceptions

### Error Response Format
```typescript
{
  success: false,
  error: {
    code: 'INVALID_PATH',
    message: 'Project path does not exist: /invalid/path',
    details?: any
  }
}
```

## Performance Targets

- **Small projects** (<100 files): <1 second
- **Medium projects** (100-1000 files): <5 seconds
- **Large projects** (1000-10000 files): <30 seconds
- **Memory usage**: <500MB for typical projects

## Security Considerations

- Never execute code from analyzed projects
- Sanitize file paths to prevent directory traversal
- Limit file size to prevent memory exhaustion
- Timeout long-running operations

## Future Architecture Enhancements

### Phase 2 Ideas
- Plugin system for custom rules
- Configuration file support
- Incremental analysis (only changed files)
- Cache results for faster re-runs
- Parallel analysis across CPU cores

### Not Planned
- Database integration (stay filesystem-based)
- Network requests (stay offline)
- Code execution (stay static analysis)

## Conclusion

This architecture prioritizes:
- **Simplicity**: Easy to understand and maintain
- **Modularity**: Easy to extend and test
- **Performance**: Fast enough for pre-commit hooks
- **Reliability**: Graceful handling of edge cases

All implementation should follow these architectural patterns.
