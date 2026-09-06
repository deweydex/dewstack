/* Builds assets/vendor/codemirror.bundle.js from the pinned packages in
 * package.json. The output is committed, on dewlab's reasoning
 * (deweydex/dewlab, vendor-src/build-vendor.mjs): GitHub Actions runs
 * build.py and nothing else, and an author previewing locally should not
 * need a Node toolchain either. Re-run `npm run build` only when a pin
 * here or codemirror-entry.js changes; CI rebuilds and fails if the
 * committed copy differs.
 *
 * One bundle, three language modes, and nothing else: the workspace page
 * is the only page that loads it (planning/CONSOLE_AND_WORKSPACE.md,
 * section 7, decided 2026-09-06). Tutorial pages keep their textareas.
 */
import { build } from "esbuild";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "assets", "vendor");

await mkdir(outDir, { recursive: true });

await build({
  entryPoints: [join(here, "codemirror-entry.js")],
  outfile: join(outDir, "codemirror.bundle.js"),
  bundle: true,
  format: "esm",
  minify: true,
  sourcemap: false,
  target: ["es2020"],
  legalComments: "none",
});

console.log("vendor/ rebuilt: codemirror.bundle.js");
