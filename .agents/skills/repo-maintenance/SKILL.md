---
name: repo-maintenance
description: Remove stale artifacts and align all agents and skills with the current codebase. Use when the user wants to clean up dead code, update agent/skill documentation, or perform a full repo hygiene pass.
---

# Objective

Remove stale artifacts and align all agents and skills with the current codebase.

# Process

## Phase 1: Dead Code Detection

Scan the codebase and identify:
- Unused imports and exports
- Unused files (JS, HTML, CSS, specs with no matching test)
- Unreachable routes or dead branches
- Duplicate implementations (same logic in multiple places)
- Orphaned assets (files not referenced anywhere)

Present findings as a list before taking action. Do NOT delete without confirmation.

## Phase 2: Safe Removal

For each confirmed removal:
- Verify non-usage via grep/references before deletion
- Update any remaining references
- Maintain build integrity (run build after each batch of changes)

## Phase 3: Agent & Skills Review

Review all files in `.agents/`, `.kiro/`, `.claude/`:
- Agent configuration files
- Skill definitions (SKILL.md files)
- Prompts and workflows

For each, check:
- Are instructions still accurate for the current codebase?
- Are there references to files, functions, or patterns that no longer exist?
- Is there missing guidance for new features that have been added?
- Does documentation match current implementation?

Update or flag issues. Present changes before applying.

## Phase 4: Validation

After all changes:
- Run tests (`npm test` or project-specific command)
- Run linting if configured
- Validate build succeeds
- Confirm no broken imports or routes

## Acceptance Criteria

- No broken imports
- No broken routes
- No failing tests introduced
- Agent documentation matches implementation
- Skills accurately describe current workflows

# Deliverables

At the end of the process, produce a summary with these sections:

1. **Cleanup report** — what was scanned, what was found
2. **Deleted files report** — what was removed and why
3. **Updated agents report** — what agent/skill files were modified
4. **Updated skills report** — what skill definitions were changed
5. **Remaining technical debt** — known issues that were not addressed and why
