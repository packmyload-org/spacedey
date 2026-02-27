# Lint Debt Plan (Phase 1 Scope)

## Objective
Reduce lint debt incrementally without destabilizing delivery, starting with recently touched auth-related files and expanding by risk-managed phases.

## Scope for Phase 1 (`chore/lint-debt-phase-1`)
Focus only on recently touched auth surfaces:

- `app/api/auth/**`
- `app/auth/**`
- `components/auth/**`

### Phase 1 actions
- Fix low-risk lint issues only (unused vars, explicit `any` replacements where straightforward, import/order tidy-ups).
- Avoid behavior-changing refactors.
- Keep changes reviewable and isolated.

## Proposed Phased Rollout

### Phase 1 (this PR)
- Auth API routes/pages/components only.
- Safe mechanical cleanup.
- Document CI strategy for changed-file linting.

### Phase 2
- Recently touched shared UI components (`components/ui`, `components/layout`) with low-risk fixes.
- Add targeted suppressions only when a safer refactor is deferred.

### Phase 3
- Higher-risk hook/lifecycle issues (`react-hooks/*`) that may require behavior-aware refactors.
- Pair refactors with focused test coverage.

### Phase 4
- Expand to full-repo lint baseline reduction.
- Remove temporary suppressions and enforce stricter rules where feasible.

## CI Strategy (Feature PRs)
Use **changed-file linting** in PR CI so new work does not increase debt while legacy areas are cleaned incrementally.

### Recommended workflow
1. Determine changed files vs base branch (e.g. `origin/main`).
2. Filter to `*.ts, *.tsx, *.js, *.jsx`.
3. Run ESLint only on changed files.
4. Keep a separate scheduled/full lint job (nightly or on `main`) to track global debt.

### Example CI script
```bash
BASE_REF="origin/main"
CHANGED_FILES=$(git diff --name-only --diff-filter=ACMRT "$BASE_REF"...HEAD \
  | grep -E '\.(ts|tsx|js|jsx)$' || true)

if [ -n "$CHANGED_FILES" ]; then
  pnpm eslint $CHANGED_FILES
else
  echo "No JS/TS files changed; skipping eslint."
fi
```

## Exit Criteria for Phase 1
- Auth-scope files lint clean under current config.
- `lint`, `test`, and `build` run as part of PR validation.
- PR opened with follow-up phases clearly listed.

## Remaining Debt (after Phase 1)
- Non-auth components and layout files still carrying lint issues.
- Hook/lifecycle refactors requiring behavior validation.
- Potential repo-wide rule tuning after debt drops.
