# Release Workflow Design

## Goal
Pushing a tag auto-creates a GitHub release with auto-generated compare notes.

## Design
- New file `.github/workflows/release.yml`
- Trigger: `push` on tags matching `v*`
- Permissions: `contents: write`
- Steps: checkout, then `gh release create "$TAG" --generate-notes --title "$TAG"`
  - `gh` CLI preinstalled on ubuntu runners; `--generate-notes` diffs against previous tag
  - No third-party action dependency
- Existing release for same tag: job fails (no overwrite)

## Out of scope
- VS Code marketplace publish
- CHANGELOG.md sync (notes come from git history)
- Prerelease marking
