#!/usr/bin/env node

// MCP Server for Kiro Project Intelligence Assistant

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { generateReport } from '../../src/report/index.js';
import { reviewFile } from '../../src/reviewer/index.js';
import { generateTests } from '../../src/test-generator/index.js';
import { analyzeProject } from '../../src/analyzer/index.js';

const SERVER_NAME = 'project-intelligence-server';
const SERVER_VERSION = '1.0.0';

// Create MCP server
const server = new Server(
  {
    name: SERVER_NAME,
    version: SERVER_VERSION,
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Tool: analyze_project
async function handleAnalyzeProject(args: any) {
  const { path } = args;
  if (!path) {
    throw new Error('Missing required argument: path');
  }
  
  const analysis = await analyzeProject(path);
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(analysis, null, 2),
      },
    ],
  };
}

// Tool: review_file
async function handleReviewFile(args: any) {
  const { filePath } = args;
  if (!filePath) {
    throw new Error('Missing required argument: filePath');
  }
  
  const review = await reviewFile(filePath);
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(review, null, 2),
      },
    ],
  };
}

// Tool: generate_tests
async function handleGenerateTests(args: any) {
  const { sourceFile, projectRoot } = args;
  if (!sourceFile) {
    throw new Error('Missing required argument: sourceFile');
  }
  
  const testSuggestions = await generateTests(sourceFile, projectRoot);
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(testSuggestions, null, 2),
      },
    ],
  };
}

// Tool: project_report
async function handleProjectReport(args: any) {
  const { path, includeReviews = true, includeTestSuggestions = true } = args;
  if (!path) {
    throw new Error('Missing required argument: path');
  }
  
  const report = await generateReport(path, {
    includeReviews,
    includeTestSuggestions,
  });
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(report, null, 2),
      },
    ],
  };
}

// Tool: project_metrics
async function handleProjectMetrics(args: any) {
  const { path } = args;
  if (!path) {
    throw new Error('Missing required argument: path');
  }
  
  const report = await generateReport(path, {
    includeReviews: true,
    includeTestSuggestions: false,
  });
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(report.metrics, null, 2),
      },
    ],
  };
}

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'analyze_project',
        description: 'Analyzes a project directory to extract structure, file counts, and organization information',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Path to the project directory to analyze',
            },
          },
          required: ['path'],
        },
      },
      {
        name: 'review_file',
        description: 'Reviews a source file for code quality issues including debug statements, TODOs, long functions, and error handling',
        inputSchema: {
          type: 'object',
          properties: {
            filePath: {
              type: 'string',
              description: 'Path to the source file to review',
            },
          },
          required: ['filePath'],
        },
      },
      {
        name: 'generate_tests',
        description: 'Generates test case suggestions for functions in a source file',
        inputSchema: {
          type: 'object',
          properties: {
            sourceFile: {
              type: 'string',
              description: 'Path to the source file to generate tests for',
            },
            projectRoot: {
              type: 'string',
              description: 'Optional project root path for better test file path suggestions',
            },
          },
          required: ['sourceFile'],
        },
      },
      {
        name: 'project_metrics',
        description: 'Calculates comprehensive project metrics including health score, test coverage ratio, and issue counts',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Path to the project directory',
            },
          },
          required: ['path'],
        },
      },
      {
        name: 'project_report',
        description: 'Generates a complete intelligence report combining analysis, reviews, test suggestions, metrics, and recommendations',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Path to the project directory',
            },
            includeReviews: {
              type: 'boolean',
              description: 'Include code reviews in the report (default: true)',
            },
            includeTestSuggestions: {
              type: 'boolean',
              description: 'Include test suggestions in the report (default: true)',
            },
          },
          required: ['path'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'analyze_project':
        return await handleAnalyzeProject(args || {});
      case 'review_file':
        return await handleReviewFile(args || {});
      case 'generate_tests':
        return await handleGenerateTests(args || {});
      case 'project_metrics':
        return await handleProjectMetrics(args || {});
      case 'project_report':
        return await handleProjectReport(args || {});
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: errorMessage }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'intelligence://schema/analysis',
        name: 'Project Analysis Schema',
        description: 'JSON schema for project analysis output',
        mimeType: 'application/json',
      },
      {
        uri: 'intelligence://schema/review',
        name: 'Code Review Schema',
        description: 'JSON schema for code review output',
        mimeType: 'application/json',
      },
      {
        uri: 'intelligence://schema/metrics',
        name: 'Project Metrics Schema',
        description: 'JSON schema for project metrics',
        mimeType: 'application/json',
      },
    ],
  };
});

// Handle resource reads
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  const schemas: Record<string, any> = {
    'intelligence://schema/analysis': {
      type: 'object',
      properties: {
        totalFiles: { type: 'number' },
        sourceFiles: { type: 'number' },
        testFiles: { type: 'number' },
        filesByExtension: { type: 'object' },
        largeFiles: { type: 'array' },
        directoryTree: { type: 'object' },
        analyzedAt: { type: 'string' },
      },
    },
    'intelligence://schema/review': {
      type: 'object',
      properties: {
        filePath: { type: 'string' },
        issues: { type: 'array' },
        summary: { type: 'object' },
        score: { type: 'number', minimum: 0, maximum: 100 },
      },
    },
    'intelligence://schema/metrics': {
      type: 'object',
      properties: {
        totalFiles: { type: 'number' },
        sourceFiles: { type: 'number' },
        testFiles: { type: 'number' },
        healthScore: { type: 'number', minimum: 0, maximum: 100 },
        testToSourceRatio: { type: 'number' },
        issuesSummary: { type: 'object' },
      },
    },
  };

  const schema = schemas[uri];
  if (!schema) {
    throw new Error(`Unknown resource: ${uri}`);
  }

  return {
    contents: [
      {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(schema, null, 2),
      },
    ],
  };
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Kiro Project Intelligence MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
