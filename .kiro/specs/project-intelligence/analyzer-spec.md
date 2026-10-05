# Project Analyzer - Feature Specification

## Purpose

The Project Analyzer scans a target directory and extracts comprehensive project structure information.

## Requirements

### Input
- `projectPath: string` - Absolute or relative path to project root

### Output
```typescript
{
  totalFiles: number,
  sourceFiles: number,
  testFiles: number,
  filesByExtension: Record<string, number>,
  largeFiles: Array<{ path: string, lines: number }>,
  directoryTree: DirectoryNode,
  analyzedAt: string
}
```

### Analysis Rules

#### File Classification
- **Source files**: `.ts`, `.js`, `.tsx`, `.jsx`, `.py`, `.java`, `.go` (excluding test files)
- **Test files**: Files containing `.test.`, `.spec.`, `_test.`, or in `__tests__` directories
- **Excluded**: `node_modules`, `.git`, `dist`, `build`, `coverage`, `.next`

#### Large File Detection
- Flag files exceeding 500 lines as potentially problematic
- Include file path and line count
- Sort by line count descending

#### Directory Tree
- Build hierarchical structure
- Include file/folder names only
- Limit depth to 5 levels for performance

## Implementation Strategy

### Algorithm
1. Use glob to recursively find all files
2. Filter out excluded directories
3. Classify each file by extension and name pattern
4. Count lines for large file detection
5. Build directory tree structure
6. Aggregate statistics

### Performance Considerations
- Stream file reading for line counting
- Parallel processing where possible
- Early termination for very large projects (>10,000 files)

## Test Cases

### Unit Tests
1. Classifies `.test.ts` files as test files
2. Classifies `.ts` files as source files
3. Excludes `node_modules` directory
4. Correctly counts files by extension
5. Handles empty directories
6. Handles invalid paths with error

### Property-Based Tests
1. Total files = source files + test files + other files
2. File counts are never negative
3. Running analysis twice yields same results
4. Large files array is sorted by line count

## Error Handling

- **Invalid path**: Throw clear error with path
- **Permission denied**: Log warning, continue with accessible files
- **Corrupted files**: Skip and log, don't crash

## Integration Points

- Used by Report Generator
- Exposed via MCP tool `analyze_project`
- CLI uses for initial project scan
