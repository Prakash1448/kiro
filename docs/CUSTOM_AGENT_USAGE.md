# Project Intelligence Agent - Usage Guide

## Overview

The **Project Intelligence Agent** is a custom Kiro agent specialized in software project analysis, code quality assessment, and intelligent recommendations. It leverages the MCP tools provided by this project to deliver comprehensive project insights.

## Location

**Agent Configuration**: `.kiro/agents/project-intelligence.md`

## Agent Capabilities

The Project Intelligence Agent provides:

1. **Project Analysis** - Complete structure and organization assessment
2. **Code Quality Review** - Issue detection and severity classification
3. **Test Coverage Analysis** - Gap identification and test generation
4. **Health Metrics** - Comprehensive scoring and interpretation
5. **Actionable Recommendations** - Prioritized improvement suggestions

## How to Invoke

### Method 1: Using the Sub-Agent System (Programmatic)

From within Kiro sessions, you can delegate to the Project Intelligence Agent:

```typescript
invoke_sub_agent({
  name: "project-intelligence",
  prompt: "Analyze this project and provide a comprehensive health assessment",
  explanation: "Delegating project analysis to specialized agent"
})
```

### Method 2: Command Palette (Interactive)

1. Open Kiro IDE
2. Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
3. Type "Select Agent" or "Switch Agent"
4. Choose "project-intelligence"
5. Start a new chat session

### Method 3: Agent Panel (UI)

1. Open the Kiro sidebar
2. Navigate to "Agents" panel
3. Find "Project Intelligence Agent"
4. Click to activate
5. Begin your analysis session

## Common Usage Patterns

### Pattern 1: Comprehensive Project Analysis

**Prompt**:
```
Analyze this project and provide a complete health assessment with prioritized recommendations.
```

**What the agent does**:
- Invokes `project_report` MCP tool
- Analyzes structure, quality, and test coverage
- Generates structured report with executive summary
- Provides prioritized, actionable recommendations

**Expected Output**: Full project intelligence report with health score, issue breakdown, and next steps

---

### Pattern 2: Code Quality Focus

**Prompt**:
```
Review code quality issues in this project. What are the top 5 issues I should fix first?
```

**What the agent does**:
- Invokes `project_report` or `project_metrics`
- Categorizes issues by severity
- Prioritizes by impact
- Explains why each issue matters

**Expected Output**: Prioritized list of quality issues with file paths and fix suggestions

---

### Pattern 3: Test Coverage Analysis

**Prompt**:
```
What's our test coverage status? Which files need tests most urgently?
```

**What the agent does**:
- Invokes `project_metrics`
- Calculates test-to-source ratio
- Identifies untested files
- Prioritizes by importance

**Expected Output**: Test coverage report with specific files needing tests

---

### Pattern 4: Targeted File Review

**Prompt**:
```
Review src/analyzer/index.ts for code quality issues.
```

**What the agent does**:
- Invokes `review_file` with specific path
- Lists issues by severity
- Explains impact of each issue
- Suggests specific fixes

**Expected Output**: Detailed file review with line numbers and recommendations

---

### Pattern 5: Test Generation

**Prompt**:
```
Generate test suggestions for src/test-generator/index.ts
```

**What the agent does**:
- Invokes `generate_tests` with file path
- Analyzes functions and their signatures
- Suggests test cases (happy path, edge cases, error cases)
- Provides test file path suggestions

**Expected Output**: Test suggestions with case names and scenarios

---

## Integration with Project Features

### Works With Steering Documents

The agent automatically considers:
- `.kiro/steering/coding-standards.md` - Project code quality guidelines
- `.kiro/steering/testing-strategy.md` - Testing best practices
- `.kiro/steering/project-overview.md` - Project context

### Works With Specs

The agent can reference:
- `.kiro/specs/project-intelligence/requirements.md`
- `.kiro/specs/project-intelligence/design.md`
- Spec tasks for context

### Works With MCP Tools

The agent directly invokes:
- `analyze_project` - Project structure analysis
- `review_file` - Code quality review
- `generate_tests` - Test case generation
- `project_metrics` - Health score calculation
- `project_report` - Comprehensive reporting

### Works With Powers

When the Intelligence Suite Power is activated:
- Agent can leverage power workflows
- Enhanced capabilities via power tools
- Integrated recommendations

