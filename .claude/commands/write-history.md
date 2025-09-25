# Write History Command

Generate a comprehensive change history document for: $ARGUMENTS

## Task Instructions:

1. **Investigate Git History**:
   - Use `git log --oneline --follow $ARGUMENTS` to get complete commit history
   - Get detailed commit information with `git show --stat` for major changes
   - Analyze actual code changes with `git show` for significant commits

2. **Create Timeline Document**:
   - Generate `docs/[COMPONENT_NAME]_HISTORY.md` file
   - Use chronological timeline format (newest first)
   - Include commit hash, date, and detailed change description for each major modification

3. **Document Structure**:

```markdown
# [ComponentName] Change History

**File Location:** `path/to/file`

This document tracks all major changes and milestones for [ComponentName] to help identify potential regressions and understand the evolution of the codebase.

---

## Timeline of Major Changes

### 📅 **[Date]** - `[commit-hash]`
**[Change Title]**
- **Change**: [Description of what changed]
- **Files Modified**: [number] insertions, [number] deletions
- **Impact**: [Risk Level Icon] **[Impact Type]**: [Impact description]
- **Key Changes** (if applicable):
  - [Bullet point 1]
  - [Bullet point 2]
- **Investigation**: [What to check for regressions]

---

## Regression Testing Checklist

When making changes to [ComponentName], verify:
- [ ] [Critical functionality 1]
- [ ] [Critical functionality 2]
- [ ] [etc...]

---

## Critical Dependencies
- [List of key dependencies and integration points]
```

## Requirements:

- **Risk Assessment**: Use icons to indicate regression risk:
  - 🚨 **HIGH REGRESSION RISK**: Major refactoring/architecture changes
  - ⚠️ **Regression Risk**: Breaking changes or significant modifications
  - 🐛 **Bug Fix**: Issue resolution
  - 🔧 **Enhancement**: Performance/UX improvements
  - 🎯 **MILESTONE**: Major feature completion
  - 🏗️ **ARCHITECTURE**: Structural changes
  - 📦 **Module**: Reorganization/refactoring
  - 🎨 **UI**: Styling/visual changes

- **Milestones**: Mark major architectural changes with ⭐

- **Investigation Notes**: For each risky change, specify what team members should test

- **Comprehensive Coverage**: Include ALL commits that modified the target file

- **Regression Focus**: Emphasize potential regression points and testing strategies

- **Dependencies**: List critical integrations that could break

## Output:
- Create markdown file in `docs/` directory with `[COMPONENT_NAME]_HISTORY.md` naming convention
- Focus on regression prevention and change tracking for team collaboration
- Include actionable testing checklist for future modifications