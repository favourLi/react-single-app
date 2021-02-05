import React, { useState, useEffect , createContext , useContext } from 'react';
import { useHistory} from 'react-router-dom';
import {Input, Select, DatePicker, Button, Cascader , Dropdown , Menu , Row , Col , Space } from 'antd';
const { RangePicker } = DatePicker;
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


const map = {
    'input' : InputForm ,
    'select' : SelectForm
}


function SearchConditionList({searchKeyList , onSearch}){
    return (
        <div>
            <Provider store={store}>
                <Row gutter={[16, 10]} >
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
                    <Col span={24}  md={12} xl={8} xxl={6} >
                        <Space style={{paddingLeft : '55px'}} >
                            <Button type='primary' onClick={() => {
                                onSearch(toJS(store.search))
                            }}>搜索</Button>
                            <Button  onClick={() => {
                                store.reset();
                                onSearch({})
                            }}>重置</Button>
                        </Space>
                    </Col>
                </Row>
            </Provider>
        </div>
    )
}



export default observer(SearchConditionList);
