import React, { useState, useMemo, useEffect } from 'react';
import './header.less';
import { Drawer } from 'antd';
import {lib} from '../index'
import {UserOutlined , CloudDownloadOutlined , LogoutOutlined , DownOutlined} from '@ant-design/icons';
import {Popover , Menu , Button} from 'antd';
import axios from 'axios';



function createMenuStyle({
    backgroundColor, 
    itemColor, 
    hoverColor, 
    hoverBackgroundColor,
    selectSubColor ,
    selectColor,
    selectBackgroundColor,
    selectRightBackgroundColor,
    borderColor ,
    logoColor}){
    var css = `
        .react-single-app-menu , .header.top{
            background: ${backgroundColor};
            border-color: ${borderColor};
        }
        .react-single-app-menu .logo{
            color: ${logoColor};
        }
        .react-single-app-menu .item , .header.top span {
            color:${itemColor};
        }
        .react-single-app-menu .item:hover , .header.top span:hover {
            color:${hoverColor};
            background: ${hoverBackgroundColor};
        }
        .react-single-app-menu .item.active-sub {
            color: ${selectSubColor};
        }
        .react-single-app-menu .item.active {
            color: ${selectColor};
            background : ${selectBackgroundColor};
        }
        .react-single-app-menu .item.active:after{
            background: ${selectRightBackgroundColor};
        }
    `
    var style = document.createElement('style');
    style.innerHTML = css;
    document.head.append(style)
}


function SystemSet({menuType , setMenuType}){
    let [visible , setVisible] = useState(false);
    let [list , setList] = useState([]);
    let [activeStyle , setActiveStyle] = useState(null)
    function setMode(menuType){
        localStorage[`/style/menuType`] = menuType;
        setMenuType(menuType);
        lib.wait(500);
    }
    function setStyle(item){
        setActiveStyle(item);
        localStorage[`/style`] = JSON.stringify(item);
        createMenuStyle(item.colors);
        lib.wait(500);
    }
    useEffect(() => {
        axios.get('http://maria.yang800.com/api/data/86').then((json) => json.data.data)
        .then((list) => {
            setList(list)
            if(!localStorage[`/style`] && list.length > 0){
                setStyle(list.sort((a,b) => Math.random() - Math.random())[0]);
            }
        });
        try{
            setStyle(JSON.parse(localStorage[`/style`]));
        }catch(e){
            // console.error(e);
        }
    } , []);

    let modeList = [
        {
            type : 'col' , 
            className : menuType != 'top' ? 'checked' : '' ,
            img : 'https://dante-img.oss-cn-hangzhou.aliyuncs.com/97402116582.png' , 
            title : '侧边导航'
        },
        {
            type : 'top' , 
            className : menuType == 'top' ? 'checked' : '' ,
            img : 'https://dante-img.oss-cn-hangzhou.aliyuncs.com/97402116525.png' , 
            title : '顶部导航'
        }
    ]

    return (
        <div className='system-set' >
            <span className='set' onClick={() => setVisible(true)}>&#xe91e;</span>
            <Drawer
                placement="right"
                closable={false}
                onClose={() => setVisible(false)}
                visible={visible}
                closable
                className='system-set'
                style={{top : 56 }}
                mask={false}
            >
                <div className='system-set' style={{ marginTop: '-32px' , marginLeft:'-12px' , marginRight:'-12px' }}>
                    <h3>导航方式</h3>
                    <ul className='mode'>
                        {
                            modeList.map(mode => 
                                <li key={mode.type} className={mode.className} onClick={() => setMode(mode.type)}>
                                    <img src={mode.img} />
                                    {mode.title}
                                </li>
                            )
                        }
                    </ul>
                    <h3>皮肤设置</h3>
                    <ul className='style'>
                        {
                            list.map((item , index) => 
                                <li key={index} className={activeStyle?.id === item.id ? 'checked' : '' } style={{backgroundColor : item.mainColor}} onClick={() => setStyle(item)}>
                                    <div>{item.title}</div>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </Drawer>
        </div>
    )
}


function User({systemList}){
    let [name , setName] = useState('')
    useEffect(()=> {
        lib.request({
            url: '/ucenter-account/current/userInfo',
            success: data => setName(data.userName)
        })
    } , [])

    return (
        <div className='user'>
            {
                systemList.length > 0 && 
                    <Popover placement="top" content={
                        systemList.map((system , key) => 
                        <div className='item' key={key} onClick={() => location = system.url}>
                                {system.name}
                        </div>)
                    } overlayClassName='react-single-app-popover'>
                        <span style={{margin: '15px'}}>{systemList[0].name} <DownOutlined /></span>
                    </Popover>
                    
            }
            <Popover placement="top" content={
                <>
                    <div className='item' onClick={() => lib.openPage('/personal-center?page_title=个人中心')}>
                        <UserOutlined style={{marginRight : '10px'}} />个人中心
                    </div>
                    <div className='item' onClick={() => lib.openPage('/download-center?page_title=下载中心')}>
                        <CloudDownloadOutlined style={{marginRight : '10px'}} />下载中心
                    </div>
                    <div className='item' onClick={() => {
                        lib.request({
                            url: '/ucenter-admin/logout' ,
                            success:() => window.location.reload()
                        })
                    }}><LogoutOutlined style={{marginRight : '10px'}} />退出登录</div>
                </>
            } overlayClassName='react-single-app-popover'>
                <span>{name}</span>
            </Popover>
        </div>
    )
}

export {User , SystemSet};

















