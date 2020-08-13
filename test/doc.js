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
        />
    </div>
}

export default Doc;