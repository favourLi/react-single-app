const merge = require('webpack-merge');
const common = require('./common.js');

module.exports = merge(common, {
    mode : 'development' , 
    devtool: 'source-map',
    devServer: {
        contentBase: './dist',
        host: '0.0.0.0',
        historyApiFallback: {
            rewrites: [
                { from: /./, to: '/index.htm' }
            ]
        }
    },
});