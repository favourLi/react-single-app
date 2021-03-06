import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { App, ConfigCenter , Outlet, lib , ImportExcel , Uploader} from '../src/index';
import Test from './test';
import TestDetail from './test-detail'
// import 'antd/dist/antd.css';
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
    'uploader' : Uploader
}

const user = {
    name : 'admin' ,
    activeSystem : 0 ,
    systemList : [{
        name : 'OMS 小二后台',
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

// dealData(json_data , 1597199079828173 , (config) => {
//     config.searchKeyList.push({
//         key : 'smallPrice,bigPrice',
//         type : 'range',
//         label:'价格'
//     });

//     dealData(config.tableFieldList , 1597200158410388 , (field) => {
//         field.type = 'function';
//         field.key = 'getUserId';
//     })
// })




lib.setConfig({
    webToken : 'admin'
})


menu_data.push({
    title : '账号管理 - 小二' , 
    url: '/warehouse/1603173834935?config_id=1604481092103925&page_title=账号管理-小二&systemCode=CCS_ADMIN',
},{
    title : '导入',
    url : '/import-excel?page_title=导入'
})


class Index extends Component{
    constructor(props){
        super(props)
        lib.request({
            url: '/ucenter-admin/current/userInfo',
            success: (data) => {
            }
        })
    }

    render(){
        return (
            <App
                pageMap={pageMap}
                menuList={menu_data}
                colStyleList={mode_list.col}
                topStyleList={mode_list.top}
                configList={json_data}
                user={user}
            />
            
        )
        
    }
}



ReactDOM.render(<Index /> , document.getElementById('root'));
// ReactDOM.render(<ConfigCenter configList={json_data} /> , document.getElementById('root'));