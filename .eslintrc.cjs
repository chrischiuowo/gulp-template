module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  ignorePatterns: ['node_modules/', 'dist/', 'gulpfile.js'],
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      extends: 'standard-with-typescript'
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {}
}
