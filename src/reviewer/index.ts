// Code Reviewer - Analyzes source files for quality issues

import { ReviewResult, Issue, Severity } from '../shared/types.js';
import { readFileContent, countLines, fileExists } from '../shared/file-utils.js';
import { ReviewError } from '../shared/errors.js';

const LONG_FUNCTION_THRESHOLD = 50;
const LARGE_FILE_THRESHOLD = 500;

interface Rule {
  name: string;
  category: string;
  severity: Severity;
  pattern: RegExp;
  getMessage: (match: RegExpMatchArray, context?: string) => string;
  getRecommendation: () => string;
}

const RULES: Rule[] = [
  {
    name: 'todo-comment',
    category: 'Technical Debt',
    severity: 'info',
    pattern: /\/\/\s*(TODO|FIXME|HACK|XXX):?\s*(.+)/gi,
    getMessage: (match) => `TODO comment found: ${match[2] || match[1]}`,
    getRecommendation: () => 'Address the TODO or create a ticket for tracking'
  },
  {
    name: 'debug-statement',
    category: 'Debug Code',
    severity: 'warning',
    pattern: /console\.(log|error|warn|debug|info)\(/g,
    getMessage: (match) => `Debug statement found: console.${match[1]}()`,
    getRecommendation: () => 'Remove debug statements or replace with proper logging'
  },
  {
    name: 'empty-catch',
    category: 'Error Handling',
    severity: 'error',
    pattern: /catch\s*\([^)]*\)\s*\{\s*(\/\/[^\n]*\n)*\s*\}/g,
    getMessage: () => 'Empty catch block detected',
    getRecommendation: () => 'Add proper error handling or at least log the error'
  }
];

export async function reviewFile(filePath: string): Promise<ReviewResult> {
  if (!fileExists(filePath)) {
    throw new ReviewError(`File not found: ${filePath}`, filePath);
  }
  
  let content: string;
  try {
    content = await readFileContent(filePath);
  } catch (error) {
    throw new ReviewError(`Failed to read file: ${filePath}`, filePath);
  }
  
  const issues: Issue[] = [];
  
  // Apply all rules
  for (const rule of RULES) {
    const ruleIssues = applyRule(content, rule);
    issues.push(...ruleIssues);
  }
  
  // Check for long functions
  const longFunctionIssues = detectLongFunctions(content);
  issues.push(...longFunctionIssues);
  
  // Check file size
  const lineCount = await countLines(filePath);
  if (lineCount > LARGE_FILE_THRESHOLD) {
    issues.push({
      severity: 'warning',
      category: 'File Size',
      message: `File has ${lineCount} lines`,
      recommendation: 'Consider splitting into multiple smaller modules'
    });
  }
  
  // Calculate summary
  const summary = {
    errors: issues.filter(i => i.severity === 'error').length,
    warnings: issues.filter(i => i.severity === 'warning').length,
    info: issues.filter(i => i.severity === 'info').length
  };
  
  // Calculate score
  const score = calculateScore(issues);
  
  return {
    filePath,
    issues,
    summary,
    score
  };
}

function applyRule(content: string, rule: Rule): Issue[] {
  const issues: Issue[] = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const matches = line.matchAll(rule.pattern);
    for (const match of matches) {
      issues.push({
        severity: rule.severity,
        category: rule.category,
        line: index + 1,
        message: rule.getMessage(match, line),
        recommendation: rule.getRecommendation()
      });
    }
  });
  
  return issues;
}

function detectLongFunctions(content: string): Issue[] {
  const issues: Issue[] = [];
  const lines = content.split('\n');
  
  // Simple function detection using regex
  const functionPattern = /(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\(|(\w+)\s*\([^)]*\)\s*\{)/g;
  
  let currentFunction: { name: string; startLine: number; braceCount: number } | null = null;
  
  lines.forEach((line, index) => {
    // Start of function
    if (!currentFunction) {
      const match = functionPattern.exec(line);
      if (match) {
        const functionName = match[1] || match[2] || match[3] || 'anonymous';
        currentFunction = {
          name: functionName,
          startLine: index + 1,
          braceCount: 0
        };
      }
    }
    
    // Count braces
    if (currentFunction) {
      const openBraces = (line.match(/\{/g) || []).length;
      const closeBraces = (line.match(/\}/g) || []).length;
      currentFunction.braceCount += openBraces - closeBraces;
      
      // End of function
      if (currentFunction.braceCount <= 0 && index > currentFunction.startLine) {
        const functionLength = index - currentFunction.startLine + 1;
        if (functionLength > LONG_FUNCTION_THRESHOLD) {
          issues.push({
            severity: 'warning',
            category: 'Maintainability',
            line: currentFunction.startLine,
            message: `Function '${currentFunction.name}' is ${functionLength} lines long`,
            recommendation: 'Consider breaking into smaller functions'
          });
        }
        currentFunction = null;
      }
    }
  });
  
  return issues;
}

function calculateScore(issues: Issue[]): number {
  let score = 100;
  
  issues.forEach(issue => {
    switch (issue.severity) {
      case 'error':
        score -= 10;
        break;
      case 'warning':
        score -= 5;
        break;
      case 'info':
        score -= 1;
        break;
    }
  });
  
  return Math.max(0, Math.min(100, score));
}

export async function reviewFiles(filePaths: string[]): Promise<ReviewResult[]> {
  const results = await Promise.all(
    filePaths.map(async (filePath) => {
      try {
        return await reviewFile(filePath);
      } catch (error) {
        // Return a result with error for files that can't be reviewed
        return {
          filePath,
          issues: [{
            severity: 'error' as Severity,
            category: 'Review Error',
            message: `Failed to review file: ${error instanceof Error ? error.message : String(error)}`,
            recommendation: 'Check file permissions and format'
          }],
          summary: { errors: 1, warnings: 0, info: 0 },
          score: 0
        };
      }
    })
  );
  
  return results;
}
