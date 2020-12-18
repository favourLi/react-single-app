import React, { useEffect , useContext, useState} from 'react';
import {lib} from '../index';
import './account.less';
import {Checkbox , Button , message} from 'antd';



function getMaxLevel(list , checkSet){
    let maxLevel = 1;
    function getNum (item , level = 0 ){
        maxLevel = Math.max(maxLevel , level);
        item.num = 0;
        if(item.auth == 1){
            checkSet.add(item.id);
        }
        if(item.list && item.list.length > 0 ){
            item.list.map(child => {
                item.num += getNum(child , level + 1)
            });
        }else{
            item.num = 1;
        }
        return item.num;
    }
    getNum({list});
    return maxLevel
}


function PermissionManage(){
    let [checkSet] = useState(new Set());
    let [detail , setDetail] = useState({});
    let [list , setList] = useState([]);
    let systemTarget = lib.config.webToken == 'admin' ? '/ucenter-admin' : '/ucenter-customer';
    let systemCode = lib.config.systemCode;
    let roleId = lib.getParam('roleId');
    let maxLevel = getMaxLevel(list , checkSet);
    useEffect(() => {
        lib.request({
            url : `${systemTarget}/role/details`,
            data : {
                systemCode ,
                id : roleId,
            },
            success: data => {
                setDetail(data)
            }
        })
        lib.request({
            url : `${systemTarget}/role/permission/menuTree`,
            data : {
                systemCode ,
                roleId ,
            },
            success : list => {
                setList(list) 
            }
        })
    } , [])

    return (
        <div className='react-single-app-permission-manage'>
            <div className='page-title'>正在为<span>{detail.systemName}</span>系统，<span>{detail.name}</span>角色分配权限</div>
            <table>
                <thead>
                    <tr>
                        <th>一级菜单</th>
                        <th>二级菜单</th>
                        {maxLevel >2 && <th>三级菜单</th>}
                        <th>按钮</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        list.map((item1,index1) => {
                            if(!item1.list || item1.list.length == 0){
                                item1.list = [{}];
                            }
                            return item1.list.map((item2 , index2) => {
                                if(!item2.list || item2.list.length == 0){
                                    item2.list = [{}];
                                }
                                return item2.list.map((item3 , index3) => {
                                    let buttons = item3.buttons || item2.buttons || item1.buttons;
                                    return (
                                        <tr key={`${index1}-${index2}-${index3}`}>
                                            {
                                                index2 == 0 && index3 == 0 && 
                                                    <td rowSpan={item1.num}>
                                                        <Checkbox defaultChecked={item1.auth == 1} onChange={e => {
                                                            e.target.checked ? checkSet.add(item1.id) : checkSet.delete(item1.id)
                                                        }}>{item1.title}</Checkbox>
                                                    </td>
                                            }
                                            {
                                                index3 == 0 && 
                                                    <td rowSpan={item2.num}>
                                                        {
                                                            item2.title && <Checkbox defaultChecked={item2.auth == 1} onChange={e => {
                                                                e.target.checked ? checkSet.add(item2.id) : checkSet.delete(item2.id)
                                                            }}>{item2.title}</Checkbox>
                                                        }
                                                    </td>
                                            }
                                            {
                                                maxLevel > 2 && 
                                                <td>
                                                    {
                                                        item3.title && <Checkbox defaultChecked={item3.auth == 1} onChange={e => {
                                                            e.target.checked ? checkSet.add(item3.id) : checkSet.delete(item3.id)
                                                        }}>{item3.title}</Checkbox>
                                                    }
                                                </td>
                                            }
                                            
                                            <td>
                                                {
                                                    buttons.map((button , index) => 
                                                        <span key={index}>
                                                            <Checkbox style={{marginRight : '10px'}} defaultChecked={button.auth == 1} onChange={e => {
                                                                e.target.checked ? checkSet.add(button.id) : checkSet.delete(button.id)
                                                            }}>{button.title}</Checkbox>
                                                        </span>
                                                    )
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                            })
                        })
                    }
                </tbody>
            </table>
            <div className='ft'><Button type='primary' style={{width : '120px'}} onClick={() => {
                lib.request({
                    url : `${systemTarget}/role/permission/update` , 
                    data : {
                        roleId , 
                        permissionId : [...checkSet]
                    },
                    needMask : true ,
                    success : () => message.success('操作成功')
                })
            }}>保存</Button></div>
        </div>
    )

}



export default PermissionManage;