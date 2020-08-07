import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { Modal } from 'antd';
import axios from 'axios';
import qs from 'qs';
import {event} from '../index'


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
        method        string      否         get post
        success       function    是         请求成功回调函数
        isAplicationJSON request数据类型   否   true表示aplicationJSON false表示formdata
        fail          function    否         失败回调函数
        needMask      boolean     否         是否需要遮照，默认为true
        timeout       int         否         超时时间，毫秒，默认为5000
    **/
    async request({ url, method = 'GET', needMask = false, data = {}, isAplicationJSON = false, success = function () { }, fail = function () { } } = {}) {
        // url = url.indexOf('http:') > -1 ? url : 'http://127.0.0.1:8080' + url;
        url = url.indexOf('http:') > -1 ? url : 'http://npc.daily.yang800.com/backend/' + url;
        needMask && lib.wait();
        var start = new Date().getTime();

        try {
            var params = method.toLocaleLowerCase() == 'get' ? data : {};
            let headers = {}
            if (!isAplicationJSON) {
                headers = { 'content-type': 'application/x-www-form-urlencoded' }
                data = qs.stringify(data)
            }
            let res = await axios.request({ url, method, headers, withCredentials: true, params, data, timeout: 30000 });
            let json = res.data;
            if (json.code == 0) {
                json.data = json.data || json.result;
                success(json);
            }
            else if (json.code == -1001) {
                window.location = 'http://npc.daily.yang800.com/login'
            }
            else if (json.code < -1) {
                Modal.error({ content: json.errorMessage });
            }
            else {

            }
        }
        finally {
            needMask && setTimeout(lib.waitEnd, 500 - new Date().getTime() + start);
        }
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
    }
}

export default lib;




