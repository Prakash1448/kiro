# Demo Script - Kiro Project Intelligence Assistant

**Duration**: 60-120 seconds  
**Audience**: Kiro University 2026 Judges  
**Goal**: Demonstrate all 7 Kiro University lessons in action

---

## Pre-Demo Setup (Done Before Presentation)

```bash
# 1. Install dependencies
npm install

# 2. Build project
npm run build

# 3. Verify sample project exists
ls sample-project/
```

---

## Demo Script

### Introduction (10 seconds)

> "I've built the **Kiro Project Intelligence Assistant** - an AI-powered tool that analyzes codebases, reviews quality, and provides actionable insights. It demonstrates **all 7 Kiro University capabilities**."

---

### Part 1: Spec-Driven Development (15 seconds)

**Show**: `.kiro/specs/project-intelligence/`

> "**Lesson 1: Spec-driven development**. I created comprehensive specifications that guided the entire implementation."

```bash
# Show specifications
ls .kiro/specs/project-intelligence/
```

**Point out**:
- `main-spec.md` - Overall requirements and architecture
- `analyzer-spec.md`, `reviewer-spec.md`, `test-generator-spec.md` - Module specs
- Each spec defines requirements, implementation strategy, and test cases

---

### Part 2: Steering Documents (15 seconds)

**Show**: `.kiro/steering/`

> "**Lesson 2: Steering documents**. These auto-included documents guided all development decisions."

```bash
# Show steering files
ls .kiro/steering/
```

**Point out**:
- `product.md` - Product vision and MVP scope
- `architecture.md` - System design and data flow
- `coding-standards.md` - TypeScript conventions and best practices

---

### Part 3: Working CLI Analysis (20 seconds)

**Show**: Live analysis of sample project

> "Let me analyze our sample project that has intentional code quality issues."

```bash
npm run analyze -- ./sample-project
```

**Expected output shows**:
- ✅ Project structure (6 files, 3 source, 1 test)
- ✅ Health score: ~58/100 (Fair)
- ✅ Issues found: 1 error, 6 warnings, 2 info
- ✅ Recommendations: Add tests, remove debug statements, fix TODOs

**Say**:
> "The tool found debug statements, TODO comments, an empty catch block, and low test coverage - all real issues in the sample code."

---

### Part 4: Property-Based Testing (15 seconds)

**Show**: Test execution

> "**Lesson 4: Property-based testing** with fast-check validates critical invariants."

```bash
npm run test:property
```

**Point out** (if tests run):
- Tests for analyzer, reviewer, test-generator, and metrics
- Properties validated: idempotency, consistency, validity, bounds
- Hundreds of random inputs tested automatically

**Fallback** (if npm not available):
```bash
# Show property test files
ls tests/property/
```

> "I created comprehensive property-based tests that validate invariants like 'file counts are never negative' and 'analyzing twice gives identical results' across hundreds of generated inputs."

---

### Part 5: Hooks (10 seconds)

**Show**: `.kiro/hooks/`

> "**Lesson 3: Hooks** automate quality checks in my workflow."

```bash
# Show hooks
ls .kiro/hooks/
```

**Point out**:
- `test-on-save.json` - Auto-runs tests when saving source files
- `pre-commit-reminder.json` - Quality check before git commits
- `test-file-reminder.json` - Reminds to create tests for new files
- `session-intelligence.json` - Welcome message with project context
- `kironomics.json` - Preserved existing Kironomics tracking

---

### Part 6: MCP Server (15 seconds)

**Show**: `mcp/server/index.ts`

> "**Lesson 6: MCP integration**. I built an MCP server with 5 tools."

```bash
# Show MCP server
cat mcp/server/index.ts | head -20
```

**List the 5 tools**:
1. `analyze_project` - Project structure analysis
2. `review_file` - Code quality review
3. `generate_tests` - Test case suggestions
4. `project_metrics` - Health metrics
5. `project_report` - Complete intelligence report

**Show configuration**:
> "Configuration instructions are in the Power documentation for easy setup."

---

### Part 7: Intelligence Suite Power (10 seconds)

**Show**: `powers/intelligence-suite/POWER.md`

> "**Lesson 5: Powers**. The Intelligence Suite packages everything as a reusable power."

```bash
# Show Power structure
ls powers/intelligence-suite/
```

**Point out**:
- `POWER.md` - Comprehensive documentation (installation, usage, workflows)
- `workflows/` - Step-by-step workflow guides
- Packages MCP server, hooks, steering docs, and agent

---

### Part 8: Custom Agent (10 seconds)

**Show**: `docs/CUSTOM_AGENT_GUIDE.md`

> "**Lesson 7: Custom agent**. The Project Intelligence Agent specializes in repository analysis."

```bash
# Show agent guide
head -30 docs/CUSTOM_AGENT_GUIDE.md
```

**Explain**:
- Agent uses all 5 MCP tools
- Generates structured intelligence reports
- Provides prioritized recommendations
- Complete setup instructions included

