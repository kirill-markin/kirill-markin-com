import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**"
    ]
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs"],
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off"
    }
  },
  // Allow console.log in scripts and tests
  {
    files: ["scripts/**/*.ts", "scripts/**/*.js", "src/__tests__/**/*.ts", "src/__tests__/**/*.js"],
    rules: {
      "no-console": "off"
    }
  }
];

export default eslintConfig;
