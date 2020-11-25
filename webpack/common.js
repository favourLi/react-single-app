const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HappyPack = require('happypack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const happyThreadPool = HappyPack.ThreadPool({
    size: 5
})

module.exports = {
    mode: 'development',
    entry: {
        index : './test/index'
    },
    plugins: [
        new ProgressBarPlugin(),
        new HappyPack({
            id: 'babel',
            loaders: [
                {
                    path: 'babel-loader',
                    query: {
                        presets: ['@babel/preset-react', '@babel/preset-env'],
                    },
                    cache: true
                }],
            threadPool: happyThreadPool,
            verbose: true
        }),
        new HappyPack({
            id: 'css',
            loaders: ['style-loader', 'css-loader'],
            threadPool: happyThreadPool,
            verbose: true
        }),
        new HappyPack({
            id: 'less',
            loaders: [
                'style-loader', 'css-loader', 'less-loader'],
            threadPool: happyThreadPool,
            verbose: true
        }),
        new HtmlWebpackPlugin({
            title: '首页',
            filename: 'index.htm',
            template: './test/index.htm',
            inject: true,
            hash: true,
        }),
    ],
    output: {
        filename: '[name]-[chunkhash].js',
        path: path.resolve('./', 'build'),
        publicPath: '/'
    },
    resolve: {
        alias: {
            '@': path.resolve('src')// 这样配置后 @ 可以指向 src 目录
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['happypack/loader?id=babel'],
                exclude: path.resolve('./', 'node_modules'), //排除node_modules目录，该目录不参与编译
            },
            {
                test: /\.css$/,
                use: ['happypack/loader?id=css'],
            },
            {
                test: /\.less$/,
                use: ['happypack/loader?id=less'],
                exclude: path.resolve('./', 'node_modules'),
            }
        ]
    },
    optimization : {
        splitChunks : {
            chunks : 'all',
            cacheGroups:{
                vendors: { 
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: -10,
                    enforce: true,
                },
                default : false
            }
        },
    },
};

