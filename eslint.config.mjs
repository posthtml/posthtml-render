import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {ignores: ['dist/**', 'coverage/**', 'artifacts/**']},
  js.configs.recommended,
  ...tseslint.configs.recommended.map(config => ({...config, files: ['**/*.ts']})),
  {files: ['**/*.cjs'], rules: {indent: ['error', 2]}},
  {languageOptions: {globals: globals.node}},
];