### Works With Hooks

The agent's insights can trigger:
- `.kiro/hooks/quality-gate.json` - Block merges if health score too low
- `.kiro/hooks/test-reminder.json` - Remind about test coverage
- Custom analysis hooks

## Example Session

### Full Analysis Session

```
User: Start a comprehensive analysis of this project.

Agent: I'll analyze the project using the project_report tool.

[Invokes MCP tool: project_report]

# Project Intelligence Report: Kiro Project Intelligence Assistant

## Executive Summary
- Health Score: 78/100 (Good)
- Test-to-Source Ratio: 0.36 (Fair, below recommended 0.5)
- Total Issues: 8 (0 errors, 6 warnings, 2 info)
- Key Findings:
  * Well-organized project structure
  * Good code quality with minor issues
  * Test coverage needs improvement

## Structure Analysis
- Total Files: 45
- Source Files: 28
- Test Files: 10
- File Organization: Clean separation of concerns (src/, tests/, docs/)
- Large Files: 1 file (src/report/index.ts - 520 lines)

## Code Quality Assessment
### Issues by Severity
- **Errors** (0): None found ✓
- **Warnings** (6): 
  * Debug statements (4 in 3 files)
  * TODO comments (2 in 2 files)
- **Info** (2): Suggestions for improvement

### Common Patterns
Most frequent: Debug statements in analyzer and reviewer modules

## Test Coverage Analysis
- Current Ratio: 0.36 (Fair, target is 0.5+)
- Files Lacking Tests: 18
- Priority Files for Testing:
  1. src/report/index.ts (complex logic, 520 lines)
  2. src/metrics/index.ts (critical calculations)
  3. src/cli/index.ts (user-facing interface)
  4. src/mcp/server/index.ts (external API)
- Coverage Gaps: CLI commands, metrics calculations

## Recommendations

### 🚨 Critical (Immediate Action Required)
None - no critical issues found ✓

### ⚠️ High Priority (This Sprint)
1. **Increase test coverage to 0.5+**: Add tests for report, metrics, and CLI modules (add 8-10 test files)
2. **Remove 4 debug statements**: Clean up before production deployment
   - src/analyzer/index.ts (line 45, 67)
   - src/reviewer/index.ts (line 123, 234)

### 💡 Improvements (Next Quarter)
1. **Address 2 TODO comments**: Create tickets or resolve inline
2. **Refactor large file**: Break src/report/index.ts into smaller modules (currently 520 lines)
3. **Add integration tests**: Test CLI end-to-end flows

## Next Steps
1. Create test files for high-priority modules (report, metrics, CLI)
2. Remove debug statements from analyzer and reviewer
3. Set up pre-commit hook to prevent debug statements in future
4. Track health score improvement after changes

---

User: Which test should I write first?

Agent: I recommend starting with **src/metrics/index.ts** tests for these reasons:

1. **Critical Functionality**: Metrics drive the health score calculation - if this is wrong, all reports are wrong
2. **High Complexity**: Involves calculations and aggregations, prone to edge cases
3. **Downstream Impact**: Reports and recommendations depend on accurate metrics
4. **Testing Friendliness**: Pure functions with clear inputs/outputs, easier to test

Suggested test file: `tests/unit/metrics.test.ts`

Priority test cases:
1. calculateHealthScore() with various issue combinations
2. Edge case: zero files
3. Edge case: no source files
4. Test-to-source ratio calculation accuracy
5. Issue severity weighting

Would you like me to generate specific test case suggestions for this module?

User: Yes, generate test suggestions.

Agent: [Invokes MCP tool: generate_tests for src/metrics/index.ts]

Here are the test suggestions for src/metrics/index.ts:

### Test Suite: Metrics Module

**Test File**: `tests/unit/metrics.test.ts`

#### Happy Path Tests
1. **should calculate correct health score for healthy project**
   - Scenario: Project with few issues, good test ratio
   - Expected: Health score 80-100

2. **should calculate correct test-to-source ratio**
   - Scenario: 10 test files, 20 source files
   - Expected: Ratio = 0.5

3. **should aggregate issues correctly by severity**
   - Scenario: Mix of errors, warnings, info
   - Expected: Correct counts per category

#### Edge Cases
4. **should handle project with zero files**
   - Scenario: Empty project
   - Expected: Health score 0, ratio 0, no crash

5. **should handle project with no source files**
   - Scenario: Only test or config files
   - Expected: Ratio 0, appropriate health score

6. **should handle project with no test files**
   - Scenario: No tests directory
   - Expected: Ratio 0, lower health score

#### Error Cases
7. **should throw error for invalid issue severity**
   - Scenario: Issue with unknown severity level
   - Expected: Descriptive error thrown

8. **should handle negative file counts gracefully**
   - Scenario: Malformed input with negative counts
   - Expected: Error or sanitized to 0

Would you like me to review another file or help with implementation?
```

