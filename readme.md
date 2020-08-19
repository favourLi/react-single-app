## 项目说明
* `npm run start` 启动测试
* `npm run build` 打包
## 简介
`react-single-app`是一个TOB类型的后台应用的前端框架。它基于`react`、`react-router`、`antd`来提供的单页多标签（类似于浏览器的多标签）应用框架。
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39caaac6aa9b46ba8e3d2ca6103a328c~tplv-k3u1fbpfcp-zoom-1.image)

`react-single-app`框架，大量使用配置来生成应用以及页面，以此来简化前端开发的工作。该应用配置可以由服务端提供，当然更多的是使用公司自研的maria系统来提供。整个架构图，如下图所示
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/861dab6f026d46658dd68523c1ab5492~tplv-k3u1fbpfcp-zoom-1.image)

`react-single-app`主要分为五个组件`App` `ConfigCenter` `Uploader` `lib` `event`

## App 
`App`组件，是一个应用的基类，每个应用有且仅有一个App组件。它包含了，菜单服务、风格服务、系统切换、多标签等功能。

App 配置主要包括六个参数
```
 * @param {menuList<Menu>} props 菜单列表
 * @param {pageMap<Page<String:Component>>} props 组件路由映射表
 * @param {configList<Config>} props 配置列表
 * @param {colStyleList} props 侧边栏样式
 * @param {topStyleList} props 顶部样式
 * @param {user} props 用户
  function Index(){
      return <App 
          user={user}
          colStyleList={mode_list.col}
          topStyleList={mode_list.top}
          menuList={menu_data}
          configList={json_data}
          pageMap={pageMap}
      />
  }

 ```
 ### 菜单
 菜单通过`menuList`提供，`App`组件，为菜单提供了三种类型，大菜单、小菜单、顶部菜单。同时可以应用于多种风格。开发者，只需要提供菜单的`menuList`数据给到`App`类即可
 
 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d930a144bc2a42a4be23d3e639e91cd9~tplv-k3u1fbpfcp-zoom-1.image)

 ```
 //数据格式
  * @param {title} props 菜单标题
  * @param {url} props 菜单链接
  * @param {icon} props 菜单icon
  * @param {list} props 子菜单列表
 [{id , icon , title , url ,  list[{id , title , url}]}]
 
 //数据demo
 [{
	"id": 1596094817770811,
	"icon": "&#xe619;",
	"title": "商品中心",
	"list": [{
		"id": 1596612963074963,
		"title": "仓库单品中心",
		"url": "/config-center?config_id=1596532526599872&page_title=仓库单品中心"
	}, {
		"id": 1596612963394346,
		"title": "店铺商品中心",
		"url": "/config-center?config_id=159661302539657&page_title=店铺商品中心"
	}],
	"url": ""
}, {
	"id": 1596613355561499,
	"icon": "&#xe651;",
	"title": "仓库管理",
	"url": "/warehouse?config_id=1595926825169994&page_title=仓库管理",
	"list": []
}, {
	"id": 1596622575545918,
	"icon": "&#xe67c;",
	"title": "文档地址",
	"url": "/doc?page_title=文档地址",
	"list": []
}]
 ```
### 风格
`App` 组件提供了侧菜单及顶部菜单两种菜单模式，针对每一种菜单模式，又提供了多种风格皮肤，这里采用 `colStyleList` 、 `topStyleList` 两个数据源提供。这两个数据源都放在maria中生成，由UI配置，开发者可以不用关心，因此就不在此列出这两个字段的参数。








### 多标签
`App` 是一个单页应用，我们把每一个功能模块称之为页面。它的底层实现是基于 `react-router`，同时提供多标签切换页面服务。基于此，在`App`系统中，不允许使用 `a标签`，他有自己的打开页面和关闭页面的方法。该方法由 `lib.openPage(url , refreshFn)` 打开页面 和 `lib.closePage()`所提供。

`lib.openPage(url , refreshFn)` 打开一个页面，url的格式为 `/页面地址?page_title=我的页面标题&other=其它参数` ,`page_title`表示新开标签的名称。`refreshFn` 表示本页面兼听的事件，如果新开的子页面，比如详情页，更改数据后，需要刷新当前页，则可以使用event.emit，发送一个事件，来更改当前页面的状态

```
'/页面地址?page_title=tab显示标题&config_id=配置中心id&other=其它参数'
'/warehouse?config_id=1595926825169994&page_title=仓库管理'
'/doc?page_title=文档地址'

```

`lib.closePage()` 关闭当前活动的页面

### 页面
整个应用中页面区域所展现的是页面，是通过 `pageMap<{url : Component}>`参数到`App`应用中。`pageMap`是一个JSON对象。其中`key`表示url地址， `value`是实际的页面组件

```
import {App , ConfigCenter} from 'react-single-app';
import Warehouse from './pages/warehouse';
import WarehouseDetail from './pages/warehouse-detail';
import Doc from './pages/doc';
const pageMap = {
    'config-center': ConfigCenter,
    'warehouse' : Warehouse,
    'warehouse-detail' : WarehouseDetail,
    'doc' : Doc
}
```

