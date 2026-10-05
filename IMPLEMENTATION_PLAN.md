# Kiro Project Intelligence Assistant - Implementation Plan

## Executive Summary

The **Kiro Project Intelligence Assistant** is an AI-powered developer tool that helps teams understand, analyze, and improve their software projects. It demonstrates all 7 Kiro University 2026 requirements through practical, production-quality features.

## Project Overview

### Core Value Proposition
- Automated project structure analysis
- Intelligent code review and quality recommendations
- Test generation and coverage analysis
- Project health scoring and metrics
- Context-aware developer assistance

### Target Users
- Development teams onboarding to new codebases
- Code reviewers needing project-specific insights
- Tech leads monitoring project health
- Developers seeking contextual assistance

---

## Architecture

### System Design

```
┌─────────────────────────────────────────────────────┐
│           Kiro IDE Integration Layer                │
├─────────────────────────────────────────────────────┤
│  Custom Agents  │  Hooks  │  Powers  │  MCP Servers │
├─────────────────────────────────────────────────────┤
│              Core Intelligence Engine               │
│  ┌──────────┬──────────┬──────────┬──────────┐   │
│  │ Project  │ Code     │ Test     │ Metrics  │   │
│  │ Analyzer │ Reviewer │ Generator│ Collector│   │
│  └──────────┴──────────┴──────────┴──────────┘   │
├─────────────────────────────────────────────────────┤
│              Data & Knowledge Layer                 │
│  ┌──────────────┬──────────────┬──────────────┐   │
│  │ Project Graph│ Quality Rules│ Test Patterns│   │
│  └──────────────┴──────────────┴──────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Technology Stack

**Runtime Environment:**
- Node.js (v18+) for MCP servers and tooling
- Python (3.10+) for analysis engines
- TypeScript for type safety and IDE integration

**Core Libraries:**
- `@modelcontextprotocol/sdk` - MCP server implementation
- `fast-check` - Property-based testing
- `eslint` / `typescript-eslint` - Code quality analysis
- `jest` - Unit and integration testing
- `glob` - File pattern matching
- `semver` - Version analysis

**Analysis Tools:**
- Abstract Syntax Tree (AST) parsing via `@babel/parser` or `typescript` compiler API
- Dependency graph analysis via `madge` or custom implementation
- Code metrics via `complexity-report` or similar

---

## Folder Structure

```
kiro-project-intelligence/
├── .kiro/                          # Kiro IDE configuration
│   ├── specs/                      # Spec-driven development
│   │   ├── main-spec.md           # Main project specification
│   │   ├── analyzer-spec.md       # Project analyzer feature spec
│   │   ├── reviewer-spec.md       # Code reviewer feature spec
│   │   └── test-gen-spec.md       # Test generator feature spec
│   ├── steering/                   # Steering documents
│   │   ├── coding-standards.md    # Project coding standards
│   │   ├── architecture-guide.md  # Architecture guidelines
│   │   └── testing-strategy.md    # Testing approach
│   ├── hooks/                      # Kiro hooks
│   │   ├── code-quality-gate.json # Pre-commit quality checks
│   │   ├── auto-review.json       # Automatic code review
│   │   └── test-reminder.json     # Test coverage reminder
│   └── agents/                     # Custom agents
│       └── project-analyzer.json  # Project analysis agent
│
├── src/                            # Source code
│   ├── core/                       # Core intelligence engine
│   │   ├── analyzer/              # Project analysis
│   │   │   ├── structure.ts       # Structure analyzer
│   │   │   ├── dependencies.ts    # Dependency analyzer
│   │   │   └── metrics.ts         # Metrics collector
│   │   ├── reviewer/              # Code review
│   │   │   ├── rules.ts           # Review rules
│   │   │   ├── suggestions.ts     # Suggestion engine
│   │   │   └── patterns.ts        # Pattern detection
│   │   └── test-gen/              # Test generation
│   │       ├── generator.ts       # Test generator
│   │       ├── templates.ts       # Test templates
│   │       └── coverage.ts        # Coverage analysis
│   │
│   ├── mcp/                        # MCP servers
│   │   ├── project-intel-server/  # Main MCP server
│   │   │   ├── index.ts           # Server entry
│   │   │   ├── tools.ts           # Tool definitions
│   │   │   └── resources.ts       # Resource providers
│   │   └── shared/                # Shared MCP utilities
│   │
│   ├── powers/                     # Kiro powers
│   │   └── intelligence-suite/    # Intelligence power
│   │       ├── POWER.md           # Power documentation
│   │       ├── config.json        # Power configuration
│   │       └── workflows/         # Workflow steering files
│   │
│   └── utils/                      # Utilities
│       ├── ast-parser.ts          # AST utilities
│       ├── file-scanner.ts        # File scanning
│       └── logger.ts              # Logging
│
├── tests/                          # Test suites
│   ├── unit/                       # Unit tests
│   ├── integration/                # Integration tests
│   └── property/                   # Property-based tests
│       ├── analyzer.property.test.ts
│       ├── reviewer.property.test.ts
│       └── generator.property.test.ts
│
├── examples/                       # Example projects
│   ├── sample-typescript-project/
│   └── sample-python-project/
│
├── docs/                           # Documentation
│   ├── user-guide.md
│   ├── api-reference.md
│   └── architecture.md
│
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

