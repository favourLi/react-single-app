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
const pageMap = {
    'warehouse': Test,
    'warehouse-detail': TestDetail ,
    'config-center' : ConfigCenter ,
    'doc' : Doc , 
    'user-center' : UserCenter ,
    'item-center' : ItemCenter,
    'brand-center' : BrandCenter
}

const user = {
    name : 'admin' ,
    activeSystem : 0 ,
    systemList : [{
        name : 'OMS 小二后台',
        url : ''
    }],
    logout:() => {
        alert('退出系统方法')
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