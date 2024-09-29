import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  files: ["**/*.ts"],
  extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
  rules: {
    "no-console":
      "error" /* while pushing to github there shouldn't be any console log statements */,
    quotes: ["error", "single", { allowTemplateLiterals: true }],
  },
});
