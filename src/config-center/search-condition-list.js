import React, { Fragment, useState, useEffect } from 'react';
import { useHistory} from 'react-router-dom';
import {Input, Select, DatePicker, Button, Cascader } from 'antd';
const { Option } = Select;
const { RangePicker } = DatePicker;
import './search-condition-list.less'
import { lib } from '../index'
import moment from 'moment'

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
                value={
                    (new Date(item.startValue).getTime() && new Date(item.endValue).getTime()) ?
                    [moment(new Date(item.startValue).getTime()), moment(new Date(item.endValue).getTime())]:
                    []
                }
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

function Range({item}){
    let [refresh, setRefresh] = useState(0);
    return (
        <div className='group range' >
            <label>{item.label}</label>
            <Input value={item.startValue || ''} onChange={(e) => {
                item.startValue = e.target.value;
                setRefresh(++refresh);
            }}></Input>
            <span>&#xe633;</span>
            <Input value={item.endValue || ''} onChange={(e) => {
                item.endValue = e.target.value;
                setRefresh(++refresh);
            }}></Input>
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
    }

    return (
        <div className='group'>
            <label>{item.label}</label>
            <Cascader options={options} onChange={onChange} style={{ width: 260 }} placeholder="Please select" />
        </div>
    )
}

function SelectTextArea({item}) {
    let [refresh, setRefresh] = useState(0);
    if (!item.select) {
        item.select = JSON.parse(item.extra)[0].id
    }
    let str = "";
    JSON.parse(item.extra).map(item => {
        str += item.name + ','
    })
    return (
        <div className='group' >
            <label>
                <Select
                    dropdownClassName="dropMenu"
                    value={item.select}
                    onChange={(e) => {
                        item.select = e;
                        setRefresh(++refresh);
                    }}>
                    {JSON.parse(item.extra).map(ite => {
                        return <Option value={ite.id} key={ite.id}>{ite.name}</Option>
                    })}
                </Select>
            </label>
            <textarea className='form-control'
                value={item.value || ''}
                style={{ width: 260, height: 69}}
                onChange={e => {
                    item.value = e.target.value;
                    setRefresh(++refresh);
                }}
                placeholder={`请输入${str}多条用换行隔开（不超过5000条）`}
            />
        </div>
    )
}

function SelectInput({item}) {
    let [refresh, setRefresh] = useState(0);
    if (!item.select) {
        item.select = JSON.parse(item.extra)[0].id
    }
    return (
        <div className='group' >
            <label>
                <Select
                    dropdownClassName="dropMenu"
                    value={item.select}
                    onChange={(e) => {
                        item.select = e;
                        setRefresh(++refresh);
                    }}>
                    {JSON.parse(item.extra).map(ite => {
                        return <Option value={ite.id} key={ite.id}>{ite.name}</Option>
                    })}
                </Select>
            </label>
            <Input className='form-control'
                value={item.value || ''}
                style={{ width: 260, height: 69}}
                onChange={e => {
                    item.value = e.target.value;
                    setRefresh(++refresh);
                }}
            />
        </div>
    )
}


function SearchConditionList({ searchKeyList , onSearch }){
    let [refresh , setRefresh] = useState(0);
    let [isMiniType , setType] = useState(false);
    let history = useHistory();
    
    function search() {
        let searchCondition = {};
        var map = new Map();
        window.location.search.substring(1).split('&').map((kv) => {
            let [key, value] = kv.split('=');
            value = decodeURIComponent(value);
            map.set(key, value);
            if(key != 'config_id' && key != 'page_title'){
                searchCondition[key] = value;
            }
        })

        searchKeyList.map((item) => {
            if (item.type == 'date' || item.type == 'range') {
                if (item.startValue) {
                    searchCondition[item.startKey] = item.startValue;
                    searchCondition[item.endKey] = item.endValue;
                }
                map.set(item.startKey, item.startValue);
                map.set(item.endKey, item.endValue);
            } else if (item.type == 'multi-select') {
                if (item.value.length) {
                    searchCondition[item.key] = item.value;
                }
            } else if (item.type == 'select-textarea') {
                if (item.value.length) {
                    let [select, queryNo] = item.key.split(",");
                    searchCondition[select] = item.select;
                    searchCondition[queryNo] = item.value.split('\n').map(item => item.trim()).join(',')
                }
            } else if (item.type == 'select-input') {
                if (item.value.length) {
                    let [select, queryNo] = item.key.split(",");
                    searchCondition[select] = item.select;
                    searchCondition[queryNo] = item.value;
                }
            } else {
                if (item.value != '') {
                    searchCondition[item.key] = item.value;
                }
                map.set(item.key , item.value);
            }
        })
        var searchUrl = [];
        for(var [key , value] of map){
            if(value){
                searchUrl.push(`${key}=${value}`);
            }
            
        }
        if(history){
            history.replace(`${window.location.pathname}?${searchUrl.join('&')}`);
        }
        onSearch(searchCondition)
    }
    function reset(){
        searchKeyList.map((item) => {
            if (item.type == 'date' || item.type == 'range') {
                if (item.startValue) {
                    item.startValue = item.endValue = '';
                }
            } else if (item.type == 'multi-select') {
                item.value = [];
            } else {
                item.value = '';
            }
        })
        onSearch({});
        setRefresh(++refresh);
    }

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
        var map = new Map();
        window.location.search.substring(1).split('&').map((kv) => {
            let [key , value] = kv.split('=');
            if(key == 'page_title' || key == 'config_id' || key == 'refresh_event'){
                return;
            }
            value = decodeURIComponent(value);
            map.set(key , value);
        })

        searchKeyList.map((item) => {
            item.value = '';
            if (item.type == 'date' || item.type == 'range') {
                item.startKey = item.key.split(',')[0];
                item.endKey = item.key.split(',')[1];
                if (!item.startValue && map.get(item.startKey)){
                    item.startValue = parseInt(map.get(item.startKey));
                    item.endValue = parseInt(map.get(item.endKey));
                }
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
            if(!item.value){
                var value = map.get(item.key);
                if(item.type != 'text' && item.type != 'textarea'){
                    value = /^\d+$/.test(value) ? parseInt(value) : value || '';
                }
                item.value = value;
            }
        })
        setRefresh(++refresh);
        search();
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
        'cascader': CascaderControl,
        'select-textarea': SelectTextArea,
        'range' : Range,
        'select-input': SelectInput
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
                <Button type="primary" onClick={search}>查询</Button>
                <Button onClick={reset}>重置</Button>
                
            </div>
            
            <div className='change-type' ></div>
            <div className='change-type-click' onClick={() => setType(!isMiniType)}></div>
        </div>
    )
}
export default SearchConditionList;