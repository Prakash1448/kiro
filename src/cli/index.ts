#!/usr/bin/env node

// CLI Interface for Kiro Project Intelligence Assistant

import { generateReport, formatReportSummary } from '../report/index.js';
import { formatError } from '../shared/errors.js';

interface CliOptions {
  path: string;
  format: 'json' | 'summary';
  output?: string;
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    path: '.',
    format: 'summary'
  };
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--json') {
      options.format = 'json';
    } else if (arg === '--output' || arg === '-o') {
      options.output = args[++i];
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else if (!arg.startsWith('-')) {
      options.path = arg;
    }
  }
  
  return options;
}

function printHelp(): void {
  console.log(`
Kiro Project Intelligence Assistant - CLI

USAGE:
  npm run analyze -- <project-path> [options]
  node dist/cli/index.js <project-path> [options]

ARGUMENTS:
  <project-path>    Path to project directory (default: current directory)

OPTIONS:
  --json            Output full JSON report instead of summary
  --output, -o      Write output to file instead of console
  --help, -h        Show this help message

EXAMPLES:
  npm run analyze -- ./my-project
  npm run analyze -- ./my-project --json
  npm run analyze -- ./my-project --json --output report.json
  npm run analyze -- --json

For more information, visit: https://github.com/kiro-university-2026
  `);
}

function printBanner(): void {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║   Kiro Project Intelligence Assistant                     ║
║   Analyzing your codebase for quality and insights...     ║
╚═══════════════════════════════════════════════════════════╝
`);
}

async function main(): Promise<void> {
  try {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
      printHelp();
      return;
    }
    
    const options = parseArgs(args);
    
    // Print banner only for summary format
    if (options.format === 'summary') {
      printBanner();
      console.log(`📁 Analyzing: ${options.path}`);
      console.log('⏳ Please wait...\n');
    }
    
    // Generate report
    const startTime = Date.now();
    const report = await generateReport(options.path);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    // Format output
    let output: string;
    if (options.format === 'json') {
      output = JSON.stringify(report, null, 2);
    } else {
      output = formatReportSummary(report);
      output += `\n⏱️  Analysis completed in ${duration}s\n`;
    }
    
    // Write output
    if (options.output) {
      const { writeFile } = await import('fs/promises');
      await writeFile(options.output, output, 'utf-8');
      console.log(`✅ Report saved to: ${options.output}`);
    } else {
      console.log(output);
    }
    
    // Exit with appropriate code based on health score
    if (report.metrics.healthScore < 40) {
      process.exit(1); // Poor health
    }
    
  } catch (error) {
    console.error('\n❌ Error:', formatError(error));
    console.error('\nRun with --help for usage information.');
    process.exit(1);
  }
}

// Run CLI
main();
