import React , {useState , useEffect , Fragment} from 'react';
import {Form , Input ,Select , DatePicker , Switch , Alert , Divider , Cascader} from 'antd';
import {lib , Uploader} from '@/index';

function getConfig(item , size ){
    let rules = [];
    if(item.isRequire){
        rules.push({
            required: true, message: `请输入${item.label}`
        });
    }
    return {
        labelCol : {span : size.labelCol} , 
        wrapperCol : {span: size.wrapperCol} ,
        name : item.key , 
        label : item.label ,
        rules
    }
}

function InputForm({item , size , isEdit}){
    let config = getConfig(item , size);
    if(item.reg){
        config.rules.push({
            pattern : item.reg , message : item.extra || `${item.label}验证规则不匹配`
        })
    }
    const Component = item.type == 'input' ? Input : Input.TextArea;
    return (
        <Form.Item {...config}>
            <Component disabled={!item.isUpdate && isEdit} />  
        </Form.Item>
    )
}

function SelectForm({item , size , isEdit}){
    let [list ,setList] = useState([]);
    let config = getConfig(item , size);
    useEffect(() => {
        if(item.type == 'select-json'){
            try{    
                setList(JSON.parse(item.extra));
            }catch(e){
                console.error(item.label , e);
            }
        }else if(item.extra){
            let [url , param] = item.extra.split('?');
            let data;
            if(param){
                let list = param.split('&');
                data = {};
                list.map(item => {
                    let [key , value] = item.split('=');
                    data[key.trim()] = value.trim();
                })
            }
            lib.request({
                url , data,
                success : data => setList(data)
            })
        }
    } , [])
    return (
        <Form.Item {...config}>
            <Select showSearch={item.type == 'select-search'} disabled={!item.isUpdate && isEdit}>
                {
                    list?.map((item , index) => <Select.Option value={item.id} key={index}>{item.name}</Select.Option>)
                }
            </Select>
        </Form.Item>
    )
}

function CascaderForm({item , size , isEdit}){
    let [list ,setList] = useState([]);
    let config = getConfig(item , size);
    function change(item){
        item.label = item.name;
        item.value = item.id;
        item.children?.map(item => change(item));
        return item;
    }
    useEffect(() => {
        if(item.extra){
            let [url , param] = item.extra.split('?');
            let data;
            if(param){
                let list = param.split('&');
                data = {};
                list.map(item => {
                    let [key , value] = item.split('=');
                    data[key.trim()] = value.trim();
                })
            }
            lib.request({
                url , data,
                success : data => setList(data.map(item => change(item)))
            })
        }
    } , [])
    return (
        <Form.Item {...config}>
            <Cascader options={list} placeholder={`请选择${item.label}`} allowClear />
        </Form.Item>
    )
}



function DateForm({item , size , isEdit}){
    let config = getConfig(item , size);
    return (
        <Form.Item {...config}>
            <DatePicker disabled={!item.isUpdate && isEdit} style={{width: '100%'}} />
        </Form.Item>
    )
}

function DateRangeForm({item , size , isEdit}){
    let config = getConfig(item , size);
    return (
        <Form.Item {...config}>
            <DatePicker.RangePicker disabled={!item.isUpdate && isEdit} style={{width: '100%'}} />
        </Form.Item>
    )
}

function UploaderForm({item , size , isEdit}){
    let config = getConfig(item , size);
    return (
        <Form.Item {...config}  >
            <Uploader disabled={!item.isUpdate && isEdit} />
        </Form.Item>
        
    )
}

function SwitchForm({item , size , isEdit}){
    let config = getConfig(item , size);
    return (
        <Form.Item {...config} valuePropName="checked" >
            <Switch disabled={!item.isUpdate && isEdit} />
        </Form.Item>
    )
}

function Group({item , size}){
    return (
        <>
            <Divider orientation="left">{item.label}</Divider>
            {
                item.extra && <Alert style={{margin :'-10px 0 20px'}} message={item.extra} type="info" showIcon />
            }
        </>
    )
}



export default  {
    input : InputForm , 
    select : SelectForm, 
    'select-json' : SelectForm , 
    'select-search' : SelectForm , 
    'date' : DateForm , 
    'date-range' : DateRangeForm,
    'uploader' : UploaderForm ,
    'switch' : SwitchForm ,
    'textarea' : InputForm ,
    'cascader' : CascaderForm,
    'group' : Group ,
    'br' : () => ''
};