/** @type {import('stylelint').Config} */
export default {
    ignoreFiles: ['*.js'],
    plugins: ['stylelint-order', 'stylelint-scss'],
    extends: [
        'stylelint-config-standard-scss',
        'stylelint-config-prettier-scss',
        'stylelint-config-idiomatic-order',
    ],
    overrides: [
        {
            files: ['**/*.scss'],
            customSyntax: 'postcss-scss',
        },
    ],
    rules: {
        'media-feature-range-notation': null,
        'at-rule-no-unknown': true,
        'block-no-empty': true,
        'color-no-invalid-hex': true,
        'comment-no-empty': true,
        'declaration-block-no-duplicate-properties': [
            true,
            {
                ignore: ['consecutive-duplicates-with-different-values'],
            },
        ],
        'declaration-block-no-shorthand-property-overrides': true,
        'font-family-no-duplicate-names': true,
        'font-family-no-missing-generic-family-keyword': true,
        'function-calc-no-unspaced-operator': true,
        'function-linear-gradient-no-nonstandard-direction': true,
        'keyframe-declaration-no-important': true,
        'media-feature-name-no-unknown': true,
        'no-descending-specificity': null,
        'no-duplicate-at-import-rules': true,
        'no-duplicate-selectors': true,
        'no-invalid-double-slash-comments': true,
        'property-no-unknown': true,
        'selector-pseudo-element-no-unknown': true,
        'selector-type-no-unknown': true,
        'string-no-newline': true,
        'selector-class-pattern': null,
        'unit-no-unknown': true,
        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: ['global'],
            },
        ],
        'at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: ['use'],
            },
        ],
    },
}
