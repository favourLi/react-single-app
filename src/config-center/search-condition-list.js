import React, { Fragment, useState, useEffect } from 'react';
import {Input, Select, DatePicker, Button, Cascader } from 'antd';
const { Option } = Select;
const { RangePicker } = DatePicker;
import './search-condition-list.less'
import { lib } from '../index'

function Text({item}){
    let [refresh, setRefresh] = useState(0);
    return (
        <div className='group' >
            <label>{item.label}</label>
            <Input 
                value={item.value || ''}
                style={{ width: 260 }}
                onChange={ e => {
                    item.value = e.target.value;
                    setRefresh(++refresh);
                }}
                placeholder={item.extra || '请输入' + item.label} />
        </div>
    )
}

function SelectControl({item}){
    let [refresh, setRefresh] = useState(0);
    return (
        <div className='group' >
            <label>{item.label}</label>
            <select value={item.value} className='form-control' style={{ width: '260px' }} 
                onChange={e => {
                    item.value = e.target.value;
                    setRefresh(++refresh);
                }} 
            >
                <option value=''>请选择</option>
                {
                    (item.list||[]).map((item, index) =>
                        <option key={index} value={item.id}>{item.name}</option>
                    )
                }
            </select>

        </div>
    )
}

function CommonSelect({item}){
    let [refresh, setRefresh] = useState(0);
    return (
        <div className='group' >
            <label>{item.label}</label>
            <Select
                allowClear
                style={{ width: 260 }}
                placeholder='请选择'
                onChange={(value) => {
                    item.value = value;
                    setRefresh(++refresh);
                }}
                value={item.value}>
                {
                    (item.list || []).map((item, index) =>
                        <Option key={index} value={item.id}>{item.name}</Option>
                    )
                }
            </Select>
        </div>
    )
}

function SearchSelect({item}){
    let [refresh, setRefresh] = useState(0);
    return (
        <div className='group' >
            <label>{item.label}</label>
            <Select
                allowClear
                showSearch
                style={{ width: 260 }}
                placeholder='请选择'
                optionFilterProp="children"
                onChange={(value) => {
                    item.value = value;
                    setRefresh(++refresh);
                }}
                value={item.value}>
                {
                    (item.list || []).map((item, index) =>
                        <Option key={index} value={item.id}>{item.name}</Option>
                    )
                }
            </Select>
        </div>
    )
}

function MultiSelect({item}){
    let [refresh, setRefresh] = useState(0);
    return (
        <div className='group' >
            <label>{item.label}</label>
            <Select
                allowClear
                showSearch
                style={{ width: 260 }}
                placeholder='请选择'
                mode="multiple"
                onChange={(value) => {
                    item.value = value;
                    setRefresh(++refresh);
                }}
                value={item.value}>
                {
                    (item.list || []).map((item, index) =>
                        <Option key={index} value={item.id}>{item.name}</Option>
                    )
                }
            </Select>
        </div>
    )
}

function DateControl({item}){
    let [refresh, setRefresh] = useState(0);
    return (
        <div className='group time' >
            <label>{item.label}</label>
            <RangePicker
                style={{ width: 260 }}
                onChange={(e, dates) => {
                    if (!dates[0]) {
                        item.startValue = '';
                        item.endValue = '';
                    }
                    else {
                        item.startValue = new Date(dates[0]).getTime();
                        item.endValue = new Date(dates[1]).getTime() + 24 * 3600 * 1000;
                    }
                    setRefresh(++refresh);
                }} />
        </div>
    )
}

function Textarea({item}){
    let [refresh, setRefresh] = useState(0);
    return (
        <div className='group' >
            <label>{item.label}</label>
            <textarea className='form-control'
                value={item.value || ''}
                style={{ width: 260 }}
                onChange={e => {
                    item.value = e.target.value;
                    setRefresh(++refresh);
                }}
                placeholder={item.extra || '请输入' + item.label} 
            />
        </div>
    )
}

function CascaderControl({item}){
    let [refresh, setRefresh] = useState(0);
    const options = [
        {
            value: 'zhejiang',
            label: 'Zhejiang',
            children: [
                {
                    value: 'hangzhou',
                    label: 'Hangzhou',
                    children: [
                        {
                            value: 'xihu',
                            label: 'West Lake',
                        },
                    ],
                },
            ],
        },
        {
            value: 'jiangsu',
            label: 'Jiangsu',
            children: [
                {
                    value: 'nanjing',
                    label: 'Nanjing',
                    children: [
                        {
                            value: 'zhonghuamen',
                            label: 'Zhong Hua Men',
                        },
                    ],
                },
            ],
        },
    ];
    function onChange(value) {
        console.log(value);
    }

    return (
        <div className='group'>
            <label>{item.label}</label>
            <Cascader options={options} onChange={onChange} style={{ width: 260 }} placeholder="Please select" />
        </div>
    )
}


function SearchConditionList({ searchKeyList, other , onSearch , onReset}){
    let [refresh , setRefresh] = useState(0);
    let [isMiniType , setType] = useState(true)
    function initSelect(node) {
        lib.request({
            url: node.extra,
            needMask: false,
            success: (data) => {
                node.list = data;
                setRefresh(++refresh);
            }
        })
    }
    function init() {
        $('.ant-picker input').val('');
        searchKeyList.map((item) => {
            item.value = '';
            if (item.type == 'date') {
                item.startKey = item.key.split(',')[0];
                item.endKey = item.key.split(',')[1];
                item.startValue = '';
                item.endValue = '';
            }
            if (item.type == 'multi-select') {
                item.value = [];
            }
            if (item.type == 'select' || item.type == 'search-select' || item.type == 'multi-select') {
                if (!item.list) {
                    initSelect(item);
                }

            }
            if (item.type == 'json-select') {
                if (!item.list) {
                    item.list = JSON.parse(item.extra) || [];
                }
            }
        })
        setRefresh(++refresh);
    }
    useEffect(() => {
        init()
    } , [])
    var map = {
        'text' : Text , 
        'select': CommonSelect , 
        'json-select': CommonSelect ,
        'search-select': SearchSelect ,
        'multi-select' : MultiSelect ,
        'date': DateControl ,
        'textarea' : Textarea ,
        'cascader': CascaderControl
    }
    return (
        <div className={isMiniType ? 'mini-search-controls' : 'full-search-controls'}>
            <div className='search-controls'>
                {searchKeyList.map((item , key) => {
                    var Control = map[item.type];
                    return Control && <Control item={item} key={key} />
                })}
            </div>
            <div className='group group-btns' >
                <Button type="primary" onClick={() => {
                    let searchCondition = {};
                    searchKeyList.map((item) => {
                        if(item.type == 'date'){
                            if(item.startValue) {
                                searchCondition[item.startKey] = item.startValue;
                                searchCondition[item.endKey] = item.endValue;
                            }
                        } else if (item.type == 'multi-select'){
                            if(item.value.length){
                                searchCondition[item.key] = item.value;
                            } 
                        }else{
                            if(item.value != ''){
                                searchCondition[item.key] = item.value;
                            }   
                        }
                    })
                    onSearch(searchCondition)
                }}>查询</Button>
                <Button onClick={() => {
                    init();
                    onSearch({});
                }}>重置</Button>
                
            </div>
            
            <div className='change-type' ></div>
            <div className='change-type-click' onClick={() => setType(!isMiniType)}></div>
        </div>
    )
}
export default SearchConditionList;