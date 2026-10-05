# Intelligence Suite Power

AI-powered project intelligence for modern development teams.

## Overview

The Intelligence Suite Power provides comprehensive project analysis capabilities directly within Kiro IDE through MCP integration, custom workflows, and automation hooks.

## Features

### Core Capabilities
- **Project Structure Analysis**: Scan and understand project organization
- **Code Quality Review**: Identify maintainability issues, debug statements, and technical debt
- **Test Coverage Analysis**: Calculate test-to-source ratios and identify gaps
- **Health Scoring**: Get actionable project health metrics (0-100 scale)
- **Test Generation**: Get intelligent test case suggestions for your functions

### Integration Points
- MCP Server with 5 tools
- Custom Project Intelligence Agent
- Automated hooks for quality gates
- Steering documents for consistent standards

## Installation

### 1. Install Dependencies

```bash
npm install
npm run build
```

### 2. Configure MCP Server

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

### 3. Enable Hooks (Optional)

Hooks are automatically available in `.kiro/hooks/`:
- `test-on-save.json` - Runs tests when source files change
- `pre-commit-reminder.json` - Quality check before commits
- `test-file-reminder.json` - Reminds to create tests for new files
- `session-intelligence.json` - Welcome message with project context

## MCP Tools

### analyze_project

Analyzes project structure and file organization.

**Input:**
```json
{
  "path": "./my-project"
}
```

**Output:** Project analysis with file counts, extensions, large files, directory tree

**Use Cases:**
- Understanding new codebases
- Getting quick project overview
- Identifying project structure issues

### review_file

Reviews a source file for quality issues.

**Input:**
```json
{
  "filePath": "./src/utils/calculator.ts"
}
```

**Output:** List of issues with severity, category, message, and recommendations

**Detects:**
- Debug statements (console.log)
- TODO/FIXME comments
- Long functions (>50 lines)
- Large files (>500 lines)
- Empty catch blocks

### generate_tests

Generates test case suggestions for functions.

**Input:**
```json
{
  "sourceFile": "./src/services/user.ts",
  "projectRoot": "./"
}
```

**Output:** Test file path suggestions and test cases (happy path, edge cases, error cases)

**Use Cases:**
- Bootstrapping test coverage
- Identifying missing test scenarios
- Learning test patterns

### project_metrics

Calculates comprehensive project metrics.

**Input:**
```json
{
  "path": "./my-project"
}
```

**Output:** Metrics including:
- File counts (total, source, test)
- Health score (0-100)
- Test-to-source ratio
- TODO/debug statement counts
- Issue summaries

### project_report

Generates complete intelligence report.

**Input:**
```json
{
  "path": "./my-project",
  "includeReviews": true,
  "includeTestSuggestions": true
}
```

**Output:** Comprehensive report combining:
- Project analysis
- Code reviews for all source files
- Test suggestions
- Metrics and health score
- Prioritized recommendations

**Best for:**
- Weekly project health checks
- Pre-release quality audits
- Onboarding documentation

## CLI Usage

### Analyze Current Project
```bash
npm run analyze -- .
```

### Analyze Specific Project
```bash
npm run analyze -- ./path/to/project
```

### Get Full JSON Report
```bash
npm run analyze -- ./project --json
```

### Save Report to File
```bash
npm run analyze -- ./project --json --output report.json
```

## Custom Agent Usage

The **Project Intelligence Agent** is available for deep analysis workflows.

**To use:**
1. Invoke the agent in Kiro
2. Ask it to "Analyze this project and provide recommendations"
3. The agent will use MCP tools to gather intelligence
4. Receive structured insights and actionable recommendations

**Agent specializes in:**
- Project onboarding
- Architecture review
- Quality assessment
- Test coverage analysis

## Workflows

### Daily Development Workflow

1. **Start Session**: Hook welcomes you with project context
2. **Write Code**: Edit source files
3. **Auto-Test**: Tests run automatically on save
4. **Review**: Fix any issues found
5. **Commit**: Pre-commit hook reminds to check health

### Weekly Health Check Workflow

1. Run full analysis: `npm run analyze -- . --json --output weekly-report.json`
2. Review health score and recommendations
3. Address high-priority issues
4. Track improvement over time

### Code Review Workflow

1. Use MCP `review_file` on changed files
2. Address errors and warnings
3. Run `generate_tests` for new functions
4. Verify health score hasn't decreased

### Onboarding Workflow

