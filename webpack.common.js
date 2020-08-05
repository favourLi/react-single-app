const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var pages = require('./webpack.pages.js');

var entry = {} , plugins = [new CleanWebpackPlugin()];
for(var key in pages){
    entry[key] = pages[key].src;
    plugins.push(
        new HtmlWebpackPlugin({
            title : pages[key].title,
            filename : key + '.htm',
            template: pages[key].template || './src/template.htm',
            inject : false,
            hash : true,
            jsList : pages[key].jsList || []
        })
    )
}

module.exports = {
    entry: entry,
    plugins: plugins,
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build')
    },
    module: {
        rules : [{
            test: /\.less$|\.css$/,
            use : ['style-loader' , 'css-loader' , 'less-loader']
        },

        {
            test: /\.(js|jsx)$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'react'],
                }
            },
            exclude: path.resolve(__dirname, 'node_modules')
        }]
    }
};