module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: ['standard-with-typescript', 'prettier'],
    overrides: [],
    parserOptions: {
        project: 'tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        '@typescript-eslint/prefer-nullish-coalescing': 0,
        '@typescript-eslint/strict-boolean-expressions': 0,
        '@typescript-eslint/consistent-type-imports': 0,
    },
};
