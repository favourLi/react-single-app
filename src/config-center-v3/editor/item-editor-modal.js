import React from 'react';
import {Modal , Form , Row , Col} from 'antd';
import formMap from './form-map';
import moment from 'moment';

class ItemEditorModal extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible : false
        }
        if(!this.getConfig){
            return console.error('this.getConfig 必须提供')
        }
        this.form = React.createRef();
        this.closeModal = this.closeModal.bind(this);
    }
    renderItem(item , index){
        let isEdit = !!this.props.data;
        if(item.hidden){
            return '';
        }
        let FormItem = formMap[item.type];
        let span = this.props.span == 2 && item.span == 1 ? 12 : 24;
        let size = item.span == 2  ? {labelCol : 3 , wrapperCol : 18} : {labelCol : 6 , wrapperCol : 16}
        if(['group' , 'br'].indexOf(item.type) > -1){
            return (
                <div style={{width : '100%'}} key={index}>
                    <FormItem item={item}  />
                </div>
            )
        }
        else if(FormItem){
            return(
                <Col span={span} key={index}>
                    <FormItem form={this.form} item={item} size={size} isEdit={isEdit}  />
                </Col>
            )
        }
        else if(item.type == 'function'){
            return (
                <Col span={span} key={index}>
                    {this[item.key] && this[item.key]({item , size})}
                </Col>
            )
        }
    }
    closeModal(){
        this.setState({visible : false});
    }
    setItemHidden(key , hidden){
        let { config} = this.state;
        let item = config.list.find(item => item.key == key);
        if(!!item.hidden != hidden){
            item.hidden = hidden;
            this.setState({config});
        }
    }
    hideItem(key){
        this.setItemHidden(key , true);
    }
    showItem(key){
        this.setItemHidden(key , false);
    }
    getValues(values){
        let data = {...values};
        this.state.config.list?.map(item => {
            if(item.type == 'date' && values[item.key]){
                data[item.key] = new Date(values[item.key]).getTime()
            }
            else if(item.type == 'date-range' && values[item.key]){
                let [start , end] = item.key.split(',');
                data[start] = new Date(values[item.key][0]).getTime();
                data[end] = new Date(values[item.key][1]).getTime();
                delete data[item.key];
            }
            else if(item.type == 'switch'){
                data[item.key] = !!data[item.key];
            }
        })
        return data;
    }
    render(){
        let {visible , config} = this.state;
        return (
            <>
            {
                visible && config &&
                <Modal 
                    visible={true} 
                    title={this.props.title} 
                    maskClosable={false} 
                    onCancel={() => this.setState({visible : false})}
                    onOk={() => {
                        this.form.current.submit();
                    }}
                    width={this.props.span == 2 ? 1120 : 560}
                >
                    <Form ref={this.form} initialValues={(() => {
                        let data = this.props.data;
                        if(data){
                            config.list.map(item => {
                                if(item.type == 'date-range'){
                                    let [start , end] = item.key.split(',');
                                    let startValue = parseInt(data[start]) , endValue = parseInt(data[end]);
                                    if(startValue && endValue){
                                        data[item.key] = [moment(startValue), moment(endValue)];
                                    }
                                }else if(item.type == 'date'){
                                    let value = parseInt(data[item.key]);
                                    if(value){
                                        data[item.key] = moment(value);
                                    }
                                }
                            })
                        }
                        return data;
                    })()} onFinish={(values) => {
                        let data = this.getValues(values);
                        this.props.onSave(data , this.closeModal , this.state)
                    }} onFieldsChange={() => {
                        this.onValuesChange && this.onValuesChange(
                            this.getValues(this.form.current.getFieldsValue()) ,
                            !!this.props.data
                        )
                    }}>
                        <Row gutter={[0, 0]}>
                        {
                            config.list?.map((item,index) => this.renderItem(item , index))
                        }
                        </Row>
                    </Form>
                </Modal>
            }
            <span onClick={() => {
                this.setState({visible : true})
                if(this.getConfig){
                    Promise.resolve(this.getConfig())
                    .then(config => {
                        config && this.setState({config});
                        setTimeout(() => {
                            this.onValuesChange && 
                            this.onValuesChange(this.getValues(this.form.current.getFieldsValue()))
                        } , 100);
                    })
                    .catch(e => this.setState({config : '出错了'}));
                    this.getConfig = null;
                }
            }}>{this.props.children}</span>
            </>
        )
    }
}

export default ItemEditorModal;