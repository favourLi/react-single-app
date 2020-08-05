/**
    完整的页面配置放在webpack.pages-lock.js中
    webpack.pages.js可根据开发需求，只放入当前正在开发的页面，可提高编译效率
    需保证本文件包含项目的所有页面
**/
var pages = {
    /**
        文拯
    **/
    'index' : {
        src : './src/index/index',
    },
    
};
module.exports = pages;


