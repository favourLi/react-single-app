import React from 'react'
import { SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
import './test-detail.less'

const DragHandle = sortableHandle(() => (
    <td style={{ width: '60px' }} className='drag'>&#xe6c4;</td>
));

const SortableItem = SortableElement(({ value }) => 
    <tr >
        <DragHandle />
        <td style={{ width: '100px' }}> {value}</td>
        <td style={{ width: '100px' }}>{value}</td>
    </tr>
);

const SortableList = SortableContainer((props) => {
    let {items } = props;
    return (
        <table style={{tableLayout : 'fixed'}}>
            <thead>
                <tr>
                    <th></th>
                    <th>内容1</th>
                    <th>内容2</th>
                </tr>
            </thead>
            <tbody>
                {items.map((value, index) => (
                    <SortableItem key={`item-${value}`}  index={index} value={value} />
                ))}
            </tbody>
        </table>
    );
});

class TestDetail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
            active : -1
        };
    }
    

    render(){
        let {items} = this.state;
        return (
            <SortableList items={this.state.items} active={this.state.active} onSortEnd={(event) => {
                let {newIndex , oldIndex} = event;
                if(newIndex > oldIndex){
                    items.splice(newIndex + 1 , 0 , items[oldIndex]);
                    items.splice(oldIndex , 1);
                }else{
                    var list = items.splice(oldIndex , 1);
                    items.splice(newIndex, 0, list[0]);
                }
                this.setState({items , active : -1})
            }} 
                useDragHandle
                helperClass="row-dragging"
            />

        )
    }

}


export default TestDetail