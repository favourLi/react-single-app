import React, { useState, useEffect, useMemo } from 'react';
import '../util/lib.js';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import 'antd/dist/antd.css';
import zhCN from 'antd/es/locale/zh_CN';
import Menu from './menu';
import {User , SystemSet} from './header';
import {Navigation , NavigationBody} from './navigation';
import './app.less';
/**
 * 
 * @param {menuList} props 菜单列表
 * @param {pageMap} props 组件路由映射表
 * @param {configList} props 配置列表
 * @param {colStyleList} props 侧边栏样式
 * @param {topStyleList} props 顶部样式
 * @param {user} props 用户
 */

function App({ pageMap = {}, menuList = [], colStyleList=[] , topStyleList=[] , configList = [] , user={}}){
    let [mode ] = useState({});
    let [pageList, setPageList] = useState([]);
    let [isColMenu, setColMenu] = useState(localStorage[`/style/type`] != 'top')
    useMemo(()=> {
        mode = Object.assign(mode, {
            col: {
                active: 0,
                isFull: true,
                thumb: 'https://gw.alipayobjects.com/zos/antfincdn/XwFOFbLkSM/LCkqqYNmvBEbokSDscrm.svg',
                list: colStyleList
            },
            top: {
                active: 0,
                thumb: 'https://gw.alipayobjects.com/zos/antfincdn/URETY8%24STp/KDNDBbriJhLwuqMoxcAr.svg',
                list: topStyleList
            },
            type: 'col'
        })
        if (localStorage[`/style/type`]) {
            mode.type = localStorage[`/style/type`];
            let colActiveId = localStorage[`/style/colActiveId`];
            let topActiveId = localStorage[`/style/topActiveId`];
            mode.col.list.map((item, index) => {
                if (colActiveId == item.id) {
                    mode.col.active = index;
                }
            });
            mode.top.list.map((item, index) => {
                if (topActiveId == item.id) {
                    mode.top.active = index;
                }
            });
        } 
    } , [])
    useEffect(() => {
        if(window.location.pathname != '/'){
            pageList.push({
                url: window.location.pathname + window.location.search
            });
            setPageList([...pageList]);
        }
        event.on('add-page', (page) => {
            pageList.push(page);
            setPageList([...pageList]);
        });
    } , [])
    return (
        <ConfigProvider locale={zhCN}>
            <Router >
                {
                    isColMenu && 
                    <div className='sub-content'>
                        <Menu menuList={menuList} />
                    </div>
                }
                <div className='main-content'>
                    <div>
                        <div className='header'  >
                            {!isColMenu && <Menu menuList={menuList} />}
                            <User user={user} />
                            <SystemSet  mode={mode} setColMenu={setColMenu} />
                        </div>
                    </div>
                    <div>
                        <Navigation pageList={pageList} setPageList={setPageList} />
                    </div>
                    <div className='main'>
                        <NavigationBody pageList={pageList} pageMap={pageMap} configList={configList} />
                    </div>
                </div>
            </Router>
        </ConfigProvider>
    )
}


export default App;



