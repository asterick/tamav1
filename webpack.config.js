"use strict";
var webpack = require('webpack');
var path = require('path');

const PORT = process.env.PORT || "8888";

module.exports = {
	entry: {
		bundle: './src/index.jsx'
	},
	output: {
		path: path.join(__dirname, 'public'),
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				exclude: /[\/\\](node_modules)[\/\\]/,
				use: [
					'style-loader?sourceMap',
					'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
				]
			},
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components|public)/,
				use: "babel-loader"
			}
		]
	},
	devServer: {
		contentBase: path.join(__dirname, 'public'),
		historyApiFallback: true,
		port: PORT,
	}
};