---

### Conclusion (10 seconds)

> "Summary: I've demonstrated all 7 Kiro University lessons with a production-quality tool that actually works."

**Quick recap**:
1. ✅ Spec-driven development - Detailed specifications
2. ✅ Steering documents - Auto-included guidelines
3. ✅ Hooks - Automated quality checks
4. ✅ Property-based testing - Invariant validation with fast-check
5. ✅ Powers - Intelligence Suite package
6. ✅ MCP - 5 tools and 3 resources
7. ✅ Custom agents - Project Intelligence Agent

> "The project is fully functional, tested, and documented. Thank you!"

---

## Alternative Flow (If Time Allows)

### Show JSON Output

```bash
npm run analyze -- ./sample-project --json | head -50
```

Shows structured JSON with all analysis data.

### Show Specific MCP Tool Schema

```bash
# Show MCP tools defined in server
grep -A 5 "name: 'analyze_project'" mcp/server/index.ts
```

### Show Property Test in Detail

```bash
# Show one property test
cat tests/property/metrics.property.test.ts | head -40
```

---

## Talking Points

### Why This Project Matters

- **Real utility**: Actually analyzes code and finds real issues
- **Complete implementation**: Not just documentation - it works
- **Production quality**: Error handling, testing, documentation
- **Demonstrates all 7 lessons**: Each lesson is real and functional

### Technical Highlights

- TypeScript with strict typing throughout
- Property-based testing with 100+ test cases per module
- Modular architecture (analyzer, reviewer, test-gen, metrics)
- Real MCP server with 5 functional tools
- Comprehensive documentation at every level

### Unique Features

- **Health scoring algorithm**: Weighs multiple factors for project quality
- **Intentional sample project**: Has real issues for demonstration
- **Test suggestion engine**: Generates happy-path, edge-case, and error-case tests
- **Four automation hooks**: Actually automate development workflow

---

## Backup Demos (If Issues Occur)

### If npm/build not working:

**Show the code structure**:
```bash
# Show complete project structure
tree -L 2 -I 'node_modules|dist'

# Show source files
ls src/*/*.ts

# Show test files
ls tests/*/*.ts
```

### If analysis fails:

**Show the code that does analysis**:
```bash
cat src/analyzer/index.ts | head -50
cat src/reviewer/index.ts | head -30
```

### Show sample project issues:

```bash
# Show file with issues
cat sample-project/src/utils/calculator.ts
```

Point out:
- Line 5: `console.log()` - debug statement
- Line 11: `// TODO:` - technical debt
- Line 15-55: Long function - maintainability issue
- Line 59-63: Empty catch block - error handling issue

---

## Q&A Preparation

**Q: Did you really implement all 7 lessons?**
A: Yes. Each lesson has real, functional implementations. I can show any of them in detail.

**Q: How does property-based testing work here?**
A: I use fast-check to generate hundreds of random inputs and validate invariants like "file counts are never negative" and "analyzing twice gives same results."

**Q: Is the MCP server functional?**
A: Yes. It has 5 tools that call the actual core modules. Configuration instructions included.

**Q: What makes this production-quality?**
A: Error handling throughout, comprehensive tests (property-based + unit), strict TypeScript types, modular architecture, full documentation.

**Q: Can I actually use this on my projects?**
A: Absolutely! Run `npm run analyze -- <your-project-path>` and you'll get a real intelligence report.

**Q: Why is the sample project health score low?**
A: Intentionally! It has debug statements, TODOs, an empty catch block, a long function, and low test coverage to demonstrate the analyzer finds real issues.

---

## Visual Aids (If Screen Sharing)

1. **Start**: Show full project tree
2. **Specs**: Open one spec file to show detail
3. **Analysis**: Run live analysis, show output
4. **Tests**: Show property test file
5. **Hooks**: Open one hook JSON to show structure
6. **MCP**: Show tool definitions in server
7. **Power**: Show POWER.md table of contents
8. **End**: Show README with all 7 lessons checked off

---

## Success Metrics

Demo is successful if judges see:
- ✅ All 7 lessons clearly demonstrated
- ✅ Working CLI that produces real output
- ✅ Code is professional and well-structured
- ✅ Documentation is comprehensive
- ✅ Project actually functions (not just docs)

**Total estimated time: 60-120 seconds for full demo**

---

## Post-Demo

**Where to find everything**:
- Repository: https://github.com/Prakash1448/kiro
- README: Complete documentation with all 7 lessons
- DEMO: This file
- Specs: `.kiro/specs/`
- Steering: `.kiro/steering/`
- Hooks: `.kiro/hooks/`
- Tests: `tests/property/`
- Power: `powers/intelligence-suite/`
- Agent: `docs/CUSTOM_AGENT_GUIDE.md`

**Commands to remember**:
```bash
npm run analyze -- <path>          # Run analysis
npm test                            # Run all tests
npm run test:property               # Property-based tests
ls .kiro/                          # Show Kiro config
```
