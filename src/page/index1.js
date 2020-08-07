import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {App , ConfigCenter} from '../index';
import Test from './test';
import TestDetail from './test-detail'
import 'antd/dist/antd.css';
const pageMap = {
    'warehouse': Test,
    'warehouse-detail': TestDetail ,
    'config-center' : ConfigCenter
}

const user = {
    name : 'admin' ,
    activeSystem : 0 ,
    systemList : [{
        name : 'OMS 小二后台',
        url : ''
    }, {
        name: 'CCS 云仓平台',
        url: ''
    }, {
        name: 'EIMS 物流平台',
        url: ''
    }, {
        name: '供俏平台',
        url: ''
    }],
    logout:() => {
        alert('退出系统方法')
    }
}



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