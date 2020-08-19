import React , {useState} from 'react';
import './uploader.less';
import {Tooltip , message} from 'antd';
import axios from 'axios';

/**
 * @param {style{width , height , ...}} 样式，一般指定width , height    可选   
 * @param {src} 默认图片URL                                            可选
 * @param {allowTypes[]} 允许的图片类型，数组。默认不限制                  可选
 * @param {onUploadStart} 开始上传回调                                  可选
 * @param {onUploadEnd(src)} 结束上传回调                               可选
 * @param {onRemove} 删除图片回调                                       可选
 */
function Uploader({style , src = '' , allowTypes=[] , onUploadStart = function(){} , onUploadEnd = function(){} , onRemove=function(){}}){
    var [src , setSrc] = useState(src);
    let status = 'start';
    if (src && src.indexOf('dante-img.oss-cn-hangzhou.aliyuncs.com') > -1){
        src += '?x-oss-process=image/resize,l_220';
        status = 'end';
    }
    else if (src && src.indexOf('blob') > -1){
        status = 'uploading';
    }
    function upload(file){
        if (!file) {
            return;
        }
        let suffix = file.name.split('.').reverse()[0].toLocaleLowerCase();
        if (allowTypes.length > 0 && allowTypes.indexOf(suffix) == -1){
            return message.error(`对不起，只支持类型为${allowTypes}的文件`)
        }
        setSrc(window.URL.createObjectURL(file));
        onUploadStart();
        var data = new FormData();
        var key = `${new Date().getTime() % 100000000}${parseInt(Math.random() * 1000)}.${suffix}`;
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
            onUploadEnd('https://dante-img.oss-cn-hangzhou.aliyuncs.com/' + key);
            setSrc('https://dante-img.oss-cn-hangzhou.aliyuncs.com/' + key);
        })
    }


    return (
        <Tooltip placement="bottom" title='不想要选文件，亲可以考虑将文件拖到这里'>
            <div className={`react-single-app-uploader ${status}` } style={style} >
                <input type='file' onChange={(e) => upload(e.target.files[0])} />
                <div className='preview' style={{backgroundImage : src ? `url(${src})` : null}}></div>
                <div className='loading'>
                    <img src='//dante-img.oss-cn-hangzhou.aliyuncs.com/30183475885.svg' />
                </div>
                <div className='delete' onClick={() => {
                    setSrc('');
                    onRemove();
                }}>&#xe659;</div>
            </div>
        </Tooltip >
    )
        
}


export default Uploader;