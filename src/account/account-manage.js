import React , {useState , useEffect} from 'react';
import {lib } from '../index';
import ConfigCenter from '../config-center-v3/config-center'
import {Button , message , Space , Modal , Switch , Select , Input , Form , Typography, Divider , Alert} from 'antd';
import './account.less';
const { Title, Paragraph } = Typography;

function SystemAuthorization({userId}){
    let [visible ,setVisible] = useState(false);
    let [list , setList] = useState([]);
    useEffect(() => {
        lib.request({
            url : '/ucenter-customer/user/sub/system/openList' ,
            data : {userId},
            success : list => setList(list)
        })
    } , [])
    return (
        <>
            {visible && 
            <Modal visible={true} title='系统授权' footer={<Button type='primary' onClick={() => setVisible(false)}>确定</Button>} >
                {
                    list.map(item => 
                        <div className='account-manage-system-auth' key={item.systemCode}>
                            <Switch checked={item.status == 1} onChange={(checked) => {
                                lib.request({
                                    url : `/ucenter-customer/user/sub/${checked ? 'open' : 'close'}System` ,
                                    data : {
                                        systemCode : item.systemCode,
                                        userId 
                                    },
                                    needMask : true,
                                    success : () => message.success('操作成功')
                                });
                                item.status = checked + 0;
                                setList([...list])
                            }}></Switch>{item.systemName}
                        </div>
                    )
                }
            </Modal>}
            <div className='link' onClick={() => setVisible(true)}>系统授权</div>
        </>
    )
}

function BindRole({userId , userName }){
    let [visible ,setVisible] = useState(false);
    let [list , setList] = useState([]);
    let [roleId , setRoleId] = useState([]);
    let url = lib.config.webToken == 'admin' ? '/ucenter-admin/waiter/role/list' : '/ucenter-customer/user/sub/role/list';
    useEffect(() => {
        if(visible && list.length == 0){
            lib.request({
                url  ,
                data : {
                    userId ,
                    systemCode : lib.config.systemCode
                },
                success : list => {
                    setRoleId(list.filter(item => item.checked).map(item => item.id));
                    setList(list);
                    
                }
            })
        }
    } , [visible])
    return (
        <>
            {visible && 
            <Modal visible={true} title={`绑定角色`} width={600} className='account-manage-bind-role' maskClosable={false}
            onCancel={() => setVisible(false)} onOk={() => {
                let url = lib.config.webToken == 'admin' ? '/ucenter-admin/waiter/role/update' : '/ucenter-customer/user/sub/updateRole'
                lib.request({
                    url  , 
                    data : {
                        userId , systemCode : lib.config.systemCode ,roleId 
                    },
                    needMask: true , 
                    success: () => {

                        message.success('操作成功')
                        setVisible(false);
                    },
                })
            }}>
                <div className='item'>
                    <label>用户名：</label>
                    {userName}
                </div>
                <div className='item'>
                    <label>请选择角色(可多选):</label>
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '300px' }}
                        value={roleId}
                        onChange={value => setRoleId(value)}
                        >
                        {
                            list.map(item => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)
                        }
                    </Select>
                </div>
            </Modal>}
            <div className='link' onClick={() => setVisible(true)}>绑定角色</div>
        </>
    )
}

function InviteUser(){
    let [visible ,setVisible] = useState(false);
    let [email , setEmail] = useState('');
    return (
        <>
            {visible && 
                <Modal visible={true} title='邀请用户' maskClosable={false}
                onCancel={() => setVisible(false)} 
                onOk={() => {
                    lib.request({
                        url : '/ucenter-admin/waiter/invite' , 
                        data : {
                            systemCode : lib.config.systemCode ,
                            email 
                        } ,
                        needMask : true , 
                        success : () => {
                            message.success('操作成功');
                            setEmail('');
                            setVisible(false);
                        }
                    })

                }}
                >
                    <Input placeholder='电子邮箱' value={email} onChange={e => setEmail(e.target.value)} />
                </Modal>
            }
            <Button  onClick={() => setVisible(true)}>邀请用户</Button>
        </>
    )
}

