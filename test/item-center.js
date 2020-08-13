import React, { Component } from 'react';
import './user-center.less';
import { ConfigCenter } from '../src/index';
import './item-center.less';


class ItemCenter extends ConfigCenter {
    getMainImage(row){
        return (
            <img style={{margin: '10px 0'}} src={`${row.mainImage}?x-oss-process=image/resize,h_60`} />
        )
    }
    go(row){
        return (
            <a href={`http://gongxiao.yang800.cn/item.htm?id=${row.id}`} target='_blank' >查看</a>
        )
    }
}


export default ItemCenter;
