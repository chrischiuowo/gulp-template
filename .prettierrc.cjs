// @ts-check
/// <reference types="@prettier/plugin-pug/src/prettier" />

/**
 * @type {import('prettier').Options}
 */
module.exports = {
  plugins: ['@prettier/plugin-pug'],

  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  printWidth: 120,

  pugSingleQuote: true
}
