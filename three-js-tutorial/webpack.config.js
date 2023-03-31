const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: './src/js/scripts.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
    watchOptions: {
        poll: true,
        ignored: /node_modules/
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|glb)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
        ],
    },
    mode: 'development',
    watch: true,
    devtool: "eval-source-map",
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' })
    ],
};