---

## Demonstrating the 7 Kiro University Lessons

### 1. Spec-Driven Development

**Implementation:**
- Create detailed specs in `.kiro/specs/` for each major feature
- Main spec defines overall system requirements
- Feature specs break down into implementation tasks
- Use spec references to link technical documents

**Files:**
- `main-spec.md` - Overall project specification
- `analyzer-spec.md` - Project analyzer feature
- `reviewer-spec.md` - Code reviewer feature
- `test-gen-spec.md` - Test generator feature

**Demonstration:**
Each spec will include:
- Requirements section with #[[file:references]]
- Design decisions
- Task breakdown
- Success criteria
- Implementation notes

### 2. Steering Documents

**Implementation:**
- Define project-wide coding standards
- Document architectural patterns
- Specify testing requirements
- Include file references for technical specs

**Files:**
- `coding-standards.md` - TypeScript/Python standards, naming conventions
- `architecture-guide.md` - System architecture, patterns, principles
- `testing-strategy.md` - Test coverage goals, property-based testing approach

**Auto-Inclusion:**
- Standards apply to all files by default
- Architecture guide includes when reading core modules
- Testing strategy includes when working in tests/

### 3. Hooks

**Implementation:**
Create hooks that demonstrate the assistant's capabilities:

**a) Pre-Commit Quality Gate** (`code-quality-gate.json`)
- Trigger: `PreToolUse` (filter: `execute_pwsh` with git commit)
- Action: Run linting and basic quality checks
- Blocks commit if quality gates fail

**b) Automatic Code Review** (`auto-review.json`)
- Trigger: `PostFileSave` (filter: `\.(ts|js|py)$`)
- Action: Analyze saved file for common issues
- Provides inline suggestions

**c) Test Coverage Reminder** (`test-reminder.json`)
- Trigger: `PostFileCreate` (filter: `src/.*\.(ts|js)$`)
- Action: Check if corresponding test exists
- Prompt to create test if missing

**d) Session Project Analysis** (`session-analyzer.json`)
- Trigger: `SessionStart`
- Action: Analyze project health and provide summary

### 4. Property-Based Testing

**Implementation:**
Use `fast-check` for property-based tests on core algorithms:

**Test Scenarios:**

a) **Project Analyzer Properties:**
   - Analyzing the same project twice yields identical results
   - Adding a file increases file count by exactly 1
   - Dependency graph has no self-cycles
   - All referenced files exist in the project

b) **Code Reviewer Properties:**
   - Valid code always passes basic syntax rules
   - Rule application is idempotent
   - Severity ordering is transitive
   - Suggestions don't introduce new issues

c) **Test Generator Properties:**
   - Generated tests are syntactically valid
   - Test names are unique
   - Generated tests import the correct module
   - Generated tests can be parsed by the test runner

**Files:**
- `tests/property/analyzer.property.test.ts`
- `tests/property/reviewer.property.test.ts`
- `tests/property/generator.property.test.ts`

### 5. Powers

**Implementation:**
Create "Intelligence Suite" power that packages the assistant:

