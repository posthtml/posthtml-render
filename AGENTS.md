# Working on posthtml-render

## Scope and workspace

This repository serializes PostHTML trees. Read `package.json`, `readme.md`, `src/index.ts` and the existing tests before making behavior changes. Inspect Git status and preserve existing work.

For cross-package changes, also read `../posthtml/AGENTS.md` when available, or `https://github.com/posthtml/posthtml/blob/master/AGENTS.md`. The core, parser and renderer are separate Git repositories; do not mix their changes or releases.

## Current toolchain

This package still uses its legacy AVA/XO/clinton and tsup toolchain. Its existing CI matrix is Node.js 12/14/16, with a published runtime minimum of Node.js 12. Use the existing CI environment to reproduce baseline toolchain failures; do not assume the modern core/parser scripts exist here.

Commands from this repository's manifest:

```sh
npm ci
npm run build
npm test
```

`prepare` builds on install. `npm test` first runs the `pretest` clinton command, then XO and the AVA suite with coverage. Record pre-existing install/lint/test failures separately from a renderer behavior regression. Modernizing these tools is a separate scoped change and must not silently change the public runtime minimum.

The current baseline has a Clinton `pkg-schema` failure resolving external SchemaStore references, reproduced on unmodified master `47e750b` with Node.js 12. This blocks the later functional checks. Keep that tooling failure distinct from changes to rendering behavior; do not disable the schema rule merely to hide it. The conventional uppercase `AGENTS.md` filename is exempted through Clinton's file ignore list.

## Files and contracts

- `src/index.ts`: serializer, quoting, attribute rules, void tags and option enums.
- `test/test-core.spec.ts` and `test/templates`: exact output expectations.
- `ava.config.js`, `xo.config.js`, `.c8rc`: current test/lint/coverage configuration.
- Built JavaScript and declarations are generated into ignored `dist/`.

Preserve raw text/comment/directive strings, numeric content, nested arrays, boolean attributes, `tag: false` unwrapping and all single-tag closing modes. The renderer currently normalizes some node content in place; test observable behavior before changing this.

Quoting is a public contract: check quote styles, embedded quotes, JSON-valued attributes and unquoted values. `is-json` has specific object/array recognition semantics; a generic `JSON.parse` success check is not automatically equivalent. Compare exact rendered HTML when changing this path.

Custom single-tag string names are matched against a lowercased tag name. Test mixed-case SVG/XML and RegExp tags explicitly when changing single-tag logic.

## Types, integration and releases

Parser is currently a development dependency used for AST declarations, not a runtime parser dependency. Preserve that distinction. Updating to newer parser declarations may require a newer development compiler without requiring a higher renderer runtime minimum; verify the emitted JavaScript and actual runtime dependencies.

For a behavior change, run renderer tests, build the package, then `npm pack --ignore-scripts`. From core, run `npm run test:packed -- <core.tgz> --render <render.tgz>` and add `--parser <parser.tgz>` for coordinated AST changes. Test parser-to-renderer round trips and all core processing modes with actual tarballs rather than `npm link`.

Keep runtime compatibility explicit and test the supported minimum. Review `.d.ts` compatibility against the parser version consumed by core. A documentation-only change needs no npm release. When a renderer release is requested, release it before updating the core range, and verify the published package and tag before reporting completion.
