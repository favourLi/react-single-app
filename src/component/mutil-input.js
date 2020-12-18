import React ,{useState , useRef} from 'react';
import ReactDom from 'react-dom';
import {Input} from 'antd';
import './mutil-input.less'
class RenderInBody extends React.Component{
    constructor(p){
        super();
    }
    componentDidMount(){
        this.popup = document.createElement("div");
        document.body.appendChild(this.popup);
        let rect = this.props.container.getBoundingClientRect();
        this.popup.style = `position:absolute;
                            z-index:9999;
                            left:${rect.x}px;
                            top:${rect.y + 32}px;
                            width:${rect.width}px;
                            `
        this.renderLayer();
    }
    componentDidUpdate() {
        this.renderLayer();
    }
    componentWillUnmount(){
        ReactDom.unmountComponentAtNode(this.popup);
        document.body.removeChild(this.popup);
    }
    renderLayer(){
        ReactDom.render(this.props.children, this.popup);
    }
    render(){
        return null;
    }
}



export default function MutilInput({value = '', onChange = function(){} , placeHolder='' , style={}}){
    let [active , setActive] = useState(false);
    let container = useRef(null);
    let textarea = useRef(null);
    return (
        <div className='react-single-app-mutil-input' ref={container} style={style} onClick={() => {
            setActive(true);
            setTimeout(function(){
                textarea.current.focus();
            } , 50);
        }}>
            {
                value ? value : <span className='place-holder'>{placeHolder}</span>
            }
            {
                active && <RenderInBody container={container.current}>
                <Input.TextArea 
                    ref={textarea} 
                    onBlur={() => {
                        setActive(false);
                        value = value.split(',').filter(item => item.trim() != '').join(',');
                        onChange(value);
                    }}
                    placeholder={placeHolder}
                    autoSize={{
                        minRows:6,
                        maxRows:18
                    }}
                    value={value.split(',').join('\n')}
                    onChange={e => {
                        value = e.target.value.split('\n').join(',');
                        onChange(value);
                    }}
                >
                </Input.TextArea>
            </RenderInBody>
            }
            
        </div>
    )
}


