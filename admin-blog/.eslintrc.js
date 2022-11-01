module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: '@babel/eslint-parser',
        requireConfigFile: false
    },
    extends: [
        'plugin:vue/vue3-recommended',
        'prettier'
    ],
    plugins: [],
    rules: {
        'vue/attributes-order': 1,
        'vue/order-in-components': [
            'error', {
                'order': [
                    'el',
                    'name',
                    'parent',
                    'functional',
                    ['delimiters', 'comments'],
                    ['components', 'directives', 'filters'],
                    'extends',
                    'mixins',
                    'inheritAttrs',
                    'model',
                    ['props', 'propsData'],
                    'data',
                    'computed',
                    'watch',
                    'LIFECYCLE_HOOKS',
                    'beforeCreate',
                    'created',
                    'mounted',
                    'beforeDestroy',
                    'destroyed',
                    'methods',
                    ['template', 'render'],
                    'renderError'
                ]
            }
        ],
        'vue/html-indent': [2, 4],
        // html 内 缩进
        'vue/no-multi-spaces': [2, {ignoreProperties: false}],
        // html 属性中不允许出现多个空格
        'vue/no-spaces-around-equal-signs-in-attribute': [2],
        // html 代码中 “=” 前后不能有空格
        'vue/prop-name-casing': [2],
        // 这条规则强制在vue组件(camelCase)中使用正确的支柱外壳。
        'vue/require-prop-types': 2,
        // 在 props 中至少要指定类型
        'vue/attribute-hyphenation': [2, 'always'],
        // 强制在Vue模板中的自定义组件上使用连字符属性名称
        'vue/html-closing-bracket-spacing': [
            // 标签前后空格
            2, {
                // 标签最前面不允许出现空格
                'startTag': 'never',
                // 标签最后面不允许出现空格
                'endTag': 'never',
                // 自闭合标签 后必须有一个空格
                'selfClosingTag': 'always'
            }
        ],
        // 不允许缺少结束标记。
        'vue/html-end-tags': [2],
        // html 标签必须使用 双引号
        'vue/html-quotes': [2, 'double'],
        'vue/multiline-html-element-content-newline': [
            // 内容 不允许出现断行
            2, {
                'ignoreWhenEmpty': true,
                'allowEmptyLines': true
            }
        ],
        // 插值两端必须留一个空格
        'vue/mustache-interpolation-spacing': [2, 'always'],
        // v-bind 指令必须使用缩写
        'vue/v-bind-style': [2, 'shorthand'],
        // v-on 指令必须使用缩写
        'vue/v-on-style': [2, 'shorthand'],
        // "vue/this-in-template": [2, "never"], // 标签内 不需要写this
        // 强制 标签使用 中横线间隔
        'vue/component-name-in-template-casing': [
            2, 'kebab-case', {
                'registeredComponentsOnly': false
                // 检查所有
            }
        ],
        'vue/html-closing-bracket-newline': [
            2, {
                'singleline': 'never',
                'multiline': 'never'
            }
        ],
        // 数组紧贴括号部分不允许包含空格。
        'array-bracket-spacing': ['error', 'never'],
        // 对象紧贴花括号部分不允许包含空格。
        'object-curly-spacing': ['error', 'never'],
        // parseInt 需添加进制数参数
        radix: 2,
        'one-var': 'off',
        'no-empty-pattern': 'error',
        'one-var-declaration-per-line': 'error',
        'wrap-iife': 'off',
        'no-ternary': 'off',
        'lines-around-comment': 'error',
        'no-extra-label': 'error',
        'block-scoped-var': 'warn',
        'init-declarations': 'warn',
        'linebreak-style': ['off', 'unix'],
        'semi-spacing': 'off',
        'no-multi-str': 'off',
        // 逗号后需加空格
        'comma-spacing': ['error', {before: false, after: true}],
        'eol-last': ['warn', 'always'],
        'no-octal': 'off',
        curly: 'off',
        'no-var': 'off',
        'no-undefined': 'off',
        'no-unused-expressions': [
            'warn',
            {
                allowShortCircuit: true
            }
        ],
        'no-new-symbol': 'error',
        'no-array-constructor': 'off',
        'arrow-spacing': 'off',
        'no-useless-rename': 'error',
        'no-implied-eval': 'off',
        'no-iterator': 'off',
        'no-process-exit': 'off',
        'space-infix-ops': 'error',
        'array-bracket-newline': [
            'warn',
            {
                multiline: true
            }
        ],
        'no-regex-spaces': 'warn',
        'no-implicit-globals': 'error',
        'no-new-func': 'warn',
        'comma-dangle': ['error', 'never'],
        'max-depth': 'off',
        'no-warning-comments': 'off',
        'spaced-comment': 'error',
        'no-param-reassign': [
            'warn',
            {
                props: true
            }
        ],
        'callback-return': 'off',
        'no-proto': 'off',
        'no-template-curly-in-string': 'off',
        'no-useless-escape': 'error',
        'prefer-destructuring': 'off',
        'no-plusplus': 'off',
        'no-self-assign': 'error',
        'id-blacklist': 'off',
        quotes: ['error', 'single'],
        'no-bitwise': 'off',
        'prefer-template': 'off',
        'no-invalid-this': 'off',
        'func-style': 'off',
        'no-empty': 'error',
        'key-spacing': ['error', {afterColon: true}],
        'no-func-assign': 'off',
        'no-unused-vars': 'off',
        'no-mixed-operators': 'off',
        'capitalized-comments': 'off',
        'object-shorthand': ['off', 'consistent-as-needed'],
        'no-dupe-args': 'off',
        'no-buffer-constructor': 'warn',
        'arrow-parens': [2, 'as-needed'],
        'computed-property-spacing': 'off',
        'object-curly-newline': [
            'off',
            {
                consistent: true,
                multiline: true
            }
        ],
        'jsx-quotes': ['error', 'prefer-double'],
        'max-params': 'off',
        'arrow-body-style': 'off',
        'rest-spread-spacing': ['error', 'never'],
        'no-else-return': 'off',
        'no-useless-constructor': 'off',
        'no-redeclare': 'off',
        'no-constant-condition': 'off',
        'global-require': 'warn',
        'comma-style': 'off',
        'line-comment-position': ['error', {position: 'above'}],
        'no-tabs': 'off',
        'block-spacing': ['error', 'never'],
        'no-dupe-keys': 'off',
        'no-caller': 'error',
        'no-new-object': 'off',
        'no-negated-condition': 'warn',
        'no-unmodified-loop-condition': 'warn',
        'no-multi-spaces': 'off',
        'keyword-spacing': ['error', {after: true, before: true}],
        'space-in-parens': 'off',
        'template-curly-spacing': ['error', 'never'],
        'space-unary-ops': 'off',
        'require-yield': 'warn',
        'no-inline-comments': 'off',
        'symbol-description': 'warn',
        'no-implicit-coercion': 'off',
        'no-whitespace-before-property': 'warn',
        'no-fallthrough': 'error',
        'no-irregular-whitespace': 'off',
        'no-global-assign': 'error',
        'no-new-require': 'warn',
        'no-mixed-requires': 'off',
        'no-return-assign': ['error', 'except-parens'],
        'no-unreachable': 'off',
        'no-console': 'off',
        'nonblock-statement-body-position': 'off',
        'no-alert': 'warn',
        'prefer-const': 'off',
        'no-cond-assign': 'error',
        'prefer-spread': 'warn',
        'object-property-newline': 'off',
        'newline-per-chained-call': 'off',
        'prefer-rest-params': 'off',
        'no-const-assign': 'off',
        'brace-style': 'off',
        'max-statements': [
            'warn',
            30,
            {
                ignoreTopLevelFunctions: true
            }
        ],
        'no-useless-call': 'warn',
        'handle-callback-err': 'off',
        'no-useless-concat': 'warn',
        'max-lines': ['warn', 800],
        'no-octal-escape': 'off',
        'no-shadow': 'off',
        'no-unsafe-finally': 'error',
        'no-unsafe-negation': 'error',
        'no-self-compare': 'off',
        'sort-vars': 'off',
        'space-before-function-paren': [2, {anonymous: 'always', named: 'never', asyncArrow: 'always'}],
        'use-isnan': 'off',
        'no-confusing-arrow': 'off',
        'no-restricted-properties': 'off',
        'default-case': 'off',
        'no-restricted-modules': 'off',
        'no-delete-var': 'off',
        'no-lone-blocks': 'off',
        'no-eq-null': 'off',
        'no-shadow-restricted-names': 'off',
        'no-extend-native': 'off',
        'sort-keys': 'off',
        'no-case-declarations': 'error',
        'no-duplicate-case': 'off',
        'operator-assignment': 'off',
        'no-magic-numbers': 'off',
        'no-eval': 'off',
        'no-extra-semi': 'error',
        'no-nested-ternary': 'off',
        // 驼峰命名法
        camelcase: [2, {properties: 'never'}],
        'no-restricted-syntax': 'off',
        'no-extra-boolean-cast': 'off',
        'no-empty-function': 'warn',
        'valid-jsdoc': 'off',
        'array-callback-return': 'error',
        'template-tag-spacing': ['error', 'never'],
        'unicode-bom': 'off',
        'padded-blocks': 'off',
        'prefer-arrow-callback': 'warn',
        'no-spaced-func': 'off',
        'no-useless-return': 'error',
        'no-duplicate-imports': 'off',
        'no-unexpected-multiline': 'warn',
        'no-unused-labels': 'error',
        'generator-star-spacing': 'off',
        'no-debugger': 'off',
        'quote-props': 'off',
        'no-loop-func': 'off',
        'no-new-wrappers': 'off',
        'valid-typeof': 'off',
        'max-nested-callbacks': 'off',
        indent: [
            'warn',
            4,
            {
                SwitchCase: 1
            }
        ],
        'accessor-pairs': 'error',
        'no-undef': 'off',
        'no-useless-computed-key': 'error',
        'require-await': 'warn',
        'no-undef-init': 'off',
        'for-direction': 'off',
        'max-statements-per-line': 'off',
        'switch-colon-spacing': [
            'error',
            {
                after: true,
                before: false
            }
        ],
        'dot-location': ['warn', 'property'],
        'no-ex-assign': 'off',
        'no-multiple-empty-lines': 'warn',
        'no-this-before-super': 'off',
        'multiline-ternary': 'off',
        eqeqeq: 'off',
        'no-dupe-class-members': 'off',
        'no-with': 'off',
        'no-multi-assign': 'warn',
        'prefer-numeric-literals': 'warn',
        'no-obj-calls': 'off',
        'no-label-var': 'off',
        'no-labels': 'off',
        'max-len': ['error', {code: 120}],
        'no-unneeded-ternary': 'off',
        'yield-star-spacing': 'off',
        'id-length': 'off',
        'no-restricted-globals': 'off',
        'func-call-spacing': ['error', 'never'],
        'constructor-super': 'off',
        'no-invalid-regexp': 'off',
        'no-lonely-if': 'error',
        'indent-legacy': 'off',
        'semi-style': ['error', 'last'],
        semi: ['error', 'always'],
        'vars-on-top': 'off',
        'id-match': 'off',
        'prefer-reflect': 'off',
        'sort-imports': 'off',
        'no-new': 'error',
        'guard-for-in': 'off',
        'no-throw-literal': 'warn',
        'operator-linebreak': [2, 'before'],
        // 函数 class 变量在未申明前不可使用
        'no-use-before-define': ['error', {functions: true, classes: true, variables: true}],
        'no-mixed-spaces-and-tabs': 'off',
        'no-compare-neg-zero': 'error',
        yoda: 'warn',
        'require-jsdoc': 'off',
        'class-methods-use-this': 'off',
        'no-negated-in-lhs': 'off',
        'func-name-matching': 'off',
        'no-sparse-arrays': 'off',
        'prefer-promise-reject-errors': 'warn',
        'no-return-await': 'error',
        'no-sequences': 'error',
        'no-extra-bind': 'off',
        strict: 'off',
        'no-floating-decimal': 'warn',
        'consistent-this': 'off',
        'func-names': ['off', 'always'],
        'wrap-regex': 'off',
        'no-class-assign': 'off',
        'no-trailing-spaces': 'error',
        'no-process-env': 'off',
        'no-await-in-loop': 'off',
        'no-div-regex': 'off',
        'new-parens': 'off',
        'no-void': 'error',
        'no-extra-parens': 'off',
        'padding-line-between-statements': 'off',
        'no-path-concat': 'off',
        'no-empty-character-class': 'off',
        'new-cap': 'warn',
        'no-catch-shadow': 'off',
        'no-prototype-builtins': 'off',
        'space-before-blocks': 'off',
        'no-control-regex': 'warn',
        'no-sync': 'off',
        'no-inner-declarations': 'off',
        complexity: ['warn', 10],
        'no-script-url': 'warn',
        'consistent-return': [
            'warn',
            {
                treatUndefinedAsUnspecified: true
            }
        ],
        'no-underscore-dangle': 'warn',
        'dot-notation': 'off',
        'no-continue': 'off',
        'no-restricted-imports': 'off'
    }
};
