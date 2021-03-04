import React , {Fragment, useEffect, useState , useRef , useContext , createContext} from 'react';
import { Steps , Button , Progress , Tabs , message , Divider , Space , Table} from 'antd';
const { Step } = Steps;
const { TabPane } = Tabs;
import {Uploader} from '../index';
import {lib, event} from '../index';

let context = createContext();

function Step1(){
    let {store , setStore , systemCode , code} = useContext(context);
    let [file , setFile] = useState(null);
    return (
        <div className='step1' >
            <Divider orientation='left'>步骤1：下载模板并完成数据录入</Divider>
            <div className='tips'>请按照模板的格式准备导入的数据，模板中表头名称不可更，表头行不可删除，单次导入的数据不可超过10000条</div>
            <Space size={15} style={{margin: '10px 0 30px'}}>
                <Button type='primary' onClick={() => window.open(store.src)}>下载模板</Button>
                {store.failSrc && <Button type='danger' onClick={() => window.open(store.failSrc)}>下载失败数据</Button>}
            </Space>
            <Divider orientation='left'>步骤2：上传已经录入的数据文件</Divider>
            <div className='tips'>文件后缀必须为xls或xlsx（即Excle格式），您可以点击上传文件或者拖拽文件至此处</div>
            <Uploader 
                allowTypes={['xls' , 'xlsx']} 
                style={{marginTop : '10px'}} 
                onChange={file => setFile(file)}
            />
            <div style={{marginTop: '15px'}}>
                <Button type='primary' onClick={() => {
                    if(!file){
                        return message.error('请选上传Excel数据表')
                    }
                    // 导入参数的添加
                    // let extend = {};
                    // decodeURIComponent(window.location.search).slice(1).split('&').map(item => {
                    //     let [key , value] = item.split('=');
                    //     if(['page_title' , 'api' , 'refresh_event'].indexOf(key) == -1){
                    //         extend[key] = value;
                    //     }
                    // });
                    lib.request({
                        url : '/park-gate/import/create' ,
                        data : {
                            systemCode , code  , file
                        },
                        needMask : true , 
                        success : () => setStore({...store ,  status : 2 , file})
                    })
                }}>下一步</Button>
            </div>
        </div>
    )
}

function Step2(){
    let {store , setStore , systemCode , code} = useContext(context);
    function query(){
        lib.request({
            url : '/park-gate/import/query' ,
            data : {
                systemCode , code
            },
            success : data => setStore({...store , ...data})
        })
    }
    let {success , fail , unProcessed , total , percent = 0} = store.progress || {};
    if(total){
        percent = parseInt((success + fail) * 100 / total);
    }
    useEffect(() => {
        query();
        let timer = setInterval(query , 3000);
        return () => {
            clearInterval(timer)
        };
    } , [])
    return (
        <div className='step2'>
            <Progress percent={percent} showInfo={true} strokeWidth={16} status="active" />
            <div className='info' style={{marginTop : '25px'}}>
                正在导入中<span className='link'>{store.file?.name}</span> 
            </div>
            <div className='info' style={{marginTop : '3px'}}>
                共<span>{total}</span>条数据，已成功导入<span className='link'>{success}</span>条，失败<span className='danger'>{fail}</span>条，未完成<span>{unProcessed}</span>条
            </div>
        </div>
    )
}

