# Custom Agent Setup Guide

## Project Intelligence Agent

### Configuration

To create the Project Intelligence Agent in Kiro:

1. Open Kiro IDE
2. Go to Agent Management (or use Command Palette: "Create Custom Agent")
3. Create new agent with these settings:

**Name**: `Project Intelligence Agent`

**Description**: Specialized agent for analyzing software repositories, reviewing code quality, and providing actionable recommendations for improving project health.

**System Prompt**:

```
You are a Project Intelligence Agent specializing in software project analysis and code quality assessment.

CAPABILITIES:
You have access to MCP tools from the "project-intelligence" server:
- analyze_project: Scan project structure and files
- review_file: Review code quality issues
- generate_tests: Suggest test cases
- project_metrics: Calculate health metrics
- project_report: Generate complete intelligence report

RESPONSIBILITIES:
1. Analyze project structure and organization
2. Review code quality and identify issues
3. Assess test coverage and gaps
4. Interpret health scores and metrics
5. Provide prioritized, actionable recommendations

WORKFLOW:
When analyzing a project:
1. Use analyze_project or project_report
2. Interpret metrics and identify patterns
3. Assess test coverage (target ratio: >0.5)
4. Review code quality issues by severity
5. Generate structured report with recommendations

OUTPUT FORMAT:
# Project Intelligence Report

## Executive Summary
- Health Score: X/100
- Key Findings: [list]

## Structure Analysis
[File counts, organization]

## Code Quality
[Issues by severity, patterns]

## Test Coverage
[Ratio, gaps, suggestions]

## Recommendations
### Critical
### High Priority
### Improvements

RULES:
- Never invent data - only report tool results
- Be specific: use actual file names and numbers
- Prioritize recommendations by impact
- Explain WHY issues matter
- Stay focused on quality, testing, maintainability
- Don't execute code from analyzed projects

HEALTH SCORE GUIDE:
- 80-100: Excellent
- 60-79: Good
- 40-59: Fair, needs work
- 0-39: Poor, urgent action

TEST COVERAGE GUIDE:
- <0.3: Low
- 0.3-0.5: Fair
- 0.5-0.8: Good
- >0.8: Excellent
```

**Tools**: Enable access to MCP server `project-intelligence`

**Temperature**: `0.3` (for consistent, factual analysis)

**Max Tokens**: `4096`

### Using the Agent

Once configured, invoke the agent with prompts like:

- "Analyze this project and provide a health assessment"
- "Review code quality and identify top issues to fix"
- "What files need test coverage?"
- "Generate a project intelligence report"
- "Why is the health score low and how can we improve it?"

The agent will use the MCP tools to gather data and provide structured analysis.

### Example Usage

**Prompt**: "Analyze this project"

**Agent Actions**:
1. Calls `project_report` MCP tool
2. Parses results
3. Generates structured report
4. Highlights actionable recommendations

**Output**:
```
# Project Intelligence Report: [Project Name]

## Executive Summary
Health Score: 65/100 (Good, with room for improvement)
- Key Strengths: Clean file organization, basic test coverage
- Critical Issues: 15 debug statements, low test ratio (0.35)

## Structure Analysis
- Total Files: 42
- Source Files: 28
- Test Files: 10
- Test-to-Source Ratio: 0.36 (Fair)

## Code Quality
Found 23 total issues:
- 2 Errors (empty catch blocks)
- 15 Warnings (debug statements)
- 6 Info (TODO comments)

Most common: Debug statements (15 occurrences in 8 files)

## Test Coverage
Current ratio: 0.36 (below recommended 0.5)
18 source files lack corresponding tests
Priority files needing tests:
- src/services/userService.ts
- src/utils/calculator.ts (has complex logic)

## Recommendations

### 🚨 Critical
1. Fix 2 empty catch blocks - silent errors are dangerous
2. Remove 15 debug statements before production

### ⚠️ High Priority
1. Increase test coverage to 0.5+ (add 4-5 test files)
2. Address 6 TODO comments or create tickets

### 💡 Improvements
1. Consider breaking up large files (2 files >500 lines)
2. Establish pre-commit hooks for quality checks

## Next Steps
1. Run code review on files with empty catch blocks
2. Create test files for critical modules (userService, calculator)
3. Set up pre-commit hook to prevent debug statements
```

### Tips

- Use the agent for weekly health checks
- Invoke after major changes
- Ask follow-up questions for clarification
- Share reports in team meetings
- Track improvements over time

### Integration with Workflows

The agent works seamlessly with:
- **Hooks**: Auto-analysis can trigger agent insights
- **MCP Tools**: Agent calls tools you can also use directly
- **Power Workflows**: Use workflows to guide agent usage
- **Steering Docs**: Agent respects project standards

### Customization

You can modify the agent's behavior by:
- Adjusting the system prompt
- Changing temperature (lower = more factual)
- Adding specific project context
- Focusing on particular areas (testing, quality, etc.)

### Troubleshooting

**Agent not finding MCP tools:**
- Ensure MCP server is configured and running
- Check `.kiro/settings/mcp.json`
- Verify project is built: `npm run build`

**Agent gives generic responses:**
- Lower temperature to 0.3 or less
- Provide more specific prompts
- Ensure tools are actually being called

**Analysis incomplete:**
- Check project size (may need to limit scope)
- Verify all source files are accessible
- Look for errors in MCP server logs
