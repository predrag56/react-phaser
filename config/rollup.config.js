const replace = require('rollup-plugin-replace');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');
const namedExports = require('rollup-plugin-json');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const NODE_ENV = process.env.NODE_ENV;
const outputFile = NODE_ENV === 'production' ? './lib/prod.js' : './lib/dev.js';

module.exports = {
	input: './src/index.js',
	output: {
		file: outputFile,
		format: 'cjs'
	},
	watch: {
		chokidar: {
			usePolling: false
		},
		include: 'src/**',
		exclude: ['node_modules/**', 'examples/**', 'lib/**', 'config/**']
	},
	plugins: [
		json({
			exclude: 'node_modules/**',
			preferConst: true,
			indent: '  ',
			compact: true,
			namedExports: true
		}),
		replace({
			'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
		}),
		babel({
			exclude: 'node_modules/**, *.json',
			runtimeHelpers: true
		}),
		resolve({
			preferBuiltins: false
		}),
		commonjs({
			include: 'node_modules/**',
			namedExports: {
				lodash: ['pick', 'omit', 'get', 'isNil', 'noop'],
				scheduler: ['unstable_now', 'unstable_scheduleCallback', 'unstable_cancelCallback']
			}
		})
	]
};
