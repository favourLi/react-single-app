import React , {useState , useRef, useEffect} from 'react';
import {Table} from 'antd';
import { Resizable } from 'react-resizable';
import './config-center-table.less';
import {event} from '../index';

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


export default function ({columns , dataSource}){
    let container = useRef();
    var [columns , setColumns] = useState(columns);
    let [tableHeight , setTableHeight] = useState(0)
    columns.map((item , index) => item.key = index);
    dataSource.map((item , index) => {
        item.key = index;
    });

    useEffect(() => {
        var resize = () => {
            setTimeout(() => setTableHeight(container.current.offsetHeight - 40));
        }
        resize();
        event.on('window.resize' , resize);
        return () => event.off('window.resize' , resize);
    }, [])

    // let [list , setList] = useState([
    //     {id : 1 , title : '中华人民共和国中华人民共和国中华人民共和国中华人民共和国' ,  key : 6} , 
    //     {id : 2 , title : '小红' ,  key : 5} , 
    //     {id : 3 , title : '小黑' ,  key : 4}
    // ])
    // let [columns , setColumns] = useState([
    //     {
    //         title: 'id',
    //         dataIndex: 'id',
    //         width: 200,
    //     },
    //     {
    //         title: '中华人民共和国中华人民共和国中华人民共和国中华人民共和国',
    //         dataIndex: 'title',
    //         width: 500,
    //         ellipsis: {
    //             showTitle: false,
    //         },
    //     },
    //     {
    //         title: 'title1',
    //         dataIndex: 'title',
    //         width: 320,
    //         index : 2,
    //     },
    //     {
    //         title: 'title2',
    //         dataIndex: 'title',
    //         width: 220,
    //         index : 3,
    //         fixed: 'right',
    //     },
    // ])
    let [selectedRowKeys , setSelectedRowKeys] = useState([]);
    var components = {
        header: {
            cell: ResizableTitle,
        },
    };
    let maxWidth = 0;
    columns = columns.map((col , index) => {
        maxWidth += col.width;
        col.onHeaderCell = column => {
            return {
                width : column.width , 
                onResize : (e , {size}) => {
                    col.width = size.width;
                    setColumns([...columns]);
                }
            }
        }
        col.index = index;
        return col;
    })
    return (
        <div className='config-center-table' ref={container}>
            <Table 
                rowSelection={{
                    selectedRowKeys  , 
                    onChange : selectedRowKeys => setSelectedRowKeys(selectedRowKeys) ,
                    fixed:true 
                }} 
                size='small' 
                pagination={false} 
                components={components} 
                dataSource={dataSource} 
                columns={columns} 
                scroll={{ x: maxWidth , y : tableHeight }} >
            </Table>
        </div>
    )
}

