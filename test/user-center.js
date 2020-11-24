import React, { Component } from 'react';
import './user-center.less';
import {ConfigCenter} from '../src/index';
import {Button} from 'antd';
class UserCenter extends ConfigCenter{
    getMainImage(row){
        return ('')
    }
    getUserId(row){
        return  <div className='link' onClick={() => {
            this.setDetailData(row);
        }}>{row.id}</div>
    }
    renderDetail(data){
        return <div>{data.id}</div>
    }


    renderRowExpand(row){
        if(row.id % 2 == 0){
            return <table>
                <tr><th>ID</th><th>名字</th></tr>
                <tr><td>{row.id}</td><td>哈哈</td></tr>
                <tr><td>{row.id}</td><td>嘻嘻</td></tr>
            </table>
        }
    }
    handle(row){
        return <div className='link' onClick={() => {
            this.setDetailData(row);
        }}>详情</div>
    }
    renderDetail(row){
        return <div>
            <div>{row.id}</div>
            <div>{row.name}</div>
        </div>
    }
    renderRightOperation(){
        return <Button type='primary' style={{marginRight : '15px'}}>测试</Button>
    }

}


export default UserCenter;
