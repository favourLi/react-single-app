import React , {useState , useEffect} from 'react';
import {Space , Button, Row} from 'antd';
import {lib , event, SearchList} from '@/index';
import axios from 'axios';

function ExpandRow({row, expanded}){
    let [item , setItem] = useState();
    useEffect(() => {
        if(!item && expanded){
            lib.request({
                url : '/ares-web/goods/detail' , 
                data : {id : row.id},
                success : data => setItem(data)
            })
        }
    } , [expanded])
    return item ? 
        <div>
            <label>品牌：</label>{item.brandName}<br/>
            <label>货品名称：</label>{item.goodsName}
        </div> : 
        <div>loading...</div>
}



class GoodManage extends SearchList{
    getConfig(){
        return axios.get('http://maria.yang800.com/api/data/v2/117').then(res => res.data.data);
    }

    myOperation(row){
        return (
            <Space size={15}>
                <div className='link' onClick={() => {
                    lib.openPage('/doc?page_title=doc')
                }}>详情</div>
                {this.renderDeleteRow({
                    id: row.id , title : `你确定要删除${row.goodsName}吗？` , api :''
                })}
            </Space>
        )
    }

    renderExpandRow(row , expanded){
        return <ExpandRow row={row} expanded={expanded} />
    }

    /**
     * 底部分栏
     * @param {*} data 
     */
    renderDetail(data){
        return JSON.stringify(data);
    }

}



export default GoodManage;