function CreateOrUpdateUser({onFinish , item}){
    let [visible ,setVisible] = useState(false);
    const [form] = Form.useForm();
    return (
        <>
            {visible && 
                <Modal visible={true} title='创建用户' onCancel={() => setVisible(false)} onOk={() => {
                    
                    form.validateFields().then((values) => {
                        let url = item ? '/ucenter-admin/waiter/update' : '/ucenter-admin/waiter/create';
                        if(item){
                            values.id = item.id;
                        }
                        lib.request({
                            url   ,
                            data : {
                                ...values , systemCode : lib.config.systemCode
                            },
                            needMask : true , 
                            success : () => {
                                form.resetFields();
                                message.success('操作成功');
                                setVisible(false);
                                onFinish();
                            }
                        })

                    })
                }}>
                    <Form form={form} layout="horizontal" name="form_in_modal" 
                        labelCol={{span: 5}} wrapperCol={{span: 16}}
                    >
                        <Form.Item name='userName' label='用户名' initialValue={item?.userName}
                            validateTrigger={['onBlur' , 'onChange']}
                            rules={[
                                {required: true, message: '请输入用户名', validateTrigger:'onChange'},
                                {pattern: /[\w\W]{3,20}/ , message: '用户名为3-20位的字母、数字、中文、特殊符号的组合' , validateTrigger:'onBlur'}
                            ]}
                        >
                            <Input disabled={item != null} />
                        </Form.Item>
                        <Form.Item name='nickName' label='姓名' initialValue={item?.nickName} rules={[
                        ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name='email' label='邮箱' initialValue={item?.email}
                            rules={[
                                {required: true,  message: '请输入电子邮箱'},
                                {
                                    type:'email' , message : '邮箱格式不对，例xxx@163.com' 
                                }
                            ]}
                        >
                            <Input disabled={item != null} />
                        </Form.Item>
                        <Form.Item name='mobile' label='手机号' initialValue={item?.mobile}
                            validateTrigger={['onBlur' , 'onChange']}
                            rules={[
                                {
                                    required: true,  message: '请输入手机号',
                                },
                                {
                                    pattern: /^\d{0,11}$/ , message: '手机号码为1开头的11位数字' , validateTrigger:'onChange'
                                },
                                {
                                    pattern: /^1\d{10}$/ , message: '手机号码为1开头的11位数字' , validateTrigger:'onBlur'
                                }
                            ]}
                        >
                            <Input disabled={item != null} />
                        </Form.Item>
                        {
                            !item &&  
                            <Form.Item name='password' label='密码' initialValue={item?.password}
                                rules={[
                                    {required: true,  message: '请输入手机号'},
                                    {validator: (rule, value) => {
                                        return new Promise((resolve ,reject) => {
                                            if(!/^([\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]|\w){6,20}$/.test(value) || 
                                                /[\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]+/.test(value) 
                                                + /\d+/.test(value) 
                                                + /[a-z]+/.test(value)
                                                + /[A-Z]+/.test(value)
                                                < 3
                                            ){
                                                reject('密码为6-20位，且必须包含数字、字母、大写字母及符号中的三种');
                                            }else{
                                                resolve();
                                            }
                                        })
                                } }
                                ]}
                            >
                                <Input.Password  />
                            </Form.Item>
                        }
                        
                    </Form>
                </Modal>
            }
            {
                item ? <div className='link' onClick={() => setVisible(true)}>修改</div> : <Button type='primary' onClick={() => setVisible(true)}>创建用户</Button>
            }
            
        </>
    )
}

function AddOrUpdateSubAccount({onFinish , item}){
    let [visible ,setVisible] = useState(false);
    const [form] = Form.useForm();
    return (
        <>
            {
                visible && 
                <Modal visible={true} title={item ? '修改子账号' : '添加子账号'} onCancel={() => setVisible(false)} onOk={() => {
                    form.validateFields().then((values) => {
                        // form.resetFields();
                        let url = item ?  '/ucenter-customer/user/sub/update' : '/ucenter-customer/user/sub/add'
                        if(item){
                            values.userId = item.userId;
                        }
                        lib.request({
                            url  ,
                            data : {
                                ...values , systemCode : lib.config.systemCode
                            },
                            needMask : true , 
                            success : () => {
                                form.resetFields();
                                message.success('操作成功');
                                setVisible(false);
                                onFinish();
                            }
                        })

                    })
                }}>
                    <Form form={form} layout="horizontal" name="form_in_modal" 
                        labelCol={{span: 5}} wrapperCol={{span: 16}}
                    >
                        <Typography>
                            <Title level={5}>账号信息</Title>
                            <Alert message="账号信息由员工自己在登录页注册" type="info" showIcon />
                            <br/>
                            <Form.Item name='userName' label='用户名' initialValue={item?.userName}
                                validateTrigger={['onBlur' , 'onChange']}
                                rules={[
                                    {required: true, message: '请输入用户名', validateTrigger:'onChange'},
                                    {pattern: /[\w\W]{3,20}/ , message: '用户名为3-20位的字母、数字、中文、特殊符号的组合' , validateTrigger:'onBlur'}
                                ]}
                            >
                                <Input  disabled={item != null} />
                            </Form.Item>
                            <Form.Item name='mobile' label='手机号' initialValue={item?.mobile}
                                validateTrigger={['onBlur' , 'onChange']}
                                rules={[
                                    {
                                        required: true,  message: '请输入手机号',
                                    },
                                    {
                                        pattern: /^\d{0,11}$/ , message: '手机号码为1开头的11位数字' , validateTrigger:'onChange'
                                    },
                                    {
                                        pattern: /^1\d{10}$/ , message: '手机号码为1开头的11位数字' , validateTrigger:'onBlur'
                                    }
                                ]}
                            >
                                <Input  disabled={item != null} />
                            </Form.Item>
                            <Divider />
                            <Title level={5}>企业信息</Title>
                            <Alert message="姓名和工号是当前企业下的唯一值，不能重复" type="info" showIcon />
                            <br/>
                            <Form.Item name='nickName' label='姓名' initialValue={item?.nickName} >
                                <Input  />
                            </Form.Item>
                            <Form.Item name='empno' label='工号' initialValue={item?.empno}  >
                                <Input  />
                            </Form.Item>
                        </Typography>
                    </Form>
                </Modal>
            }
            {
                item ? <div className='link' onClick={() => setVisible(true)}>修改</div> : <Button type='primary' onClick={() => setVisible(true)}>添加员工</Button>
            }
            
        </>
    )
}

class AccountManage extends ConfigCenter{
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
        return <>
                {lib.config.webToken == 'admin' && <Space><InviteUser /><CreateOrUpdateUser onFinish={() => this.reload()} /></Space>}
                {lib.config.webToken == 'user' && <AddOrUpdateSubAccount onFinish={() => this.reload()} />}
            </>
    }

    myOperation(row){
        return <Space>
            <BindRole userId={row.userId || row.id} userName={row.userName} />
            <div className='link' onClick={() => {
                let url = lib.config.webToken == 'admin' ? '/ucenter-admin/waiter/delete' :  '/ucenter-customer/user/sub/remove';

                let data = {
                    userId : row.userId ,
                    id : row.id
                }
                Modal.confirm({
                    title : `确定要删除${row.userName}吗?` , 
                    onOk : () => {
                        lib.request({
                            url , data , needMask : true , success:() => this.load()
                        })
                    }
                })
            }}>删除</div>
            {
                lib.config.webToken == 'user' && <AddOrUpdateSubAccount onFinish={() => this.load()} item={row} />
            }
            {
                lib.config.webToken == 'admin' && <CreateOrUpdateUser onFinish={() => this.load()} item={row} />
            }

        </Space>
    }
    getStatus(row){
        return (
            <Switch checked={row.status == 1} onChange={checked => {
                row.status = checked + 0;
                this.setState(this.state);
                let url = lib.config.webToken == 'admin' ? '/ucenter-admin/waiter/enable' : '/ucenter-customer/user/sub/enable';
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
}

export default props => {
    let requestUrl = lib.config.webToken == 'admin' ? '/ucenter-admin/waiter/page' : '/ucenter-customer/user/sub/page';
    var config = {
        "title": "账号管理-小二",
        "searchKeyList": [{
            "id": 1,
            "label": "用户名",
            "key": "userName",
            "type": "text",
            "extra": ""
        }, {
            "id": 2,
            "label": "手机号",
            "key": "mobile",
            "type": "text",
            "extra": ""
        }, {
            "id": 3,
            "label": "电子邮箱",
            "key": "email",
            "type": "text",
            "extra": ""
        }, {
            "id": 5,
            "label": "创建时间",
            "key": "createdAtStart,createdAtEnd",
            "type": "date",
            "extra": ""
        }, {
            "id": 1602392585769915,
            "label": "更新时间",
            "key": "updatedAtStart,updatedAtEnd",
            "type": "date",
            "extra": ""
        } ,{
            "id": 6,
            "label": "工号",
            "key": "empno",
            "type": lib.config.webToken == 'admin' ? '' : "text",
            "extra": ""
        }, {
            "id": 7,
            "label": "姓名",
            "key": "nickName",
            "type": "text",
            "extra": ""
        }],
        requestUrl , 
        "tableFieldList": [{
            "id": 10,
            "title": "用户名",
            "key": "userName",
            "type": "text",
            "width": "160",
            "display": "auto"
        }, {
            "id": 1602392622817859,
            "title": "姓名",
            "key": "nickName",
            "type": "text",
            "width": "180",
            "display": "auto"
        }, {
            "id": 123654,
            "title": "工号",
            "key": "empno",
            "type":  "text" ,
            "width": "100",
            "display": lib.config.webToken == 'user' ? "auto" : 'hidden'
        },{
            "id": 1602392623889532,
            "title": "手机号",
            "key": "mobile",
            "type": "text",
            "width": "135",
            "display": "auto"
        }, {
            "id": 3,
            "title": "电子邮箱",
            "key": "email",
            "type": "text",
            "width": "220",
            "display": "auto"
        }, {
            "id": 1602392625057972,
            "title": "启用状态",
            "key": "getStatus",
            "type": "function",
            "width": "100",
            "display": "auto"
        }, {
            "id": 1602392625665191,
            "title": "创建时间",
            "key": "createdAt",
            "type": "text",
            "width": "160",
            "display": "auto"
        }, {
            "id": 1602392626169863,
            "title": "更新时间",
            "key": "updatedAt",
            "type": "text",
            "width": "160",
            "display": "auto"
        }, {
            "id": 4,
            "title": "操作",
            "key": "myOperation",
            "type": "function",
            "width": "190",
            "display": "sticky-right"
        }],
        "needBatchOperation": true,
        "excel": {}
    }
    return <AccountManage {...props} config={config} />
}