## Tips for Effective Usage

### 1. Be Specific in Prompts
❌ "Analyze this"
✅ "Analyze this project's test coverage and identify the top 3 files that need tests"

### 2. Ask Follow-up Questions
The agent maintains context, so you can drill deeper:
```
User: "Analyze the project"
Agent: [Provides full report]
User: "Why is the health score 65 instead of higher?"
Agent: [Explains specific factors]
User: "Which issue should I fix first to improve the score fastest?"
Agent: [Prioritizes by impact]
```

### 3. Leverage MCP Tools Directly
You can also call MCP tools directly if you know what you need:
```
User: "Use the review_file tool on src/analyzer/index.ts"
```

### 4. Combine with Other Agents
Use the Project Intelligence Agent for analysis, then switch to other agents for implementation:
```
1. Project Intelligence Agent: Analyze and recommend
2. General Task Agent: Implement fixes
3. Project Intelligence Agent: Verify improvements
```

### 5. Regular Health Checks
Schedule regular analysis sessions:
- Weekly: Quick health check
- Sprint End: Comprehensive review
- Pre-Release: Full quality gate

## Troubleshooting

### Issue: Agent not invoking MCP tools

**Solution**: Ensure MCP server is configured and running
```bash
# Check MCP configuration
cat .kiro/settings/mcp.json

# Build and start MCP server
npm run build
npm run mcp
```

### Issue: Agent provides generic responses

**Solution**: Lower temperature in agent config or be more specific in prompts
- Edit `.kiro/agents/project-intelligence.md`
- Set `temperature: 0.1` for highly factual responses

### Issue: Analysis seems incomplete

**Solution**: Check project build status and file accessibility
```bash
# Ensure all source files are compiled
npm run build

# Verify source structure
ls -la src/
```

### Issue: Cannot find agent

**Solution**: Verify agent file exists and is properly formatted
```bash
# Check agent exists
ls .kiro/agents/project-intelligence.md

# Validate Markdown syntax
# Agent should have proper frontmatter and sections
```

## Advanced Usage

### Customizing the Agent

You can modify `.kiro/agents/project-intelligence.md` to:

1. **Change Focus**: Emphasize security, performance, or documentation
2. **Adjust Scoring**: Modify health score thresholds
3. **Add Context**: Include project-specific guidelines
4. **Change Style**: Adjust communication tone

### Integration with CI/CD

Use the agent in automated workflows:

```yaml
# Example: GitHub Actions
- name: Project Intelligence Analysis
  run: |
    kiro agent run project-intelligence "Analyze project and report health score"
```

### Tracking Improvements

Compare reports over time:
```
Week 1: Health Score 65
Week 2: Health Score 72 (after adding tests)
Week 3: Health Score 78 (after fixing quality issues)
```

## Related Documentation

- **MCP Configuration**: `docs/MCP_CONFIGURATION.md`
- **Custom Agent Guide**: `docs/CUSTOM_AGENT_GUIDE.md`
- **Steering Documents**: `.kiro/steering/`
- **Project Specs**: `.kiro/specs/project-intelligence/`
- **Intelligence Suite Power**: `powers/intelligence-suite/`

## Support

For issues or questions:
1. Check this documentation
2. Review agent configuration: `.kiro/agents/project-intelligence.md`
3. Verify MCP server status
4. Consult Kiro documentation: https://kiro.dev/docs/custom-agents/

---

**Version**: 1.0.0  
**Compatibility**: Kiro IDE 1.0+, CLI 3.0+  
**Last Updated**: October 2026
