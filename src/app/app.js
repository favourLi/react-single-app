import React, { useState, useEffect, useMemo , createContext , useContext } from 'react';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import Menu from './menu1';

import Header from './header';
import Navigation  from './navigation';

import {lib , event} from '../index'
import DownloadCenter from '../page/download-center';
import ImportExcel from '../page/import-excel';
import PersonalCenter from '../page/personal-center';
import PermissionManage from '../account/permission-manage';
import AccountManage from '../account/account-manage';
import RoleManage from '../account/role-manage';
import ImportData from '../page/import-data';
import {message} from 'antd';
import './app.less';
/**
 * 
 * @param {pageMap} props 组件路由映射表
 * @param {configList} props 配置列表
 * @param {systemCode} props 系统编码
 */

function App({ pageMap = {} ,  configList = [] }){
    let [pageList, setPageList] = useState([]);
    let [menuType , setMenuType] = useState(localStorage[`/style/menuType`] || 'col');
    let history = useHistory();
    let [menuList , setMenuList] = useState([]);
    
    pageMap = {
        ...pageMap , 
        'import-excel' : ImportExcel ,
        'download-center' : DownloadCenter , 
        'personal-center' : PersonalCenter ,
        'permission-manage' : PermissionManage , 
        'account-manage' : AccountManage ,
        'role-manage' : RoleManage , 
        'import-data' : ImportData
    }
    function closePage({url}){
        let current = decodeURIComponent(window.location.pathname + window.location.search);
        if(!url){
            url = current;
        }
        let index = pageList.findIndex(item => item.url == url);
        if(url == current){
            let item = pageList[index - 1] || pageList[index + 1] || {url : ''};
            history.push(item.url )
        }
        pageList.splice(index , 1);
        setPageList([...pageList]);
    }
    function addPage(page){
        page.url = decodeURIComponent(page.url);
        if(!pageList.find(item => item.url == page.url)){
            pageList.push(page);
        }
        history.push(page.url);
        setPageList([...pageList]);
    }
    function init(){
        if(window.location.pathname != '/'){
            pageList.push({
                url: window.location.pathname + decodeURIComponent(window.location.search)
            });
            setPageList([...pageList]);
        }
    }
    useEffect(() => {
        init();
        event.on('add-page', addPage);
        event.on('delete-page' , closePage);
        event.on('close-page' , closePage);
        window.onresize = () => event.emit('window.resize')
    } , []);
    useEffect(() => {
        if(!lib.config.systemCode){
            return message.error('缺少参数systemCode');
        }
        let systemCode = lib.config.systemCode;
        lib.request({
            url : '/ucenter-account/current/menuList' ,
            data : {systemCode},
            success : (data) => setMenuList(data)
        })
    } , []);


    return (
        <ConfigProvider locale={zhCN}>
            <div className='react-single-app' id='react-single-app'>
                <Header  />
                <div className='app-content'>
                    <Menu  menuList={menuList}  />
                    <Navigation pageList={pageList} pageMap={pageMap} configList={configList} />
                </div>
            </div>
        </ConfigProvider>
    )
}

function AppRouterWrap(props){
    return (
        <Router >
            <App {...props} />
        </Router>
    )
}

export default AppRouterWrap;



