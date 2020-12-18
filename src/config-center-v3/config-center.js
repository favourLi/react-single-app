import React, { Fragment, useState } from 'react';
import { Pagination, Checkbox, Empty , Button , Modal, Space} from 'antd';
import './config-center.less';
import SearchConditionList from '../config-center/search-condition-list';
import md5 from 'md5';
import { lib ,  event} from '../index'
import { Tooltip} from 'antd';
import CTable from './config-center-table';
import SetUp from '../config-center/set-up';

export default class ConfigCenter extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            pagination: {
                currentPage: 1,
                pageSize: 20,
                totalPage: 1
            },
            searchConditions: {},
            dataList: [],
            config: this.getConfig(lib.getParam('config_id')),
            detail : {
                height : 300,
                show: false
            },
            tableHeight : 0
        };
        this.resetSize = this.resetSize.bind(this);
        window.addEventListener("resize",this.resetSize,false);
        this.resetSize();
    }

    resetSize(){
        this.resetSize.timer && clearTimeout(this.resetSize.timer);
        this.resetSize.timer = setTimeout(() => {
            console.log(this.tablePanel.offsetHeight)
            this.setState({
                tableHeight : this.tablePanel.offsetHeight - 40
            })
        } , 500);
    }
    componentWillUnmount(){
        window.removeEventListener("resize",this.resetSize);
    }
    getConfig(id) {
        let configList = this.props.configList;
        let config = this.props.config;
        if(!config){
            for (var i = 0; i < configList.length; i++) {
                if (configList[i].id == id) {
                    config = configList[i];
                    break;
                }
            }
        }
        if (!config) {
            throw new Error(`page ${location.pathname} do not have a config; you can set the 
                config to the page or set a config_id 
            `);
        }
        config.tableFieldList.map((item) => {
            if(!item.width){
                item.width = 80
            }
        })
        config.tableFieldListVersion = md5(JSON.stringify(config.tableFieldList));
        var storage = localStorage[id];
        if (storage) {
            try {
                storage = JSON.parse(storage);
                if (storage.tableFieldListVersion == config.tableFieldListVersion) {
                    config.tableFieldList = storage.tableFieldList;
                    config.saveTableFieldList = true;
                }
            } catch (e) {
                console.error(e)
            }
        }
        config.tableFieldList.map((item) => item.width = parseInt(item.width));
        return JSON.parse(JSON.stringify(config));
    }
    load(needMask) {
        let { pagination, searchConditions } = this.state;
        var data = {};
        Object.assign(data, pagination, searchConditions);
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
    renderTable(){
        let {config , dataList , tableHeight} = this.state;
        console.log('---' , config.tableFieldList);
        let columns = config.tableFieldList.map(item => {
            var column =  {
                title: item.title,
                dataIndex: item.key,
                width: item.width,
                ellipsis : {showTitle: false},
                fixed : item.display
            }
            if(item.type == 'function' || item.type == 'js'){
                try {
                    column.render = (_ , row , index) => item.type == 'js' ?  eval(item.key) : this[item.key](row , index)
                } catch (e) {
                    console.error(new Error(`error expression ${item.key}`) );
                }
            }   
            return column;
        })
        return (<CTable dataSource={dataList} columns={columns} tableHeight={tableHeight} />)
    }

    renderPagination() {
        return (
            <Pagination showQuickJumper showSizeChanger
                pageSize={this.state.pagination.pageSize}
                pageSizeOptions={['10', '20', '30', '40', '50', '100', '200']}
                current={this.state.pagination.currentPage}
                total={this.state.pagination.totalCount}
                onChange={(page, pageSize) => {
                    let { pagination } = this.state;
                    pagination.currentPage = page;
                    if (pagination.pageSize != pageSize) {
                        pagination.pageSize = pageSize;
                        pagination.currentPage = 1;
                    }
                    this.load(true);
                }}
                showTotal={total => `总共 ${total} 条`}
            />
        )
    }
    renderOperation(){
        let {config} = this.state;
        let excel = config.excel;
        return (
            <Fragment>
                <div className='operation-left-panel'>
                    <Space>
                        {this.renderLeftOperation && this.renderLeftOperation()}
                    </Space>
                </div>
                <div style={{ marginLeft: '15px' }}>
                    <Space>
                        {this.renderRightOperation && this.renderRightOperation()}
                        <div style={{display : 'inline-block'}}>
                            {   
                                excel?.import  && 
                                <Button className='btn import' onClick={() => 
                                    lib.openPage(`/import-excel?page_title=${lib.getParam('page_title')}导入&api=${encodeURIComponent(excel.import)}` , () => {
                                        this.load();
                                    })
                                }>
                                    导入 &#xe639;
                                </Button>
                            }
                            {
                                excel?.export  && <Button className='btn' onClick={() => {
                                    let { pagination, searchConditions } = this.state;
                                    lib.request({
                                        url : excel.export , 
                                        needMask : true , 
                                        data : {...pagination , ...searchConditions},
                                        success : (json) => {
                                                    lib.openPage('/download-center?page_title=下载中心')
                                        }
                                    })
                                }}>
                                    导出 &#xe638;
                                </Button>
                            }
                        </div>
                    </Space>
                </div>
                    
                
                <SetUp {...this.state.config} save={(tableFieldList) => {
                    let config = this.state.config;
                    config.tableFieldList = tableFieldList;
                    this.setState({config});
                }} />
            </Fragment>
        )
    }
    render(){
        let {config } = this.state;
        return (
            <div className={`react-single-app-config-center ${this.props.name}`}>
                {this.renderModal && this.renderModal()}
                <div className='config-center-main'>
                    <div className='search-condition-panel'>
                        <SearchConditionList  searchKeyList={config.searchKeyList} onSearch={(searchConditions) => {
                            this.state.searchConditions = searchConditions;
                            this.state.pagination.currentPage = 1;
                            this.load(true);
                        }} />
                    </div>
                    <div className='operation-panel'>
                        {this.renderOperation()}
                    </div>
                    <div className='table-panel' ref={(tablePanel) => {
                        this.tablePanel = tablePanel;
                    }}>
                        {this.renderTable()}
                    </div>
                    <div>
                        {
                            this.state.pagination?.totalCount > 0 && 
                            <div className='pagination-panel'>
                                {this.renderPagination()}
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}