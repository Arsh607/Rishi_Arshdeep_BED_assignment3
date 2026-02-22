import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  js.configs.recommended,

  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      // Allow console in backend
      "no-console": "off",

      // Disable base rule (handled by TS)
      "no-unused-vars": "off",

      // TS version of unused vars
      "@typescript-eslint/no-unused-vars": ["warn"],

      // Warn on any (not error for now)
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  {
    ignores: ["dist", "node_modules", "coverage"],
  },
];