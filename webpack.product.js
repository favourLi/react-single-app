const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    mode: 'production',
    entry: {
        'index': './src/index',
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'lib'),
        libraryTarget: 'commonjs2'
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
    externals: [
        // nodeExternals(),
        {
            react: {
                root: 'React',
                commonjs2: 'react',
                commonjs: 'react',
                amd: 'react'
            },
            'react-dom': {
                root: 'ReactDOM',
                commonjs2: 'react-dom',
                commonjs: 'react-dom',
                amd: 'react-dom'
            },
            'react-router': {
                root: 'ReactRouter',
                commonjs2: 'react-router',
                commonjs: 'react-router',
                amd: 'react-router'
            },
            'antd' : {
                root: 'antd',
                commonjs2: 'antd',
                commonjs: 'antd',
                amd: 'antd'
            }
            
        }
    ]
};