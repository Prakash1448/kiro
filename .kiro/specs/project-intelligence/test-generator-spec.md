# Test Generator - Feature Specification

## Purpose

The Test Generator analyzes source files and generates practical test case suggestions using deterministic rules.

## Requirements

### Input
- `sourceFile: string` - Path to source file
- `functionName?: string` - Optional specific function to target

### Output
```typescript
{
  sourceFile: string,
  suggestedTestFile: string,
  testSuggestions: Array<{
    functionName: string,
    description: string,
    testCases: Array<{
      name: string,
      scenario: string,
      type: 'happy-path' | 'edge-case' | 'error-case'
    }>
  }>
}
```

## Generation Rules

### Test File Naming
- Source: `src/utils/parser.ts` → Test: `tests/unit/utils/parser.test.ts`
- Source: `src/analyzer/index.ts` → Test: `tests/unit/analyzer/index.test.ts`

### Test Case Generation

For each detected function, generate:

#### 1. Happy Path Test
```
"should return expected result for valid input"
Scenario: Call function with typical valid parameters
```

#### 2. Edge Cases (3-5 based on function)
```
"should handle null input gracefully"
"should handle undefined input gracefully"
"should handle empty array/string/object"
"should handle large input values"
"should handle special characters"
```

#### 3. Error Cases (if applicable)
```
"should throw error for invalid input type"
"should reject negative values"
"should handle missing required parameters"
```

## Function Detection

### Simple Pattern Matching
Detect:
- Named functions: `function functionName(`
- Arrow functions: `const functionName = (` or `export const functionName = (`
- Class methods: `methodName(`
- Async functions: `async function` or `async methodName(`

Extract:
- Function name
- Approximate parameter count
- Whether async

## Template Structure

```typescript
import { describe, it, expect } from '@jest/globals';
import { functionName } from '../../../src/path/to/module';

describe('functionName', () => {
  it('should return expected result for valid input', () => {
    // Arrange
    const input = /* typical input */;
    
    // Act
    const result = functionName(input);
    
    // Assert
    expect(result).toBeDefined();
  });

  it('should handle null input gracefully', () => {
    expect(() => functionName(null)).not.toThrow();
  });

  // Additional test cases...
});
```

## Implementation Strategy

1. Read source file content
2. Use regex to find function declarations
3. For each function:
   - Determine function type (sync/async, params)
   - Generate 3-5 test cases based on heuristics
   - Create test case descriptions
4. Format output with suggested test file path

## Test Cases

### Unit Tests
1. Detects named functions
2. Detects arrow functions
3. Generates test file path correctly
4. Creates 3-5 test cases per function
5. Includes happy path, edge cases, error cases
6. Handles files with no functions

### Property-Based Tests
1. Test suggestions always have required fields
2. Test file paths are valid
3. Each function gets at least 3 test cases
4. Test case types are valid enum values
5. Running twice yields same suggestions

## Limitations

- No semantic analysis (uses simple regex)
- Cannot determine actual parameter types
- Test cases are templates requiring manual completion
- Does not generate actual test code, only suggestions

## Integration Points

- Used by Report Generator
- Exposed via MCP tool `generate_tests`
- CLI can generate tests for specific files
