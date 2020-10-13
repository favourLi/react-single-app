import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { App, ConfigCenter, Uploader , lib} from '../src/index';
import Test from './test';
import TestDetail from './test-detail'
import 'antd/dist/antd.css';
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
    'order-detail': OrderDetail
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


lib.setConfig({
    login : window.location.host.indexOf('yang800.com') > -1 ? 'http://admin.account.yang800.com/login.htm' : 'http://admin.account.yang800.cn/login.htm'
})

class Index extends Component{
    constructor(props){
        super(props)
        lib.request({
            url: '/ucenter-admin/current/userInfo',
            success: (data) => {
                console.log(data);
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