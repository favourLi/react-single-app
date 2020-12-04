import React from 'react';
import ConfigCenter from '../config-center/config-center';
import lib from '../util/lib'
import {Modal , Alert , Button} from 'antd';
var config = {
    "id":1604886267662997,
    "title":"下载中心",
    "searchKeyList":[
        {
            "id":1604886892007963,
            "label":"报表名称",
            "key":"name",
            "type":"text",
            "extra":""
        },
        {
            "id":1604886892495133,
            "label":"完成时间",
            "key":"finishTimeStart,finishTimeEnd",
            "type":"date",
            "extra":""
        },
        {
            "id":160488689293549,
            "label":"状态",
            "key":"status",
            "type":"select",
            "extra":"/park-gate/export/statusList"
        }
    ],
    "requestUrl":"/park-gate/export/page",
    "tableFieldList":[
        {
            "id":1604886717666482,
            "title":"文件名称",
            "key":"name",
            "type":"text",
            "width":"100",
            "display":"auto"
        },
        {
            "id":1604887114454835,
            "title":"开始时间",
            "key":"startTime",
            "type":"text",
            "width":"100",
            "display":"auto"
        },
        {
            "id":1604887114822681,
            "title":"完成时间",
            "key":"finishTime",
            "type":"text",
            "width":"100",
            "display":"auto"
        },
        {
            "id":1604887115479452,
            "title":"状态",
            "key":"statusName",
            "type":"text",
            "width":"100",
            "display":"auto"
        },
        {
            "id":1604887134153540,
            "title":"操作",
            "key":"getOperation",
            "type":"function",
            "width":"100",
            "display":"auto"
        }
    ],
}

class DownloadCenter extends ConfigCenter {
    getOperation(row) {
        return (
            <>
                {
                    row.buttons.map((item, key) => {
                        return (
                            <span onClick={() => {
                                if(item == '下载'){
                                    window.open(row.url);
                                }
                                else {
                                    let map = {
                                        '删除' : '/park-gate/export/delete' ,
                                        '取消任务' : '/park-gate/export/cancel'
                                    }
                                    Modal.confirm({
                                        title : '请确认' + item ,
                                        content : <>
                                            <div>报表名称: {row.name}</div>
                                            <div>完成时间: {row.finishTime}</div>
                                        </>,
                                        onOk :() =>{
                                            lib.request({
                                                url : map[item],
                                                data : {
                                                    uid : row.uid
                                                },
                                                needMask : true , 
                                                success : () => this.load()
                                            })
                                        }
                                    })
                                }
                            }}
                                style={{ marginRight: '10px' }} 
                                className='link' 
                                key={key}>
                                {item}
                            </span>
                        )
                    })
                }
            </>
        )
    }
    renderLeftOperation(){
        return <>
                <Alert style={{width : '450px' , display : 'inline-block' }} message='服务端数据将为您保留7天，已过期的数据将会自动删除' type="warning" showIcon  />
                <Button style={{marginLeft: '20px'}} type='primary' onClick={() => this.load(true)}>刷新</Button>
            </>
    }
}




export default function (props) {
    return <DownloadCenter {...props} config={config}></DownloadCenter>
};