import React, { useState, useMemo } from 'react';
import './header.less';
import { Drawer } from 'antd';
import { createMenuStyle, createTopStyle } from './create-style';
import {lib} from '../index'



function SystemSet({mode , setColMenu}){
    let [visible , setVisible] = useState(false);
    let [refresh , setRefresh] = useState(0);
    let {col , top , type} = mode;
    let currentMode = mode[type];
    function set(){
        if (type == 'col') {
            createMenuStyle(currentMode.list[currentMode.active]);
        }
        else {
            createTopStyle(currentMode.list[currentMode.active]);
        }
        localStorage[`/style/type`] = type;
        localStorage[`/style/colActiveId`] = col.list[col.active].id;
        localStorage[`/style/topActiveId`] = top.list[top.active].id;
    }
    set();
    return (
        <div className='system-set' >
            <div className='set' onClick={() => setVisible(true)}>&#xe91e;</div>
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
                        <li className={type == 'col' ? 'checked' : ''} onClick={() => {
                            mode.type = 'col';
                            setColMenu(true);
                            lib.wait(500);
                        }}>
                            <img src={mode.col.thumb} />
                            侧边导航
                        </li>
                        <li className={type == 'top' ? 'checked' : ''} onClick={() => {
                            mode.type = 'top';
                            setColMenu(false);
                            lib.wait(500);
                        }}>
                            <img src={mode.top.thumb} />
                            顶部导航
                        </li>
                    </ul>
                    <h3>皮肤设置</h3>
                    <ul className='style'>
                        {
                            currentMode.list.map((style , index) => 
                                <li key={index} className={index == currentMode.active ? 'checked' : ''} style={{backgroundColor : style.backgroundColor}} onClick={() => {
                                    currentMode.active = index;
                                    setRefresh(++refresh);
                                    lib.wait(500);
                                }}>
                                    <div>{style.name}</div>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </Drawer>
        </div>
    )
}



function User({user}){

    return (
        <div className='user'>
            {
                user.systemList && user.systemList.length && 
                <div className={`system ${user.systemList.length == 1 ? 'alone' : ''}`}>
                    {user.systemList[user.activeSystem].name}
                    {
                        user.systemList.length > 1 && 
                        <div className='header-tip'>
                            <div className='list'>
                                {
                                    user.systemList.map((system, index) =>
                                        user.activeSystem != index && <div key={index} onClick={() => window.location = system.url}>{system.name}</div>
                                    )
                                }
                            </div>
                        </div>
                    }
                    
                </div>
            }
            
            <div className='name'>
                {user.name}
                <div className='header-tip'>
                    <div className='list'>
                        <div onClick={user.goUserCenter}><span>&#xe631;</span>用户中心</div>
                        <div onClick={user.logout}><span>&#xe635;</span>退出登录</div>
                    </div>
                </div>
            </div>
        </div>
    )
}









export {User , SystemSet};

















