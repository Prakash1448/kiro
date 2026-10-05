// Test Generator - Generates test case suggestions

import { TestSuggestions, TestSuggestion, TestCase, FunctionInfo } from '../shared/types.js';
import { readFileContent, fileExists } from '../shared/file-utils.js';
import { relative, dirname, join, parse } from 'path';

export async function generateTests(sourceFile: string, projectRoot?: string): Promise<TestSuggestions> {
  if (!fileExists(sourceFile)) {
    throw new Error(`Source file not found: ${sourceFile}`);
  }
  
  const content = await readFileContent(sourceFile);
  const functions = detectFunctions(content);
  const testSuggestions: TestSuggestion[] = [];
  
  for (const func of functions) {
    const testCases = createTestCases(func);
    testSuggestions.push({
      functionName: func.name,
      description: `Test suite for ${func.name}${func.isAsync ? ' (async)' : ''}`,
      testCases
    });
  }
  
  const suggestedTestFile = suggestTestFilePath(sourceFile, projectRoot);
  
  return {
    sourceFile,
    suggestedTestFile,
    testSuggestions
  };
}

export function detectFunctions(content: string): FunctionInfo[] {
  const functions: FunctionInfo[] = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Named function: function name() {}
    const namedFuncPattern = /(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)/g;
    let match;
    while ((match = namedFuncPattern.exec(line)) !== null) {
      const name = match[1];
      const params = match[2] || '';
      const paramCount = params.trim() ? params.split(',').length : 0;
      const isAsync = line.includes('async');
      
      if (name !== 'test' && name !== 'it' && name !== 'describe') {
        functions.push({
          name,
          line: index + 1,
          isAsync,
          paramCount
        });
      }
    }
    
    // Arrow function: const name = () => {}
    const arrowFuncPattern = /(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>/g;
    while ((match = arrowFuncPattern.exec(line)) !== null) {
      const name = match[1];
      const params = match[2] || '';
      const paramCount = params.trim() ? params.split(',').length : 0;
      const isAsync = line.includes('async');
      
      if (name !== 'test' && name !== 'it' && name !== 'describe') {
        functions.push({
          name,
          line: index + 1,
          isAsync,
          paramCount
        });
      }
    }
    
    // Class method: methodName() {}
    const methodPattern = /^\s*(?:async\s+)?(\w+)\s*\(([^)]*)\)\s*[:{]/g;
    while ((match = methodPattern.exec(line)) !== null) {
      const name = match[1];
      const params = match[2] || '';
      const paramCount = params.trim() ? params.split(',').length : 0;
      const isAsync = line.includes('async');
      
      if (name !== 'test' && name !== 'it' && name !== 'describe') {
        functions.push({
          name,
          line: index + 1,
          isAsync,
          paramCount
        });
      }
    }
  });
  
  // Remove duplicates (same function detected by multiple patterns)
  const uniqueFunctions = functions.filter((func, index, self) =>
    index === self.findIndex(f => f.name === func.name)
  );
  
  return uniqueFunctions;
}

function createTestCases(func: FunctionInfo): TestCase[] {
  const testCases: TestCase[] = [];
  
  // Happy path test
  testCases.push({
    name: `should return expected result for valid input`,
    scenario: `Call ${func.name} with typical valid parameters and verify the result`,
    type: 'happy-path'
  });
  
  // Edge cases based on function characteristics
  if (func.paramCount > 0) {
    testCases.push({
      name: 'should handle null input gracefully',
      scenario: `Pass null as parameter to ${func.name} and verify it doesn't crash`,
      type: 'edge-case'
    });
    
    testCases.push({
      name: 'should handle undefined input gracefully',
      scenario: `Pass undefined as parameter to ${func.name} and verify behavior`,
      type: 'edge-case'
    });
    
    testCases.push({
      name: 'should handle empty values (empty string/array/object)',
      scenario: `Pass empty values to ${func.name} and verify appropriate handling`,
      type: 'edge-case'
    });
  }
  
  // Async-specific tests
  if (func.isAsync) {
    testCases.push({
      name: 'should resolve successfully for valid async operation',
      scenario: `Await ${func.name} and verify the promise resolves correctly`,
      type: 'happy-path'
    });
    
    testCases.push({
      name: 'should reject with error for invalid async operation',
      scenario: `Verify ${func.name} rejects with appropriate error for invalid inputs`,
      type: 'error-case'
    });
  } else {
    // Error case for sync functions
    testCases.push({
      name: 'should throw error for invalid input type',
      scenario: `Pass invalid input type to ${func.name} and verify it throws appropriate error`,
      type: 'error-case'
    });
  }
  
  return testCases;
}

export function suggestTestFilePath(sourceFile: string, projectRoot?: string): string {
  const parsed = parse(sourceFile);
  const fileName = parsed.name;
  const ext = parsed.ext;
  
  // If we have a project root, create relative path
  if (projectRoot) {
    const relativePath = relative(projectRoot, dirname(sourceFile));
    const cleanPath = relativePath.replace(/^src[/\\]?/, '');
    return join('tests', 'unit', cleanPath, `${fileName}.test${ext}`).replace(/\\/g, '/');
  }
  
  // Otherwise, create based on source directory
  const sourceDir = dirname(sourceFile);
  if (sourceDir.includes('src')) {
    const parts = sourceDir.split(/[/\\]/);
    const srcIndex = parts.findIndex(p => p === 'src');
    const testPath = parts.slice(srcIndex + 1).join('/');
    return `tests/unit/${testPath}/${fileName}.test${ext}`;
  }
  
  return `tests/unit/${fileName}.test${ext}`;
}

export async function generateTestsForFiles(
  sourceFiles: string[], 
  projectRoot?: string
): Promise<TestSuggestions[]> {
  const results = await Promise.all(
    sourceFiles.map(async (file) => {
      try {
        return await generateTests(file, projectRoot);
      } catch (error) {
        // Return empty suggestions for files that can't be processed
        return {
          sourceFile: file,
          suggestedTestFile: '',
          testSuggestions: []
        };
      }
    })
  );
  
  return results.filter(r => r.testSuggestions.length > 0);
}
