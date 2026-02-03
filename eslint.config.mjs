// @ts-check
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import unicorn from "eslint-plugin-unicorn";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(
	{
		ignores: [
			"tools/**",
			"node_modules/**",
			"scripts_files/**",
			"standard.d.ts",
			"octarine-core.d.ts",
			"eslint.config.mjs",
		],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: __dirname,
			},
			globals: {
				// ES6
				Promise: "readonly",
				Symbol: "readonly",
				Map: "readonly",
				Set: "readonly",
				WeakMap: "readonly",
				WeakSet: "readonly",
				Proxy: "readonly",
				Reflect: "readonly",
			},
		},
		plugins: {
			"@typescript-eslint": tseslint.plugin,
			import: importPlugin,
			unicorn,
			"simple-import-sort": simpleImportSort,
			"unused-imports": unusedImports,
			prettier: prettierPlugin,
		},
		rules: {
			// Отключаем правила, которых не было в старом конфиге (совместимость при миграции)
			"no-undef": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"no-constant-binary-expression": "off",
			"@typescript-eslint/no-duplicate-enum-values": "off",
			"no-case-declarations": "off",
			"no-useless-escape": "off",
			"@typescript-eslint/ban-ts-comment": "off",

			// TypeScript ESLint
			"@typescript-eslint/adjacent-overload-signatures": "error",
			"@typescript-eslint/array-type": ["error", { default: "array" }],
			"@typescript-eslint/await-thenable": "error",
			"@typescript-eslint/consistent-type-assertions": "error",
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{ prefer: "no-type-imports" },
			],
			"@typescript-eslint/dot-notation": "error",
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/explicit-member-accessibility": [
				"error",
				{
					accessibility: "explicit",
					overrides: { constructors: "no-public" },
				},
			],
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/member-delimiter-style": [
				"off",
				{
					multiline: { delimiter: "none", requireLast: true },
					singleline: { delimiter: "semi", requireLast: false },
				},
			],
			"@typescript-eslint/naming-convention": [
				"error",
				{
					selector: "default",
					format: ["camelCase", "PascalCase"],
					leadingUnderscore: "forbid",
					trailingUnderscore: "allow",
				},
				{
					selector: ["variable", "function"],
					format: ["camelCase", "PascalCase"],
					modifiers: ["exported", "global"],
					leadingUnderscore: "forbid",
					trailingUnderscore: "forbid",
				},
				{
					selector: "variable",
					format: ["UPPER_CASE", "camelCase", "PascalCase"],
					modifiers: ["const"],
					leadingUnderscore: "forbid",
					trailingUnderscore: "forbid",
				},
				{
					selector: "classProperty",
					format: ["UPPER_CASE", "camelCase", "PascalCase"],
					modifiers: ["readonly"],
					leadingUnderscore: "forbid",
					trailingUnderscore: "allow",
				},
				{
					selector: "method",
					format: ["camelCase", "PascalCase"],
					leadingUnderscore: "allow",
					trailingUnderscore: "allow",
				},
				{
					selector: ["parameter", "variable"],
					format: ["camelCase"],
					leadingUnderscore: "allow",
					trailingUnderscore: "allow",
				},
				{
					selector: ["typeLike", "objectLiteralProperty", "objectLiteralMethod"],
					format: ["camelCase", "UPPER_CASE", "PascalCase", "snake_case"],
					leadingUnderscore: "forbid",
					trailingUnderscore: "forbid",
				},
				{
					selector: "enumMember",
					format: null,
					leadingUnderscore: "forbid",
					trailingUnderscore: "forbid",
				},
			],
			"@typescript-eslint/no-empty-function": "error",
			"@typescript-eslint/no-empty-interface": "error",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-floating-promises": "error",
			"@typescript-eslint/no-misused-new": "error",
			"@typescript-eslint/no-namespace": "error",
			"@typescript-eslint/no-parameter-properties": "off",
			"@typescript-eslint/no-restricted-types": [
				"error",
				{
					types: {
						Object: {
							message: "Avoid using the `Object` type. Did you mean `object`?",
						},
						Function: {
							message:
								"Avoid using the `Function` type. Prefer a specific function type, like `() => void`.",
						},
						Boolean: {
							message: "Avoid using the `Boolean` type. Did you mean `boolean`?",
						},
						Number: {
							message: "Avoid using the `Number` type. Did you mean `number`?",
						},
						String: {
							message: "Avoid using the `String` type. Did you mean `string`?",
						},
						Symbol: {
							message: "Avoid using the `Symbol` type. Did you mean `symbol`?",
						},
					},
				},
			],
			"@typescript-eslint/no-shadow": ["error", { hoist: "all" }],
			"@typescript-eslint/no-this-alias": "error",
			"@typescript-eslint/no-unnecessary-type-assertion": "error",
			"@typescript-eslint/no-unused-expressions": "error",
			"@typescript-eslint/no-use-before-define": "off",
			"@typescript-eslint/no-var-requires": "error",
			"@typescript-eslint/prefer-function-type": "error",
			"@typescript-eslint/prefer-namespace-keyword": "error",
			"@typescript-eslint/quotes": ["error", "double", { avoidEscape: true }],
			"@typescript-eslint/require-await": "error",
			"@typescript-eslint/semi": ["off", "never"],
			"@typescript-eslint/triple-slash-reference": [
				"error",
				{ path: "always", types: "prefer-import", lib: "always" },
			],
			"@typescript-eslint/typedef": "off",
			"@typescript-eslint/unified-signatures": "off",

			// ESLint base
			curly: ["error", "all"],
			"object-curly-spacing": ["warn", "always", { objectsInObjects: false }],
			"arrow-parens": ["warn", "as-needed"],
			"comma-spacing": "error",
			complexity: "off",
			"no-multi-str": "error",
			"constructor-super": "error",
			"dot-notation": "off",
			"eol-last": "error",
			eqeqeq: ["error", "smart"],
			"guard-for-in": "error",
			"id-denylist": [
				"error",
				"any",
				"Number",
				"number",
				"String",
				"string",
				"Boolean",
				"boolean",
				"Undefined",
				"undefined",
			],
			"id-match": "error",
			"no-useless-return": "error",
			"no-useless-concat": "error",
			"no-useless-call": "error",
			"keyword-spacing": "warn",
			"no-lone-blocks": "error",
			"comma-dangle": "warn",
			"space-before-blocks": "warn",
			indent: "off",
			"max-classes-per-file": "off",
			"max-len": "off",
			"new-parens": "error",
			"no-bitwise": "off",
			"no-caller": "error",
			"no-cond-assign": "error",
			"no-console": "off",
			"no-debugger": "error",
			"no-duplicate-case": "error",
			"no-duplicate-imports": "error",
			"no-empty": "error",
			"no-empty-function": "off",
			"no-eval": "error",
			"no-extra-bind": "error",
			"no-fallthrough": "off",
			"no-invalid-this": "off",
			"no-multiple-empty-lines": "error",
			"no-new-func": "error",
			"no-new-wrappers": "error",
			"no-redeclare": "off",
			"no-return-await": "error",
			"no-sequences": "error",
			"no-shadow": "off",
			"no-sparse-arrays": "error",
			"no-template-curly-in-string": "error",
			"no-throw-literal": "off",
			"no-trailing-spaces": "error",
			"no-undef-init": "error",
			"no-underscore-dangle": "off",
			"no-unsafe-finally": "error",
			"no-unused-expressions": "off",
			"no-unused-labels": "error",
			"no-lonely-if": "warn",
			"no-use-before-define": "off",
			"no-var": "off",
			"object-shorthand": "error",
			"one-var": ["off", "never"],
			"no-else-return": "error",
			"semi-spacing": "warn",
			"block-spacing": "warn",
			"prefer-const": "error",
			"no-unmodified-loop-condition": "error",
			"no-whitespace-before-property": "warn",
			"prefer-object-spread": "error",
			quotes: "off",
			radix: "off",
			"require-await": "off",
			semi: "off",
			"space-in-parens": "off",
			"use-isnan": "error",
			"valid-typeof": "off",
			"array-callback-return": "error",
			"prefer-arrow-callback": "error",
			"func-style": [
				"warn",
				"declaration",
				{ allowArrowFunctions: true },
			],

			// Import
			"import/first": "error",
			"import/no-default-export": "error",
			"import/no-duplicates": "error",
			"import/order": "error",
			"import/no-self-import": "error",
			"import/no-extraneous-dependencies": "off",
			"import/no-internal-modules": "off",

			// Simple import sort
			"simple-import-sort/imports": "error",
			"simple-import-sort/exports": "error",

			// Unicorn
			"unicorn/prefer-ternary": "error",

			// Unused imports
			"no-unused-vars": "off",
			"unused-imports/no-unused-imports": "error",
			"unused-imports/no-unused-vars": [
				"warn",
				{
					vars: "all",
					varsIgnorePattern: "^_",
					args: "after-used",
					argsIgnorePattern: "^_",
				},
			],

			// Prettier
			"prettier/prettier": [
				"error",
				{
					useTabs: true,
					semi: false,
					endOfLine: "auto",
					arrowParens: "avoid",
					singleQuote: false,
					printWidth: 90,
					tabWidth: 4,
					trailingComma: "none",
					breakBeforeElse: true,
					proseWrap: "always",
				},
			],
		},
	},
	prettierConfig,
);
