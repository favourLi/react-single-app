import React, { useState, useMemo, useEffect } from 'react';
import './header.less';
import { Drawer } from 'antd';
import {lib} from '../index'
import {UserOutlined , CloudDownloadOutlined , LogoutOutlined , DownOutlined , SwapOutlined} from '@ant-design/icons';
import {Popover , Menu , Button , Modal , Dropdown} from 'antd';
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
    logoColor,
    systemSelectColor,
    systemSelectBackgroundColor
}){
    var css = `
        .app-menu , .header.top{
            background: ${backgroundColor};
            border-color: ${borderColor};
        }
        .app-menu .logo{
            color: ${logoColor};
        }
        .app-menu .item  {
            color:${itemColor};
        }
        .app-menu .item:hover {
            color:${hoverColor};
            background: ${hoverBackgroundColor};
        }
        .app-menu .item.active-sub , .app-menu .shrink {
            color: ${selectSubColor};
        }
        .app-menu .item.active , .app-menu .shrink {
            color: ${selectColor};
            background : ${selectBackgroundColor};
        }
        .app-menu .item.active:after{
            background: ${selectRightBackgroundColor};
        }
        .app-header .system-list .active , .app-header .system-list div:hover{
            background: ${systemSelectBackgroundColor};
            color: ${systemSelectColor};
        }

    `
    var style = document.createElement('style');
    style.innerHTML = css;
    document.head.append(style)
}


function SystemSet(){
    let [visible , setVisible] = useState(false);
    let [list , setList] = useState([]);
    let [activeStyle , setActiveStyle] = useState(null)
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
                setStyle(list.sort(() => Math.random() - Math.random())[0]);
            }
        });
        try{
            setStyle(JSON.parse(localStorage[`/style`]));
        }catch(e){
            // console.error(e);
        }
    } , []);


    return (
        <div className='system-set' >
            <span className='set' onClick={() => setVisible(true)}>&#xe91e;</span>
            <Drawer
                placement="right"
                onClose={() => setVisible(false)}
                visible={visible}
                className='system-set'
                style={{top : 56 }}
                mask={false}
            >
                <div className='system-set' style={{ marginTop: '-32px' , marginLeft:'-12px' , marginRight:'-12px' }}>
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

function ChangeAccount(){
    let [list ,setList] = useState([]);
    let [visible , setVisible] = useState(false);
    useEffect(() => {
        lib.request({
            url : '/ucenter-account/current/masterUserList',
            success : data => setList(data)
        })
    } , [])

    return (
        list?.length > 1 && 
        <>
            <div className='item' onClick={() => setVisible(true)}>
                <SwapOutlined  style={{marginRight : '10px'}} />切换账号
            </div>
            <Drawer
                placement="right"
                closable={false}
                onClose={() => setVisible(false)}
                visible={visible}
                closable
                className='react-single-app-change-account'
                style={{top : 56 }}
                mask={false}
            >
                <div className='title'>切换账号</div>
                {
                    list.map(item => 
                        <div  className={`item ${item.active && 'active'}`} key={item.id}
                        onClick={() => {
                            if(!item.active){
                                lib.request({
                                    url : '/ucenter-account/token/login',
                                    data : {
                                        masterUserName : item.name
                                    },
                                    needMask : true,
                                    success : () => {
                                        window.location = window.location.origin;
                                    }
                                })
                            }
                        }}
                        > {item.name}</div>    
                    )
                }
            </Drawer>

        </>
    )
}


function User(){
    let [name , setName] = useState('')
    useEffect(()=> {
        lib.request({
            url: '/ucenter-account/current/userInfo',
            success: data => setName(data.userName)
        })
    } , [])
    const menu = (
        <Menu>
            <Menu.Item>
                <div className='item' onClick={() => lib.openPage('/personal-center?page_title=个人中心')}>
                    <UserOutlined style={{marginRight : '10px'}} />个人中心
                </div>
            </Menu.Item>
            <Menu.Item>
                <div className='item'  onClick={() => lib.openPage('/download-center?page_title=下载中心')}>
                    <CloudDownloadOutlined style={{marginRight : '10px'}} />下载中心
                </div>
            </Menu.Item>
            <Menu.Item>
                <ChangeAccount />
            </Menu.Item>
            <Menu.Item >
                <div className='item logout'  onClick={() => {
                    lib.request({
                        url: '/ucenter-admin/logout' ,
                        success:() => window.location.reload()
                    })
                }}><LogoutOutlined style={{marginRight : '10px'}} />退出登录</div>
            </Menu.Item>
        </Menu>
      );

    return (
        <div className='user'>
            <Dropdown overlay={menu} arrow placement="bottomCenter"  overlayClassName='react-single-app-user'>
                <span>{name}</span>
            </Dropdown>
        </div>
    )
}


function Header(){
    let [systemList , setSystemList] = useState([]);
    useEffect(() => {
        lib.request({
            url : '/ucenter-account/current/user/systemList',
            success : (list) => setSystemList(list)
        })
    } , [])
    return (
        <div className='app-header'>
            <div className='logo'>
                <img src='https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg' />代塔供应链协作平台
            </div>
            <div className='system-list'>
                {
                    systemList.map(system => 
                        <div key={system.systemCode} onClick={() => window.location = system.url} className={system.systemCode == lib.config.systemCode ? 'active' : ''}>
                            {system.name}
                        </div>
                    )
                }
            </div>
            <User   />
            <SystemSet   />
        </div>
    )
}


export default Header;

















