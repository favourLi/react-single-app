import React, { Component } from 'react';
import './user-center.less';
import {ConfigCenter} from '../src/index';

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
                <tr><th>ID</th></tr>
                <tr><td>{row.id}</td></tr>
            </table>
        }
    }

}


export default UserCenter;