### 用户及系统

`App`组件，在设计时，就考虑到了多系统应用。每个系统属于单页应用，系统之间属于多页应用。因此。如果是多系统的话，请提供`systemList`。`url`可以直接使用`a标签`的链接。如果是单系统，可以不提供`systemList`,也可以提供只有一个元素的`systemList`，只有一个元素的`systemList`表示显示系统的名称。另外，`name`表示当前系统的用户，且需要提供一个`logout`退出系统的方法
```
const user = {
    name: 'admin',
    activeSystem: 0,
    systemList: [{
        name: 'OMS 小二后台',
        url: ''
    }, {
        name: 'CCS 云仓平台',
        url: ''
    }, {
        name: 'EIMS 物流平台',
        url: ''
    }, {
        name: '供俏平台',
        url: ''
    }],
    logout: () => {
        alert('退出系统方法')
    }
}
```

## lib
lib 库主要的功能包括多标签：`打开页面`、`关闭页面`， 网关请求：`request请求`
```    
     /**
     *
     * @param url /test-detail?pageTitle=测试详情页
     * @param refreshFn 回调函数，作状态更新使用
     */
    openPage({ url, refreshFn })
    
    /**
     * 关闭当前页面
     */
    closePage()
    
    /**
        字段名         类型       是否必填      说明
        url           string      是         访问的URL
        data          json        否         请求的数据
        success       function    是         请求成功回调函数
        fail          function    否         失败回调函数
        needMask      boolean     否         是否需要遮照，默认为true
        client        json<{clientId , clientSecret}>        否
    **/
    request({ url, needMask = 'false', data , success = function(){}, fail = function(){} , client})
```
* 多标签：`打开页面`、`关闭页面`在上面已经介绍过，此处不再叙述。

* 网关请求：目前，公司所有的系统服务端都在往网关迁移，做统一登陆，因此，`lib.request` 默认采用但丁云网关的加签的方式，进行加签。如果不采用网关，或者接口不一致的情况，则对`lib.request`方法进行更改即可。网关加签方式，可参考 https://juejin.im/post/6857440384878116872#heading-0


## event
`App`应用为单页多标签应用，因此一定会存在页面间通信的需求。如列表页打开详情页，详情页同意了退款需求，则需要对列表页进行同步刷新，所有的通信机制即`event`组件。event 库主要包括事件的监听和通知机制。

```
/**
 * @param {*} name 监听的事件名
 * @param {*} fn 事件的回调方法
 */
on : function(name , fn)
/**
 * @param {*} name 取消监听的事件名
 * @param {*} fn 取肖监听的事件方法，省略此参数，表示取消所有为name的事件监听
 */
off : function(name , fn)
/**
 * @param {*} name 发送{name}事件
 * @param {*} entry 发送事件并带上数据{entry}，此参数可省略
 * @param {*} once once=true，表示发送{name}事件，之后立即取消监听{name}事件
 */
emit : function(name , entry , once)
```

## ConfigCenter 配置中心
对于后台类应用，会有很多列表查询类的页面，他的格式比较固定，统一。上面是各种类型的搜索条件，下面是表格。表格列宽可拖动，列可排序，固定在左，或者右侧，也可以隐藏等。表格可带批量操作，底部可以出详情，等等，很多的操作。对于这一类共性的需求，可使用`ConfigCenter`快速生成页面，或者通过继承`ConfigCenter`,使用`ConfigCenter`提供的API接口，用少量代码开发来生成页面。
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25566a50590941d5ba152c810e8368d8~tplv-k3u1fbpfcp-zoom-1.image)

配置中心所提供的能力图以及API，如下图所示。
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c164abe28e94911895e329d0cca2ad6~tplv-k3u1fbpfcp-zoom-1.image)

### 配置中心配置解析
1. 所有配置中心的配置，通过参数`configList<config>`传递给`App`组件
2. 每一个配置中心的页面，都需要用到一个参数config_id，用于在`configList` 中查找对类的`config`配置
```
http://admin.gongxiao.yang800.cn/order/1597742357174?config_id=1597316269951703&page_title=订单管理
http://admin.gongxiao.yang800.cn/item-center/1597742700177?config_id= 1597212444608339&page_title=商品中心
```
3. config配置的结构如下
```
	config={id ,searchKeyList , requestUrl , excel ,  tableFieldList , needBatchOperation}
```

### 搜索条件配置

`searchKeyList<Search>` 为搜索条件列表。Search属性如表所示

