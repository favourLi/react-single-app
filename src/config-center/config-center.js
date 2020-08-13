import React, { Fragment, useState } from 'react';
import { Pagination , Checkbox } from 'antd';
import { Resizable } from 'react-resizable';
import './config-center.less';
import SetUp from './set-up';
import SearchConditionList from './search-condition-list';
import md5 from 'md5';
import Draggable from 'react-draggable'
import { lib } from '../index'



function ResizeableTh(props){
    let {item , tableStyle , dataList} = props;
    let [width, setWidth] = useState(parseInt(item.width));
    let cls = '';
    let style = { zIndex: 200 - props.index};
    if (tableStyle == 'sticky') {
        cls = item.display;
        if (cls == 'sticky-left') {
            style.left = item.left ;
        }
        if (cls == 'sticky-right') {
            style = { right: item.right , zIndex : 200 };
        }
    } 
    let [checked, indeterminate] = [false , false];
    if(item.type == 'batch'){
        let checkedNum = dataList.filter((item) => item.checked).length;
        if(checkedNum == dataList.length){
            checked = true;
        }
        else if(checkedNum > 0){
            indeterminate = true;
        }
    }

    return (
        <th style={style} className={cls}>
            {
                item.type == 'batch' && 
                <div className='content ' style={{paddingLeft:'6px' , borderRight:'solid 1px #ddd' , marginRight : '-11px' }}>
                    <Checkbox checked={checked} indeterminate={indeterminate} onChange={(e) => {
                        dataList.map((item) => item.checked = e.target.checked);
                        props.refresh();
                    }} />
                </div>
            }
            {
                item.type != 'batch' && 
                <Fragment >
                    <div className='content' >{item.title}</div>
                    <Resizable width={width} height={36} minConstraints={[80, 50]}
                        onResize={(event, { element, size, handle }) => {
                            console.log('onResize', size.width);
                            setWidth(size.width);
                        }}
                        onResizeStop={(e, { size }) => {
                            item.width = size.width;
                            props.refresh();
                        }}
                        draggableOpts={{ enableUserSelectHack: false }} >
                        <div style={{ width: width + 1 + 'px', height: '36px' }}></div>
                    </Resizable>
                </Fragment>
            }
            
        </th>
    )
}

function ResizeableDetail(props){
    return (
        <Draggable
            axis="y"
            handle=".handle"
            defaultPosition={{ x: 0, y: 0 }}
            position={{x : 0 , y:0}}
            grid={[1 , 1]}
            scale={1}
            onStop={(e) => {
                props.setHeight(e.layerY);
            }}>
            <div className='handle'></div>
        </Draggable>
    )
}


class ConfigCenter extends React.Component{

