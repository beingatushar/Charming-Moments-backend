const js = require("@eslint/js");
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = [
    // Base ESLint recommended rules
    js.configs.recommended,

    {
        // Apply to all TypeScript files in src
        files: ["src/**/*.ts"],

        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
            // Define Node.js globals manually since we aren't using the 'globals' package
            globals: {
                process: "readonly",
                console: "readonly",
                module: "readonly",
                require: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
                exports: "readonly",
                Buffer: "readonly",
            },
        },

        plugins: {
            "@typescript-eslint": tsPlugin,
        },

        // Apply TypeScript recommended rules and custom overrides
        rules: {
            ...tsPlugin.configs.recommended.rules,
            "no-unused-vars": "off", // Turn off default rule to avoid duplicates
            "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
            "@typescript-eslint/no-explicit-any": "warn",
        },
    },

    // Ignore build artifacts
    {
        ignores: ["dist/", "node_modules/"],
    },
];