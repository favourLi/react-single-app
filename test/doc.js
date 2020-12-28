import React, { useState } from 'react';
import {Uploader} from '../src/index';
import './doc.less';
function Doc(){
    let [flag , setFlag] = useState(true)
    let style = flag ? {} : {maxHeight : '36px'};
    let [value , setValue] = useState(null);
    return <div style={{padding: '20px'}}>
        <Uploader 
            onChange={value => setValue(value)}
            value={value}
            style={{width:'160px' , height:'160px'}}
        />

        <div className='doc-group' style={style} onClick={() => setFlag(!flag)}>
            <div className='title'>主标题</div>
            <div className='sub-title'>子标题</div>
            <div className='sub-title'>子标题</div>
        </div>

    </div>
}

export default Doc;