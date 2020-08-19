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
    logout:() => {
        lib.request({
            url: '/ucenter-admin/logout' ,
            client: {
                clientId: '9E514E70AD7D485986D687F64616C662',
                clientSecret: '33F14542BB274284B63147E6C8F3DF9E'
            },
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
    clientId: '74EDE65E37AB4C549E79F1B0AC540AB8' , 
    clientSecret: '038D453DCA1A467293058BBCC31169BC',
    hostPrefixMap : {
        '*': 'http://danding-gateway.yang800.cn',
        'admin.gongxiao.yang800.com': 'http://danding-gateway.yang800.com'
    }
})



class Index extends Component{
    constructor(props){
        super(props)
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