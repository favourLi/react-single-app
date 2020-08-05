const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        'index': './src/page/index1',
    },
    plugins: [
        new CleanWebpackPlugin() , 
        new HtmlWebpackPlugin({
            title: '首页',
            filename: 'index.htm',
            template: './src/template.htm',
            inject: false,
            hash: true,
        })
    ],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'lib'),
    },
    module: {
        rules: [{
            test: /\.less$|\.css$/,
            use: ['style-loader', 'css-loader', 'less-loader']
        },

        {
            test: /\.(js|jsx)$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'react'],
                }
            },
            exclude: path.resolve(__dirname, 'node_modules'),

        }]
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        host: '0.0.0.0',
        historyApiFallback: {
            rewrites: [
                { from: /./, to: '/index.htm' }
            ]
        }
    }
};

