import React from 'react';
import {Uploader} from '../src/index';

function Doc(){
    return <div style={{padding: '20px'}}>
        <Uploader 
            allowTypes={['png' , 'jpg']}
            onUploaderStart={() => {console.log('开始上传 ')}}
            onUploaderEnd={(src) => {
                console.log(src);
            }}
            style={{width:'160px' , height:'160px'}}
            src='https://dante-img.oss-cn-hangzhou.aliyuncs.com/28562010515.png'
        />
    </div>
}

export default Doc;