    constructor(props) {
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
            __detail__ : {
                height : 300,
                show: false
            }
        };
        this.load(true);
    }

    setDetailData(data){
        let {__detail__ : detail} = this.state;
        detail.data = data;
        detail.show = true;
        this.setState({
            __detail__ : detail
        })
    }


    getConfig(id) {
        let configList = this.props.configList;
        let config;
        for (var i = 0; i < configList.length; i++) {
            if (configList[i].id == id) {
                config = configList[i];
                break;
            }
        }
        if (!config) {
            throw new Error(`Config center can't find config for ${id}`);
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
                    console.log(storage.tableFieldListVersion, config.tableFieldListVersion)
                    config.tableFieldList = storage.tableFieldList;
                    config.saveTableFieldList = true;
                }
            } catch (e) {
                console.log(e)
            }
        }
        config.tableFieldList.map((item) => item.width = parseInt(item.width));
        return config;
    }


    load(needMask) {
        let { pagination, searchConditions } = this.state;
        var strs = window.location.search.substring(1);
        var data = {};
        var b = strs.split('&');
        for (var i = 0; i < b.length; i++) {
            var [key, value] = b[i].split('=');
            if (['config_id', 'title', 'page_title', 'refresh_event'].indexOf(key) == -1) {
                data[key] = value;
            }
        }
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
            }
        })
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



    getTableStyle(){
        let tableStyle = 'auto';
        let config = this.state.config;
        let tableFieldList = this.state.config.tableFieldList;
        let leftList = tableFieldList.filter((item) => item.display == 'sticky-left');
        let list = tableFieldList.filter((item) => item.display == 'auto');
        let rightList = tableFieldList.filter((item) => item.display == 'sticky-right');
        
        let [left, right] = [config.needBatchOperation  ? 50 : 0 , 0];
        leftList.map((item) => {item.left = left ; item.right = 'auto' ; left += item.width});
        rightList.reverse().map((item) => {item.right = right ; item.left='auto' ; right += item.width});
        rightList.reverse();
        tableFieldList = [...leftList , ...list , ...rightList];
        if(this.tablePanel){
            let width = this.tablePanel.offsetWidth - (navigator.platform.toLocaleLowerCase().indexOf('mac') > -1 ? 0 : 18);
            if(config.needBatchOperation ){
                width -= 50;
            }
            let tableWidth = 0;
            tableFieldList.map((item) => tableWidth += item.width);
            if(tableWidth < width){
                let avg = parseInt((width - tableWidth) / tableFieldList.length);
                tableFieldList.map((item) => item.width += avg);
                tableFieldList[tableFieldList.length - 1].width += (width - tableWidth - avg * tableFieldList.length);
                
            }
            else if(tableWidth > width){
                tableStyle = 'sticky';
            }
        }
        if (config.needBatchOperation ) {
            tableFieldList = [{
                id: 1,
                type: 'batch',
                display: 'sticky-left',
                left : 0,
                width: 50
            }, ...tableFieldList]
        }
        return {tableFieldList , tableStyle};
    }

    renderTable() {
        if(!this.tablePanel){
            return;
        }
        let tableWidth = 0;
        let {dataList} = this.state;
        let {tableFieldList , tableStyle} = this.getTableStyle();
        
        tableWidth = tableFieldList.reduce((tableWidth, item) => tableWidth + item.width);
        return (
            <Fragment>
                <div className='thead'>
                    <table style={{ width: tableWidth + 'px' }} className='table table-hover '>
                        <colgroup>
                            {tableFieldList.map((item) => 
                                <col key={item.id} style={{ width: item.width + 'px'}} />
                            )}
                        </colgroup>
                        <thead>
                            <tr>
                                {tableFieldList.map((item , index) => 
                                    <ResizeableTh 
                                        key={item.id + tableStyle} 
                                        index={index} 
                                        refresh={() => this.setState(this.state)} 
                                        item={item} 
                                        tableStyle={tableStyle} 
                                        dataList={dataList}
                                    />
                                )}
                            </tr>
                        </thead>
                    </table>
                </div>
                <div className='tbody'>
                    <table className='table table-hover '  >
                        <colgroup>
                            {tableFieldList.map((item) =>
                                <col key={item.id} style={{ width: item.width + 'px' }} />
                            )}
                        </colgroup>
                        <tbody>

                            {
                                dataList.map((row, index) =>
                                    <tr key={index}>
                                        {
                                            tableFieldList.map((item, i) => {
                                                let cls = '';
                                                let style = {};
                                                if(tableStyle == 'sticky'){
                                                    cls = item.display;
                                                    if(cls == 'sticky-left'){
                                                        style = {left : item.left};
                                                    }
                                                    if(cls == 'sticky-right'){
                                                        style={right : item.right};
                                                    }
                                                } 
                                                if(item.type == 'batch'){
                                                    return (
                                                        <td key={i} className={cls + ' batch'} style={style}>
                                                            <Checkbox checked={row.checked} onChange={(e) => {
                                                                row.checked = e.target.checked
                                                                this.setState({dataList});
                                                            }} />
                                                        </td>
                                                    )
                                                }
                                                if (item.type == 'text') {
                                                    return (
                                                        <td key={i} className={cls} style={style}>
                                                            {row[item.key]}
                                                        </td>
                                                    )
                                                }
                                                else if (item.type == 'js') {
                                                    var html = '';
                                                    try {
                                                        html = eval(item.key)
                                                    } catch (e) {
                                                        console.error(new Error(`error expression ${item.key}`) );
                                                    }
                                                    return (
                                                        <td key={i} className={cls} style={style} dangerouslySetInnerHTML={{ __html: html }}>
                                                        </td>
                                                    )
                                                }
                                                else if (item.type == 'function') {
                                                    var html = '';
                                                    try {
                                                        if (typeof this[item.key] != 'function'){
                                                            console.error( new Error(`can not find the function ${item.key}`));
                                                        }else{
                                                            html = this[item.key](row)
                                                        }

                                                    } catch (e) {
                                                        console.error(e)
                                                    }
                                                    return (
                                                        <td key={i} className={cls} style={style} >
                                                            {html}
                                                        </td>

                                                    )
                                                }

                                            })
                                        }
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
                
            </Fragment>
        )
    }
    renderOperation(){
        let {config} = this.state;
        let other = config.other;
        return (
            <Fragment>
                <div className='operation-left-panel'>
                    {this.renderLeftOperation && this.renderLeftOperation()}
                </div>
                <div style={{ marginLeft: '15px' }}>
                    {this.renderRightOperation && this.renderRightOperation()}
                </div>
                {/* <div className='btn-group'>
                    {   
                        other.import  && 
                        <Fragment>
                            <button className='btn'>导入模板下载 &#xe639;</button>
                            <button className='btn'>导入 &#xe639;</button>
                        </Fragment>
                    }
                    {
                        other.export  && <button className='btn'>导出 &#xe638;</button>
                    }
                    {
                        other.sync  && <button className='btn'>同步 &#xe6de;</button>
                    }
                </div> */}
                
                <SetUp {...this.state.config} save={(tableFieldList) => {
                    let config = this.state.config;
                    config.tableFieldList = tableFieldList;
                    this.setState({config});
                }} />
            </Fragment>
        )
    }

    render(){
        let {config , __detail__:detail} = this.state;
        return (
            <div className={`config-center ${this.props.name}`}>
                {this.renderModal && this.renderModal()}
                <div >
                    <div className='search-condition-panel'>
                        <SearchConditionList searchKeyList={config.searchKeyList} other={config.other} onSearch={(searchConditions) => {
                            this.state.searchConditions = searchConditions;
                            this.load(true);
                        }} onReset={() => {
                            
                        }} />
                    </div>
                </div>
                <div>
                    <div className='operation-panel'>
                        {this.renderOperation()}
                    </div>
                </div>
                <div className='table-panel' ref={(tablePanel) => {
                    this.tablePanel = tablePanel;
                }}>
                    {this.renderTable()}
                </div>
                <div>
                    <div className='pagination-panel'>
                        {this.renderPagination()}
                    </div>
                </div>
                <div>
                    {
                        detail.show && 
                        <div className='detail-panel' style={{ height: detail.height + 'px' }}>
                            <ResizeableDetail height={detail.height} setHeight={(height) => {
                                detail.height -= height;
                                detail.height = Math.max(detail.height, 200);
                                detail.height = Math.min(detail.height, 500);
                                this.setState({
                                    __detail__: detail
                                })
                            }} />
                            <div className='close' onClick={() => {
                                detail.show = false;
                                this.setState({ __detail__: detail });
                            }}>&#xe60c;</div>
                            <div className='detail-content' >
                                {detail.show && this.renderDetail && this.renderDetail(detail.data)}
                            </div>
                        </div>
                    }
                        
                    
                </div>
            </div>
        )
    }
}

export default ConfigCenter;