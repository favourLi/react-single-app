import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { App, ConfigCenter, Uploader , lib} from '../index';
import Test from './test';
import TestDetail from './test-detail'
import 'antd/dist/antd.css';
import Doc from './doc';
import UserCenter from './user-center';

const pageMap = {
    'warehouse': Test,
    'warehouse-detail': TestDetail ,
    'config-center' : ConfigCenter ,
    'doc' : Doc , 
    'user-center' : UserCenter
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
        '*': 'http://danding-gateway-test.yang800.com'
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