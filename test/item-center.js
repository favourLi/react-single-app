import React, { Component, Fragment } from 'react';
import './user-center.less';
import { ConfigCenter , ImportExcel } from '../src/index';
import './item-center.less';
import {Modal} from 'antd';

class ItemCenter extends ConfigCenter {
    
    renderModal(){
        let {showImportModal} = this.state;
        return <Fragment>
            {
                showImportModal && 
                <Modal visible={showImportModal} footer={null} width={1000}
                bodyStyle={{height: '650px' }} maskClosable={false} onCancel={(e) => this.setState({showImportModal : false})}>
                    <ImportExcel api='/ucenter-account/demo' />
                </Modal>
            }
        </Fragment>
    }

    getMainImage(row){
        return (
            <img style={{margin: '10px 0'}} src={`${row.mainImage}?x-oss-process=image/resize,h_60`} />
        )
    }
    go(row){
        return (
            <>
                <a href={`http://gongxiao.yang800.cn/item.htm?id=${row.id}`} target='_blank' >查看</a>
                <div className='link' onClick={() => this.setState({showImportModal : true})}>导入</div>
            </>
        )
    }
}


export default ItemCenter;
