
var path = require('path');
var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');

module.exports = {
  context: path.join(__dirname, "src"),
  mode: debug ? 'development' : 'production',
  devtool: debug ? "inline-sourcemap" : false,
  entry: "./js/client.js",
  target: "electron-main",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + "/src/",
    filename: "client.min.js"
  },
  plugins: [
  ],
  devServer: {
    contentBase: "./src"
  }
};