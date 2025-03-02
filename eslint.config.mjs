import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: {},
});

const eslintConfig = [
    ...compat.env({ browser: true, es2021: true, node: true }),
    ...compat.extends(
        "next/core-web-vitals",
        "next/typescript",
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@next/next/recommended",
        "next",
        "prettier",
        "plugin:prettier/recommended",
    ),
    ...compat.plugins("@typescript-eslint", "react", "react-hooks"),
    ...compat.config({
        parser: "@typescript-eslint/parser",
        parserOptions: {
            ecmaVersion: 12,
            sourceType: "module",
            project: "./tsconfig.json",
            tsconfigRootDir: __dirname,
            createDefaultProgram: true,
            ecmaFeatures: {
                jsx: true,
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            eqeqeq: "warn",
            "no-trailing-spaces": "warn",
            "no-useless-catch": "off",
            "comma-dangle": "off",
            "no-var": "off",
            "no-unused-vars": [
                "off",
                {
                    vars: "all",
                    args: "after-used",
                    ignoreRestSiblings: false,
                },
            ],
            "no-console": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-unused-vars": [
                "off",
                {
                    vars: "all",
                    args: "after-used",
                    ignoreRestSiblings: false,
                },
            ],
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "@next/next/no-img-element": "off",
            "react-hooks/exhaustive-deps": "off",
        },
        overrides: [
            {
                files: ["src/**/*.{js,jsx,ts,tsx}"],
            },
        ],
    }),
];

export default eslintConfig;
