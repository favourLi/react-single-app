import React, { useState, useEffect, Fragment } from 'react';
import './test.less';
import {  Button, Modal } from 'antd';
import {lib , ConfigCenter} from  '../src/index'


class Test extends ConfigCenter {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }

    renderSelfButtons() {
        return (
            <React.Fragment>
                <Button type='primary' onClick={() => {
                    this.setState({
                        editModal: {
                            show: true
                        }
                    })
                }}>新增 + </Button>
            </React.Fragment>
        )
    }

    renderSelfOperation(){
        return (
            <React.Fragment>
                <Button type='primary' onClick={() => {
                    var dataList = this.state.dataList.filter((item) => !item.rowChecked)
                    lib.wait();
                    setTimeout(() => {
                        lib.waitEnd();
                        this.setState({ dataList })
                    } , 1000)
                }}>批量删除</Button>
            </React.Fragment>
        )
    }

    renderSelfCode() {
        let {editModal , editRow} = this.state;

        return (
            <React.Fragment>
                {
                    editModal &&
                    <Modal
                        title="编辑商品"
                        visible={editModal.show}
                        onOk={() => {
                            editModal.confirmLoading = true;
                            setTimeout(() => {
                                editModal.confirmLoading = false;
                                editModal.show = false;
                                this.setState({
                                    editModal: editModal
                                })
                            }, 2000)
                            this.setState({
                                editModal: editModal
                            })
                        }}
                        onCancel={() => {
                            if (!editModal.confirmLoading) this.setState({ editModal: null })
                        }}
                        confirmLoading={this.state.editModal.confirmLoading}
                        width={800}
                    >
                        <div>
                            弹层的内容
                        </div>
                    </Modal>
                }
                {
                    editRow && 
                    <Modal
                        title="编辑行内数据"
                        visible={editRow.show}
                        onOk={() => {
                            editRow.show = false
                            this.setState({
                                editRow: editRow
                            })
                        }}
                        onCancel={() => {
                            this.setState({editRow : null})
                        }}
                        width={800}
                    >
                        <div>
                            <div>{editRow.row.id}</div>
                            <div>{editRow.row.shipperName}</div>
                        </div>
                    </Modal>
                }
            </React.Fragment>
        )
    }
    getHS(row) {
        return row.name + 'HS仓库'
    }
    getOperation(row) {
        return (
            <div style={{ paddingLeft: '13px' }}>
                <span className='link' onClick={() => {
                    this.setState({
                        editRow: {
                            show : true,
                            row : row
                        }
                    })
                }}>编辑</span>
            </div>
        )
    }

    goDetail1(row){
        return <div className='link' onClick={() => {
            this.setDetailData(row)
        }}>下部详情页</div>
    }

    renderDetail(data){
        if(!data){
            return ;
        }
        return (
            <Fragment>
                <div>{data.name}</div>
                <div>{data.shipperName}</div>
            </Fragment>
        )
    }

    renderLeftOperation(){
        return (
            <div className='btn-group'>
                <button className='btn'>上架</button>
                <button className='btn'>下架</button>
                <button className='btn'>删除</button>
            </div>
        )
    }
    renderLeftOperation() {
        return (
            <Fragment>
                <Button type='primary'>上架</Button>
                <Button type='default' style={{marginLeft : '8px'}}>下架</Button>
                <Button type='danger' style={{ marginLeft: '8px' }} onClick={() => {
                    let dataList = this.state.dataList;
                    dataList = dataList.filter((item) => !item.checked);
                    this.setState({dataList})
                }}>删除</Button>
            </Fragment>
        )
    }
    renderRightOperation(){
        return (
            <Fragment>
                <Button type='primary'>新增 + </Button>
            </Fragment>
        )
    }

    goDetail2(row) {
        return <a type='primary' onClick={() => lib.openPage( `/test-detail?pageTitle=测试详情页&id=${row.id}&name=${row.name}`) }>详情</a>
    }


   


}

export default Test














