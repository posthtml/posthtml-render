# Contributing

## Development

Use Node.js 24, selected by `.nvmrc`:

```sh
nvm install
nvm use
npm ci
npm run check
```

`check` builds with TypeScript, runs ESLint, checks current and minimum
TypeScript consumers, runs the full suite with coverage, and verifies CommonJS
and native ESM loading. `prepublishOnly` runs the same checks before publication.

- `npm test` rebuilds and runs the suite with coverage.
- `npm run test:unit` tests the existing build with `node:test`.
- `npm run dev` watches TypeScript sources.
- `npm run typecheck:minimum` checks TypeScript 4.3.5 consumers.

Development tools require modern Node.js; the published renderer still supports
Node.js 12 and newer. The parser 0.9 development dependency supplies a round-trip
fixture that also works on the oldest runtime. Current parser integration is
checked through PostHTML's packed-package suite.

## Installed-package checks

After `npm run check`, pack the built output and test it:

```sh
mkdir -p artifacts
npm pack --ignore-scripts --pack-destination artifacts
npm run test:packed -- artifacts/posthtml-render-3.0.0.tgz
```

Use the actual version in the tarball path. `test:packed` installs the production
package in an isolated consumer, runs the complete shared synchronous suite and
CJS/ESM consumers, then compiles standalone TypeScript consumers. Pass
`--node /path/to/node` to run the JavaScript checks with another runtime while
npm and TypeScript remain on Node.js 24. Failed fixtures are preserved for
debugging; `POSTHTML_TEST_TMP` selects their temporary parent directory.

CI builds one tarball on Node.js 24 and tests that artifact on Node.js 12.0,
12/14/16/18/20/22/24/26. Native ESM checks use the historical experimental flag on
Node.js versions before 12.17. Coverage reports are workflow artifacts.

For coordinated changes, follow `AGENTS.md` and run the core packed tests with
`--render /path/to/posthtml-render-<version>.tgz`.

## Changes and pull requests

- Keep commits focused, with short imperative subjects. Prefixes such as `fix:`,
  `docs:` and `build:` are optional.
- Include exact-output regression tests for changes to rendering behavior.
- Keep coverage at 100% statements/functions/lines and at least 95% branches.
- Check public declarations against TypeScript 4.3.5 and the current compiler.
- Commit `package-lock.json` with dependency changes. Keep generated `dist/`,
  coverage reports, tarballs and temporary consumers out of commits.
- Add user-visible notes to `Unreleased` in `changelog.md`, preserving history.
- Describe verification in the pull request. Checks run in CI and before npm
  publication; no local Git hooks are installed.

## Releases

1. Prepare a release pull request. Update the version and lockfile with
   `npm version <version> --no-git-tag-version`.
2. Turn `Unreleased` into a dated version entry and start a new `Unreleased`
   section above it. Maintain the changelog by hand.
3. Run `npm run check`, test the tarball and validate it in PostHTML.
4. Merge the release pull request after its checks pass. Tag the tested master
   commit as `v<version>` and publish that checkout with `npm publish`.
5. Verify the npm version/dist-tag and a fresh registry install before updating
   the renderer dependency range in core.

Publishing and pushing release tags require an explicit maintainer request.
