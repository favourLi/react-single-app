import React, { Fragment, useMemo } from 'react';
import { Route, Link } from 'react-router-dom';
import './navigation.less';
import {lib , event , App , ConfigCenter} from '../index'

function Navigation({pageList }){
    return (
        <ul className='navigation'>
            {
                pageList.map((item, index) =>
                    <Route key={index} path={item.url.split('?')[0]} children={(props) =>
                        <li title={lib.getParam('page_title' , item.url)} 
                            className={(props.match ? 'active ' : '') }>
                            <Link to={item.url}>
                                {lib.getParam('page_title', item.url)}
                            </Link>
                            {
                                props.match &&
                                <div className='close' onClick={() => {
                                    event.emit('delete-page')
                                }}>&#xe60c;</div>
                            }
                        </li>
                    } />

                )
            }
        </ul>
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
        <Fragment>
            {
                pageList.map((item) => {
                    var names = item.url.split('/');
                    var name = names[0] || names[1];
                    var Page = pageMap[name];
                    var path = item.url.split('?')[0];
                    if (!Page){
                        console.error(`can't find page for name ${name}`)
                        return (<div></div>)
                    }
                    return (
                        <Route key={path} path={path} children={(props) => 
                            <MemoPage match={props.match} Page={Page} name={name} configList={configList} />
                        }/>
                    )
                })
            }
        </Fragment>
    )
}



export {Navigation , NavigationBody};