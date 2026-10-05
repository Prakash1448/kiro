// Metrics Calculator - Calculates project health metrics

import { Metrics, ProjectAnalysis, ReviewResult } from '../shared/types.js';

export function calculateMetrics(
  analysis: ProjectAnalysis,
  reviews: ReviewResult[]
): Metrics {
  // Aggregate issues from all reviews
  const issuesSummary = {
    errors: 0,
    warnings: 0,
    info: 0
  };
  
  let todoCount = 0;
  let debugStatementCount = 0;
  let totalLines = 0;
  
  reviews.forEach(review => {
    issuesSummary.errors += review.summary.errors;
    issuesSummary.warnings += review.summary.warnings;
    issuesSummary.info += review.summary.info;
    
    // Count specific issue types
    review.issues.forEach(issue => {
      if (issue.category === 'Technical Debt') {
        todoCount++;
      }
      if (issue.category === 'Debug Code') {
        debugStatementCount++;
      }
    });
  });
  
  // Calculate total lines from large files (approximation)
  analysis.largeFiles.forEach(file => {
    totalLines += file.lines;
  });
  
  // Test to source ratio
  const testToSourceRatio = analysis.sourceFiles > 0 
    ? analysis.testFiles / analysis.sourceFiles 
    : 0;
  
  // Calculate health score
  const healthScore = calculateHealthScore({
    analysis,
    issuesSummary,
    todoCount,
    debugStatementCount,
    testToSourceRatio
  });
  
  return {
    totalFiles: analysis.totalFiles,
    sourceFiles: analysis.sourceFiles,
    testFiles: analysis.testFiles,
    totalLines,
    largestFiles: analysis.largeFiles.slice(0, 5),
    todoCount,
    debugStatementCount,
    testToSourceRatio: Math.round(testToSourceRatio * 100) / 100,
    healthScore,
    issuesSummary
  };
}

interface HealthScoreInput {
  analysis: ProjectAnalysis;
  issuesSummary: { errors: number; warnings: number; info: number };
  todoCount: number;
  debugStatementCount: number;
  testToSourceRatio: number;
}

function calculateHealthScore(input: HealthScoreInput): number {
  let score = 100;
  const { analysis, issuesSummary, todoCount, debugStatementCount, testToSourceRatio } = input;
  
  // No tests penalty
  if (analysis.testFiles === 0 && analysis.sourceFiles > 0) {
    score -= 30;
  } else if (testToSourceRatio < 0.3 && analysis.sourceFiles > 0) {
    // Low test coverage penalty
    score -= 15;
  }
  
  // Debug statements penalty
  if (debugStatementCount > 10) {
    score -= 10;
  } else if (debugStatementCount > 5) {
    score -= 5;
  }
  
  // TODO comments penalty
  if (todoCount > 20) {
    score -= 10;
  } else if (todoCount > 10) {
    score -= 5;
  }
  
  // Large files penalty
  const largeFileCount = analysis.largeFiles.length;
  if (largeFileCount > 5) {
    score -= Math.min(15, (largeFileCount - 5) * 3);
  }
  
  // Code quality issues penalty
  score -= Math.min(30, issuesSummary.errors * 2);
  score -= Math.min(20, issuesSummary.warnings * 1);
  score -= Math.min(10, Math.floor(issuesSummary.info * 0.5));
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function generateRecommendations(metrics: Metrics, _reviews: ReviewResult[]): string[] {
  const recommendations: string[] = [];
  
  // Test coverage recommendations
  if (metrics.testFiles === 0 && metrics.sourceFiles > 0) {
    recommendations.push('🚨 CRITICAL: No test files found. Add unit tests to improve code quality and confidence.');
  } else if (metrics.testToSourceRatio < 0.3) {
    recommendations.push(`⚠️  Low test coverage (ratio: ${metrics.testToSourceRatio}). Aim for at least 0.5 test-to-source ratio.`);
  } else if (metrics.testToSourceRatio >= 0.8) {
    recommendations.push('✅ Excellent test coverage! Keep maintaining this standard.');
  }
  
  // Debug statements
  if (metrics.debugStatementCount > 10) {
    recommendations.push(`⚠️  Found ${metrics.debugStatementCount} debug statements (console.log). Remove or replace with proper logging.`);
  }
  
  // Technical debt
  if (metrics.todoCount > 20) {
    recommendations.push(`📝 High technical debt: ${metrics.todoCount} TODO comments. Create tickets and address systematically.`);
  } else if (metrics.todoCount > 10) {
    recommendations.push(`📝 Moderate technical debt: ${metrics.todoCount} TODO comments. Consider addressing high-priority items.`);
  }
  
  // Large files
  if (metrics.largestFiles.length > 5) {
    recommendations.push(`📦 ${metrics.largestFiles.length} large files (>500 lines). Consider refactoring for better maintainability.`);
  }
  
  // Code quality issues
  if (metrics.issuesSummary.errors > 0) {
    recommendations.push(`❌ ${metrics.issuesSummary.errors} errors found. Address critical issues first (empty catch blocks, etc.).`);
  }
  
  if (metrics.issuesSummary.warnings > 10) {
    recommendations.push(`⚠️  ${metrics.issuesSummary.warnings} warnings found. Review and fix to improve code quality.`);
  }
  
  // Overall health assessment
  if (metrics.healthScore >= 80) {
    recommendations.push('🌟 Overall project health is good. Keep up the excellent work!');
  } else if (metrics.healthScore >= 60) {
    recommendations.push('👍 Project health is fair. Address the recommendations above to improve further.');
  } else if (metrics.healthScore >= 40) {
    recommendations.push('⚠️  Project health needs attention. Focus on critical issues and testing.');
  } else {
    recommendations.push('🚨 Project health is poor. Urgent action needed on multiple fronts.');
  }
  
  return recommendations;
}
