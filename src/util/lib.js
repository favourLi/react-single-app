import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import axios from 'axios';
import {event} from '../index';
import md5 from 'md5';
import {message} from 'antd';
/**
    yyyy-MM-dd : 年月日
    yyyy-MM-dd hh:mm:ss 年月日 时分秒
**/
Date.prototype.format = function (fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "h+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

let config = {
    hostPrefixMap: {
        '*': 'http://danding-gateway.yang800.cn/'
    }
}



var lib = {

    /**
     * 
     * @param url /test-detail?pageTitle=测试详情页 
     * @param element 字符串或者任何html无素如div button等
     * @param refreshFn 回调函数，作状态更新使用
     */
    getLink(url, element, refreshFn) {
        if (!url) {
            console.error('function getLink must have a url');
            url = '';
        }
        url = url.replace('pageTitle', 'page_title')
        if (url.indexOf("?") == -1 || url.indexOf('page_title') == -1) {
            return console.error('function getLink url must have a page_title or pageTitle value')
        }
        url = url.replace(/\/\d{13}/, '');
        url = url.replace('?', '/' + new Date().getTime() + '?');

        if (refreshFn) {
            var refreshEvent = new Date().getTime();
            url += `&refresh_event=${refreshEvent}`;
        }
        return (
            <Link onClick={() => {
                event.emit('add-page', {
                    url: url
                });
                refreshFn && event.on(refreshEvent, refreshFn)
            }} to={url}>{element}</Link>
        )
    },

    /**
     *
     * @param url /test-detail?pageTitle=测试详情页
     * @param refreshFn 回调函数，作状态更新使用
     */
    openPage(url, refreshFn) {
        if (!url) {
            return console.error('function openPage must have a url');
        }
        url = url.replace('pageTitle', 'page_title')
        if (url.indexOf("?") == -1 || url.indexOf('page_title') == -1) {
            return console.error('function openPage url must have a page_title or pageTitle value')
        }
        url = url.replace(/\/\d{13}/, '');
        url = url.replace('?', '/' + new Date().getTime() + '?');
        if (refreshFn) {
            var refreshEvent = new Date().getTime();
            url += `&refresh_event=${refreshEvent}`;
        }
        event.emit('add-page', {
            url: url
        });
        refreshFn && event.on(refreshEvent, refreshFn);
        // history.pushState(null , null , url);
        window.indexProps.history.push(url);
    },


    /**
     * 关闭当前页面
     */
    closePage() {
        var refreshEvent = lib.getParam('refresh_event');
        event.emit('delete-page');
        setTimeout(() => {
            if (refreshEvent) {
                event.emit(refreshEvent, {}, true);
            }
        }, 100);
    },


    getParam(key, url) {
        var strs = (url || window.location.href).split('?')[1];
        if (!strs) {
            return null;
        }
        var json = {};
        var b = strs.split('&');
        for (var i = 0; i < b.length; i++) {
            var [_key, _value] = b[i].split('=');
            json[_key] = _value;
        }
        if (key == undefined) {
            return json;
        }
        if (json[key] == undefined) {
            return null;
        }
        return decodeURIComponent(json[key]);
    },


    /**
        字段名         类型       是否必填      说明
        url           string      是         访问的URL
        data          json        否         请求的数据
        success       function    是         请求成功回调函数
        fail          function    否         失败回调函数
        needMask      boolean     否         是否需要遮照，默认为true
    **/
    request({ url, needMask = 'false', data = {}, success = function () { }, fail = function () { } }) {
        let { clientId, clientSecret, hostPrefixMap } = config;
        let prefixUrl = hostPrefixMap[window.location.hostname] || hostPrefixMap['*'];
        if (!clientId || !clientSecret) {
            return console.error('please set the clientId and clientSecret by use the function lib.setConfig(config)')
        }
        if (!prefixUrl) {
            return console.error(`can not find the prefixUrl by the ${window.location.hostname} , please set the hostPrefixMap by use the function lib.setConfig(config)`)
        }
        var timestamp = new Date().getTime()
        var md5Data = md5(JSON.stringify(data)).toUpperCase();
        var sign = md5(`clientId${clientId}data${md5Data}path${url}timestamp${timestamp}version${'1.0.0'}${clientSecret}`).toUpperCase();
        needMask && lib.wait();
        var maskTime = new Date().getTime();
        axios.request({
            url: `${prefixUrl}${url}`,
            method: 'POST',
            data: data,
            headers: {
                timestamp: timestamp,
                clientId: clientId,
                sign: sign
            }, withCredentials: true,
            crossDomain: true,
        }).then(function ({ data: json }) {
            let { code, data, message : msg } = json;
            if (code == 200) {
                success(data);
            } else if (code == -1001) {
                let host = 'http://login.yang800.cn';
                if(window.location.host.indexOf('yang800.com') > -1){
                    host = 'http://login.yang800.com';
                }
                window.location = `${host}?redirectUrl=${encodeURIComponent(window.location.href)}`
            }  else if (code < 0) {
                message.error(msg);
            } else {
                fail(code, message);
            }
            needMask && setTimeout(lib.waitEnd, 500 - new Date().getTime() + maskTime);
        });
    },
    wait(time) {
        var html = `
            <div class='wait' id='wait'>
                <div class='mask'></div>
                <img src='//dante-img.oss-cn-hangzhou.aliyuncs.com/30183475885.svg' />
            </div>
        `;
        $('body').append(html);
        if (time) {
            setTimeout(lib.waitEnd, time)
        }
    },
    waitEnd() {
        $('#wait').remove();
    },

    setConfig(_config) {
        Object.assign(config, _config);
    }
}

export default lib;



