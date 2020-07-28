module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	extends: [
		'airbnb-base',
	],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
		__basedir: 'readonly',
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	rules: {
		"no-console": "off",
		semi: [1, "never"],
		"no-tabs": ["error", { allowIndentationTabs: true }],
		"indent": ["error", "tab"],
		"no-use-before-define": ["error", { "functions": false }]
	},
};
