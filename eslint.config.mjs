import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Sanity Studio build output: bundled megabyte-scale files crash the
    // ESLint "stylish" formatter (RangeError in text-table), taking the
    // whole lint run down with them.
    "dist/**",
  ]),
]);

export default eslintConfig;