1. New developer joins team
2. Run `project_report` to understand codebase
3. Review recommendations for areas needing work
4. Use agent to ask specific questions

## Configuration

### Steering Documents

The power includes steering documents in `.kiro/steering/`:

- `product.md` - Product vision and scope
- `architecture.md` - System architecture and design
- `coding-standards.md` - TypeScript conventions and best practices

These documents guide Kiro's suggestions when working on the project.

### Customizing Hooks

Edit hook files in `.kiro/hooks/` to:
- Change test commands
- Adjust matchers (file patterns)
- Modify timeout values
- Enable/disable specific hooks

### Adjusting Thresholds

Edit `src/analyzer/index.ts`, `src/reviewer/index.ts`, etc. to customize:
- Large file threshold (default: 500 lines)
- Long function threshold (default: 50 lines)
- Health score algorithm
- Review rules

## Metrics Interpretation

### Health Score (0-100)

- **80-100**: Excellent - Well-maintained project
- **60-79**: Good - Minor issues to address
- **40-59**: Fair - Needs attention
- **0-39**: Poor - Urgent action required

**Score Factors:**
- Test coverage (up to -30 points for no tests)
- Code quality issues (errors, warnings)
- Technical debt (TODOs, debug statements)
- File size (large files penalty)

### Test-to-Source Ratio

- **< 0.3**: Low coverage, increase testing
- **0.3-0.5**: Fair coverage
- **0.5-0.8**: Good coverage
- **> 0.8**: Excellent coverage

## Troubleshooting

### MCP Server Not Starting

1. Ensure project is built: `npm run build`
2. Check `dist/mcp/server/index.js` exists
3. Verify Node.js path in MCP config
4. Check Kiro logs for error messages

### No Hooks Firing

1. Hooks activate on next session start
2. Check matcher regex patterns
3. Verify hook files in `.kiro/hooks/`
4. Check hook logs in Kiro

### Analysis Takes Too Long

1. Limit files reviewed: Set `maxFilesToReview` option
2. Skip test suggestions: Set `includeTestSuggestions: false`
3. Exclude large directories in analysis
4. Run on smaller sub-projects

### Inaccurate Detection

- Review rules use regex, not full AST parsing
- May have false positives/negatives
- Customize rules in `src/reviewer/index.ts`
- Property-based tests ensure core correctness

## Examples

### Example 1: Quick Health Check

```bash
npm run analyze -- ./my-app
```

Output shows summary with health score and top recommendations.

### Example 2: Detailed Analysis

```bash
npm run analyze -- ./my-app --json | jq '.metrics'
```

Extract just the metrics in JSON format.

### Example 3: Review Specific File

Use MCP tool `review_file`:
```json
{
  "filePath": "./src/problematic-file.ts"
}
```

### Example 4: Generate Tests

Use MCP tool `generate_tests`:
```json
{
  "sourceFile": "./src/new-feature.ts",
  "projectRoot": "./"
}
```

## Best Practices

1. **Run Analysis Regularly**: Weekly or before releases
2. **Address Errors First**: Fix critical issues before warnings
3. **Improve Test Coverage**: Aim for >0.5 test-to-source ratio
4. **Remove Debug Code**: Clean up console.log statements
5. **Track Progress**: Save reports over time to measure improvement
6. **Use Custom Agent**: Ask specific questions for deeper insights
7. **Leverage Hooks**: Automate quality checks in workflow

## Limitations

- Analysis is syntax-based (regex), not semantic
- JavaScript/TypeScript focused (extensible to other languages)
- Large projects (>10,000 files) may be slow
- Test suggestions are templates, not actual test code
- Health score is heuristic-based, not absolute truth

## Contributing

To extend the Intelligence Suite:

1. Add new rules in `src/reviewer/index.ts`
2. Add new metrics in `src/metrics/index.ts`
3. Create new MCP tools in `mcp/server/index.ts`
4. Add property-based tests in `tests/property/`
5. Update this documentation

## Support

For issues, questions, or contributions:
- Review specifications in `.kiro/specs/`
- Check steering documents in `.kiro/steering/`
- Run tests: `npm test`
- Run property tests: `npm run test:property`

## License

MIT License - See LICENSE file for details

---

**Kiro University 2026 Project**

Demonstrates all 7 Kiro capabilities:
1. ✅ Spec-driven development
2. ✅ Steering documents
3. ✅ Hooks
4. ✅ Property-based testing
5. ✅ Powers (this package)
6. ✅ MCP integration
7. ✅ Custom agents
