import React, { Fragment, useMemo } from 'react';
import { Route, Link , useHistory , withRouter} from 'react-router-dom';
import {lib , event } from '../index'
import {Tabs} from 'antd';

function NavigationHeader({pageList }){
    let history = useHistory();
    let activeKey = decodeURIComponent(window.location.pathname + window.location.search)
    return (
        <div className='navigation-header'>
            <Tabs type="editable-card" hideAdd activeKey={activeKey} onChange={url => history.push(url)} onEdit={url => {
                lib.closePage(url);
            }}>
                {
                    pageList.map((item, index) => 
                    <Tabs.TabPane tab={lib.getParam('page_title', item.url)} key={item.url} closable={true}>
                    </Tabs.TabPane>
                    )
                }
            </Tabs>
        </div>
    )
}
//useMemo

function MemoPage({ match, Page, name, configList}){
    let memoPage = useMemo(() => <Page name={name} configList={configList} />  , []);
    return (
        <div style={{ display: match ? 'block' : 'none' }} className='main-page'>
            {memoPage}
        </div>
    )
}


function NavigationBody({pageList , pageMap , configList}){
    return (
        <div className='navigation-body'>
            {
                pageList.map((item , index) => {
                    var path = item.url.split('?')[0];
                    var names = path.split('/');
                    var name = names.pop();
                    var Page = pageMap[name];
                    let match = decodeURIComponent(window.location.pathname + window.location.search) == decodeURIComponent(item.url);
                    if (!Page){
                        console.error(`can't find page for name ${name}`)
                        return (<div key={index}></div>)
                    }
                    return (
                        <Route key={item.url} path={path} children={(props) => 
                            <MemoPage match={match}  Page={Page} name={name} configList={configList} />
                        }/>
                    )
                })
            }
        </div>
    )
}


function Navigation({pageList , pageMap , configList}){
    return (
        <div className='app-navigation'>
            <NavigationHeader pageList={pageList} />
            <NavigationBody pageList={pageList} pageMap={pageMap} configList={configList} />
        </div>
    )
}


export default withRouter(Navigation);