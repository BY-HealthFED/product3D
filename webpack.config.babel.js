import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import OfflinePlugin from 'offline-plugin';
import path from 'path';
import fs from 'fs';

const isPRD = process.env.NODE_ENV.indexOf('production') !== -1 ? 'production' : null;
const isUAT = process.env.NODE_ENV.indexOf('uat') !== -1;
const ENV = isPRD || 'development';

const CSS_MAPS = ENV!=='production';


// globVar for less
function getLessVariables() {
	let themeContent = fs.readFileSync(path.resolve(__dirname, 'src/style/variables.less'), 'utf-8');
	let variables = {};
	themeContent.split('\n').forEach((item) => {
		if (item.indexOf('//') > -1 || item.indexOf('/*') > -1) {
			return;
		}
		let _pair = item.split(':');
		if (_pair.length < 2) return;
		let key = _pair[0].replace('\r', '').replace('@', '');
		if (!key) return;
		let value = _pair[1].replace(';', '').replace('\r', '').replace(/^\s+|\s+$/g, '');
		variables[key] = value;
	});
	return variables;
}

module.exports = {
	context: path.resolve(__dirname, "src"),
	entry: ['./core/polyfill.js', './index.js'],

	output: {
		path: path.resolve(__dirname, "build"),
		publicPath: './',
		filename: 'bundle.js'
	},

	resolve: {
		extensions: ['.jsx', '.js', '.json', '.less', '.scss', '.css'],
		modules: [
			path.resolve(__dirname, "src/lib"),
			path.resolve(__dirname, "node_modules"),
			'node_modules'
		],
		alias: {
			components: path.resolve(__dirname, "src/components"),    // used for tests
			style: path.resolve(__dirname, "src/style"),
			core: path.resolve(__dirname, "src/core"),
			'~': path.resolve(__dirname, "src"), // root
			'react': 'preact-compat',
			'react-dom': 'preact-compat'
		}
	},

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: path.resolve(__dirname, 'src'),
				enforce: 'pre',
				use: 'source-map-loader'
			},
			{
				test: /\.(jsx|js)?$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			{
				// Transform our own .(scss|css) files with PostCSS and CSS-modules
				test: /\.(scss|css)$/,
				include: [path.resolve(__dirname, 'src/components'), path.resolve(__dirname, 'src/containers')],
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: { modules: true, sourceMap: CSS_MAPS, importLoaders: 1, minimize: true }
						},
						{
							loader: `postcss-loader`,
							options: {
								sourceMap: CSS_MAPS,
								plugins: () => {
									autoprefixer({ browsers: [ 'last 2 versions' ] });
								}
							}
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: CSS_MAPS,
								data: '@import "variables.scss";',
								includePaths: [
									path.resolve(__dirname, "src/style")
								]
							}
						}
					]
				})
			},
			{
				test: /\.(scss|css)$/,
				exclude: [path.resolve(__dirname, 'src/components'), path.resolve(__dirname, 'src/containers')],
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: { sourceMap: CSS_MAPS, importLoaders: 1, minimize: true }
						},
						{
							loader: `postcss-loader`,
							options: {
								sourceMap: CSS_MAPS,
								plugins: () => {
									autoprefixer({ browsers: [ 'last 2 versions' ] });
								}
							}
						},
						{
							loader: 'sass-loader',
							options: { sourceMap: CSS_MAPS }
						}
					]
				})
			},
			// Transform our own .less files with PostCSS and CSS-modules
			{
				test: /\.less$/,
				include: [path.resolve(__dirname, 'src/components'), path.resolve(__dirname, 'src/containers')],
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						'css-loader?modules&localIdentName=[name][hash:base64:8]',
						{
							loader: 'less-loader',
							options: {
								sourceMap: CSS_MAPS,
								globalVars: getLessVariables()
							}
						}]
				})
			},
			{
				test: /\.less$/,
				exclude: [path.resolve(__dirname, 'src/components'), path.resolve(__dirname, 'src/containers')],
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'less-loader']
				})
			},
			{
				test: /\.json$/,
				use: 'json-loader'
			},
			{
				test: /\.(xml|html|txt|md)$/,
				use: 'raw-loader'
			},
			{
				test: /\.(svg|woff2?|ttf|eot)(\?.*)?$/i,
				use: ENV==='production' ? 'file-loader' : 'url-loader'
			},
			{
				test: /\.(jpe?g|png|gif)$/,
				use: ENV==='production' ?
					{
						loader: 'url-loader?limit=10000'
					} : {
						loader: 'url-loader'
					}
			}
		]
	},
	plugins: ([
		new webpack.NoEmitOnErrorsPlugin(),
		new ExtractTextPlugin({
			filename: 'style.css',
			allChunks: true,
			disable: ENV !== 'production'
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(ENV),
			'__UAT__': isUAT,
			'__PRD__': isPRD === 'production' ? true : false
		}),
		new HtmlWebpackPlugin({
			template: './index.ejs',
			minify: { collapseWhitespace: true }
		}),
		new CopyWebpackPlugin([
			{ from: './manifest.json', to: './' },
			{ from: './favicon.ico', to: './' },
			{ from: './assets', to: './assets' }
		])
	]).concat(ENV==='production' ? [
		new webpack.optimize.UglifyJsPlugin({
			output: {
				comments: false
			},
			compress: {
				unsafe_comps: true,
				properties: true,
				keep_fargs: false,
				pure_getters: true,
				collapse_vars: true,
				unsafe: true,
				warnings: false,
				screw_ie8: true,
				sequences: true,
				dead_code: true,
				drop_debugger: true,
				comparisons: true,
				conditionals: true,
				evaluate: true,
				booleans: true,
				loops: true,
				unused: true,
				hoist_funs: true,
				if_return: true,
				join_vars: true,
				cascade: true,
				drop_console: true
			}
		}),

		new OfflinePlugin({
			relativePaths: false,
			AppCache: false,
			excludes: ['_redirects'],
			ServiceWorker: {
				events: true
			},
			cacheMaps: [
				{
					match: /.*/,
					to: '/',
					requestTypes: ['navigate']
				}
			],
			publicPath: '/'
		})
	] : []),

	stats: { colors: true },

	node: {
		global: true,
		process: false,
		Buffer: false,
		__filename: false,
		__dirname: false,
		setImmediate: false
	},

	devtool: ENV==='production' ? 'source-map' : 'cheap-module-eval-source-map',

	devServer: {
		port: process.env.PORT || 8080,
		host: 'localhost', // host: '0.0.0.0',
		publicPath: '/',
		contentBase: './src',
		historyApiFallback: true,
		open: true,
		// openPage: '',
		proxy: {
			'/mf': {
				target: 'http://wx-test1.by-health.com',
				changeOrigin: true
			},
			'/common': {
				target: 'http://wx-test.by-health.com',
				changeOrigin: true
			},
			'/annualmeeting': {
				target: 'http://wx-test.by-health.com',
				changeOrigin: true
			}
		}
	}
};
