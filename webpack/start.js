const merge = require('webpack-merge');
const common = require('./common.js');

module.exports = merge(common, {
    mode : 'development' , 
    devtool: 'source-map',
    devServer: {
        contentBase: './dist',
        host: '127.0.0.1',
        historyApiFallback: {
            rewrites: [
                { from: /./, to: '/index.htm' }
            ]
        }
    },
});