import React, { useState, useEffect , createContext , useContext } from 'react';
import { useHistory} from 'react-router-dom';
import {Input, Select, DatePicker, Button, Cascader , Dropdown , Menu , Row , Col , Space  } from 'antd';
import { lib , event } from '@/index'
import moment from 'moment'
import { DownOutlined } from '@ant-design/icons';
import  {  makeAutoObservable , autorun , toJS } from 'mobx'
import {Provider ,  inject as _inject , observer , } from 'mobx-react'

var inject = (fn) => _inject('store')(observer(fn));

class Store{
    constructor(){
        makeAutoObservable(this)
    }
    search = {}
    setValue(key , value){
        this.search[key] = value;
    }
    reset(){
        this.search = {}
    }
}
var store = new Store();
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

var InputForm = inject(({store , item}) => {
    let search = store.search;
    return (
        <>  
            {store.goodsName}
            <label>{item.label}</label>
            <Input value={search[item.key]} onChange={e => store.setValue(item.key , e.target.value)} />
        </>
    )
})

var SelectForm = inject(({store , item}) => {
    let search = store.search;
    let [list, setList] = useState([]);
    useEffect(() => {
        if(item.source == 'json'){
            try{
                setList(eval(item.json));
            }
            catch(e){console.error(`${item.label}解析出错了，请检查该JSON` , e)}
        }else{
            let url = item.api.split('?')[0];
            let data = getSearchParam(item.api);
            lib.request({
                url , 
                data , 
                needMask: false,
                success: list => setList(list || [])
            })
        }
    } , [])
    return (
        <>  
            <label>{item.label}</label>
            <Select 
                allowClear
                value={search[item.key]} 
                onChange={value => store.setValue(item.key , value)} 
                showSearch={item.isSearch}
                optionFilterProp="children"
                mode={item.isMultiSelect ? 'multiple' : null}
            >
                {
                    list.map((item, index) =>
                        <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
                    )
                }
            </Select>
        </>
    )
})

var DateForm = inject(({store , item}) => {
    let search = store.search;
    let {start , end , key} = item;
    if(!item.isRange){
        return (
            <>
                <label>{item.label}</label>
                <DatePicker 
                    value={search[key] ? moment(parseInt(search[key])) : ''}
                    onChange={(e , dates) => {
                        store.setValue(key , new Date(dates).getTime() - 8 * 3600 * 1000)
                    }}
                    picker={item.dateType}
                />
            </>
        )
    }
    else{
        return (
            <>
                <label>{item.label}</label>
                <DatePicker.RangePicker
                    value={
                        search[start] ?
                        [moment(parseInt(search[start])), moment(parseInt(search[end]))]:
                        []
                    }
                    onChange={(e, dates) => {
                        if (!dates[0]) {
                            store.setValue(start , '');
                            store.setValue(end , '');
                        }
                        else {
                            store.setValue(start , new Date(dates[0]).getTime() - 8 * 3600 * 1000);
                            store.setValue(end , new Date(dates[1]).getTime()  + 16 * 3600 * 1000 - 1);
                        }
                    }} 
                    picker={item.dateType}
                />
            </>
        )
    }
})

var SelectTextArea = inject(({store , item}) => {
    let search = store.search;
    let [list , setList] = useState([]);
    let {key1 , key2} = item;
    useEffect(() => {
        list = eval(item.json);
        setList(list)
        store.setValue(key1 , list[0]?.id)
    } , []);
    return (
        <>
            <Select 
                value={search[key1]}
                onChange={value => store.setValue(key1 , value)}
                style={{width : '100px' }}
            >
                {
                    list.map((item, index) =>
                        <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
                    )
                }
            </Select>
            <Input.TextArea 
                autoSize={{minRows:1 , maxRows:6}}
                placeholder='每条数据占一行'
                value={search[key2]?.split(',').join('\n')}
                onChange={e => store.setValue(key2 , e.target.value.split('\n').join(','))}
            />
        </>
    )
})

var CascaderForm = inject(({store , item}) => {
    let search = store.search;
    let [list, setList] = useState([]);
    var change = function(list){
        return list.map(item => {
            item.value = item.id || item.value;
            item.label = item.name || item.label;
            item.children && change(item.children);
            return item;
        })
    }
    useEffect(() => {
        if(item.source == 'json'){
            try{
                setList(change(eval(item.json)));
            }
            catch(e){console.error(`${item.label}解析出错了，请检查该JSON` , e)}
        }else{
            let url = item.api.split('?')[0];
            let data = getSearchParam(item.api);
            lib.request({
                url , 
                data , 
                needMask: false,
                success: list => setList(change(list || []))
            })
        }
    } , []);
    return (
        <>
            <label>{item.label}</label>
            <Cascader options={list} value={search[item.key]?.split(',')} onChange={values => store.setValue(item.key , values.join(','))} /> 
        </>
    )
})

const map = {
    'input' : InputForm ,
    'select' : SelectForm ,
    'date' : DateForm,
    'select-textarea': SelectTextArea,
    'cascader': CascaderForm,
}




function SearchConditionList({searchKeyList , onSearch}){
    var executeSearch = function(search){
        let params = {};
        window.location.search.slice(1).split('&').map(item => {
            let [key , value] = item.split('=');
            if(key != 'config_id' && key!= 'page_title'){
                params[key] = value;
            }
        })
        onSearch({...params , ...search})
    }
    let [isMini , setMini] = useState(false);
    useEffect(() => executeSearch({}) , []);
    return (
        <>
        <div className={`${isMini ? 'mini-search' : 'full-search'}`}>
            <Provider store={store}>
                <Row gutter={[16, 10]} style={{paddingRight : '20px'}}>
                    {
                        searchKeyList.map((item , index) => 
                        {
                            let Control = map[item.type];
                            if(Control){
                                return (
                                    <Col span={24}  md={12} xl={8} xxl={6} key={index}>
                                        <Control item={item} />
                                    </Col>
                                )
                            }
                            
                        })
                    }
                    <Col span={24}  md={12} xl={8} xxl={6} className='search-btns'>
                        <Space  >
                            <Button type='primary' onClick={() => {
                                executeSearch(toJS(store.search))
                            }}>搜索</Button>
                            <Button  onClick={() => {
                                store.reset();
                                executeSearch({})
                            }}>重置</Button>
                        </Space>
                    </Col>
                </Row>
                
            </Provider>
        </div>
        <div className={`change-type ${isMini}`} onClick={() => {
            setMini(!isMini);
            event.emit('window.resize')
        }}></div>
        </>
    )
}

export default observer(SearchConditionList);
