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




lib.setConfig({
    webToken : 'admin' , 
    systemCode : 'CCS_ADMIN'
})
// lib.setConfig({
//     webToken : 'user' , 
//     systemCode : 'ARES_WEB'
// })




class Index extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return (
            <App
                pageMap={pageMap}
                configList={json_data}
            />
        )
        
    }
}



ReactDOM.render(<Index /> , document.getElementById('root'));
// ReactDOM.render(<ConfigCenter configList={json_data} /> , document.getElementById('root'));