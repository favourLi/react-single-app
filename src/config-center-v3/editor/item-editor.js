import React , {Fragment} from 'react';
import { Form , Row , Col , Skeleton  , Divider , Button} from 'antd';
import formMap from './form-map';
import moment from 'moment';
import './index.less'

function getSize(item){
    let [span , xxl , xl , lg , labelCol , wrapperCol] = [24 , 6 , 8 , 12 , 8 , 16];
    if(item.span == 2){
        [span , xxl , xl , lg , labelCol , wrapperCol] = [24 , 12 , 16 , 24 , 4 , 20]
    }
    if(item.span == 3){
        [span , xxl , xl , lg , labelCol , wrapperCol] = [24 , 18 , 24 , 24 , 3 , 21];
    }
    if(item.span == 4){
        [span , xxl , xl , lg , labelCol , wrapperCol] = [24 , 24 , 24 , 24 , 2 , 22];
    }
    return [span , xxl , xl , lg , labelCol , wrapperCol];
}


class ItemEditor extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
        Promise.resolve(this.getConfig())
        .then(config => config && this.setState({config}))
        .catch(e => this.setState({config : '出错了'}));
        Promise.resolve(this.getData())
        .then(data => this.setState({data : data || true}));
        this.form = React.createRef();
    }
    getData(){
    }

    renderItem(item , index){
        let isEdit = !!this.state.data && this.state.data != true;
        if(item.hidden){
            return '';
        }
        let FormItem = formMap[item.type];
        let [span , xxl , xl , lg , labelCol , wrapperCol] = getSize(item)
        if(['group' , 'br'].indexOf(item.type) > -1){
            return (
                <div style={{width : '100%'}} key={index}>
                    <FormItem item={item}  />
                </div>
            )
            
        }
        else if(FormItem){
            return(
                <Col span={span} xxl={xxl} lg={lg} xl={xl} key={index} key={index}>
                    <FormItem  item={item} size={{labelCol , wrapperCol}} isEdit={isEdit}  />
                </Col>
            )
        }
        else if(item.type == 'function'){
            return (
                <Col span={span} xxl={xxl} lg={lg} xl={xl} key={index} key={index}>
                    {this[item.key] && this[item.key]({item , size : {labelCol , wrapperCol} , isEdit})}
                </Col>
            )
        }
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
    submit(){
        return this.form.current.validateFields().then(values => this.getValues(values));
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
        let {config , data} = this.state;
        if(!config || !data){
            return <Skeleton active />;
        }
        return (
            <div className={`config-center-v3 item-editor `} >
                <div className='form'>
                    <Form ref={this.form} initialValues={(() => {
                        if(data.constructor == Object){ 
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
                                }else if(item.type == 'input' || item.type == 'textarea'){
                                    let value = data[item.key];
                                    if(value){
                                        data[item.key] = value + '';
                                    }
                                }
                            })
                        }
                        return data;
                    })()} onFieldsChange={() => {
                        this.onValuesChange && 
                        this.onValuesChange(this.getValues(this.form.current.getFieldsValue()))
                    }}>
                        <Row gutter={[0, 0]}>
                        {
                            config.list?.map((item,index) => this.renderItem(item , index))
                        }
                        </Row>
                    </Form>
                </div>
                <div className='ft'>
                    {
                        this.renderOperation && this.renderOperation()
                    }
                </div>
            </div>
        )
    }
}

export default ItemEditor;