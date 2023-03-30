const path = require('path');

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
    mode: 'development',
    watch: true,
    devtool: "eval-source-map",
};