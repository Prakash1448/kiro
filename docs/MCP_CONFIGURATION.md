# MCP Server Configuration Guide

## Overview

The Project Intelligence MCP Server provides 5 tools and 3 resources for analyzing projects, reviewing code, generating test suggestions, and calculating metrics directly within Kiro IDE.

## Prerequisites

1. Node.js 18+ installed
2. Project built: `npm run build`
3. Kiro IDE with MCP support

## Configuration Steps

### Step 1: Build the Project

```bash
npm install
npm run build
```

Verify `dist/mcp/server/index.js` exists.

### Step 2: Configure MCP Server

**Option A: Workspace-Level Configuration** (Recommended)

Create or edit `.kiro/settings/mcp.json` in your workspace:

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

**Option B: User-Level Configuration**

Create or edit `~/.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "project-intelligence": {
      "command": "node",
      "args": ["/absolute/path/to/kiro-project-intelligence/dist/mcp/server/index.js"],
      "env": {
        "NODE_ENV": "production"
      },
      "disabled": false
    }
  }
}
```

**Note**: Use absolute path for user-level configuration.

### Step 3: Restart or Reload Kiro

- Restart Kiro IDE, OR
- Use Command Palette: "MCP: Reload Servers"

### Step 4: Verify Connection

1. Open Kiro's MCP view/panel
2. Look for "project-intelligence" server
3. Status should be "Connected" or "Running"

## Available Tools

### 1. analyze_project

**Purpose**: Analyze project directory structure and organization

**Input Schema**:
```json
{
  "path": "string (required) - Path to project directory"
}
```

**Example Usage**:
```json
{
  "path": "./my-project"
}
```

**Output**: Project analysis with file counts, extensions, large files, directory tree

**Use Cases**:
- Understanding new codebase structure
- Getting quick project overview
- Identifying organization issues

---

### 2. review_file

**Purpose**: Review a source file for code quality issues

**Input Schema**:
```json
{
  "filePath": "string (required) - Path to source file"
}
```

**Example Usage**:
```json
{
  "filePath": "./src/utils/calculator.ts"
}
```

**Output**: Review result with issues, severity, recommendations, score

**Detects**:
- Debug statements (console.log, console.error, etc.)
- TODO/FIXME/HACK comments
- Long functions (>50 lines)
- Large files (>500 lines)
- Empty catch blocks

---

### 3. generate_tests

**Purpose**: Generate test case suggestions for functions

**Input Schema**:
```json
{
  "sourceFile": "string (required) - Path to source file",
  "projectRoot": "string (optional) - Project root for better paths"
}
```

**Example Usage**:
```json
{
  "sourceFile": "./src/services/userService.ts",
  "projectRoot": "./"
}
```

**Output**: Test suggestions with suggested test file path and test cases

**Generates**:
- Happy path tests
- Edge case tests (null, undefined, empty)
- Error case tests

---

### 4. project_metrics

**Purpose**: Calculate comprehensive project health metrics

**Input Schema**:
```json
{
  "path": "string (required) - Path to project directory"
}
```

**Example Usage**:
```json
{
  "path": "./my-project"
}
```

**Output**: Metrics including health score, test ratio, issue counts

**Includes**:
- Total/source/test file counts
- Health score (0-100)
- Test-to-source ratio
- TODO/debug statement counts
- Issue summary (errors, warnings, info)
- Largest files

---

### 5. project_report

**Purpose**: Generate complete intelligence report

**Input Schema**:
```json
{
  "path": "string (required) - Path to project directory",
  "includeReviews": "boolean (optional, default: true)",
  "includeTestSuggestions": "boolean (optional, default: true)"
}
```

**Example Usage**:
```json
{
  "path": "./my-project",
  "includeReviews": true,
  "includeTestSuggestions": true
}
```

**Output**: Complete report combining all analyses

**Includes**:
- Project analysis
- Code reviews for all source files
- Test suggestions
- Metrics and health score
- Prioritized recommendations

---

## Available Resources

### 1. intelligence://schema/analysis

JSON schema for project analysis output structure

### 2. intelligence://schema/review

JSON schema for code review output structure

### 3. intelligence://schema/metrics

JSON schema for project metrics output structure

## Usage in Kiro IDE

### Method 1: Direct Tool Invocation

1. Open MCP Tools panel in Kiro
2. Select "project-intelligence" server
3. Choose tool (e.g., "analyze_project")
4. Provide input parameters
5. Execute and view results

### Method 2: Agent Integration

Configure the Project Intelligence Agent to use these tools:

```markdown
Agent Configuration:
- Name: Project Intelligence Agent
- MCP Servers: [project-intelligence]
- Tools: All 5 tools enabled
```