**Power Structure:**
```
intelligence-suite/
├── POWER.md              # Documentation
├── config.json           # Power configuration
├── mcp.json             # MCP server config
└── workflows/           # Workflow steering files
    ├── analyze-project.md
    ├── review-code.md
    └── generate-tests.md
```

**Power Features:**
- Packaged MCP server for project intelligence
- Pre-configured steering files for common workflows
- Example usage and configuration
- Distribution as shareable unit

### 6. Model Context Protocol (MCP)

**Implementation:**
Create MCP server: `project-intelligence-server`

**Tools:**
1. `analyze_project_structure` - Scan and analyze project files
2. `review_code_file` - Review code with quality suggestions
3. `generate_tests` - Generate test cases for code
4. `get_project_metrics` - Retrieve project health metrics
5. `suggest_improvements` - AI-powered improvement suggestions
6. `find_similar_code` - Detect code duplication

**Resources:**
1. `project://structure` - Project structure JSON
2. `project://dependencies` - Dependency graph
3. `project://metrics` - Project metrics
4. `project://health` - Health score and issues

**Configuration:**
```json
{
  "mcpServers": {
    "project-intelligence": {
      "command": "node",
      "args": ["./src/mcp/project-intel-server/index.js"],
      "env": {
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

### 7. Custom Agents

**Implementation:**
Create specialized agent: `project-analyzer`

**Agent Purpose:**
Deep project analysis that explores codebase structure, identifies patterns, suggests improvements, and provides architectural insights.

**Agent Configuration:**
```json
{
  "name": "project-analyzer",
  "description": "Analyzes project structure, dependencies, and architecture",
  "systemPrompt": "You are a project analysis specialist...",
  "tools": [
    "read_code",
    "grep_search",
    "execute_pwsh",
    "file_search"
  ],
  "temperature": 0.3
}
```

**Use Cases:**
- Onboarding: "Analyze this project for a new developer"
- Architecture review: "Review the current architecture"
- Refactoring: "Find opportunities for code consolidation"
- Dependency analysis: "Map out module dependencies"

---

## MVP Definition

### Phase 1: Core Infrastructure (Week 1)
- [x] Project structure setup
- [ ] Basic MCP server with 2 tools (analyze_project_structure, get_project_metrics)
- [ ] Simple project analyzer (file count, basic metrics)
- [ ] Unit tests for core functionality
- [ ] Main specification document

### Phase 2: Intelligence Features (Week 2)
- [ ] Code reviewer with 3-5 basic rules
- [ ] Test generator for simple functions
- [ ] Custom project-analyzer agent
- [ ] Property-based tests for analyzer
- [ ] Feature specs for analyzer and reviewer

### Phase 3: Kiro Integration (Week 3)
- [ ] All 4 hooks implemented and tested
- [ ] Steering documents (coding standards, architecture)
- [ ] Intelligence Suite power package
- [ ] Complete MCP server with all 6 tools
- [ ] Integration tests

### Phase 4: Polish & Documentation (Week 4)
- [ ] Complete property-based test suite
- [ ] User documentation
- [ ] Example projects
- [ ] Demo video preparation
- [ ] Final testing and bug fixes

### MVP Features

**Must Have:**
- ✅ Project structure analysis (file count, types, size)
- ✅ Basic code quality metrics (LOC, complexity)
- ✅ Simple code review (3-5 rules: unused imports, console.logs, TODO comments)
- ✅ Test generator for pure functions
- ✅ MCP server with 3 core tools
- ✅ 2 useful hooks (quality gate, test reminder)
- ✅ Project analyzer custom agent
- ✅ Property-based tests for core logic
- ✅ Basic Intelligence Suite power

**Nice to Have:**
- Advanced code review rules (security patterns, performance)
- Dependency graph visualization
- Code duplication detection
- Test coverage analysis
- Project health scoring

**Explicitly Out of Scope:**
- AI model training or fine-tuning
- Real-time collaboration features
- Cloud deployment
- Multi-language support beyond TypeScript/JavaScript
- GUI beyond Kiro IDE integration

---

## Testing Strategy

### Unit Tests
- All core modules have >80% coverage
- Test individual functions and classes
- Mock external dependencies

### Integration Tests
- Test MCP server tool execution
- Test hook triggers and actions
- Test agent workflows
- Test power configuration loading

### Property-Based Tests
**Critical for demonstrating Lesson 4:**

1. **Analyzer Properties:**
```typescript
// Idempotency
analyze(project) === analyze(project)

