import axios from 'axios';
import {event} from '../index';
import md5 from 'md5';
import {message , Modal} from 'antd';
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
    config : {
        webToken : 'admin'
    } ,

    /**
    * 
    * @param url /test-detail?pageTitle=测试详情页 
    * @param element 字符串或者任何html无素如div button等
    * @param refreshFn 回调函数，作状态更新使用
    */
    getLink() {
        console.error(new Error('function lib.getLink has been delete please use lib.openPage for replace'))
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
        // url = url.replace(/\/\d{13}/, '');
        // url = url.replace('?', '/' + new Date().getTime() + '?');
        if (refreshFn) {
            var refreshEvent = new Date().getTime();
            url += `&refresh_event=${refreshEvent}`;
        }
        event.emit('add-page', {
            url: url
        });
        refreshFn && event.on(refreshEvent, refreshFn);
    },


    /**
     * 关闭当前页面
     */
    closePage(url) {
        event.emit('delete-page' , {url});
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
    request({ url, needMask = false, data , success = function(){}, fail = function(){} }) {
        var loginHost;
        if(/yang800.com.cn$/.test(window.location.host)){
            var [clientId, clientSecret, prefixUrl] = [
                '96A63530DA0C49BB9FABB66ED40FB3C7',
                'F6A99B36E4D24817AB037237454893D9',
                'http://danding-gateway.yang800.com.cn'
            ]
        }
        else if(/yang800.com$/.test(window.location.host) && window.location.host != 'maria.yang800.com'){
            var [clientId, clientSecret, prefixUrl] = [
                '9E514E70AD7D485986D687F64616C662',
                '33F14542BB274284B63147E6C8F3DF9E' , 
                'http://danding-gateway.yang800.com'
            ]
        }
        else{
            var [clientId, clientSecret, prefixUrl] = [
                '96A63530DA0C49BB9FABB66ED40FB3C7',
                'F6A99B36E4D24817AB037237454893D9',
                'http://danding-gateway.yang800.cn'
            ]
        }
        
        var timestamp = new Date().getTime()
        let md5Data = ''
        if(data){
            md5Data = md5(JSON.stringify(data)).toUpperCase();
        }
        var sign = md5(`clientId${clientId}data${md5Data}path${url}timestamp${timestamp}version${'1.0.0'}${clientSecret}`).toUpperCase();
        needMask && lib.wait();
        var maskTime = new Date().getTime();
        if(url.indexOf('http://') == -1 && url.indexOf('https://') == -1){
            url = `${prefixUrl}${url}`;
        }else{
            loginHost = new URL(url).origin;
        }
        return axios.request({
            url: url,
            method: 'POST',
            data: data,
            headers: {
                timestamp: timestamp,
                clientId: clientId,
                sign: sign,
                webToken: this.config.webToken
            }, withCredentials: true,
            crossDomain: true,
        }).then( ({ data: json }) => {
            let { code, data, message : msg } = json;
            // console.log(code , data , msg);
            if (code == 200) {
                success(data);
                needMask && setTimeout(lib.waitEnd, 500 - new Date().getTime() + maskTime);
                return data;
            } 
            else if (code == -1001) {
                if(!this.config.login){
                    console.error('no login url;please set the webToken')
                }
                else{
                    window.location = `${this.config.login}/login?redirectUrl=${encodeURIComponent(window.location.href)}${loginHost ? '&host=' + loginHost : ''}`;
                }
            }  
            else{
                code < 0 && message.error(msg);
                fail && fail(code, msg);
            } 
            needMask && setTimeout(lib.waitEnd, 500 - new Date().getTime() + maskTime);
        }).catch(e => {
            lib.waitEnd();
            throw e;
        });
    },
    wait(time) {
        var div = document.getElementById('react-single-app-wait');
        if(!div){
            div = document.createElement('div');
            div.id = 'react-single-app-wait';
            div.innerHTML = `
                <div class='mask'></div>
                <img src='//dante-img.oss-cn-hangzhou.aliyuncs.com/30183475885.svg' />
            `
            document.body.append(div);
        }
        if (time) {
            setTimeout(lib.waitEnd, time)
        }
    },
    waitEnd() {
        if(document.getElementById('react-single-app-wait')){
            document.getElementById('react-single-app-wait').remove();
        }
    },
    setConfig(config){
        Object.assign(this.config , config);
        if(config.webToken == 'user'){
            this.config.login = /yang800.com$/.test(window.location.host) ? 'http://account.yang800.com' : 'http://account.yang800.cn';
        }
        if(config.webToken == 'admin'){
            this.config.login = /yang800.com$/.test(window.location.host) ? 'http://account.admin.yang800.com' : 'http://account.admin.yang800.cn'
        }
    }
}

if(!window.__lib__){
    window.__lib__ = lib;
}

export default window.__lib__;




