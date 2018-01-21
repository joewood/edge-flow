const path = require("path");
var webpack = require("webpack");

module.exports = {
	entry: ["./app.tsx"],
	output: {
		pathinfo: true,
		filename: "./bundle.js",
		publicPath: "/"
	},
	devtool: "cheap-module-source-map",
	resolve: {
		extensions: [".webpack.js", ".web.js", ".ts", ".js", ".tsx"]
	},
	module: {
		loaders: [
			{ test: /\.ts.?$/, loader: "ts-loader" },
			{
				test: /\.(s?)css$/,
				loader: "style-loader!css-loader"
			},
			{
				test: /\.(ico|jpg|png|gif|eot|otf|svg|ttf|woff|woff2)(\?.*)?$/,
				exclude: /\/favicon.ico$/,
				loader: "file-loader",
				query: {
					name: "static/media/[name].[hash:8].[ext]"
				}
			}
		]
	}
};
