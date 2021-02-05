import React, {  useState } from 'react';
import { Pagination, Button , Space , Skeleton , Table , Modal , message} from 'antd';
import SearchConditionList from './search-condition-list';
import { lib ,  event} from '@/index'
import SortTable from './sort-table';
import './index.less';
import { Resizable } from 'react-resizable';
import MyDraggable from  './draggable';

const ResizableTitle = props => {
    const { onResize ,  ...restProps } = props;
    let [width , setWidth] = useState(props.width);
    let [resizing , setResizing] = useState(false);
    if (!width) {
        return <th {...restProps} />;
    }
    let thStyle = {...restProps.style}, handleStyle = {};
    if(resizing){
        handleStyle = {left : `${width - 11}px`};
        thStyle.zIndex = 10;
    }
    return (
        <Resizable
            width={width}
            height={0}
            handle={
                <div className={`resizable-handle ${resizing && 'resizing'}`} onClick={e => {
                    e.stopPropagation();
                }} style={handleStyle}></div>
            }
            onResizeStart={() => setResizing(true)}
            onResize={(e , {size}) => {
                if(size.width > 80 && size.width < 800){
                    setWidth(size.width);
                }
            }}
            onResizeStop={(e,p) => {
                setResizing(false);
                onResize(e , p);
            }}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps} style={thStyle}>
                <div className='title'>{restProps.children}</div>
            </th>
        </Resizable>
    );
};




export default class SearchList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            pagination: {
                currentPage: 1,
                pageSize: 20,
                totalPage: 1
            },
            search: {},
            dataList: [],
            config: null,
            table : {
                panel : React.createRef(),
                height : 500
            },
            selectedRows : []
        };
        Promise.resolve(this.getConfig())
            .then(config => config && this.setState({config}))
            .catch(e => this.setState({config : '出错了'}));

        this.resetSize = this.resetSize.bind(this);
        window.addEventListener("resize",this.resetSize,false);
        event.on('window.resize' , this.resetSize);
        setTimeout(this.resetSize , 100);

        this.load = this.load.bind(this);
    }

    resetSize(){
        this.resetSize.timer && clearTimeout(this.resetSize.timer);
        this.resetSize.timer = setTimeout(() => {
            let {table} = this.state;
            if(table.panel.current?.offsetHeight){
                table.height = table.panel.current.offsetHeight - 40;
                this.setState({table});
            }
            
        } , 100);
    }
    componentWillUnmount(){
        window.removeEventListener("resize",this.resetSize);
        event.off('window.resize' , this.resetSize);
    }
    
    load(needMask) {
        let { pagination, search , config } = this.state;
        var data = {};
        Object.assign(data, pagination, search);
        lib.request({
            url: config.page.api,
            data: data,
            needMask: needMask,
            success: (data) => {
                this.setState({
                    pagination: data.page,
                    dataList: data.dataList || []
                })
                this.tablePanel.scrollTop = 0;
                setTimeout(this.resetSize);
            }
        })
    }
    setDetail(detail){
        this.setState({detail})
    }
    renderDeleteRow({api , id , title}){
        return (
            <div className='danger' onClick={() => {
                Modal.confirm({
                    content : title ,
                    onOk: () => {
                        lib.request({
                            url : api,
                            data : {id},
                            needMask:true ,
                            success : () => {
                                message.success('操作成功');
                                this.load(true);
                            }
                        })
                    }
                })
            }}>删除</div>
        )
    }
    renderTable(){
        let {config , dataList , table , selectedIdList , pagination } = this.state;
        let maxWidth = 0;
        let list = config.tableFieldList
                    .filter(item => item.fixed != 'hide')
                    .sort((a,b) => {
                        var type = ['left' , 'show' , 'right'];
                        return type.indexOf(a.fixed) - type.indexOf(b.fixed);
                    });
        let columns = list.map(item => {
            var column =  {
                title: item.title,
                dataIndex: item.key,
                width: item.width,
                ellipsis : {showTitle: false},
                fixed : item.fixed , 
                onHeaderCell : column => {
                    return {
                        width : column.width , 
                        onResize : (e , {size}) => {
                            item.width = size.width;
                            this.setState({config})
                        }
                    }
                }
            }
            maxWidth += column.width;
            if(item.type == 'function' || item.type == 'js'){
                column.render = (_ , row , index) => {
                    try {
                        return item.type == 'js' ?  eval(item.key) : this[item.key](row , index);
                    } catch (e) {
                        console.error(new Error(`error expression ${item.key}`) );
                    }
                }
            }   
            return column;
        })
        let rowSelection = config.isBatch && {
            onChange : (_ , selectedRows) => {
                this.setState({ selectedRows})
            },
            fixed:true ,
            preserveSelectedRowKeys : true
        };
        //列表展开
        let expandable = !this.renderExpandRow ? null : {
            rowExpandable: (row) => this.renderExpandRow(row , false) != null ,
            expandedRowRender : (row , _ , __ ,  expanded) =>  this.renderExpandRow(row , expanded),
        };
        return (
            <div className='search-list-table' ref={table.panel}>
                <Table 
                    rowSelection={rowSelection} 
                    rowKey='id'
                    size='small' 
                    pagination={false} 
                    expandable={expandable}
                    components={{header : {cell: ResizableTitle}}} 
                    dataSource={dataList} 
                    columns={columns} 
                    scroll={{ x: maxWidth , y : table.height }} >
                </Table>
            </div>
        )
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
        let {config , selectedRows} = this.state;
        let excel = config.excel;
        return (
            <>
                <div className='operation-left-panel'>
                    <Space>
                        {config.isBatch && !!selectedRows.length && `共选择 ${selectedRows.length} 条数据`}
                        {this.renderLeftOperation && this.renderLeftOperation()}
                    </Space>
                </div>
                <div >
                    <Space>
                        {this.renderRightOperation && this.renderRightOperation()}
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
                                let { pagination, search } = this.state;
                                lib.request({
                                    url : excel.export , 
                                    needMask : true , 
                                    data : {...pagination , ...search},
                                    success : (json) => {
                                                lib.openPage('/download-center?page_title=下载中心')
                                    }
                                })
                            }}>
                                导出 &#xe638;
                            </Button>
                        }
                        <SortTable list={config.tableFieldList} onSortEnd={tableFieldList => {
                            config.tableFieldList = tableFieldList;
                            this.setState({config});
                        }} />
                    </Space>
                </div>
            </>
        )
    }

    render(){
        let {config , detail } = this.state;
        if(!config){
            return <Skeleton active />;
        }
        return (
            <div className={`config-center-v3 ${this.props.name}`}>
                {this.renderModal && this.renderModal()}
                <MyDraggable axis='y' size={document.body.offsetHeight-300} onStop={() => event.emit('window.resize')}>
                    <div className='search-list'>
                        <div>
                            <div className='search-condition-panel'>
                                <SearchConditionList  searchKeyList={config.searchKeyList} onSearch={search => {
                                    this.state.search = search;
                                    this.state.pagination.currentPage = 1;
                                    this.load(true);
                                }} />
                            </div>
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
                    {detail && 
                        <div className='config-center-detail'>
                            <div className='close' onClick={() => {
                                this.setState({ detail: null });
                            }}>&#xe60c;</div>
                            <div className='detail-content' >
                                {detail && this.renderDetail && this.renderDetail(detail)}
                            </div>
                        </div>
                    }
                </MyDraggable>
            </div>
        )
    }
}