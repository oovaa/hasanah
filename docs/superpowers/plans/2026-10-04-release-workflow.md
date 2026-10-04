# Release Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Auto-create a GitHub release with auto-generated compare notes when a `v*` tag is pushed.

**Architecture:** One workflow file triggering on tag pushes; uses preinstalled `gh` CLI with `--generate-notes` (no third-party actions).

**Tech Stack:** GitHub Actions, gh CLI.

---

### Task 1: Create release workflow

**Files:**
- Create: `.github/workflows/release.yml`

- [ ] **Step 1: Write the workflow**

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

permissions:
  contents: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Create release
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: gh release create "${GITHUB_REF_NAME}" --generate-notes --title "${GITHUB_REF_NAME}"
```

- [ ] **Step 2: Validate YAML parses**

Run: `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/release.yml'))"`
Expected: no output, exit 0

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/release.yml
git commit -m "ci: auto-create release with generated notes on v* tag push"
```

### Task 2: Verify on GitHub

- [ ] **Step 1: Push** (ask user first — do not push without consent)

Run: `git push origin master`

- [ ] **Step 2: Test with a tag**

```bash
git tag v10.0.6-test && git push origin v10.0.6-test
```
Expected: Actions run "Release" workflow, release appears with auto notes. Delete test release/tag after.
