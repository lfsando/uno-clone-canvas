module.exports = {
    parser: "@typescript-eslint/parser",
    env: {
        "node": true
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {}
    },
    settings: {

    },
    extends: [
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended",
        "airbnb-typescript-prettier",
    ],
    rules: {
        "no-unused-vars": "off",
        "react/static-property-placement": "off",
        "no-param-reassign": [2, { "props": false }],
        'lines-between-class-members': [
            'error',
            'always',
            { 'exceptAfterSingleLine': true },
        ]
    }
};