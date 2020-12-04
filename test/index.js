import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { App, ConfigCenter , Outlet, lib , ImportExcel , Uploader , PersonalCenter} from '../src/index';
import Test from './test';
import TestDetail from './test-detail'
import Doc from './doc';
import UserCenter from './user-center';
import ItemCenter from './item-center';
import BrandCenter from './brand-center';
import OrderList from './order-center/index';
import OrderDetail from './order-center/detail';

const pageMap = {
    'warehouse': Test,
    'warehouse-detail': TestDetail ,
    'config-center' : ConfigCenter ,
    'doc' : Doc , 
    'user-center' : UserCenter ,
    'item-center' : ItemCenter,
    'brand-center' : BrandCenter,
    'order': OrderList,
    'order-detail': OrderDetail,
    'admin-user-center' : Outlet , 
    'import-excel' : ImportExcel ,
    'uploader' : Uploader,
    'personal-center' : PersonalCenter
}

const user = {
    name : 'admin' ,
    activeSystem : 0 ,
    systemList : [{
        name : 'OMS 小二后台',
        url : ''
    },{
        name : '测试后台1',
        url : ''
    }],
    goUserCenter: () => {
        lib.openPage('/abc?page_title=123')
    },
    logout:() => {
        lib.request({
            url: '/ucenter-admin/logout' ,
            success:() => {
                if(window.location.host.indexOf('yang800.com') > -1){
                    window.location = '//login.yang800.com';
                }else{
                    window.location = '//login.yang800.cn';
                }
                
            }
        })
    }
}

function dealData(list , id , fn){
    var config = list.find((item) => item.id == id);
    config ? fn(config) : console.error(`找不到id:${id}的配置`);
}

dealData(json_data , 1597199079828173 , (config) => {
    config.searchKeyList.push({
        key : 'smallPrice,bigPrice',
        type : 'range',
        label:'价格'
    });

    dealData(config.tableFieldList , 1597200158410388 , (field) => {
        field.type = 'function';
        field.key = 'getUserId';
    })
})

dealData(json_data , 1597199079828173 , (config) => {
    config.excel.export = '/ccs/hsCode/exportExcelByDownLoadCenter';
    config.excel.import = '/abc'
})



lib.setConfig({
    webToken : 'admin'
})


menu_data.push({
    title : '账号管理 - 小二' , 
    url: '/admin-user-center/1603173834935?config_id=1602392556225207&page_title=账号管理-小二&systemCode=CCS_ADMIN',
},{
    title : 'react-single-app',
    icon: '&#xe8b9;',
    list:[{
        title : '导入',
        url : '/import-excel?page_title=导入'
    },{
        title : '下载中心' ,
        url : '/download-center?page_title=下载中心'
    }]
})


class Index extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return (
            <App
                pageMap={pageMap}
                configList={json_data}
                systemCode='SUPPLY_ADMIN'
            />
        )
        
    }
}



ReactDOM.render(<Index /> , document.getElementById('root'));
// ReactDOM.render(<ConfigCenter configList={json_data} /> , document.getElementById('root'));