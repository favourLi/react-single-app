import React, { useState } from 'react';
import {Uploader} from '../src/index';
import './doc.less';
function Doc(){
    let [flag , setFlag] = useState(true)
    let style = flag ? {} : {maxHeight : '36px'};
    
    return <div style={{padding: '20px'}}>
        <Uploader 
            onUploaderStart={() => {console.log('开始上传 ')}}
            onUploaderEnd={(src) => {
                console.log(src);
            }}
            style={{width:'160px' , height:'160px'}}
            defaultValue={{src:'https://dante-img.oss-cn-hangzhou.aliyuncs.com/42547248838.xlsx' , name : '爱读书.key'}}
        />

        <div className='doc-group' style={style} onClick={() => setFlag(!flag)}>
            <div className='title'>主标题</div>
            <div className='sub-title'>子标题</div>
            <div className='sub-title'>子标题</div>
        </div>

    </div>
}

export default Doc;