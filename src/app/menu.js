import React, { useState, Fragment } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import './menu.less';

function isChecked(url , location){
    let configId = lib.getParam('config_id' , location.search);
    if(configId){
        return url.indexOf(`config_id=${configId}`) > -1;
    }
    let pathname = location.pathname.split('/')[1];
    return url.indexOf(`/${pathname}/`) > -1 || url.indexOf('/${pathname}?') > -1;
}

function setChecked(item , location){
    if(item.url){
        item.checked = isChecked(item.url , location);
    }
    else{
        item.list && item.list.map((node) => {
            node.checked = isChecked(node.url , location);
            if(node.checked){
                item.subChecked = true;
            }
        })
    }
}


function Menu({menuList:list , type}){
    let [isFull, setFull] = useState(localStorage[`/style/menu/isFull`] == 'true');
    let [refresh, setRefresh] = useState(0);
    localStorage[`/style/menu/isFull`] = isFull;
    return (
        <Route path={''} children={(props) => {
            return (
                <div className={`menu ${isFull ? 'full' : 'smart'}`}>
                    <div className='shrink' onClick={() => {
                        setFull(!isFull);
                    }}></div>
                    <div className='logo'></div>
                    {
                        list.map((item, index) => {
                            setChecked(item , props.location);
                            let mainTitle = (
                                <div className={`main-title ${item.checked || (item.subChecked && !isFull) ? 'checked' : ''}`}>
                                    <span className='icon' dangerouslySetInnerHTML={{ __html: item.icon }}></span>
                                    {item.title}
                                    {item.list.length > 0 && <div className={`icon-down ${item.open ? 'open' : ''}`} >&#xe6c7;</div>}
                                </div>
                            );
                            return (
                                <div className='menu-group' style={{ height: item.open && isFull ? `${48 + item.list.length * 40}px` : '48px' }} key={index} onClick={() => {
                                    item.open = !item.open;
                                    setRefresh(++refresh);
                                }}>
                                    {
                                        item.list && item.list.length > 0 ? mainTitle : lib.getLink(item.url, mainTitle)
                                    }
                                    <div className='sub-box' onClick={(e) => { e.stopPropagation()}}>
                                        <div className='sub-list'>
                                            {item.list && item.list.length > 0 ? item.list.map((sub, key) =>
                                                <Fragment key={key}>
                                                {lib.getLink(sub.url , 
                                                    <div className={sub.checked && isFull ? 'sub-title checked' : 'sub-title'} >
                                                        {sub.title}
                                                    </div>    
                                                )}
                                                </Fragment>
                                                )
                                                :
                                                !isFull && type == 'sub-menu' &&
                                                lib.getLink(item.url , 
                                                    <div className={item.checked ? 'sub-title checked' : 'sub-title'} >
                                                        {item.title}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    
                </div>
            )
        }}
        />
    )
}

export default Menu;