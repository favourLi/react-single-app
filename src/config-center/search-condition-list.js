import React, { useState, useEffect , createContext , useContext } from 'react';
import { useHistory} from 'react-router-dom';
import {Input, Select, DatePicker, Button, Cascader , Dropdown , Menu } from 'antd';
const { RangePicker } = DatePicker;
import MutilInput from '../component/mutil-input';
import './search-condition-list.less'
import { lib , event } from '../index'
import moment from 'moment'
import { DownOutlined } from '@ant-design/icons';
const context = createContext();

let map = {
    'text' : Text , 
    'select': MySelect , 
    'json-select': MySelect ,
    'search-select': MySelect ,
    'multi-select' : MySelect ,
    'cascader': MySelect,
    'date' : MyDate,
    'select-textarea': SelectTextArea,
    'textarea' : SelectTextArea,
    'range' : Range
}

function setKeyToObj(obj , key  , value){
    if(value){
        obj[key] = value;
    }else{
        delete obj[key];
    }
    return obj;
}

function getSearchParam(url){
    if(url.indexOf('?') == -1){
        return null;
    }
    let search = url.split('?')[1];
    let result = {} , ps = search.split('&');
    ps.map(item => {
        let [key , value] = item.split('=');
        result[key] = decodeURIComponent(value);
    })
    return result;
}

function Text({item}){
    let {search , setSearch} = useContext(context);
    let {label , key , extra} = item;
    return (
        <div className='group' >
            <label>{label}</label>
            <Input 
                value={search[key] || ''}
                style={{ width: 260 }}
                onChange={ e => {
                    setSearch({...setKeyToObj(search , key , e.target.value)});
                }}
                placeholder={extra || '请输入' + label} />
        </div>
    )
}

function MySelect({item}){
    let {search , setSearch} = useContext(context);
    let {label , key , extra , type} = item;
    let [list , setList] = useState([]);
    useEffect(() => {
        if(type == 'json-select'){
            try{
                setList(JSON.parse(extra));
            }
            catch(e){console.error(`${label}解析出错了，请检查该JSON` , e)}
        }else{
            let url = extra.split('?')[0];
            let data = getSearchParam(extra);
            lib.request({
                url , 
                data , 
                needMask: false,
                success: list => setList(list || [])
            })
        }
    } , [])
    function onChange(value){
        if(value instanceof Array){
            value = value.join(',');
        }
        setSearch({...setKeyToObj(search , key , value)});
    }
    let value = search[key];
    if(value && ['multi-select' , 'cascader'].indexOf(type) > -1){
        value = value.split(',');
    }
    return (
        <div className='group' >
            <label>{label}</label>
            {
                type == 'cascader' ? 
                <Cascader options={list} onChange={onChange} value={value} style={{ width: 260 }}  /> :
                <Select
                    allowClear
                    showSearch={type == 'search-select'}
                    optionFilterProp="children"
                    mode={type == 'multi-select' ? 'multiple' : null}
                    style={{ width: 260 }}
                    placeholder='请选择'
                    onChange={onChange}
                    value={value}>
                    {
                        list.map((item, index) =>
                            <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
                        )
                    }
                </Select>
            }
            
        </div>
    )
}

function MyDate({item}){
    let {search , setSearch} = useContext(context);
    let {label , key} = item;
    let [start , end] = key.split(',');
    return (
        <div className='group time' >
            <label>{label}</label>
            <RangePicker
                style={{ width: 260 }}
                value={
                    search[start] ?
                    [moment(new Date(search[start]).getTime()), moment(new Date(search[end]).getTime())]:
                    []
                }
                onChange={(e, dates) => {
                    if (!dates[0]) {
                        setKeyToObj(search , start , '');
                        setKeyToObj(search , end , '');
                    }
                    else {
                        setKeyToObj(search , start , new Date(dates[0]).getTime());
                        setKeyToObj(search , end , new Date(dates[1]).getTime());
                    }
                    setSearch({...search});
                }} />
        </div>
    )
}

function SelectTextArea({item}){
    
    let {search , setSearch} = useContext(context);
    let [list , setList] = useState([]);
    let [value1 , setValue1] = useState(null);
    let {label , key , extra , type} = item;
    let key1 , key2 , menu;
    let isSelectTextarea = type == 'select-textarea';
    if(isSelectTextarea){
        [key1 , key2] = key.split(','); 
        menu = (
            <Menu>
                {
                    list.map((item , key) => <Menu.Item key={key} onClick={() => {
                        setValue1(item);
                        if(search[key2]){
                            setKeyToObj(search , key1 , item.id);
                        }
                    }}>{item.name}</Menu.Item>)
                }
            </Menu>
        );
    }else{
        key2 = key;
    }
    useEffect(() => {
        if(isSelectTextarea){
            try{
                list = JSON.parse(extra);
                setList(list);
                setValue1(list[0]);
            }
            catch(e){console.error(`${label}解析出错了，请检查该JSON` , e)}
        }
    } , [])
    return (
        <div className='group' >
            {
                isSelectTextarea ? 
                <Dropdown overlay={menu} arrow placement="bottomCenter">
                    <label className='link'>{value1?.name}<DownOutlined /></label>
                </Dropdown>
                : <label>{label}</label>
            }
            <MutilInput value={search[key2]} onChange={value2 => {
                if(isSelectTextarea){
                    setKeyToObj(search , key1 , value2 ? value1?.id : '');
                    setSearch({...setKeyToObj(search , key2 , value2)})
                }
                else{
                    setSearch({...setKeyToObj(search , key2 , value2)})
                }
            }} style={{width: '260px'}} placeHolder={`请输入${label || list.map(item => item.name)}，每个ID占一行`} />
            
        </div>
    )
}

function Range({item}){
    let {search , setSearch} = useContext(context);
    let {label , key } = item;
    let [start , end] = key.split(',');
    return (
        <div className='group range' >
            <label>{label}</label>
            <Input value={search[start] || ''} onChange={(e) => {
                setSearch({...setKeyToObj(search , start , e.target.value)});
            }}></Input>
            <span>&#xe633;</span>
            <Input value={search[end] || ''} onChange={(e) => {
                setSearch({...setKeyToObj(search , end , e.target.value)});
            }}></Input>
        </div>
    )
}

export default function ({ searchKeyList , onSearch }){
    let [isMini , setMini] = useState(false);
    let [search , setSearch] = useState(getSearchParam(window.location.hash?.replace('#' , '?')) || {});
    let history = useHistory();
    function executeSearch(search){
        let params = [];
        for(var key in search){
            params.push(`${key}=${search[key]}`)
        }
        history.replace(`${window.location.pathname}${window.location.search}#${params.join('&')}`);
        search = {...getSearchParam(window.location.search) ,  ...search};
        delete search.page_title;
        delete search.config_id;
        onSearch(search);
        setSearch(search);
    }
    useEffect(() => executeSearch(search) , [])
    return (
        <context.Provider value={{search , setSearch}} >
            <div className={`${isMini ? 'mini-search-controls' : 'full-search-controls'}`}>
                <div className='search-controls'>
                    {searchKeyList.map((item , index) => {
                        var Control = map[item.type];
                        return Control && <Control item={item} key={index} />
                    })}
                </div>
                
                <div className='group group-btns' >
                    <Button type="primary" onClick={() => executeSearch(search)}>查询</Button>
                    <Button onClick={() => executeSearch({})}>重置</Button>
                </div>
                <div className='change-type' onClick={() => {
                    setMini(!isMini);
                    event.emit('window.resize')
                }}></div>
            </div>
        </context.Provider>
    )
}

