import React, { useState, useMemo } from 'react';
import './header.less';
import { Drawer } from 'antd';
import { createMenuStyle, createTopStyle } from './create-style';




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
        <div className='system-set'>
            <div className='set' onClick={() => setVisible(true)}>&#xe91e;</div>
            <Drawer
                placement="right"
                closable={false}
                onClose={() => setVisible(false)}
                visible={visible}
                closable
                className='system-set'
                style={{top : 56}}
                mask={false}
            >
                <div className='system-set'>
                    <h3>导航模式</h3>
                    <ul className='mode'>
                        <li className={type == 'col' ? 'checked' : ''} onClick={() => {
                            mode.type = 'col';
                            setColMenu(true);
                            lib.wait(500);
                        }}>
                            <img src={mode.col.thumb} />
                        </li>
                        <li className={type == 'top' ? 'checked' : ''} onClick={() => {
                            mode.type = 'top';
                            setColMenu(false);
                            lib.wait(500);
                        }}>
                            <img src={mode.col.thumb} />
                        </li>
                    </ul>
                    <h3>风格设置</h3>
                    <ul className='style'>
                        {
                            currentMode.list.map((style , index) => 
                                <li key={index} className={index == currentMode.active ? 'checked' : ''} style={style} onClick={() => {
                                    currentMode.active = index;
                                    setRefresh(++refresh);
                                    lib.wait(500);
                                }}></li>
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
            <div className='system'>
                {user.systemList[user.activeSystem].name}
                <div className='header-tip'>
                    <div className='list'>
                        {
                            user.systemList.map((system , index) => 
                                user.activeSystem != index && <div key={index} onClick={() => window.location = system.url}>{system.name}</div>
                            )
                        }
                    </div> 
                </div>
            </div>
            <div className='name'>
                {user.name}
                <div className='header-tip'>
                    <div className='list'>
                        <div onClick={user.logout}><span>&#xe635;</span>退出登录
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}









export {User , SystemSet};

















