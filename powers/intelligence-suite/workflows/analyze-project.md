# Workflow: Analyze Project

Use this workflow when you need to understand a project's structure, health, and quality.

## When to Use

- Joining a new project or team
- Weekly health checks
- Before major releases
- After significant refactoring
- When onboarding new developers

## Steps

### 1. Run Full Analysis

```bash
npm run analyze -- ./project-path
```

Or use MCP tool `project_report`:
```json
{
  "path": "./project-path",
  "includeReviews": true,
  "includeTestSuggestions": true
}
```

### 2. Review Health Score

Check the metrics.healthScore value (0-100):
- 80+ = Excellent
- 60-79 = Good
- 40-59 = Needs work
- <40 = Critical

### 3. Examine Key Metrics

- **Test Coverage**: testToSourceRatio (aim for >0.5)
- **Code Quality**: issuesSummary (errors, warnings, info)
- **Technical Debt**: todoCount, debugStatementCount
- **File Sizes**: largestFiles (watch for >500 line files)

### 4. Review Recommendations

Read the recommendations array in priority order. Focus on:
1. Critical issues (🚨)
2. Warnings (⚠️)
3. Suggestions (💡)

### 5. Take Action

Based on recommendations:
- Add tests if coverage is low
- Remove debug statements
- Address TODO comments
- Refactor large files
- Fix error-level issues

### 6. Track Progress

Save report for comparison:
```bash
npm run analyze -- . --json --output reports/$(date +%Y-%m-%d).json
```

## Expected Outputs

- **analysis**: File structure and organization
- **reviews**: Code quality issues per file
- **testSuggestions**: Where tests are needed
- **metrics**: Aggregate statistics
- **recommendations**: Prioritized actions

## Tips

- Run analysis on CI/CD for continuous monitoring
- Set health score threshold for builds (e.g., min 60)
- Review reports in team meetings
- Celebrate improvements!
