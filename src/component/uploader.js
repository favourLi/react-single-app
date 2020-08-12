import React , {useState} from 'react';
import './uploader.less';
import {Tooltip , Button} from 'antd';
import axios from 'axios';

function Uploader({style , status = 'normal' , src = ''}){
    var [status , setStatus] = useState(status);
    var [src , setSrc] = useState(src)
    function upload(file){
        setStatus('uploading');
        if(!file){
            return;
        }
        var data = new FormData();
        var key = new Date().getTime() % 100000000 + '' + parseInt(Math.random() * 1000) + '.' + file.name.split('.').reverse()[0].toLocaleLowerCase();
        data.append('name', 'dev/' + key);
        data.append('key', key);
        data.append('policy', 'eyJleHBpcmF0aW9uIjoiMjAyMS0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==');
        data.append('OSSAccessKeyId', 'LTAIzH2kt3oukSR9');
        data.append('success_action_status', '200');
        data.append('signature', 'VjVz6BCC3ZLqW/fgcpOPOc8hbfs=');
        data.append('file', file);
        axios.request({
            url: 'https://dante-img.oss-cn-hangzhou.aliyuncs.com',
            method : 'POST' ,
            data : data , 
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((json) => {
            setStatus('finish');
        })
    }


    return (
        <Tooltip placement="bottom" title='不想要选文件，你可以考虑将文件拖到这里'>
            <div className={`react-single-app-uploader ${status}` } style={style}>
                <input type='file' onChange={(e) => upload(e.target.files[0])} />
                <div className='preview'></div>
                <div className='loading'>
                    <img src='//dante-img.oss-cn-hangzhou.aliyuncs.com/30183475885.svg' />
                </div>
                <div className='delete'></div>
            </div>
        </Tooltip >
    )
        
}


export default Uploader;