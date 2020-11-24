import React, { Fragment, useState } from 'react';
import { Modal, Checkbox, Radio , Input} from 'antd';
import { SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
import './set-up.less';

const DragHandle = sortableHandle(() => (
    <td style={{ width: '60px' }} className='drag'>&#xe6c4;</td>
));

const SortableItem = SortableElement((props) => {
        let [item , setItem] = useState(props.item);
        let [refresh , setRefresh] = useState(0);
        return (
            <tr>
                <DragHandle />
                <td style={{ width: '160px' }}>{item.title}</td>
                <td style={{ width: '120px' }}><Input value={item.width} onChange={(e) => {
                    if(/^\d*$/.test(e.target.value)){
                        item.width = parseInt(e.target.value) || '';
                        setRefresh(++refresh);
                    }
                }}/></td>
                <td style={{ width: '260px' }}>
                    <Radio.Group
                        options={[
                            {label : '左固定' , value : 'sticky-left'},
                            { label: '显示', value: 'auto' },
                            { label: '隐藏', value: 'hide' },
                            { label: '右固定', value: 'sticky-right' }
                        ]}
                        onChange={(e) => {
                            item.display = e.target.value;
                            setRefresh(++refresh);
                        }}
                        value={item.display}
                        optionType="button"
                        buttonStyle="solid"
                        size="small"
                    />
                </td>
            </tr>
        )    
    }
);

const SortableList = SortableContainer((props) => {
    let { list } = props;
    return (
        <table >
            <thead>
                <tr>
                    <th></th>
                    <th>字段</th>
                    <th>宽度</th>
                    <th>显示类型</th>
                </tr>
            </thead>
            <tbody>
                {
                    list.map((item, index) =>
                        <SortableItem key={item.id} index={index} item={item} />
                    )
                }
            </tbody>
        </table>

    );
});

function SetUp(props) {
    let [visible, setVisible] = useState(false);
    let [list, setList] = useState(props.tableFieldList);
    let [isSave , setSave] = useState(props.saveTableFieldList);
    let handleOk = function () {
        if(isSave){
            localStorage[props.id] = JSON.stringify({
                tableFieldList : list , 
                tableFieldListVersion: props.tableFieldListVersion
            });
        }
        props.save(list);
        setVisible(false);
    }
    let handleCancel = function () {
        setVisible(false);
    }
    return (
        <Fragment>
            <div className='set-up' onClick={() => {
                setVisible(true);
            }}>&#xe8b7;</div>
            <Modal title='数据源设置' visible={visible} onOk={handleOk} onCancel={handleCancel} width={600}>
                <div className='set-up-dialog'>
                    <div className='field-list'>
                        <SortableList list={list}  onSortEnd={(event) => {
                            console.log(list)
                            let { newIndex, oldIndex } = event;
                            if (newIndex > oldIndex) {
                                list.splice(newIndex + 1, 0, list[oldIndex]);
                                list.splice(oldIndex, 1);
                            } else {
                                var item = list.splice(oldIndex, 1)[0];
                                list.splice(newIndex, 0, item);
                            }
                            setList([...list])
                        }}
                            useDragHandle
                            helperClass="set-up-row-dragging"
                            maskClosable={false}
                        />
                    </div>
                    <div className='save'>
                        <Checkbox checked={isSave} onChange={e => setSave(e.target.checked)} > 保存配置，应用于下次打开页面 </Checkbox>
                    </div>
                </div>
                
            </Modal>
        </Fragment>
    )
}


export default SetUp;