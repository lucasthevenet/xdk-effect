# Releasing xdk-effect

## One-time setup

- Push the repository to `lucasthevenet/xdk-effect` on GitHub. Keep the package's repository metadata in sync with its public location so npm provenance can be verified.
- Configure an npm trusted publisher for `xdk-effect`: owner `lucasthevenet`, repository `xdk-effect`, workflow filename `release.yml`. Allow direct publishing. The workflow uses GitHub-hosted runners and Node 24 for OIDC authentication.
- For the first publication, or if trusted publishing is not configured, set the repository's `NPM_TOKEN` Actions secret to an npm granular token with permission to publish this package and bypass 2FA. The workflow supports this fallback; remove it once trusted publishing works. A new package may need its first publication before its npm trusted-publisher settings are available.
- For the spec watcher, enable **Allow GitHub Actions to create and approve pull requests** in repository Settings → Actions → General. The watcher only creates/updates review PRs; it never approves, merges, or publishes them.

See [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) for the npm-side configuration.

## Publish a version

1. Update `version` in `packages/xdk-effect/package.json` and run `bun install --lockfile-only` to refresh workspace metadata.
2. Run `bun run release:validate`. This runs generation checks, formatting, lint, typechecking, tests, and a build, then validates the npm package contents. To also check the intended release tag, run `RELEASE_VERSION=v0.1.0 bun run release:validate` (substitute your version).
3. Commit and push the changes, and wait for CI to pass.
4. Publish a GitHub Release with a matching tag, such as `v0.1.0`, pointing at that commit. A draft does not publish to npm; publishing the GitHub Release starts `.github/workflows/release.yml`.

The release workflow repeats validation and publishes only `packages/xdk-effect`, with provenance. A mismatched tag fails before publishing. GitHub prereleases and versions with a prerelease suffix publish to npm's `next` tag; stable releases publish to `latest`. Every npm release needs a new version.

There is no live API test job: this repository currently has only offline/mock-based tests. CI and release validation do not need X credentials or deploy the Worker example.

## Upstream spec updates

The X API watcher runs Tuesdays at 06:43 UTC and can also be started manually. It fetches the latest upstream OpenAPI snapshot and opens or refreshes `codex/x-api-update` only when the spec itself changes. Revision-only changes do not open PRs.

The branch is bot-owned and may be replaced on a later run. Review the snapshot and any affected patches, then run `bun run generate` and `bun run release:validate`. Commit the generated changes before merging; the watcher intentionally does not regenerate or publish the SDK. GitHub suppresses automatic PR workflow runs for changes pushed with `GITHUB_TOKEN`, so push the reviewed changes with your own account to trigger CI. Use a separate branch if you need to keep work across watcher runs.