// Monotonicity
fileCount(project + file) = fileCount(project) + 1

// Consistency
allFiles(project).every(f => exists(f))
```

2. **Reviewer Properties:**
```typescript
// Valid code passes basic checks
isValid(code) => review(code).errors.length === 0

// Rule determinism
review(code, rules) === review(code, rules)

// Severity transitivity
high > medium > low
```

3. **Generator Properties:**
```typescript
// Syntactic validity
generated = generateTest(fn)
parse(generated).success === true

// Uniqueness
tests = generateTests(fns)
names(tests).unique === true
```

### Test Execution
- Run on every commit via hook
- CI/CD integration ready
- Performance benchmarks for analysis operations

---

## MCP Integration Details

### Server Architecture

```typescript
// src/mcp/project-intel-server/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "project-intelligence-server",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {},
    resources: {}
  }
});

// Tool implementations
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "analyze_project_structure",
      description: "Analyzes project file structure and organization",
      inputSchema: { /* ... */ }
    },
    // ... other tools
  ]
}));
```

### Tool Specifications

**1. analyze_project_structure**
```json
{
  "input": {
    "path": "string (project root)",
    "depth": "number (optional, default: 5)",
    "include": "string[] (file patterns)",
    "exclude": "string[] (ignore patterns)"
  },
  "output": {
    "totalFiles": "number",
    "filesByType": "Record<string, number>",
    "totalSize": "number",
    "structure": "Tree<FileNode>"
  }
}
```

**2. review_code_file**
```json
{
  "input": {
    "filePath": "string",
    "rules": "string[] (optional)",
    "severity": "enum (error, warning, info)"
  },
  "output": {
    "issues": "Issue[]",
    "suggestions": "Suggestion[]",
    "score": "number (0-100)"
  }
}
```

**3. generate_tests**
```json
{
  "input": {
    "sourceFile": "string",
    "functions": "string[] (optional)",
    "framework": "enum (jest, vitest, mocha)"
  },
  "output": {
    "testFile": "string (content)",
    "testCount": "number",
    "coverage": "string[] (covered functions)"
  }
}
```

---

## Custom Agents Details

### Project Analyzer Agent

**Configuration:**
```json
{
  "name": "project-analyzer",
  "description": "Deep project analysis specialist",
  "systemPrompt": "You are an expert software architect specializing in project analysis. Analyze codebases to identify patterns, issues, and improvement opportunities. Focus on architecture, dependencies, code organization, and technical debt.",
  "tools": [
    "read_code",
    "grep_search",
    "file_search",
    "execute_pwsh",
    "invoke_sub_agent"
  ],
  "model": "claude-sonnet-4.5",
  "temperature": 0.3,
  "maxTokens": 4096
}
```

**Agent Workflows:**

1. **New Project Onboarding:**
   - Scan project structure
   - Identify framework and patterns
   - Map key modules and their purposes
   - Generate onboarding guide

2. **Architecture Review:**
   - Analyze module dependencies
   - Identify circular dependencies
   - Detect anti-patterns
   - Suggest refactoring opportunities

3. **Technical Debt Assessment:**
   - Find code duplication
   - Identify complex functions
   - Locate TODO/FIXME comments
   - Calculate maintainability score

---

## Power: Intelligence Suite

### Package Structure

```
intelligence-suite/
├── POWER.md                    # User documentation
├── config.json                 # Power metadata
├── mcp.json                    # MCP server config
├── steering/                   # Workflow guides
│   ├── analyze-project.md      # How to analyze projects
│   ├── review-code.md          # Code review workflow
│   └── generate-tests.md       # Test generation guide
└── examples/
    └── sample-analysis.json    # Example outputs
```

### POWER.md Structure

```markdown
# Intelligence Suite Power

AI-powered project intelligence for modern development teams.

## Features
- Project structure analysis
- Automated code review
- Test generation
- Project health metrics

