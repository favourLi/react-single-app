const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({
    size: 5
})

module.exports = {
    mode: 'production',
    entry: {
        'index': './src/index'
    },
    plugins: [
        // new CleanWebpackPlugin(),
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
        })
    ],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'lib'),
        libraryTarget: 'commonjs2'
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
                exclude: path.resolve(__dirname, 'node_modules'), //排除node_modules目录，该目录不参与编译
            },
            {
                test: /\.css$/,
                use: ['happypack/loader?id=css'],
                exclude: path.resolve(__dirname, 'node_modules'), //排除node_modules目录，该目录不参与编译
            },
            {
                test: /\.less$/,
                use: ['happypack/loader?id=less'],
                exclude: path.resolve(__dirname, 'node_modules'),
            }
        ]
    },
    externals: [
        // nodeExternals(),
        {
            react: 'react',
            'react-dom': 'react-dom',
            'react-router': 'react-router',
            'antd' : 'antd',
            'axios' : 'axios' ,
            'react-draggable' : 'react-draggable' ,
            'react-resizable' : 'react-resizable' , 
            'react-sortable-hoc' : 'react-sortable-hoc' ,
            'md5' : 'md5' , 
            'moment' : 'moment'
        }
    ]
};