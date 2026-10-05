// Report Generator - Orchestrates analysis and generates intelligence report

import { resolve } from 'path';
import { IntelligenceReport, ReportOptions } from '../shared/types.js';
import { analyzeProject } from '../analyzer/index.js';
import { reviewFiles } from '../reviewer/index.js';
import { generateTestsForFiles } from '../test-generator/index.js';
import { calculateMetrics, generateRecommendations } from '../metrics/index.js';
import { isSourceFile } from '../shared/file-utils.js';
import { glob } from 'glob';

const DEFAULT_OPTIONS: ReportOptions = {
  includeReviews: true,
  includeTestSuggestions: true,
  maxFilesToReview: 50
};

export async function generateReport(
  projectPath: string,
  options: ReportOptions = {}
): Promise<IntelligenceReport> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const absolutePath = resolve(projectPath);
  
  // Step 1: Analyze project structure
  const analysis = await analyzeProject(absolutePath);
  
  // Step 2: Find source files for review
  const pattern = `${absolutePath}/**/*.{ts,tsx,js,jsx}`;
  const allFiles = await glob(pattern, {
    ignore: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/build/**', '**/coverage/**']
  });
  
  const sourceFiles = allFiles
    .filter(f => isSourceFile(f))
    .slice(0, opts.maxFilesToReview || 50);
  
  // Step 3: Review source files (parallel)
  const reviews = opts.includeReviews && sourceFiles.length > 0
    ? await reviewFiles(sourceFiles)
    : [];
  
  // Step 4: Generate test suggestions (parallel)
  const testSuggestions = opts.includeTestSuggestions && sourceFiles.length > 0
    ? await generateTestsForFiles(sourceFiles.slice(0, 10), absolutePath) // Limit to 10 files for performance
    : [];
  
  // Step 5: Calculate metrics
  const metrics = calculateMetrics(analysis, reviews);
  
  // Step 6: Generate recommendations
  const recommendations = generateRecommendations(metrics, reviews);
  
  // Step 7: Compile final report
  const report: IntelligenceReport = {
    projectPath: absolutePath,
    timestamp: new Date().toISOString(),
    analysis,
    reviews,
    testSuggestions,
    metrics,
    recommendations
  };
  
  return report;
}

export function formatReportSummary(report: IntelligenceReport): string {
  const lines: string[] = [];
  
  lines.push('='.repeat(60));
  lines.push('PROJECT INTELLIGENCE REPORT');
  lines.push('='.repeat(60));
  lines.push('');
  
  lines.push(`📁 Project: ${report.projectPath}`);
  lines.push(`⏰ Analyzed: ${new Date(report.timestamp).toLocaleString()}`);
  lines.push('');
  
  lines.push('📊 PROJECT STRUCTURE');
  lines.push('-'.repeat(60));
  lines.push(`Total Files: ${report.analysis.totalFiles}`);
  lines.push(`Source Files: ${report.analysis.sourceFiles}`);
  lines.push(`Test Files: ${report.analysis.testFiles}`);
  lines.push(`Test-to-Source Ratio: ${report.metrics.testToSourceRatio}`);
  lines.push('');
  
  if (Object.keys(report.analysis.filesByExtension).length > 0) {
    lines.push('File Types:');
    Object.entries(report.analysis.filesByExtension)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([ext, count]) => {
        lines.push(`  ${ext || '(no extension)'}: ${count}`);
      });
    lines.push('');
  }
  
  lines.push('📈 METRICS');
  lines.push('-'.repeat(60));
  lines.push(`Health Score: ${report.metrics.healthScore}/100`);
  lines.push(`TODO Comments: ${report.metrics.todoCount}`);
  lines.push(`Debug Statements: ${report.metrics.debugStatementCount}`);
  lines.push('');
  
  lines.push('Issues Summary:');
  lines.push(`  Errors: ${report.metrics.issuesSummary.errors}`);
  lines.push(`  Warnings: ${report.metrics.issuesSummary.warnings}`);
  lines.push(`  Info: ${report.metrics.issuesSummary.info}`);
  lines.push('');
  
  if (report.metrics.largestFiles.length > 0) {
    lines.push('Largest Files:');
    report.metrics.largestFiles.forEach(file => {
      lines.push(`  ${file.path} (${file.lines} lines)`);
    });
    lines.push('');
  }
  
  lines.push('💡 RECOMMENDATIONS');
  lines.push('-'.repeat(60));
  report.recommendations.forEach(rec => {
    lines.push(`${rec}`);
  });
  lines.push('');
  
  if (report.testSuggestions.length > 0) {
    lines.push('🧪 TEST SUGGESTIONS');
    lines.push('-'.repeat(60));
    lines.push(`Generated test suggestions for ${report.testSuggestions.length} files`);
    lines.push('Run with full JSON output to see detailed test case suggestions.');
    lines.push('');
  }
  
  lines.push('='.repeat(60));
  lines.push('For full details, save the JSON output to a file.');
  lines.push('='.repeat(60));
  
  return lines.join('\n');
}
