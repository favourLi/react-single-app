> 注意：该工程为项目初始化工程，请勿在此git 上提交代码

# 单页应用（多标签）
多标签的单页应用，是一个体验非常棒的应用，但同时，页面的管理模式，相对于多页来说，也会有很大的不同。


![](https://user-gold-cdn.xitu.io/2020/6/24/172e589bffb34627?w=2458&h=1016&f=png&s=236700)

### 页面的引用方式

引入一个新的页面，只需要在`index.js`中进行两处配置
```
import Test from '../page/test';
import TestDetail from '../page/test-detail'
var pageMap = {
    'base': Base,
    'base-sticky': BaseSticky,
    'test': Test,
    'test-detail' : TestDetail
}
```
首先，将页面导入`import` ，然后在pageMap中，配置 `key`为页面的url，`value`为页面的类名，不需要在`webpack.pages.js`中做任何的配置


### 链接的打开方式
传统的页面跳转有两种方式，`a链接`，`window.open`，对于单页应用来说，这两种方式无法再继续使用。

为了让所有的页面，有正确的打开方式，我们的页面，都不再继承于 `React.Component`，走配置中心的页面，我们继承于`Base`或者`BaseSticky`，对于详情页之类的不需要配置的页面，我们继续于`Module`。其实`Base`或者`BaseSticky`也是继承于`Module`。
```
    /**
     * 
     * @param url /test-detail?pageTitle=测试详情页 
     * @param element 字符串或者任何html无素如div button等
     * @param refreshFn 回调函数，作状态更新使用
     */
    getLink({url, element, refreshFn})
    
    /**
     *
     * @param url /test-detail?pageTitle=测试详情页
     * @param refreshFn 回调函数，作状态更新使用
     */
    openPage({url, refreshFn})
    
    /**
     * 关闭当前页面
     */
    closePage
```
参数`url`的格式为`/页面地址?pageTitle=打开新的页面的标题&id=1&name=新页面`
```
goDetail1(row){
    return this.getLink({
        url : `/test-detail?pageTitle=测试详情页&id=${row.id}&name=${row.name}`,
        element : '详情页'
    })
}
goDetail2(row) {
    return <Button type='primary' onClick={() => this.openPage({ url: `/test-detail?pageTitle=测试详情页&id=${row.id}&name=${row.name}`}) }>详情</Button>
}
```

# 配置中心
配置中心能批量的页面，一般为搜索条件+表格的页面类型。每一行为一个页面

![](https://user-gold-cdn.xitu.io/2020/6/24/172e5a763ca57a30?w=2432&h=1522&f=png&s=404963)

### 引用数据源
配置中心的配置，从maria中产出。每个系统，单独使用一个或者多个数据源。maria产生的数据，有两种格式，建议使用第二种方式
```
接口调用
http://maria.yang800.com/api/data/18 
script 引用 建议
http://maria.yang800.com/api/data/18?type=js&name=json_data
```
数据源在模板文件 `template.htm` 中配置
单数据源，直接引用
```
<script type="text/javascript" src='http://maria.yang800.com/api/data/28?type=js&name=json_data'></script>
```
多数据源的引用
```
<script type='text/javascript' src='http://maria.yang800.com/api/data/6?type=js&name=json_data'></script>
<script type='text/javascript' src='http://maria.yang800.com/api/data/25?type=js&name=json_data1'></script>
<script>
    json_data = json_data.concat(json_data1);
</script>
```

### 页面地址
通过配置产出的页面地址有固定的格式`/${url}?pageTitle=申报路径管理&config_id=${configId}&id=1&name=名字`。

`url`为页面地址，页面地址在`index.js`页面中的`pageMap`字段去配置。pageTitle必填，属于多标签打开后的标签标题, 

`configId`：由于每一行配置，都是一条配置。每一行配置，都会产生一个唯一的ID，因此`configId`就为配置中的ID

`id` `name`等，都属于自定义参数，可能随意的配置

### 接口数据格式
由于系统是配置的，所以对接口返回的格式有一定的要求

选择框数据源，返回结果为`id` `name`的数组或者 `value` `desc`的数组

![](https://user-gold-cdn.xitu.io/2020/6/24/172e5c24b7da402d?w=724&h=668&f=png&s=53100)

![](https://user-gold-cdn.xitu.io/2020/6/24/172e5c2871b6fdc3?w=1674&h=822&f=png&s=198067)

列表类接口为`dataList` `page`的一个组件 ， 其中 page的返回参数，以及分页的请求方式，具体可以参数`npc`或者`scm`系统

![](https://user-gold-cdn.xitu.io/2020/6/24/172e5c683f9bf411?w=1124&h=584&f=png&s=72109)

### 配置中心三个重要的生命周期函数

* `renderSelfButtons`：自定义操作按钮放置的区域
* `renderSelfOperation`：自定义批量操作铵钮放置的区域
* `renderSelfCode`：弹层放置区域

