import React , {useState} from 'react';
import {Table , Button , Modal , Radio} from 'antd';
import { sortableContainer, sortableElement, sortableHandle  } from 'react-sortable-hoc';
import { MenuOutlined , SettingOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';
const DragHandle = sortableHandle(() => (
    <MenuOutlined style={{ cursor: 'all-scroll', color: '#999' }} />
));
const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

function SortTable({list , onSortEnd = function(){}}){
    let [visible , setVisible] = useState(false);
    var [list, setList] = useState(list);
    let columns = [
        {title: '排序',width: 60, className: 'drag-visible',render: () => <DragHandle />} ,
        {title :'标题',width:200, className:'drag-visible',dataIndex : 'title'} ,
        {title :'显示',width:220, className:'drag-visible',render: (_ , row) => 
            <Radio.Group
                options={[
                    {label : '左固定' , value : 'left'},
                    { label: '显示', value: '' },
                    { label: '隐藏', value: 'hide' },
                    { label: '右固定', value: 'right' }
                ]}
                onChange={(e) => {
                    row.fixed = e.target.value;
                    setList([...list]);
                }}
                value={row.fixed}
                optionType="button"
                buttonStyle="solid"
                size="small"
            />
        }
    ];
    
    const DraggableContainer = props => (
        <SortableContainer
          useDragHandle
          helperClass="search-list-row-dragging"
          onSortEnd={({oldIndex , newIndex}) => {
              setList(arrayMove(list , oldIndex , newIndex));
          }}
          {...props}
        />
    );  
    const DraggableBodyRow = ({ className, style, ...restProps }) => {
        const index = list.findIndex(x => x.key === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    };
    return (
        <>
            {
                visible && 
                <Modal visible={true} title='设置'  maskClosable={false} width={600}
                    onCancel={() => setVisible(false)} onOk={() => {
                        setVisible(false);
                        onSortEnd(list);
                    }}
                >
                    <Table  
                        className='search-list-sort-table'
                        columns={columns} 
                        dataSource={list}
                        components={{
                            body: {
                                wrapper: DraggableContainer,
                                row: DraggableBodyRow,
                            },
                        }} 
                        bordered 
                        pagination={false} 
                        expandable={false}
                    />
                </Modal>
            }
            <SettingOutlined onClick={() => setVisible(true)} className='set-up' />
        </>
    )
}

export default SortTable;