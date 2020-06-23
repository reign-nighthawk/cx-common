// .eslintrc.js
const eslintrc = {
  parser: '@typescript-eslint/parser', // 使用 ts 解析器
  extends: [
    'eslint:recommended', // eslint 推荐规则
    'plugin:@typescript-eslint/recommended', // ts 推荐规则
  ],
  plugins: [
    '@typescript-eslint',
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    '@typescript-eslint/consistent-type-definitions': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/generic-type-naming': 0,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/no-this-alias':0,
    '@typescript-eslint/member-ordering': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-extra-parens': 0,
    '@typescript-eslint/no-magic-numbers': 0,
    '@typescript-eslint/no-parameter-properties': 0,
    '@typescript-eslint/explicit-module-boundary-types':0,
    '@typescript-eslint/ban-types':0,
    '@typescript-eslint/no-type-alias': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/prefer-for-of': 1,
    '@typescript-eslint/prefer-interface': 0,
    '@typescript-eslint/interface-name-prefix': [0, {
      prefixWithI: 'always',
    }], // 接口名称首字母 I
    '@typescript-eslint/member-delimiter-style': [0, {
      delimiter: 'none',
    }], // 成员分隔符
    '@typescript-eslint/semi': ['error', 'never'],

    'jest/expect-expect': ['off'],

    'space-infix-ops': ['error'],
    'comma-dangle': ['error', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'never',
    }],
    'space-before-function-paren': ['error', 'always'], // 方法名后空格
    'semi': ['error', 'never'], // 无分号
    'indent': ['error', 2], // 缩进2
    'quotes': ['error', 'single'], // 单引号
    'no-param-reassign': 0, // 传入参数可修改
    'no-restricted-globals': ['error', 'event'], // 部分全局变量禁止直接使用
  }, // 自定义
}

module.exports = eslintrc