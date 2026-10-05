# Code Reviewer - Feature Specification

## Purpose

The Code Reviewer analyzes source files and identifies code quality issues using rule-based detection.

## Requirements

### Input
- `filePath: string` - Path to source file to review
- `rules?: string[]` - Optional specific rules to apply (default: all)

### Output
```typescript
{
  filePath: string,
  issues: Array<{
    severity: 'error' | 'warning' | 'info',
    category: string,
    line?: number,
    message: string,
    recommendation: string
  }>,
  summary: {
    errors: number,
    warnings: number,
    info: number
  },
  score: number // 0-100
}
```

## Review Rules

### Rule 1: Long Functions
- **Detection**: Functions exceeding 50 lines
- **Severity**: Warning
- **Category**: Maintainability
- **Message**: "Function '<name>' is <N> lines long"
- **Recommendation**: "Consider breaking into smaller functions"
- **Pattern**: Count lines between function declaration and closing brace

### Rule 2: Large Files
- **Detection**: Files exceeding 500 lines
- **Severity**: Warning
- **Category**: File Size
- **Message**: "File has <N> lines"
- **Recommendation**: "Consider splitting into multiple modules"

### Rule 3: TODO Comments
- **Detection**: Comments containing TODO, FIXME, HACK, XXX
- **Severity**: Info
- **Category**: Technical Debt
- **Message**: "TODO comment: <text>"
- **Recommendation**: "Address or create ticket for tracking"
- **Pattern**: `// TODO:`, `/* FIXME: */`, etc.

### Rule 4: Debug Statements
- **Detection**: console.log, console.error, console.warn
- **Severity**: Warning
- **Category**: Debug Code
- **Message**: "Debug statement found"
- **Recommendation**: "Remove or replace with proper logging"
- **Pattern**: `console\.(log|error|warn|debug)`

### Rule 5: Empty Catch Blocks
- **Detection**: catch blocks with no statements or only comments
- **Severity**: Error
- **Category**: Error Handling
- **Message**: "Empty catch block detected"
- **Recommendation**: "Add proper error handling or logging"
- **Pattern**: `catch.*{\s*(//.*\n)*\s*}`

## Scoring Algorithm

Base score: 100

Deductions:
- Each error: -10 points
- Each warning: -5 points
- Each info: -1 point

Minimum score: 0
Maximum score: 100

## Implementation Strategy

### Simple Regex-Based Approach
- Read file content as string
- Apply regex patterns for each rule
- Track line numbers for issues
- Generate recommendations

### Why Not AST?
- Simpler implementation
- Faster execution
- Sufficient for MVP
- Can upgrade later if needed

## Test Cases

### Unit Tests
1. Detects function with 60 lines
2. Detects file with 600 lines
3. Finds TODO comments on correct lines
4. Identifies console.log statements
5. Detects empty catch blocks
6. Handles files with no issues (score 100)
7. Calculates score correctly

### Property-Based Tests
1. Score is always 0-100
2. Issues array has valid structure
3. Summary counts match issues array
4. Severity values are only error/warning/info
5. Running review twice yields same results

## Error Handling

- **File not found**: Return error issue
- **Binary file**: Skip with warning
- **Permission denied**: Return error issue
- **Malformed file**: Best-effort parsing, log warnings

## Integration Points

- Used by Report Generator
- Exposed via MCP tool `review_file`
- CLI can review individual files or all source files
