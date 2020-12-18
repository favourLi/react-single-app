import React, { useState, useEffect, useMemo , createContext , useContext } from 'react';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import Menu from './menu';

import {User , SystemSet} from './header';
import {Navigation , NavigationBody} from './navigation';
import './app.less';
import {lib , event} from '../index'
import DownloadCenter from '../page/download-center';
import ImportExcel from '../page/import-excel';
import PersonalCenter from '../page/personal-center';
import PermissionManage from '../account/permission-manage';
import AccountManage from '../account/account-manage';
import RoleManage from '../account/role-manage';
import {message} from 'antd';

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
    let [systemList , setSystemList] = useState([]);
    pageMap = {
        ...pageMap , 
        'import-excel' : ImportExcel ,
        'download-center' : DownloadCenter , 
        'personal-center' : PersonalCenter ,
        'permission-manage' : PermissionManage , 
        'account-manage' : AccountManage ,
        'role-manage' : RoleManage
    }
    useEffect(() => {
        function closePage(){
            var key = window.location.pathname.split('/').pop();
            var active = -1;
            pageList.map((item , index) => {
                if(item.url.indexOf(key) > -1){
                    active = index;
                }
            })
            if(active > -1){
                pageList.splice(active , 1);
            }
            var item = pageList[active] || pageList[active - 1]
            if(item){
                history.push(item.url);
            }else{
                history.push('/');
            }
            setPageList([...pageList]);
        }

        if(window.location.pathname != '/'){
            pageList.push({
                url: window.location.pathname + window.location.search
            });
            setPageList([...pageList]);
        }
        event.on('add-page', (page) => {
            pageList.push(page);
            history.push(page.url);
            setPageList([...pageList]);
        });
        event.on('delete-page' , closePage);
        event.on('close-page' , closePage);
        event.on('close-other-page' , () => {
            var key = window.location.pathname.split('/').pop();
            var activeItem = pageList.find(item => item.url.indexOf(key) > -1);
            pageList.splice(0);
            pageList.push(activeItem);
            setPageList([...pageList]);
        })
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
        lib.request({
            url : '/ucenter-account/current/user/systemList',
            success : (data) => {
                setSystemList(data.sort((a , b) => b.systemCode.indexOf(systemCode) - a.systemCode.indexOf(systemCode)))
            }
        })

    } , []);


    return (
        <ConfigProvider locale={zhCN}>
            <div className='react-single-app' id='react-single-app'>
                {
                    menuType != 'top' && 
                    <div className='sub-content'>
                        <Menu systemList={systemList} menuList={menuList} menuType={menuType} setMenuType={setMenuType} />
                    </div>
                }
                <div className='main-content'>
                    <div>
                        <div className={'header ' + menuType}  >
                            {menuType == 'top' && <Menu menuList={menuList} menuType='top' />}
                            <User  systemList={systemList} />
                            <SystemSet  menuType={menuType} setMenuType={setMenuType} />
                        </div>
                    </div>
                    {
                        pageList.length > 0 && 
                        <div>
                            <Navigation pageList={pageList} />
                        </div>
                    }
                    
                    <div className='main'>
                        <NavigationBody pageList={pageList} pageMap={pageMap} configList={configList} />
                    </div>
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



