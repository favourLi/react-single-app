import React , { useState, useRef, useEffect } from 'react';
import {  Route, useHistory, useRouteMatch , withRouter} from 'react-router-dom';
import {Popover} from 'antd';
import './menu.less';
import { lib } from '../index'
import {RightOutlined , BackwardOutlined , ForwardOutlined } from '@ant-design/icons'
import VerticalScroll from '../component/vertical-scroll';

function openPage(url){
    if(url.indexOf('http://') > -1 || url.indexOf('https://') > -1){
        url = url.replace('?' , `/${new Date().getTime()}?`)
        window.open(url);
    }
    else if(url){
        url = url.replace('//' , '/');
        lib.openPage(url);
    }
}
var isMatch = url => window.location.pathname.indexOf(url) == 0 && url != '' && url != '/';


function Group({item}){
    let [isOpen , setOpen] = useState(false);
    let match = isMatch(item.url);
    useEffect(() => {
        if(match){
            setOpen(true);
        }
    } , []);
    let height = '48px';
    if(isOpen && item.list?.length){
        height = 48 + item.list.length * 48 + 'px';
    }
    let transform = `rotate(${isOpen ? 90 : 0}deg)`;
    return (
        <div className='group' style={{height}}>

            <div className={`item ${match ? 'active-sub' : ''}`} onClick={() => item.list?.length == 0 ? openPage(item.url) :  setOpen(!isOpen)}>
                <span className='icon' dangerouslySetInnerHTML={{__html : item.icon}}></span>
                {item.title}
                {item.list?.length > 0 && <RightOutlined  className='icon-down'  style={{fontSize : '14px' , transform}} />}
                
            </div>
            {
                item.list?.map((sub , key) => 
                    <div onClick={() => openPage(item.url + sub.url)} 
                        className={`item ${isMatch(item.url + sub.url.split('?')[0]) ? 'active' : ''}`} key={key}>
                            {sub.title}
                    </div>)
            }
        </div>
    )
}

function PopoverGroup({item}){
    let subList = item.list || [item]
    return (
        <Popover placement={"right"}  content={
            subList.map((sub , key) => 
            <div onClick={() => openPage(item.url + sub.url)} 
                className={`item ${isMatch(item.url + sub.url.split('?')[0]) && 'active'}`} key={key}>
                    {sub.title}
            </div>)
        } overlayClassName='react-single-app-popover'>
            <div className={`item ${isMatch(item.url) && 'active'}`} onClick={() => openPage(item.url)}>
                <span className='icon' dangerouslySetInnerHTML={{__html : item.icon}}></span>
            </div>
        </Popover>
    )
}

function Menu({menuList}) {
    let [menuType , setMenuType] = useState(localStorage[`/style/menuType`] || 'col');
    return (
        <div className='app-menu'>
            
            <div className={`app-menu-main ${menuType}`}>
                <VerticalScroll style={{width : menuType == 'mini' ? '64px' : '240px' , height : '100%'}}>
                    {menuList.map((item , key) => 
                        menuType == 'col' ?
                        <Group key={key} item={item} menuType={menuType} /> :
                        <PopoverGroup key={key} item={item}  />
                    )}
                </VerticalScroll>
               
            </div>
            <div className={`shrink`} onClick={() => {
                let newType = menuType == 'col' ? 'mini' : 'col';
                setMenuType(newType);
                localStorage[`/style/menuType`] = newType;
            }}>
                {
                    menuType == 'mini' ? <ForwardOutlined /> :  <BackwardOutlined /> 
                }
                
            </div>            
        </div>
    );
}

export default withRouter(Menu);