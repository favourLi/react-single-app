import React, { useState } from 'react';
import {Uploader} from '../src/index';
import './doc.less';
// import OSS from 'ali-oss';

// import Base64 from 'base64';

// console.log(Base64)
function Doc(){
    let [flag , setFlag] = useState(true)
    let style = flag ? {} : {maxHeight : '36px'};
    let [value , setValue] = useState(null);
    let [file , setFile] = useState('');
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

        <input type='file' onChange={(e) => setFile(e.target.files)} />
        <button onClick={() => {
            let client = new OSS({
                // region以杭州为例（oss-cn-hangzhou），其他region按实际情况填写。
                region: 'oss-cn-hangzhou',
                // 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录RAM控制台创建RAM账号。
                accessKeyId: 'LTAI4GDcG22sccSsU4BCd3U9',
                accessKeySecret: 'ltZAVYKxaX7WC68PM4HSdGuSvw4HAW',
                bucket: 'dante-img'
            });

            var policy = "{\"expiration\": \"2120-01-01T12:00:00.000Z\",\"conditions\": [[\"content-length-range\", 0, 104857600]]}";


            var data = new FormData();
            // var key = `${new Date().getTime() % 100000000}${parseInt(Math.random() * 1000)}.${suffix}`;
            // data.append('name', 'dev/' + key);
            // data.append('key', key);
            // data.append('policy', config.policy);
            // data.append('OSSAccessKeyId', config.OSSAccessKeyId);
            // data.append('success_action_status', '200');
            // data.append('signature', config.signature);
            console.log(file);
            data.append('file', file);
            client.put('object-key', file[0])     
        }}>提交</button>

    </div>
}




export default Doc;