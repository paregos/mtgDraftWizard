var path = require("path");
var debug = process.env.NODE_ENV !== "production";
var webpack = require("webpack");

module.exports = {
    context: path.join(__dirname, "src"),
    devtool: debug ? "inline-sourcemap" : false,
    entry: "./js/client.js",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: ["url-loader?limit=10000", "img-loader"]
            }
        ]
    },
    resolve: {
        extensions: ["*", ".js", ".jsx"]
    },
    output: {
        path: __dirname + "/src/",
        filename: "client.min.js"
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    devServer: {
        contentBase: "./src",
        hot: true
    }
};
