import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // JavaScript
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    extends: ["eslint:recommended"],
  },

  // TypeScript
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    extends: ["plugin:@typescript-eslint/recommended"],
    rules: {
      // optional TS-specific rule overrides
    },
  },

  // React
  {
    files: ["**/*.{jsx,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    extends: ["plugin:react/recommended"],
    settings: {
      react: {
        version: "detect",
      },
    },
  },
]);