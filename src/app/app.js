import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import Menu from './menu';
import {User , SystemSet} from './header';
import {Navigation , NavigationBody} from './navigation';
import './app.less';
import {event} from '../index'
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
    let history = useHistory();
    useMemo(()=> {
        mode = Object.assign(mode, {
            col: {
                active: 0,
                isFull: true,
                thumb: 'https://dante-img.oss-cn-hangzhou.aliyuncs.com/97402116582.png',
                list: colStyleList
            },
            top: {
                active: 0,
                thumb: 'https://dante-img.oss-cn-hangzhou.aliyuncs.com/97402116525.png',
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
            history.push(page.url);
        });
        event.on('delete-page' , () => {
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
        })
    } , [])
    return (
        <ConfigProvider locale={zhCN}>
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



