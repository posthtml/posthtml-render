# Working on posthtml-render

## Scope and workspace

This repository serializes PostHTML trees. Read `package.json`, `readme.md`, `src/index.ts` and the existing tests before making behavior changes. Inspect Git status and preserve existing work.

For cross-package changes, also read `../posthtml/AGENTS.md` when available, or `https://github.com/posthtml/posthtml/blob/master/AGENTS.md`. The core, parser and renderer are separate Git repositories; do not mix their changes or releases.

## Commands and toolchain

Read `.github/CONTRIBUTING.md`. Use Node.js 24 from `.nvmrc` for development. The published runtime minimum remains Node.js 12; development tools do not set it.

```sh
nvm use
npm ci
npm run check
```

`check` builds with `tsc`, lints, checks current/minimum TypeScript consumers, runs the suite with coverage, and tests CommonJS/native ESM loading. `npm test` rebuilds and collects coverage; `test:unit` uses the existing build. `prepare` builds on install, and `prepublishOnly` runs `check`.

CI packs one checked build, then runs the complete synchronous suite against isolated production installs on Node.js 12.0/12/14/16/18/20/22/24/26. `npm run test:packed -- <renderer.tgz> --node /path/to/node` keeps npm and TypeScript on the development runtime while executing all JavaScript checks on the selected consumer runtime. Do not replace the full suite with an import smoke test.

## Files and contracts

- `src/index.ts`: serializer, quoting, attribute rules, void tags and option enums.
- `test/suite.cjs` and `test/templates`: shared exact-output expectations.
- `test/core.test.cjs`: native test registration; `test/installed.cjs`: synchronous execution on legacy runtimes.
- `test/package.cjs`, `test/package.mjs`, `test/packed.cjs`: CJS/ESM and installed-package checks.
- `test/types`: standalone CJS/ESM declarations and minimum TypeScript consumers.
- `eslint.config.mjs`, `.c8rc`: lint and coverage configuration. Preserve 100% statements/functions/lines and at least 95% branches.
- Built JavaScript and declarations are generated into ignored `dist/`.

Preserve raw text/comment/directive strings, numeric content, nested arrays, boolean attributes, `tag: false` unwrapping and all single-tag closing modes. The renderer currently normalizes some node content in place; test observable behavior before changing this.

Quoting is a public contract: check quote styles, embedded quotes, JSON-valued attributes and unquoted values. `is-json` has specific object/array recognition semantics; a generic `JSON.parse` success check is not automatically equivalent. Compare exact rendered HTML when changing this path.

Custom single-tag string names are matched against a lowercased tag name. Test mixed-case SVG/XML and RegExp tags explicitly when changing single-tag logic.

## Types, integration and releases

Parser is a development-only round-trip fixture dependency. Version 0.9 is retained so that the same suite runs on Node.js 12; current parser integration is checked through core. Public renderer declarations use structural AST types and must compile in a standalone production consumer without parser installed. Keep those shapes compatible with current parser output; do not introduce a parser runtime dependency.

After checks, build and pack with `npm pack --ignore-scripts --pack-destination artifacts`, then run the renderer's `test:packed`. From core, run `npm run test:packed -- <core.tgz> --render <render.tgz>` and add `--parser <parser.tgz>` for coordinated AST changes. Test parser-to-renderer round trips and all core processing modes with actual tarballs rather than `npm link`.

Keep runtime compatibility explicit and test the supported minimum. Check declarations on TypeScript 4.3.5 and the current compiler, as well as with the parser version consumed by core. A documentation-only change needs no npm release. Maintain `Unreleased` notes by hand. When a renderer release is requested, follow `.github/CONTRIBUTING.md`, release it before updating the core range, and verify the published package and tag before reporting completion.