| filed | type | description |
| - | -| - |
| label | 标签 | 用于展示 |
| key | key | 用于搜索，传给服务端的key值 |
| type | 展示给用户的组件类型 | 类型包含 文本、选择框 、 选择框-JSON数据来源 、 选择框-带搜索 、 选择框-多选 、 选择框-级联 、日期 、 文本域 | 
| extra | 补充字段 | 文本、文本域，该字段用于placeholder， 选择框、级联字段用于选择框、级联的接口地址 请参考[接口规范](https://juejin.im/post/6857440384878116872)|

搜索条件一共支持8种类型的控件。
* string文本 | text文本域：extra的值表示文本框或文本框的placeholder
* select选择框 | searchSelect选择框-带搜索 | multiSelect选择框-多选: extra的值表示下拉框数据来源接口API。将调用自动`lib.request` 去请求下拉框的数据。对请求和返回格式有一定要求，请参照 [接口文档](https://juejin.im/post/6857440384878116872#heading-2)
* 选择框-JSON数据来源 : extra字段为一个序列化的`JSON`. `ConfigCenter`会自动将反序列化的数据用于下拉框
* 选择框-级联 : extra字段参照select选择框，对请求和返回格式有一定要求，请参照 [接口文档](https://juejin.im/post/6857440384878116872#heading-3)
* 日期 ： key的值有两个字段，以英文逗号隔开。如`startDate,EndDate`.

### 列表数据请求
列表数据请求，会自动组装用户通过`searchKeyList`设置的值，以及翻页组件设置的值，发送给`requestUrl`的接口。该接口，对请求，及响应，都有一定的格式要求，统一调用`lib.request`，走网关，加签名。格式要求请参数[接口文档](https://juejin.im/post/6857440384878116872#heading-4)

### 导入 && 导出配置
`excel` 用于配置导入、导出

| key | filed | description | 
| - | - | - | 
| export | 导出接口、取值true , false | 导出接口使用 `request`请求接口一样的搜索条件，？？？翻页参数需要传吗。 url 后面加上/download 请参考[接口规范](https://juejin.im/post/6857440384878116872/#heading-5)|
| import | 导入接口、取值true ，false | 导出接口使用 `request`请求url后面加上 /import ,参数为file=url。（由于网关不支持formdata请求，由前端先将文件上传到oss ，然后再给服务端地址）请参考[接口规范](https://juejin.im/post/6857440384878116872/#heading-6)|
| importTemplate | 导入模板下载 | 模块只需要放到maria中的相册中。提供链接即可 |

### 列表配置
配置中心的列表，是一个表现形式非常丰富的一个列表。它支持多选，翻页，列宽的自由调整，列排序，列显示、隐藏、左右固定，表头固定等一系统功能。列的调用，可以保存到本地。也可以只是临时性的。

表格字段 `tableFieldList<TableField>` 属性如下

| key | filed | description | 
| - | - | - |
| title | 列标题 | |
| key | 列关键字，用于这一列数据的来源 | 根据type的不同，显示方式不同。type=text,这一列直接从dataList中取值。 type=js，从dataList中取值，并进行简单的脚本运算。type=function 。这一列的数据来源于代码。key表示继承后的function name。会被配置中心调用|
| type | 列类型(text/js/function) | 配合key 渲染该列的数据 |
| width | 列宽度 | 默认的列宽度，用户可自行设置|
| display | 显示类弄 | auto:显示、hide:隐藏、sticky-left:固定左侧、sticky-right:固定右侧 ,用户可自行设置|

`needBatchOperation` 是否支持仳量操作。如果支持批量操作，则dataList中，每一行数据有一个属性 checked=true表示选中。

### 配置中心API

配置中心，abstruct方法
1. renderModal:渲染自定义弹层。
2. renderLeftOperation：渲染批量操作按钮
3. renderRightOperation：渲染其它操作按钮，比如新建按钮
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ddd8ba08a4c402f8206554d86a16d1c~tplv-k3u1fbpfcp-zoom-1.image)
4. renderDetail(data)：渲染底部浮层，注意，其中data，由开发者调用 setDetailData(data)传入。在需要渲梁底部浮层的地方，调用setDetailData，传入data即可。
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f78f52f1545493ca8a48eb3422f5bb0~tplv-k3u1fbpfcp-zoom-1.image)
5. 表格字段type=function，指定的key值的函数名。


## Uploader

上传组件。一般用于上传图片，当然也可以用于上传任何文件，如excel等。支持拖动上传和选择文件上传。上传图片时，可还以支持查看缩略图，删除图片等等。
```
/**
 * @param {style{width , height , ...}} 样式，一般指定width , height    可选   
 * @param {src} 默认图片URL                                            可选
 * @param {allowTypes[]} 允许的图片类型，数组。默认不限制                  可选
 * @param {onUploadStart} 开始上传回调                                  可选
 * @param {onUploadEnd(src)} 结束上传回调                               可选
 * @param {onRemove} 删除图片回调                                       可选
 */
 <Uploader 
    allowTypes={['png' , 'jpg']}
    onUploaderStart={() => {console.log('开始上传 ')}}
    onUploaderEnd={(src) => {
        console.log(src);
    }}
    style={{width:'160px' , height:'160px'}}
    src='https://dante-img.oss-cn-hangzhou.aliyuncs.com/28562010515.png'
/>

 
```























