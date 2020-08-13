import React, { Component, Fragment, useState } from 'react';
import './user-center.less';
import {lib ,  ConfigCenter , Uploader} from '../src/index';
import './brand-center.less';
import {Button , Modal , Input, message } from 'antd';
const { TextArea } = Input;

function BrandModal({brand , onSave , onCancel}){
    var [brand , setBrand] = useState(brand);
    return (
        <Modal
            title='新增品牌'
            visible={true}
            onOk={() => {
                let url = brand.id ? '/supply-admin/brands/update' : '/supply-admin/brands/save'
                lib.request({
                    url: url , 
                    data : brand,
                    needMask : true,
                    success(){
                        message.success('添加品牌成功');
                        onSave(brand);
                    }
                })
            }}
            onCancel={onCancel}
        >
            <div className='brand-center-brand-modal'>
                <div className='group require'>
                    <label>品牌名称</label>
                    <Input value={brand.name} onChange={(e) => {
                        brand.name = e.target.value.trim();
                        setBrand(Object.assign({} , brand))
                    }} />
                </div>
                <div className='group'>
                    <label>英文名</label>
                    <Input value={brand.enName} onChange={(e) => {
                        brand.enName = e.target.value.trim();
                        setBrand(Object.assign({}, brand))
                    }} />
                </div>
                <div className='group require'>
                    <label>品牌LOGO</label>
                    <Uploader src={brand.logo} onUploadEnd={(src) => {
                        brand.logo = src;
                        setBrand(Object.assign({}, brand))
                    }} onRemove={() => {
                        brand.logo = '';
                        setBrand(Object.assign({}, brand))
                    }} />
                </div>
                <div className='group'>
                    <label>品牌简介</label>
                    <TextArea rows={4} value={brand.description} onChange={(e) => {
                        brand.description = e.target.value;
                        setBrand(Object.assign({}, brand))
                    }} />
                </div>
            </div>
        </Modal>
    )
}



class BrandCenter extends ConfigCenter {
    renderModal(){
        let {brand} = this.state;
        return (
            <Fragment>
                {brand && <BrandModal brand={brand} onSave={(brand) => {
                    if(!brand.id){
                        this.state.pagination.currentPage = 1;
                    }
                    delete this.state.brand;
                    this.load(false);
                }} onCancel={() => {
                    this.setState({
                        brand : null
                    })
                }} />}
            </Fragment>
        )
    }
    renderRightOperation(){
        return (
            <Fragment>
                <Button type='primary' onClick={() => {
                    this.setState({
                        brand : {}
                    })
                }}>新增</Button>
            </Fragment> 
        )
    }
    getLogo(row) {
        return (
            <img style={{ margin: '10px 0' }} src={`${row.logo}?x-oss-process=image/resize,h_60`} />
        )
    }
    edit(row){
        return (
            <div className='link' onClick={() => {
                this.setState({
                    brand: row
                })
            }}>编辑</div>
        )
    }
}


export default BrandCenter;
