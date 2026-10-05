# Kiro Project Intelligence Assistant

> AI-powered project analysis, code review, and testing intelligence for modern development teams

[![Kiro University 2026](https://img.shields.io/badge/Kiro-University%202026-blue)](https://github.com/kiro-university-2026)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Overview

The **Kiro Project Intelligence Assistant** is a comprehensive developer productivity tool that analyzes software repositories, reviews code quality, identifies testing gaps, and generates actionable intelligence reports. Built specifically to demonstrate all 7 Kiro University 2026 core capabilities.

### Key Features

- 📊 **Project Analysis** - Scan and understand project structure, file organization, and metrics
- 🔍 **Code Review** - Identify quality issues: debug statements, TODOs, long functions, empty catches
- 🧪 **Test Generation** - Get intelligent test case suggestions for your functions
- 📈 **Health Scoring** - Calculate comprehensive project health score (0-100)
- 🎯 **Recommendations** - Prioritized, actionable improvement suggestions
- 🚀 **MCP Integration** - 5 powerful tools for Kiro IDE
- 🤖 **Custom Agent** - Specialized project intelligence analysis agent
- ⚡ **Automation Hooks** - Quality gates and workflow automation

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run the analyzer on sample project
npm run analyze -- ./sample-project
```

### First Analysis

```bash
# Analyze current directory
npm run analyze -- .

# Get full JSON report
npm run analyze -- ./my-project --json

# Save report to file
npm run analyze -- ./my-project --json --output report.json
```

### Example Output

```
╔═══════════════════════════════════════════════════════════╗
║   Kiro Project Intelligence Assistant                     ║
║   Analyzing your codebase for quality and insights...     ║
╚═══════════════════════════════════════════════════════════╝

📁 Project: ./sample-project
⏰ Analyzed: 2026-10-05T10:30:45.123Z

📊 PROJECT STRUCTURE
──────────────────────────────────────────────────────────
Total Files: 6
Source Files: 3
Test Files: 1
Test-to-Source Ratio: 0.33

📈 METRICS
──────────────────────────────────────────────────────────
Health Score: 58/100
TODO Comments: 2
Debug Statements: 4

Issues Summary:
  Errors: 1
  Warnings: 6
  Info: 2

💡 RECOMMENDATIONS
──────────────────────────────────────────────────────────
⚠️ Low test coverage (ratio: 0.33). Aim for at least 0.5
⚠️ Found 4 debug statements (console.log). Remove or replace
📝 Moderate technical debt: 2 TODO comments
❌ 1 errors found. Address critical issues first
⚠️ Project health is fair. Focus on critical issues and testing
```

## Architecture

### System Design

```
┌──────────────────────────────────────────────────────────┐
│           External Interfaces (CLI, MCP, Agent)           │
├──────────────────────────────────────────────────────────┤
│              Report Generator (Orchestrator)              │
│  ┌──────────┬──────────┬──────────┬──────────┐          │
│  │ Analyzer │ Reviewer │ Test Gen │ Metrics  │          │
│  └──────────┴──────────┴──────────┴──────────┘          │
├──────────────────────────────────────────────────────────┤
│         Shared Utilities (Types, File Utils, Errors)      │
└──────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.3+
- **Testing**: Jest + ts-jest + fast-check (property-based)
- **MCP**: @modelcontextprotocol/sdk
- **Build**: TypeScript compiler

## Kiro University 2026 — 7 Lessons

This project demonstrates **all 7 required Kiro University capabilities**:

### 1. ✅ Spec-Driven Development (250 credits)

**Location**: `.kiro/specs/project-intelligence/`

**Files**:
- `main-spec.md` - Overall requirements, architecture, MVP definition
- `analyzer-spec.md` - Project scanning specification
- `reviewer-spec.md` - Code review rules specification  
- `test-generator-spec.md` - Test suggestion generation specification

**How it guided development**: Each specification defined clear requirements, implementation strategy, test cases, and integration points. All modules were implemented to match their specifications exactly.

### 2. ✅ Steering Documents (250 credits)

**Location**: `.kiro/steering/`

**Files**:
- `product.md` - Product purpose, MVP scope, target users, principles
- `architecture.md` - System design, module responsibilities, data flow
- `coding-standards.md` - TypeScript conventions, naming, error handling, testing

**How they influenced development**: Auto-included steering documents guided all implementation decisions, ensuring consistent code style, error handling patterns, and architectural choices throughout the project.

### 3. ✅ Hooks (250 credits)

**Location**: `.kiro/hooks/`

**Implemented Hooks**:

1. **test-on-save.json** - Automatically runs property-based tests when source files are saved
   - Trigger: `PostFileSave`
   - Matcher: `src/.*\.(ts|js)$`
   - Action: Runs `npm run test:property`

2. **pre-commit-reminder.json** - Reminds to check project health before committing
   - Trigger: `PreToolUse`
   - Matcher: `execute_pwsh.*git.*commit`
   - Action: Agent prompt suggesting analysis

3. **test-file-reminder.json** - Reminds to create tests when new source files are created
   - Trigger: `PostFileCreate`
   - Matcher: `src/.*\.(ts|tsx|js|jsx)$`
   - Action: Agent reminder for test file

4. **session-intelligence.json** - Provides project context at session start
   - Trigger: `SessionStart`
   - Action: Welcome message with key file locations

**Note**: Existing Kironomics hook preserved (`.kiro/hooks/kironomics.json`)

### 4. ✅ Property-Based Testing (500 credits)

**Location**: `tests/property/`

**Implemented Tests** (using fast-check):

**analyzer.property.test.ts**:
- File classification always returns valid types
- File counts never negative
- Idempotency (analyzing twice gives same results)
- Consistency (totalFiles >= sourceFiles + testFiles)
- Directory tree structure validity

**reviewer.property.test.ts**:
- Score always 0-100
- Severity values always valid (error/warning/info)
- Summary counts match issues array
- Idempotency (reviewing twice gives same results)
- All issues have required fields

**test-generator.property.test.ts**:
- Function detection returns valid structure
- Non-negative line numbers and param counts
- At least 3 test cases per function
- Valid test case types (happy-path/edge-case/error-case)
- Unique test names within suggestions

**metrics.property.test.ts**:
- Health score always 0-100
- Non-negative counts for all metrics
- Issues summary matches review aggregation
- Test-to-source ratio never negative
- Recommendations always return string array

**Properties Validated**:
- Determinism (same input → same output)
- Stability (valid inputs don't crash)
- Validity (outputs match expected structure)
- Consistency (related values stay in sync)
- Monotonicity (expected orderings hold)

### 5. ✅ Powers (500 credits)

**Location**: `powers/intelligence-suite/`

**Intelligence Suite Power** provides:

- **POWER.md** - Comprehensive documentation:
  - Installation instructions
  - 5 MCP tools documentation
  - CLI usage guide
  - Workflows (daily dev, weekly health check, code review, onboarding)
  - Configuration and customization
  - Metrics interpretation
  - Troubleshooting guide
  - Best practices

- **Workflows** (`workflows/`):
  - `analyze-project.md` - Step-by-step project analysis workflow

**Power Features**:
- Packages complete project intelligence capabilities
- Reusable across projects
- Includes steering documents
- Pre-configured hooks
- MCP server integration
- Custom agent integration

### 6. ✅ Model Context Protocol (1,000 credits)

**Location**: `mcp/server/`

**MCP Server**: `project-intelligence-server`

**Implemented Tools**:

1. **analyze_project**
   - Input: `{ path: string }`
   - Output: Project structure, file counts, large files, directory tree
   - Use: Understanding project organization

2. **review_file**
   - Input: `{ filePath: string }`
   - Output: Code quality issues with severity, category, recommendations
   - Use: Reviewing individual files for quality

3. **generate_tests**
   - Input: `{ sourceFile: string, projectRoot?: string }`
   - Output: Test suggestions with happy-path, edge-cases, error-cases
   - Use: Identifying testing gaps and getting test ideas

4. **project_metrics**
   - Input: `{ path: string }`
   - Output: Health score, test ratio, issue counts, largest files
   - Use: Getting quick project health overview

5. **project_report**
   - Input: `{ path: string, includeReviews?: boolean, includeTestSuggestions?: boolean }`
   - Output: Complete intelligence report with all analyses
   - Use: Comprehensive project assessment

**Resources**:
- `intelligence://schema/analysis` - Analysis output schema
- `intelligence://schema/review` - Review output schema
- `intelligence://schema/metrics` - Metrics output schema

**Configuration**: See `docs/MCP_CONFIGURATION.md`

### 7. ✅ Custom Agents (1,000 credits)

**Agent**: Project Intelligence Agent

**Location**: `docs/CUSTOM_AGENT_GUIDE.md`

**Capabilities**:
- Uses all 5 MCP tools for comprehensive analysis
- Specializes in project onboarding, health assessment, quality review
- Generates structured intelligence reports
- Provides prioritized recommendations
- Explains metrics and their implications

**Configuration**:
- Name: "Project Intelligence Agent"
- System Prompt: Detailed instructions for project analysis workflow
- Tools: Access to project-intelligence MCP server
- Temperature: 0.3 (factual, consistent)
- Output: Structured markdown reports

**Use Cases**:
- "Analyze this project and provide health assessment"
- "Why is the health score low?"
- "What files need test coverage?"
- "Generate a project intelligence report"

**See**: `docs/CUSTOM_AGENT_GUIDE.md` for complete setup instructions

## Project Structure

```
kiro-project-intelligence/
├── .kiro/
│   ├── specs/                    # Lesson 1: Specifications
│   │   └── project-intelligence/
│   ├── steering/                 # Lesson 2: Steering documents
│   │   ├── product.md
│   │   ├── architecture.md
│   │   └── coding-standards.md
│   ├── hooks/                    # Lesson 3: Hooks
│   │   ├── test-on-save.json
│   │   ├── pre-commit-reminder.json
│   │   ├── test-file-reminder.json
│   │   └── session-intelligence.json
│   └── ugmdu.json               # Kiro University config
│
├── src/                         # Core implementation
│   ├── analyzer/                # Project structure analysis
│   ├── reviewer/                # Code quality review
│   ├── test-generator/          # Test suggestions
│   ├── metrics/                 # Health metrics
│   ├── report/                  # Report orchestration
│   ├── cli/                     # CLI interface
│   └── shared/                  # Utilities and types
│
├── mcp/                         # Lesson 6: MCP Server
│   └── server/
│       └── index.ts
│
├── tests/                       # Lesson 4: Property-based tests
│   ├── property/                # fast-check tests
│   │   ├── analyzer.property.test.ts
│   │   ├── reviewer.property.test.ts
│   │   ├── test-generator.property.test.ts
│   │   └── metrics.property.test.ts
│   └── unit/                    # Unit tests
│
├── powers/                      # Lesson 5: Power package
│   └── intelligence-suite/
│       ├── POWER.md
│       └── workflows/
│
├── docs/                        # Lesson 7: Agent documentation
│   └── CUSTOM_AGENT_GUIDE.md
│
├── sample-project/              # Demo project with intentional issues
│   ├── src/
│   │   ├── utils/calculator.ts
│   │   ├── services/userService.ts
│   │   └── index.ts
│   └── __tests__/
│
├── package.json
├── tsconfig.json
├── jest.config.js
├── README.md                    # This file
└── DEMO.md                      # Demo script
```

## Commands

### Development

```bash
npm install           # Install dependencies
npm run build        # Build TypeScript to dist/
npm run clean        # Remove dist/
npm run lint         # Run ESLint
```

### Testing

```bash
npm test                    # Run all tests
npm run test:unit          # Run unit tests only
npm run test:property      # Run property-based tests only
```

### Analysis

```bash
npm run analyze -- <path>              # Analyze project
npm run analyze -- <path> --json       # JSON output
npm run analyze -- <path> --output file.json  # Save to file
```

### MCP Server

```bash
npm run mcp         # Start MCP server (after build)
```

## Usage Examples

### Example 1: Analyze Sample Project

```bash
npm run analyze -- ./sample-project
```

**What it does**:
- Scans all files in sample-project
- Classifies source vs test files
- Reviews code for quality issues
- Generates test suggestions
- Calculates health score
- Provides recommendations

**Expected findings**:
- Debug statements (console.log)
- TODO/FIXME comments
- Long functions
- Empty catch blocks
- Low test coverage

### Example 2: Get JSON Report

```bash
npm run analyze -- ./sample-project --json > report.json
```

Opens `report.json` to see:
- Complete project analysis
- All code review issues
- Test suggestions for each function
- Detailed metrics
- Prioritized recommendations

### Example 3: Use MCP Tools

In Kiro IDE with MCP configured:

```typescript
// Tool: analyze_project
{
  "path": "./my-project"
}

// Tool: review_file
{
  "filePath": "./src/utils/helper.ts"
}

// Tool: project_report
{
  "path": "./my-project",
  "includeReviews": true,
  "includeTestSuggestions": true
}
```

### Example 4: Invoke Custom Agent

In Kiro IDE:

> "Analyze this project and tell me the top 3 things to improve"

Agent will:
1. Call `project_report` MCP tool
2. Parse results
3. Identify top issues
4. Provide specific recommendations

## Metrics Guide

### Health Score (0-100)

| Score | Status | Meaning |
|-------|--------|---------|
| 80-100 | 🌟 Excellent | Well-maintained, high quality |
| 60-79 | 👍 Good | Minor improvements needed |
| 40-59 | ⚠️ Fair | Significant issues to address |
| 0-39 | 🚨 Poor | Urgent action required |

**Factors**:
- Test coverage (up to -30 points)
- Code quality issues (-1 to -10 per issue)
- Technical debt (-5 to -10 based on count)
- Large files (-3 to -15 based on count)

### Test-to-Source Ratio

| Ratio | Status | Recommendation |
|-------|--------|----------------|
| < 0.3 | Low | Add tests urgently |
| 0.3-0.5 | Fair | Improve coverage |
| 0.5-0.8 | Good | Maintain standard |
| > 0.8 | Excellent | Great coverage! |

### Issue Severity

- **Error** 🔴: Critical problems (empty catches, major issues)
- **Warning** 🟡: Should fix (debug statements, long functions)
- **Info** 🔵: Nice to have (TODOs, minor improvements)

## Configuration

### MCP Server Setup

Add to `.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "project-intelligence": {
      "command": "node",
      "args": ["./dist/mcp/server/index.js"],
      "env": {
        "NODE_ENV": "production"
      },
      "disabled": false
    }
  }
}
```

### Custom Agent Setup

See `docs/CUSTOM_AGENT_GUIDE.md` for complete instructions.

### Hook Customization

Edit files in `.kiro/hooks/` to:
- Change trigger events
- Modify matchers (file patterns)
- Adjust timeout values
- Enable/disable hooks

## Development Guidelines

See `.kiro/steering/coding-standards.md` for:
- TypeScript conventions
- Naming patterns
- Error handling
- Testing expectations
- Performance guidelines

## Testing Strategy

### Unit Tests
- Test individual functions and classes
- Mock external dependencies
- Fast execution

### Property-Based Tests
- Validate invariants (counts never negative)
- Test consistency (summary matches issues)
- Verify idempotency (same input → same output)
- Ensure stability (valid inputs don't crash)

**Why property-based?** Tests 100s of generated inputs automatically, finding edge cases unit tests miss.

## Troubleshooting

### Build Errors

```bash
npm run clean
npm install
npm run build
```

### Test Failures

```bash
# Run specific test file
npx jest tests/property/analyzer.property.test.ts

# Run with verbose output
npm test -- --verbose
```

### MCP Server Not Starting

1. Ensure project is built: `npm run build`
2. Check dist/mcp/server/index.js exists
3. Verify Node.js path in MCP config
4. Check Kiro logs for errors

### Analysis Hangs

- Large projects may take time
- Limit files: Set `maxFilesToReview` option
- Exclude directories in analyzer
- Check for permission issues

## Contributing

This is a Kiro University 2026 demonstration project. To extend:

1. Add new review rules in `src/reviewer/index.ts`
2. Add new metrics in `src/metrics/index.ts`
3. Create new MCP tools in `mcp/server/index.ts`
4. Add property-based tests in `tests/property/`
5. Update specifications in `.kiro/specs/`
6. Update documentation

## License

MIT License - See LICENSE file for details

## Kiro University 2026

**AWS User Group Madurai**

**Participant ID**: `1498e488-d0a1-7023-29d5-0b03a24f8dc5`

**Campaign**: `kiro-university-2026`

**Repository**: https://github.com/Prakash1448/kiro

### Lessons Completed

- ✅ Spec-driven development (250 credits)
- ✅ Steering documents (250 credits)
- ✅ Hooks (250 credits)
- ✅ Property-based testing (500 credits)
- ✅ Powers (500 credits)
- ✅ Model Context Protocol (1,000 credits)
- ✅ Custom agents (1,000 credits)

**Total**: 3,750 credits + potential 1,000 credit bonus

## Acknowledgments

Built with:
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [fast-check](https://fast-check.dev/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Kiro IDE](https://kiro.ai/)

---

**For demo instructions, see [DEMO.md](DEMO.md)**
