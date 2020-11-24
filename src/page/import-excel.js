import React , {Fragment, useEffect, useState} from 'react';
import { Steps , Button , Progress , Tabs , message } from 'antd';
const { Step } = Steps;
const { TabPane } = Tabs;
import './import-excel.less';
import Uploader from '@/component/uploader';
import {lib, event} from '../index';

var importInfo = {};


function Step1({setCurrent }){
    return <div className='step-1'>
        <div className='box'>
            <div className='title'>步骤1：下载模板并完成数据录入</div>
            <div className='text'>请按照模板的格式准备导入的数据，模板中表头名称不可更改，表头行不可删除，单次导入的数据不可超过10000条</div>
            <a className='link' href={importInfo.templateUrl} target='_blank'>下载数据模板</a>
            {
                importInfo.failUrl && 
                <Button type='danger' style={{marginLeft : '20px'}} onClick={() => window.open(importInfo.failUrl)}>下载失败数据</Button>
            }
        </div>
        <div className='box'>
        <div className='title'>步骤2：上传已经录入的数据文件</div>
            <div className='text'>文件后缀必须为xls或xlsx（即Excle格式），您可以点击上传文件或者拖拽文件至此处</div>
            <Uploader allowTypes={['xls' , 'xlsx']} onUploadEnd={(src , name) => importInfo.file={src,name}} />
        </div>
        <Button type='primary' className='next' onClick={() => {
            if(!importInfo.file){
                return message.error('请先上传数据文件')
            }
            lib.request({
                url : `${importInfo.api}/import` , 
                needMask : true, 
                data : {
                    url : importInfo.file.src ,
                    faileCount : parseInt(Math.random() * 120) ,
                    total : parseInt(Math.random() * 2000)
                },
                success : () => setCurrent(2)
            })
        }}>下一步</Button>
    </div>  
}  
  

function Step2({setCurrent }){
    var [data , setData] = useState(null);
    function query(){
        lib.request({
            url : `${importInfo.api}/import/query` ,
            success : data => {
                if(data.step!= 2 ){
                    setCurrent(data.step);
                    return;
                }
                setData(data);
            }
        })
    }
    useEffect(()=> {
        query();
        var handle = setInterval(query , 3000);
        return () => clearInterval(handle);
    } , [])
    if(!data){
        return '';
    }
    return <div className='step-2'>
        <Progress percent={parseInt((data.successCount + data.failCount) * 100 / data.total)} status="active" showInfo={true} strokeWidth={12} />
        <div className='status'>正在导入<span style={{color : '#1890ff'}}> {importInfo.file?.name}</span></div>
        <div className='info'>
            共<span>{data.total}</span>条数据 ， 
            已成功<span style={{color : '#1890ff'}}>{data.successCount}</span>条 ，
            已失败<span style={{color : '#f30'}}>{data.failCount}</span>条， 
            未完成<span>{data.total - data.successCount - data.failCount}</span>条 
        </div>
    </div> 
}


function Step3({api , setCurrent}){
    let [active , setActive] = useState('1');
    var [data , setData] = useState(null);
    useEffect(()=> {
        if(importInfo.refreshEvent){
            event.emit(importInfo.refreshEvent);
        }
        if(importInfo.onImportEnd){
            importInfo.onImportEnd();
        }
        lib.request({
            url : `${importInfo.api}/import/query` ,
            success : data => {
                setCurrent(data.step);
                setData(data);
            }
        })
    } , []);
    function confirm(){
        lib.request({
            url : `${importInfo.api}/import/confirm` ,
            success : data => {
                setCurrent(1);
            }
        })
    }
    if(!data){
        return '';
    }
    return <div className='step-3'>
        <div className='info'>
        <div className='title'>
            共成功导入了<span>{data.total}</span>条信息，
            其中成功<span style={{color: '#1890ff'}}>{data.successCount}</span>条，
            <span style={{color:'#ff4d4f'}}>{data.failCount}</span>条出现异常导入失败。
        </div>
            <div className='sub-title'>请下载失败表，重新导入本次的失败项</div>
        </div>
        <div  className='tabs'>
            <Tabs onChange={active => setActive(active)} active={active} tabBarExtraContent={
                <>
                    {data.failUrl && <Button type='danger' onClick={() => window.open(data.failUrl)}>失败数据</Button>}
                    {data.successUrl && <Button type='primary' onClick={() => window.open(data.successUrl)} style={{marginLeft : '10px'}}>成功数据</Button>}
                </>
            }>
                <TabPane tab="失败信息" key="1">
                </TabPane>
                <TabPane tab="异常信息" key="2">
                </TabPane>
                <TabPane tab="成功信息" key="3">
                </TabPane>
            </Tabs>
        </div>
        <div className='tab-contents'>
            <div className='panel'>
            {
                active == 1 && <Table hdlist={data.header}  list={data.failData} needReason={true} />
            }
            {
                active == 2 && <div className='reason-panel'>
                    {
                        data.failData.map((item , index) => 
                            <div key={index}>第<span className='no'>{item.__index__}</span>行 {item.__reason__}</div>
                        )
                    }
                </div>
            }
            {
                active == 3 && <Table hdlist={data.header}  list={data.successData} needReason={false} />
            }
            </div>
        </div>
        <div className='btns'>
            {
                data.successCount < data.total && <Button type='danger' style={{marginRight: '20px'}} onClick={() => {
                    importInfo.failUrl = data.failUrl;
                    confirm();
                }}>重新导入失败数据</Button>
            }
            <Button type='primary' onClick={() => {
                    importInfo.failUrl = '';
                    confirm();
                }}>完成</Button>
        </div>
    </div>
}

function Table({hdlist = [], list = [], needReason}){
    return <table>
        <thead>
            <tr>
                <th className='no'>行号</th>
                {hdlist.map((item , key) => <th key={key}>{item.name}</th>)}
                {needReason && <th>失败原因</th>}
            </tr>
        </thead>
        <tbody>
        {
            list.map((row , index) => 
                <tr key={index}>
                    <td className='no'>{row.__index__}</td>
                    {
                        hdlist.map((item,key) => <td key={key}>{row[item.key]}</td>)
                    }
                    {needReason && <td>{row.__reason__}</td>}
                </tr>
            )
        }
        </tbody>
    </table>
}



function ImportExcel({api , onImportEnd}){
    var [current , setCurrent] = useState(0);
    useEffect(()=> {
        importInfo.api =api || lib.getParam('api');
        importInfo.refreshEvent = lib.getParam('refresh_event');
        importInfo.onImportEnd = onImportEnd;
        lib.request({
            url : `${importInfo.api}/import/query` ,
            success : data => {
                importInfo.templateUrl = data.templateUrl;
                setCurrent(data.step);
            }
        })
    } , [])

    return (
        <div className='import-excel'>
            <Steps current={current-1}>
                <Step title='上传文件'  />
                <Step title='导入中' />
                <Step title='导入完成' />
            </Steps>
            {
                current == 1 && <Step1 setCurrent={setCurrent}  />
            }
            {
                current == 2 && <Step2 setCurrent={setCurrent}  />
            }
            {
                current == 3 && <Step3 setCurrent={setCurrent}  />
            }
        </div>
    )
}


export default ImportExcel;