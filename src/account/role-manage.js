import React , {useEffect, useState} from 'react'
import {lib } from '../index';
import ConfigCenter from '../config-center/config-center'
import {Button , message , Space , Modal , Switch , Select , Input , Form , Typography, Divider , Alert} from 'antd';
import './account.less';
const { Title, Paragraph } = Typography;


function CreateOrUpdateRole({row , reload}){
    let [visible ,setVisible] = useState(false);
    const [form] = Form.useForm();
    let target = lib.config.webToken == 'admin' ? '/ucenter-admin' : '/ucenter-customer'
    useEffect(()=>{
        form.setFieldsValue(row)
    } , [])
    return (
        <>
            {
                visible && 
                <Modal visible={true} title='添加子账号' onCancel={() => setVisible(false)} onOk={() => {
                    form.validateFields().then((values) => {
                        let data = {
                            ...values , systemCode : lib.config.systemCode 
                        };
                        let url = `${target}/role/create`;
                        if(row){
                            url = `${target}/role/update`;
                            data.id = row.id;
                        }
                        lib.request({
                            url : url ,
                            data,
                            needMask : true , 
                            success : () => {
                                if(!row){
                                    form.resetFields();
                                }
                                message.success('操作成功');
                                setVisible(false);
                                reload();
                            }
                        })
                    })
                }}>
                    <Form form={form} layout="horizontal" name="form_in_modal" 
                        labelCol={{span: 5}} wrapperCol={{span: 16}}
                    >
                        <Form.Item name='name' label='角色名称' 
                            rules={[{required: true,  message: '请输入角色名称'}]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name='remark' label='角色简介' >
                            <Input.TextArea  />
                        </Form.Item>
                    </Form>
                </Modal>
            }
            {row ? 
                <div className='link' onClick={() => setVisible(true)}>编辑</div> : 
                <Button type='primary' onClick={() => setVisible(true)}>新增角色</Button>
            }
            
        </>
    )

}


class RoleManage extends ConfigCenter{
    load(needMask) {
        let { pagination, searchConditions } = this.state;
        var data = {};
        Object.assign(data, pagination, searchConditions , {systemCode : lib.config.systemCode});
        lib.request({
            url: this.state.config.requestUrl,
            data: data,
            needMask: needMask,
            success: (data) => {
                this.setState({
                    pagination: data.page,
                    dataList: data.dataList || []
                })
                this.tablePanel.scrollTop = 0;
            }
        })
    }
    reload(){
        this.state.pagination.currentPage = 1;
        this.load();
    }
    renderLeftOperation(){
        return <CreateOrUpdateRole reload={this.reload.bind(this)} />
    }
    getStatus(row){
        return (
            <Switch checked={row.status == 1} onChange={checked => {
                row.status = checked + 0;
                this.setState(this.state);
                let url = lib.config.webToken == 'admin' ? '/ucenter-admin/role/enable' : '/ucenter-customer/role/enable';
                lib.request({
                    url ,
                    data : row,
                    needMask : true , 
                    success: () => message.success('操作成功'),
                    fail : this.load.bind(this)
                })
            }} />
        )
    }
    getUserCount(row){
        return <div className='link' onClick={() => lib.openPage(`/account-manage?page_title=${row.name}绑定的账号&roleId=${row.id}`)}>{row.userCount}</div>
    }
    myOperation(row){
        return (
            <Space>
                <div className='link' onClick={() => lib.openPage(`/permission-manage?page_title=${row.systemName}权限分配&roleId=${row.id}`)}>权限分配</div>
                <CreateOrUpdateRole row={row} reload={this.reload.bind(this)} />
            </Space>
        )
    }

}


export default props => {
    let requestUrl = lib.config.webToken == 'admin' ? "/ucenter-admin/role/page" : '/ucenter-customer/role/page'
    var config = {
        "id": 160239269089711,
        "searchKeyList": [{
            "id": 1602392705930741,
            "label": "角色名称",
            "key": "name",
            "type": "text",
            "extra": ""
        }, {
            "id": 1602392706817861,
            "label": "启用状态",
            "key": "status",
            "type": "json-select",
            "extra": "[{\"id\":\"0\",\"name\":\"禁用\"},{\"id\":\"1\",\"name\":\"启用\"}]"
        }, {
            "id": 1602392707297479,
            "label": "创建时间",
            "key": "a,b",
            "type": "date",
            "extra": ""
        }, {
            "id": 1602392707962437,
            "label": "更新时间",
            "key": "c,d",
            "type": "date",
            "extra": ""
        }],
        requestUrl,
        "tableFieldList": [{
            "id": 1602392747953582,
            "title": "角色名称",
            "key": "name",
            "type": "text",
            "width": "200",
            "display": "auto"
        }, {
            "id": 1602392751273722,
            "title": "角色简介",
            "key": "remark",
            "type": "text",
            "width": "200",
            "display": "auto"
        }, {
            "id": 1602392751769505,
            "title": "关联人数",
            "key": "getUserCount",
            "type": "function",
            "width": "100",
            "display": "auto"
        }, {
            "id": 1602392748609958,
            "title": "启用状态",
            "key": "getStatus",
            "type": "function",
            "width": "100",
            "display": "auto"
        },  {
            "id": 1602392750129599,
            "title": "创建时间",
            "key": "createdAt",
            "type": "text",
            "width": "130",
            "display": "auto"
        }, {
            "id": 1602392750649118,
            "title": "更新时间",
            "key": "updatedAt",
            "type": "text",
            "width": "130",
            "display": "auto"
        },{
            "id": 1602392752473404,
            "title": "操作",
            "key": "myOperation",
            "type": "function",
            "width": "194",
            "display": "sticky-right"
        }],
        "needBatchOperation": false,
        "excel": {}
    };

    return <RoleManage {...props} config={config} />
}

