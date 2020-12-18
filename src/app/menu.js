import React, { useState, useRef, useEffect } from 'react';
import {  Route, useHistory, useRouteMatch , withRouter} from 'react-router-dom';
import {Popover} from 'antd';
import './menu.less';
import { lib } from '../index'
import {RightOutlined } from '@ant-design/icons'
import VerticalScroll from '../component/vertical-scroll';
function openPage(item){
    if(item.url){
        lib.openPage(item.url);
    }
}

function isMatch(item){
    var reg = /(^\/(\w|-)+|config_id=\w+)/g;
    var urlMatch = item.url?.match(reg);
    var locationMatch = `${location.pathname}${location.search}`.match(reg);
    return urlMatch?.length > 0 && urlMatch?.join('-') === locationMatch?.join('-');
}


function Group({item , activeItem , activeSubItem , menuType}){
    let [isOpen , setOpen] = useState(false);
    let height = '48px';
    if(isOpen && menuType != 'mini' && item.list?.length){
        height = 48 + item.list.length * 48 + 'px';
    }
    let transform = `rotate(${isOpen ? 90 : 0}deg)`;
    let oneClass = 'item ';
    if(item === activeItem){
        oneClass = 'item active';
    }
    if(item.list?.indexOf(activeSubItem) > -1){
        oneClass = 'item active-sub'
    }
    return (
        <div className='group' style={{height}}>
            <div className={oneClass} onClick={() => item.list?.length == 0 ? openPage(item) :  setOpen(!isOpen)}>
                <span className='icon' dangerouslySetInnerHTML={{__html : item.icon}}></span>
                {item.title}
                {item.list?.length > 0 && <RightOutlined  className='icon-down'  style={{fontSize : '14px' , transform}} />}
                
            </div>
            {
                item.list?.map((sub , key) => 
                    <div onClick={() => openPage(sub)} 
                        className={`item ${sub === activeSubItem && 'active'}`} key={key}>
                            {sub.title}
                    </div>)
            }
        </div>
    )
}

function PopoverGroup({item , activeItem , activeSubItem , menuType }){
    let subList = item.list || [item]

    return (
        <Popover placement={menuType == 'top' ? 'bottom' : "right"} content={
            subList.map((sub , key) => 
            <div onClick={() => openPage(sub)} 
                className={`item ${sub === activeSubItem && 'active'}`} key={key}>
                    {sub.title}
            </div>)
        } overlayClassName='react-single-app-popover'>
            <div className={`item ${item === activeItem && 'active'}`} onClick={() => openPage(item)}>
                {menuType == 'top' ? item.title : <span className='icon' dangerouslySetInnerHTML={{__html : item.icon}}></span>}
            </div>
        </Popover>
    )
}

function ColMenu({list , menuType , setMenuType , activeItem , activeSubItem , systemList}){
    return (
        <div className='react-single-app-menu'>
            <div className={`react-single-app-menu-main ${menuType}`} >
                <div className='logo'>
                    {
                        menuType == 'mini' ? 
                        <span className='mini'>&#xe70f;</span> : 
                        <span>&#xe70e;</span>
                    }
                    {systemList.length > 0 && systemList[0].name}
                </div>
                <VerticalScroll style={{width : menuType == 'mini' ? '64px' : '240px' , height : 'calc(100% - 56px)'}}>
                    {
                        list.map((item,key) =>  menuType == 'col' ?
                            <Group item={item} menuType={menuType} activeItem={activeItem} activeSubItem={activeSubItem} key={key} /> : 
                            <PopoverGroup item={item} menuType={menuType} activeItem={activeItem} activeSubItem={activeSubItem} key={key}  />
                        ) 
                    }
                </VerticalScroll>
                
            </div>
            <div className={`shrink ${menuType}`} onClick={() => {
                let newType = menuType == 'col' ? 'mini' : 'col';
                setMenuType(newType);
                localStorage[`/style/menuType`] = newType;
            }}></div>
        </div>
    )
}

function TopMenu(props){
    return (
        <div className='react-single-app-menu top'>
            {
                props.list.map((item,key) =>  
                    <PopoverGroup {...props} item={item} key={key}  />
                ) 
            }
        </div>
    )
}


function Menu({menuList:list , menuType , setMenuType , systemList}){
    let activeItem = null;
    let activeSubItem = null;
    list.map(item => {
        item.icon = item.icon || '&#xe89a;';
        if(isMatch(item)){
            activeItem = item;
        }
        item.list?.map(sub => isMatch(sub) && (activeItem = item , activeSubItem = sub))
    })
    let props = {list , menuType , setMenuType , activeItem , activeSubItem , systemList}

    return menuType == 'top' ? <TopMenu {...props} /> : <ColMenu {...props} />
}




export default withRouter(Menu)