## Installation
1. Install the power
2. Configure MCP server
3. Activate steering workflows

## MCP Tools
- analyze_project_structure
- review_code_file
- generate_tests
- get_project_metrics
- suggest_improvements
- find_similar_code

## Workflows
Use #IntelligenceSuite in Kiro to activate workflow guides

## Configuration
[Configuration details]
```

### Distribution
- Shareable as single package
- Easy installation via Kiro powers UI
- Includes all necessary configuration
- Pre-configured for common use cases

---

## Useful Kiro Hooks

### 1. Code Quality Gate
```json
{
  "version": "v1",
  "hooks": [{
    "name": "Quality Gate Check",
    "trigger": "PreToolUse",
    "matcher": "execute_pwsh.*git commit",
    "action": {
      "type": "command",
      "command": "node scripts/quality-gate.js"
    }
  }]
}
```
**Purpose:** Prevent commits that don't meet quality standards

### 2. Auto Code Review
```json
{
  "version": "v1",
  "hooks": [{
    "name": "Auto Review on Save",
    "trigger": "PostFileSave",
    "matcher": "\\.(ts|tsx|js|jsx)$",
    "action": {
      "type": "command",
      "command": "node scripts/auto-review.js"
    }
  }]
}
```
**Purpose:** Immediate feedback on code changes

### 3. Test Coverage Reminder
```json
{
  "version": "v1",
  "hooks": [{
    "name": "Test Reminder",
    "trigger": "PostFileCreate",
    "matcher": "src/.*\\.(ts|js)$",
    "action": {
      "type": "command",
      "command": "node scripts/check-test-exists.js"
    }
  }]
}
```
**Purpose:** Remind developers to create tests

### 4. Session Intelligence
```json
{
  "version": "v1",
  "hooks": [{
    "name": "Project Health Summary",
    "trigger": "SessionStart",
    "action": {
      "type": "agent",
      "prompt": "Provide a brief project health summary including recent changes, open issues, and key metrics."
    }
  }]
}
```
**Purpose:** Start sessions with project context

---

## Dependencies

### Runtime Dependencies
```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "glob": "^10.3.10",
    "semver": "^7.5.4",
    "fast-check": "^3.15.0",
    "typescript": "^5.3.3"
  }
}
```

### Development Dependencies
```json
{
  "devDependencies": {
    "@types/node": "^20.10.6",
    "@types/jest": "^29.5.11",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "eslint": "^8.56.0",
    "@typescript-eslint/parser": "^6.17.0",
    "@typescript-eslint/eslint-plugin": "^6.17.0",
    "prettier": "^3.1.1"
  }
}
```

### External Tools
- Node.js v18+ (required for MCP)
- Git (for repository analysis)
- TypeScript compiler (for AST parsing)

---

## Risks and Fallback Approaches

### Risk 1: MCP Server Complexity
**Risk:** MCP server development more complex than expected
**Impact:** High - Core demonstration requirement
**Mitigation:**
- Start with minimal 2-tool server
- Use official SDK examples as templates
- Test server independently before Kiro integration
**Fallback:** Implement simple stdio-based server with basic JSON protocol

### Risk 2: Property-Based Test Design
**Risk:** Difficult to identify meaningful properties
**Impact:** Medium - Required for Lesson 4
**Mitigation:**
- Research property-based testing patterns
- Start with obvious properties (idempotency, consistency)
- Review fast-check documentation and examples
**Fallback:** Implement comprehensive example-based tests with property-like assertions

### Risk 3: Custom Agent Configuration
**Risk:** Agent configuration and prompts don't work well
**Impact:** Medium - Required for Lesson 7
**Mitigation:**
- Test agent with various prompts
- Iterate on system prompt design
- Limit agent tool access to prevent issues
**Fallback:** Create simpler agent with focused, well-tested use case

### Risk 4: Time Constraints
**Risk:** Cannot complete all features before deadline
**Impact:** High - Completion requirement
**Mitigation:**
- **Priority 1 (Must have):** MCP server (3 tools), 2 hooks, 1 agent, basic property tests
- **Priority 2 (Should have):** All 4 hooks, complete property tests, power package
- **Priority 3 (Nice to have):** Advanced features, polish, extensive docs
**Fallback:** Focus on demonstrating all 7 lessons minimally rather than polish

### Risk 5: Cross-Platform Compatibility
**Risk:** Windows-specific issues (current environment)
**Impact:** Low - Development environment
**Mitigation:**
- Use Node.js for cross-platform consistency
- Test hooks and commands on Windows
- Avoid platform-specific shell commands
**Fallback:** Document platform requirements, provide Windows-specific scripts

### Risk 6: AST Parsing Complexity
**Risk:** Code analysis more complex than anticipated
**Impact:** Medium - Core feature
**Mitigation:**
- Use existing TypeScript compiler API
- Start with simple metrics (LOC, file count)
- Gradually add sophisticated analysis
**Fallback:** Use regex-based analysis for MVP, note limitation

---

## Success Criteria

### Technical Criteria
- ✅ All 7 Kiro University lessons demonstrated
- ✅ MCP server with minimum 3 working tools
- ✅ At least 2 functional hooks
- ✅ 1 custom agent with clear use case
- ✅ Property-based tests with meaningful properties
- ✅ Spec-driven development with linked specs
- ✅ Steering documents actively used
- ✅ Power package installable and functional

### Quality Criteria
- ✅ Code passes linting (no errors)
- ✅ Test coverage >70%
- ✅ All MCP tools return valid responses
- ✅ Hooks execute without errors
- ✅ Documentation complete and clear
- ✅ Examples work as documented

### Demonstration Criteria
- ✅ Can analyze a real project
- ✅ Can review code with suggestions
- ✅ Can generate basic tests
- ✅ Hooks trigger appropriately
- ✅ Agent completes analysis task
- ✅ Power installs successfully

---

## Timeline

### Week 1: Foundation (Days 1-7)
- Day 1-2: Project setup, dependencies, basic structure
- Day 3-4: Simple MCP server with 2 tools
- Day 5-6: Core analyzer (file scanning, basic metrics)
- Day 7: Unit tests, main spec document

### Week 2: Intelligence (Days 8-14)
- Day 8-9: Code reviewer with basic rules
- Day 10-11: Test generator for simple cases
- Day 12-13: Property-based tests
- Day 14: Feature specs, steering documents

### Week 3: Integration (Days 15-21)
- Day 15-16: All hooks implemented
- Day 17-18: Custom agent configuration
- Day 19-20: Power package creation
- Day 21: Integration testing

### Week 4: Polish (Days 22-28)
- Day 22-23: Complete MCP server tools
- Day 24-25: Documentation and examples
- Day 26-27: Bug fixes and refinement
- Day 28: Final testing and demo prep

---

## Next Steps

1. **Review and approve this plan**
2. **Create detailed specifications** in `.kiro/specs/`
3. **Set up project structure** (folders, package.json, configs)
4. **Begin Phase 1 implementation** (Core Infrastructure)

---

## Appendix: Key Design Decisions

### Why TypeScript?
- Strong typing for MCP server development
- Excellent IDE support in Kiro
- Large ecosystem for tooling
- AST parsing readily available

### Why Node.js for MCP?
- MCP SDK officially supports Node.js
- Cross-platform compatibility
- Fast development iteration
- Easy integration with existing tools

### Why fast-check?
- Industry-standard property-based testing for JavaScript/TypeScript
- Good documentation and examples
- Active maintenance
- Integrates well with Jest

### Why Simple MVP?
- Ensures completion before deadline
- Allows focus on demonstrating all 7 lessons
- Reduces technical risk
- Provides foundation for future enhancement

### Why Focus on TypeScript/JavaScript?
- Most common in web development
- Kiro IDE has excellent TypeScript support
- AST tools readily available
- Team likely familiar with ecosystem

---

## Conclusion

This plan provides a realistic path to building a production-quality "Kiro Project Intelligence Assistant" that meaningfully demonstrates all 7 Kiro University 2026 requirements. The phased approach ensures we can deliver a working system while managing risks and time constraints.

The MVP focuses on core value (project analysis, code review, test generation) while ensuring each Kiro University lesson is properly demonstrated through practical, useful features rather than contrived examples.

**Ready to proceed with spec creation and implementation.**
