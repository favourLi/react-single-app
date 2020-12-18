import React , {useState} from 'react';
import './uploader.less';
import {Tooltip , message} from 'antd';
import axios from 'axios';
import './iconfont.js'


function Preview({type , name , src}){
    if(src == ''){
        return '';
    }
    type = type.toLowerCase();
    let isImage = false;
    let thumb;
    let map = {
        doc: '#icon-yunpanlogo-3',
        docx: '#icon-yunpanlogo-3',
        ppt: '#icon-yunpanlogo-2',
        pptx: '#icon-yunpanlogo-2',
        xls: '#icon-yunpanlogo-1',
        xlsx: '#icon-yunpanlogo-1',
        zip: '#icon-yunpanlogo-9',
        rar: '#icon-yunpanlogo-9',
        psd: '#icon-yunpanlogo-15',
        pdf: '#icon-yunpanlogo-19',
        htm: '#icon-yunpanlogo-8',
        html: '#icon-yunpanlogo-8',
        mp3: '#icon-yunpanlogo-7',
        wma: '#icon-yunpanlogo-7',
        file: '#icon-yunpanlogo-11',
        folder: '#icon-yunpanlogo-'
    }
    if (['jpg' , 'jpeg' , 'png' , 'git' , 'svg' , 'webp' , 'bmp'  ].indexOf(type) > -1) {
        thumb = <>
            <div className='pic' style={{
                backgroundImage: `url(${src.includes('blob') ? src : src + '?x-oss-process=image/resize,l_220'})`
            }}></div>
            <div className='name'>{name}</div>
        </>
        isImage = true;
    } else if (['mp4', 'mov' , 'rm' , 'rmvb' , '3gp' , 'm4v' , 'avi' , 'mkv' , 'flv' , 'vob'].indexOf(type) > -1) {
        thumb = <>
                <svg className="icon" aria-hidden="true">
                    <use xlinkHref='#icon-yunpanlogo-10'></use>
                </svg>
                <div className='name' >{name}</div>
            </>
    } else if(map[type]){
        thumb = <>
                <svg className={`icon ${type}` } aria-hidden="true" >
                    <use xlinkHref={map[type]}></use>
                </svg>
                <div className='name' >{name}</div>
            </>
    } else {
        thumb = <>
            <div className='type'>{type}</div>
            <div className='name' >{name}</div>
        </>
    }

    return <div className='preview' style={{bottom : isImage ? '0' : '50px'}}>
            {thumb}
        </div>;
}


/**
 * @param {style{width , height , ...}} 样式，一般指定width , height    可选   
 * @param {src} 默认图片URL                                            可选
 * @param {allowTypes[]} 允许的图片类型，数组。默认不限制                  可选
 * @param {onUploadStart} 开始上传回调                                  可选
 * @param {onUploadEnd(src , name)} 结束上传回调                        可选
 * @param {onRemove} 删除图片回调                                       可选
 */
function Uploader({style , src = '' , allowTypes=[] , onUploadStart = function(){} , onUploadEnd = function(){} , onRemove=function(){}}){
    var [src , setSrc] = useState(src);
    var [type , setType] = useState('');
    var [name , setName] = useState('');
    let status = 'start';
    if (src && src.indexOf('dante-img.oss-cn-hangzhou.aliyuncs.com') > -1){
        // src += '?x-oss-process=image/resize,l_220';
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
            onUploadEnd('https://dante-img.oss-cn-hangzhou.aliyuncs.com/' + key , file.name);
            setSrc('https://dante-img.oss-cn-hangzhou.aliyuncs.com/' + key);
            setType(suffix);
            setName(file.name);
        })
    }


    return (
        <Tooltip placement="bottom" title='不想要选文件，亲可以考虑将文件拖到这里'>
            <div className={`react-single-app-uploader ${status}` } style={style} >
                <input type='file' onChange={(e) => upload(e.target.files[0])} />
                <Preview type={type} src={src} name={name} />
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