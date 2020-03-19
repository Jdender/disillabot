module.exports = {
    rules: {
        "@typescript-eslint/explicit-function-return-type": 0
    },
    parser: "@typescript-eslint/parser",
    extends: [
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended"
    ],
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: "module"
    },
};
