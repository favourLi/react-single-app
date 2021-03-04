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
import GoodManage from './good-manage';
import axios from 'axios';

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
    'personal-center' : PersonalCenter , 
    'good-manage' : GoodManage
}

// axios.get('http://127.0.0.1:9100/api/data/all-student').then(res => console.log(res))


// lib.setConfig({
//     webToken : 'admin' , 
//     systemCode : 'CCS_ADMIN'
// })
lib.setConfig({
    webToken: 'user',
    systemCode: "ARES_WEB",
    env : 'pre'
})
// lib.setConfig({
//     webToken : 'user',
//     systemCode : 'DT_WMS'
// })

// lib.setConfig({
//     webToken : 'admin' , 
//     systemCode : 'ACCOUNT_ADMIN'
// })



// var name = 'jsonp' + new Date().getTime() + parseInt(Math.random() * 1000);

// window[name] = function(list){
//     console.log(list)
// }
// var script = document.createElement('script');
// script.src = `http://127.0.0.1:9100/api/data/all-student/${name}`;
// document.body.appendChild(script);


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