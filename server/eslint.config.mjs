import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import eslintPluginPrettier from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
    ...compat.extends("plugin:@typescript-eslint/recommended"),

    {
        ignores: ["node_modules/**", "dist/**"],
        plugins: {
            "@typescript-eslint": tsPlugin,
            prettier: eslintPluginPrettier,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            ...eslintPluginPrettier.configs.recommended.rules,
            "prettier/prettier": "error",
        },
    },
];