Then invoke agent with prompts like:
- "Analyze this project"
- "Review code quality"
- "What files need tests?"

### Method 3: Workflow Integration

Use tools in automated workflows or hooks (see Power documentation).

## Testing the Server

### Test 1: Server Starts

```bash
# Start server directly (for testing)
node dist/mcp/server/index.js
```

Should output: "Kiro Project Intelligence MCP Server running on stdio"

### Test 2: Tool Execution

Using Kiro IDE:
1. Invoke `analyze_project` on sample-project
2. Should return JSON with file counts

Expected output structure:
```json
{
  "totalFiles": 6,
  "sourceFiles": 3,
  "testFiles": 1,
  "filesByExtension": {...},
  "largeFiles": [...],
  "directoryTree": {...},
  "analyzedAt": "2026-10-05T..."
}
```

### Test 3: Error Handling

Invoke tool with invalid path:
```json
{
  "path": "/nonexistent/path"
}
```

Should return error message (not crash).

## Troubleshooting

### Server Not Starting

**Symptom**: "project-intelligence" server shows as disconnected

**Solutions**:
1. Verify build: `ls dist/mcp/server/index.js`
2. Check Node.js path: `which node` or `where node`
3. Update command in mcp.json to absolute path
4. Check Kiro logs for error messages

### Tools Not Appearing

**Symptom**: Server connected but no tools visible

**Solutions**:
1. Reload MCP servers in Kiro
2. Check server status in MCP panel
3. Restart Kiro IDE
4. Verify server code has ListToolsRequestSchema handler

### Tool Execution Fails

**Symptom**: Tool returns error or no output

**Solutions**:
1. Check input parameters match schema
2. Verify paths are correct and accessible
3. Check file/directory permissions
4. Look at error messages in tool output

### Performance Issues

**Symptom**: Tools take very long to execute

**Solutions**:
1. Limit scope: Use `maxFilesToReview` option
2. Exclude large directories
3. Disable test suggestions: `includeTestSuggestions: false`
4. Analyze smaller sub-projects

## Advanced Configuration

### Custom Environment Variables

Add to env object in mcp.json:

```json
{
  "env": {
    "NODE_ENV": "production",
    "LOG_LEVEL": "debug",
    "MAX_FILES": "1000"
  }
}
```

### Multiple Workspaces

Each workspace can have its own mcp.json configuration. Later workspace configs override earlier ones.

### Debugging

Enable debug output:

```json
{
  "env": {
    "NODE_ENV": "development",
    "DEBUG": "mcp:*"
  }
}
```

## Security Considerations

- Server runs locally (no network access)
- Only reads files (never writes or executes)
- No credentials or secrets required
- Operates within file system permissions

## Performance Tips

1. **Incremental Analysis**: Analyze specific subdirectories
2. **Limit Reviews**: Set `maxFilesToReview` to 20-30 for large projects
3. **Skip Test Suggestions**: Disable when not needed
4. **Cache Results**: Save JSON reports for repeated reference

## Integration Examples

### Example 1: Pre-Commit Hook

Integrate with git pre-commit:

```bash
# In pre-commit hook
kiro mcp call project-intelligence project_metrics '{"path": "."}'
```

### Example 2: CI/CD Pipeline

Add to GitHub Actions:

```yaml
- name: Project Quality Check
  run: |
    npm run analyze -- . --json > report.json
    # Parse health score and fail if < 60
```

### Example 3: VS Code Task

Add to `.vscode/tasks.json`:

```json
{
  "label": "Analyze Project Quality",
  "type": "shell",
  "command": "npm run analyze -- ${workspaceFolder}"
}
```

## FAQ

**Q: Can I use this outside Kiro IDE?**  
A: Yes! Use the CLI: `npm run analyze -- <path>`

**Q: Does it support languages other than TypeScript/JavaScript?**  
A: Currently focused on TS/JS, but extensible. File classification works for any language.

**Q: How accurate is the health score?**  
A: It's heuristic-based, not absolute truth. Use as a general indicator and trend tracker.

**Q: Can I customize the review rules?**  
A: Yes! Edit `src/reviewer/index.ts` and rebuild.

**Q: Is this production-ready?**  
A: Yes, it's functional and tested. Use at your own discretion.

## Support

For issues or questions:
- Check README.md for general documentation
- Review specifications in `.kiro/specs/`
- Check steering documents in `.kiro/steering/`
- Review property tests in `tests/property/`

## Version Information

- **MCP SDK**: @modelcontextprotocol/sdk ^0.5.0
- **Server Version**: 1.0.0
- **Protocol**: MCP over stdio
- **Node**: 18+ required

---

**Ready to analyze? Configure the server and start improving your codebase!** 🚀