function Step3(){
    let {store , setStore , systemCode , code} = useContext(context);
    let [data , setData] = useState({});
    let heightPanel = useRef();
    let [height , setHeight] = useState(300);
    function resize(){
        setHeight(heightPanel.current.offsetHeight);
    }
    function finish(retry){
        lib.request({
            url : '/park-gate/import/confirm' ,
            data : {
                systemCode , code
            },
            needMask : true ,
            success : () => {
                let failUrl = retry ? store.failUrl : '';
                setStore({...store , status : 1 , failUrl});
            }
        })
    }
    useEffect(() => {
        lib.request({
            url : '/park-gate/import/getData' , 
            data : {
                systemCode , code
            } , 
            success : data => {
                setData(data);
            }
        })
        resize();
        event.on('window.resize' , resize);
        return () => event.off('window.resize' , resize);
    } , [])
    return (
        <div className='step3'>
            <div style={{marginLeft : '60px'}}>
                <div className='info'>共成功导入了<span className=''>{store.progress?.total}</span>条信息，其中成功<span className='link'>{store.progress?.success}</span>条，<span className='danger'>{store.progress?.fail}</span>条出现异常导入失败。</div>
                <div className='tips' style={{marginTop : '5px'}}>请下载失败表，重新导入本次的失败项</div>
            </div>
            <div  className='tabs'>
                <Tabs tabBarExtraContent={
                    <Space size={15}>
                        {store.successSrc &&  <Button type='danger' onClick={() => window.open(store.successSrc)}>失败数据</Button>}
                        {store.failSrc &&  <Button type='primary' onClick={() => window.open(store.failSrc)}>成功数据</Button>}
                    </Space>
                }>
                    <TabPane tab="失败信息" key={1}>
                        {data.fail?.length && <SheetList list={data.fail} height={height} needReason />}
                    </TabPane>
                    <TabPane tab="成功信息" key={2}>
                        {data.success?.length && <SheetList list={data.success} height={height}  />}
                    </TabPane>
                </Tabs>
                <div className='height-panel' ref={heightPanel}></div>
            </div>
            <div className='ft' style={{marginTop : '15px'}}>
                <Space size={15}>
                    <Button type='danger' onClick={() => finish(true)}>重新导入失败数据</Button>
                    <Button type='primary' onClick={() => finish()}>完成</Button>
                </Space>
            </div>
        </div>
    )
}

function SheetList({list = [] , needReason = false , height = 500}){
    let [item , setItem] = useState(list[0]);
    let columns = [
        {title : '行号' , dataIndex : '__index__' , width : 80 , fixed: 'left',} , 
        ...item.hdList.map(item => ({title : item , dataIndex : item , width : 200}))
    ]
    if(needReason){
        columns.push({title : '原因' , width: 200 , dataIndex : '__reason__' , fixed: 'right'})
    }
    return (
        <>
            <Space size={15} split={<Divider type="vertical" />} className='sheet'>
                {
                    list.map(node => <div key={node.title} className={item === node ? 'link' : ''} onClick={() => setItem(node)}>{node.title}</div>)
                }
            </Space>
            <div className='table-panel' >
                <Table 
                    size='small' 
                    columns={columns}
                    dataSource={item.list} 
                    pagination={false}
                    scroll={{x : 80 + 200 * (item.hdList.length + needReason) , y : height - 60}}
                    rowKey='__index__'
                >
                </Table>
            </div>
        </>
    )
}

function ImportData(){
    let [store , setStore] = useState({
        status : 0 , 
        src : '' , 
        failSrc : '' ,
        successSrc : '' ,
        progress : {
            success : 0 , 
            fail : 0 , 
            total : 0 ,
            unProcessed : 0
        }
    })
    let systemCode = lib.config.systemCode , code = lib.getParam('code');
    useEffect(() => {
        lib.request({
            url : '/park-gate/import/query' ,
            data : {
                systemCode , code
            },
            success : store => setStore(store)
        })
    } , [])
    return (
        <context.Provider value={{store , setStore , systemCode, code}}>
            <div className='config-center-v3-import-data'>
                <div style={{margin: '20px 60px'}}>
                    <Steps current={store.status - 1} >
                        <Step title='上传文件'  />
                        <Step title='导入中' />
                        <Step title='导入完成' />
                    </Steps>
                </div>
                <div style={{padding: '0 30px'}}>
                    {
                        store.status == 1 && <Step1 />
                    }
                    {
                        store.status == 2 && <Step2 />
                    }
                    {
                        store.status == 3 && <Step3 />
                    }
                </div>
                
            </div>
        </context.Provider>
    )
};

export default ImportData;




