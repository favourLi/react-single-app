## 引子
react-single-app 主要功能，分为四大块 `App` `ConfigCenter` `lib` `event`

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/861dab6f026d46658dd68523c1ab5492~tplv-k3u1fbpfcp-zoom-1.image)

* `App` 提供整体界面搭建，菜单、风格、多标签服务
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef48ab8b0d234ef28fafe01e70fc58f1~tplv-k3u1fbpfcp-zoom-1.image)

* `ConfigCenter` 提供一个通过配置来快速搭建查询类页面。

* `lib` 通用函数。主要包括链接封装、对多标签的操作、request请求封装

* `event` 框架事件机制，主要实现多页面或者多模块之间的刷新操作

## App 

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
 1. menuList
 ```
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
 2. configList
 ```
 [{
	"id": 1595926825169994,
	"title": "仓库管理",
	"searchKeyList": [{
		"id": 1595926985149977,
		"label": "仓库",
		"key": "warehouseSn",
		"type": "select",
		"extra": "/xhr/shopItem/listWarehouse"
	}, {
		"id": 1595926985469918,
		"label": "货主",
		"key": "shipperSn",
		"type": "search-select",
		"extra": "/xhr/shopItem/listShipper"
	}, {
		"id": 1596009728624848,
		"label": "货主多选",
		"key": "shipperSn123",
		"type": "multi-select",
		"extra": "/xhr/shopItem/listShipper"
	}, {
		"id": 1595926986053186,
		"label": "状态",
		"key": "isPublish",
		"type": "json-select",
		"extra": "[{\"id\":0,\"name\":\"未发布\"},{\"id\":1,\"name\":\"已发布\"}]"
	}, {
		"id": 1595926986365327,
		"label": "搜索",
		"key": "query",
		"type": "text",
		"extra": "输入仓库sku编码或仓库商品名称"
	}, {
		"id": 1595926987317294,
		"label": "更新时间",
		"key": "updateStartTime,updateEndTime",
		"type": "date",
		"extra": ""
	}, {
		"id": 1596072133836212,
		"label": "级联",
		"key": "cascader",
		"type": "cascader",
		"extra": ""
	}, {
		"id": 1596013851501547,
		"label": "多个编码",
		"key": "many",
		"type": "textarea",
		"extra": ""
	}],
	"request": {
		"method": "GET",
		"url": "/xhr/Sku/querySku"
	},
	"importOutport": {
		"sync": "false",
		"outport": "false",
		"import": "false"
	},
	"tableFieldList": [{
		"id": 1595927073048883,
		"title": "仓库",
		"key": "row. warehouseAdminVO.name",
		"type": "js",
		"width": "120",
		"display": "sticky-left"
	}, {
		"id": 1595927074144233,
		"title": "货主",
		"key": "shipperName",
		"type": "text",
		"width": "120",
		"display": "sticky-left"
	}, {
		"id": 1595927074968572,
		"title": "仓库sku编码",
		"key": "skuCode",
		"type": "text",
		"width": "220",
		"display": "auto"
	}, {
		"id": 1595927075736817,
		"title": "仓库单品名称",
		"key": "name",
		"type": "text",
		"width": "220",
		"display": "auto"
	}, {
		"id": 1595927077177280,
		"title": "HS编码",
		"key": "getHS",
		"type": "function",
		"width": "220",
		"display": "auto"
	}, {
		"id": 1595927077561184,
		"title": "更新时间",
		"key": "updatedAt",
		"type": "text",
		"width": "80",
		"display": "auto"
	}, {
		"id": 1595927078769885,
		"title": "状态",
		"key": "publishDesc",
		"type": "text",
		"width": "80",
		"display": "auto"
	}, {
		"id": 1595927145539979,
		"title": "操作",
		"key": "getOperation",
		"type": "function",
		"width": "80",
		"display": "auto"
	}, {
		"id": 1595927145978633,
		"title": "详情（方式一）",
		"key": "goDetail1",
		"type": "function",
		"width": "160",
		"display": "auto"
	}, {
		"id": 159592714631428,
		"title": "详情（方式二）",
		"key": "goDetail2",
		"type": "function",
		"width": "160",
		"display": "sticky-right"
	}],
	"needBatchOperation": "true",
	"extra": [],
	"other": {
		"sync": "true",
		"outport": "true",
		"import": "true",
		"output": "true",
		"export": "true"
	}
}, {
	"id": 1596532526599872,
	"title": "仓库单品中心",
	"searchKeyList": [{
		"id": 1596613039124387,
		"label": "仓库",
		"key": "warehouseSn",
		"type": "select",
		"extra": "/xhr/shopItem/listWarehouse"
	}, {
		"id": 1596613039732730,
		"label": "货主",
		"key": "shipperSn",
		"type": "search-select",
		"extra": "/xhr/shopItem/listShipper"
	}, {
		"id": 1596613040460209,
		"label": "状态",
		"key": "isPublish",
		"type": "json-select",
		"extra": "[{\"id\":0,\"name\":\"未发布\"},{\"id\":1,\"name\":\"已发布\"}]"
	}, {
		"id": 1596613040812263,
		"label": "搜索",
		"key": "query",
		"type": "text",
		"extra": "输入仓库sku编码或仓库商品名称"
	}, {
		"id": 1596613041549909,
		"label": "hs编码",
		"key": "codeTs",
		"type": "text",
		"extra": ""
	}, {
		"id": 1596613042180299,
		"label": "更新时间",
		"key": "updateStartTime,updateEndTime",
		"type": "date",
		"extra": ""
	}],
	"request": {
		"method": "GET",
		"url": "/xhr/Sku/querySku"
	},
	"other": {
		"sync": "true",
		"outport": "false",
		"import": "true",
		"export": "true"
	},
	"tableFieldList": [{
		"id": 1596613140583157,
		"title": "仓库",
		"key": "row. warehouseAdminVO.name",
		"type": "js",
		"width": "100",
		"display": "auto"
	}, {
		"id": 1596613140959467,
		"title": "货主",
		"key": "shipperName",
		"type": "text",
		"width": "100",
		"display": "auto"
	}, {
		"id": 1596613141599773,
		"title": "仓库sku编码",
		"key": "skuCode",
		"type": "text",
		"width": "100",
		"display": "auto"
	}, {
		"id": 1596613142239629,
		"title": "仓库单品名称",
		"key": "name",
		"type": "text",
		"width": "100",
		"display": "auto"
	}, {
		"id": 1596613142583456,
		"title": "HS编码",
		"key": "",
		"type": "text",
		"width": "100",
		"display": "auto"
	}, {
		"id": 1596613142951926,
		"title": "更新时间",
		"key": "updatedAt",
		"type": "text",
		"width": "100",
		"display": "auto"
	}, {
		"id": 1596613160976396,
		"title": "状态",
		"key": "publishDesc",
		"type": "text",
		"width": "100",
		"display": "auto"
	}, {
		"id": 1596613161520843,
		"title": "操作",
		"key": "",
		"type": "text",
		"width": "100",
		"display": "auto"
	}],
	"needBatchOperation": "false"
}, {
	"id": 159661302539657,
	"title": "店铺商品中心",
	"searchKeyList": [{
		"id": 1596616593306605,
		"label": "店铺",
		"key": "shopId",
		"type": "search-select",
		"extra": "/xhr/shop/search"
	}, {
		"id": 1596616597834699,
		"label": "供应商",
		"key": "userId",
		"type": "search-select",
		"extra": "/xhr/supplier/search"
	}, {
		"id": 1596616598378692,
		"label": "搜索",
		"key": "query",
		"type": "text",
		"extra": "搜索商品编码或商品名称"
	}],
	"request": {
		"method": "GET",
		"url": "/xhr/shopItem/getShopItems"
	},
	"other": {
		"sync": "false",
		"export": "false",
		"import": "false"
	},
	"tableFieldList": [{
		"id": 1596616649427962,
		"title": "供应商",
		"key": "name",
		"type": "text",
		"width": "100",
		"display": "auto"
	}, {
		"id": 1596616650011843,
		"title": "店铺商品编码",
		"key": "shopItemCode",
		"type": "text",
		"width": "100",
		"display": "auto"
	}, {
		"id": 1596616651003196,
		"title": "店铺商品名称",
		"key": "shopItemName",
		"type": "text",
		"width": "100",
		"display": "auto"
	}, {
		"id": 15966166515877,
		"title": "外部商品编码",
		"key": "outerItemCode",
		"type": "text",
		"width": "100",
		"display": "auto"
	}, {
		"id": 1596616651963722,
		"title": "商品状态",
		"key": "statusDesc",
		"type": "text",
		"width": "100",
		"display": "auto"
	}, {
		"id": 1596616652851671,
		"title": "映射单品SKU",
		"key": "getItemCode",
		"type": "text",
		"width": "100",
		"display": "auto"
	}, {
		"id": 1596616653404263,
		"title": "单品名称",
		"key": "getName",
		"type": "text",
		"width": "100",
		"display": "auto"
	}, {
		"id": 1596616653987354,
		"title": "单品可用库存",
		"key": "getAvailableStock",
		"type": "text",
		"width": "100",
		"display": "auto"
	}, {
		"id": 1596616654403316,
		"title": "y800总库存",
		"key": "getStockQuantity",
		"type": "text",
		"width": "100",
		"display": "auto"
	}, {
		"id": 159661665514859,
		"title": "仓库库存",
		"key": "getWareStock",
		"type": "text",
		"width": "100",
		"display": "auto"
	}, {
		"id": 159661665558789,
		"title": "组合数量",
		"key": "getNum",
		"type": "text",
		"width": "100",
		"display": "auto"
	}, {
		"id": 1596616656035330,
		"title": "店铺可售库存",
		"key": "stockQuantity",
		"type": "text",
		"width": "100",
		"display": "auto"
	}, {
		"id": 1596616656627715,
		"title": "初始货主",
		"key": "shipperName",
		"type": "text",
		"width": "100",
		"display": "auto"
	}, {
		"id": 1596616657660271,
		"title": "更新时间",
		"key": "updatedTime",
		"type": "text",
		"width": "100",
		"display": "auto"
	}],
	"needBatchOperation": "false"
}]
 ```
3. pageMap
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
4. colStyleList 、 topStyleList 皮肤样式
5. user 用户及系统
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

## 页面链接
由于页面，属于多标签单页应用，有属于自己的链接体系统。url的组成为 
```
'/页面地址?page_title=tab显示标题&config_id=配置中心id&other=其它参数'
'/warehouse?config_id=1595926825169994&page_title=仓库管理'
'/doc?page_title=文档地址'

```
## lib
lib 库主要的功能包括 `创建链接`、`打开页面`、`关闭页面`、`request请求`
```
 /**
     * 
     * @param url /test-detail?pageTitle=测试详情页 
     * @param element 字符串或者任何html无素如div button等
     * @param refreshFn 回调函数，作状态更新使用
     */
    getLink( url, element, refreshFn ) 
    
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
        method        string      否         get post
        success       function    是         请求成功回调函数
        isAplicationJSON request数据类型   否   true表示aplicationJSON false表示formdata
        fail          function    否         失败回调函数
        needMask      boolean     否         是否需要遮照，默认为true
        timeout       int         否         超时时间，毫秒，默认为5000
    **/
    async request({ url, method = 'GET', needMask = false, data = {}, isAplicationJSON = false, success = function(){}, fail = function(){}} = {})
```
## event
event 库主要包括事件的监听和通知机制

```
on : function(name , fn)

off : function(name , fn)

emit : function(name , entry , once)
```

## ConfigCenter
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c164abe28e94911895e329d0cca2ad6~tplv-k3u1fbpfcp-zoom-1.image)

### 配置中心字段解析
1. 应用的所有config通过configList 参数传给App，每个配置页的配置，会通过该页的url中的config_id 在configList中查找。

2. config配置的结构如下
```
	config={searchKeyList , request , other ,  tableFieldList , needBatchOperation}
```

3. `searchKeyList<Search>` 为搜索条件列表。Search属性如表所示

| filed | type | description |
| - | -| - |
| label | 标签 | 用于展示 |
| key | key | 用于搜索，传给服务端的key值 |
| type | 展示给用户的组件类型 | 类型包含 文本、选择框 、 选择框-JSON数据来源 、 选择框-搜索 、 选择框-多选 、 选择框-级联 、日期 、 文本域 | 
| extra | 补充字段 | 文本、文本域，该字段用于placeholder， 选择框、级联字段用于选择框、级联的接口地址 请参考[接口规范](https://juejin.im/post/6857440384878116872)|

4. `request` 用于设置列表类页列，请求数据的接口，由于采用网关后，method统一为POST，后期考虑将request改为string类型

5. `other` 用于配置导入、导出、同步等接口

| key | filed | description | 
| - | - | - | 
| sync | 同步接口、取值true , false | 同步接口使用`request`请求接口一样的url 后面加上 /sync 请参考[接口规范](https://juejin.im/post/6857440384878116872)|
| export | 导出接口、取值true , false | 导出接口使用 `request`请求接口一样的搜索条件，？？？翻页参数需要传吗。 url 后面加上/download 请参考[接口规范](https://juejin.im/post/6857440384878116872)|
| import | 导入接口、取值true ，false | 导出接口使用 `request`请求url后面加上 /import ,参数为file=url。（由于网关不支持formdata请求，由前端先将文件上传到oss ，然后再给服务端地址）请参考[接口规范](https://juejin.im/post/6857440384878116872)|
| importTemplate | 导入模板下载 | 模块只需要放到maria中的相册中。提供链接即可 |

6. `tableFieldList<TableField>` 表格字段TableField属性如下

| key | filed | description | 
| - | - | - |
| title | 列标题 | |
| key | 列关键字，用于这一列数据的显示 | 根据type的不同，显示方式不同。type=text,这一列直接从dataList中取值。 type=js，从dataList中取值，并进行简单的脚本运算。type=function 。这一列的数据来源于代码。key表示继承后的function name。会被配置中心调用|
| type | 列类型(text/js/function) | 配合key 渲染该列的数据 |
| width | 列宽度 | 默认的列宽度，用户可自行设置|
| display | 显示类弄 | auto:显示、hide:隐藏、sticky-left:固定左侧、sticky-right:固定右侧 ,用户可自行设置|

7. `needBatchOperation` 是否支持仳量操作。如果支持批量操作，则dataList中，每一行数据有一个属性 checked=true表示选中。

### 配置中心生命周期

配置中心，abstruct方法
1. renderModal:渲染自定义弹层。
2. renderLeftOperation：渲染批量操作按钮
3. renderRightOperation：渲染其它操作按钮，比如新建按钮
4. renderDetail(data)：渲染底部浮层，注意，其中data，由业务生命周期 setDetailData(data)传入。在需要渲梁底部浮层的地方，调用setDetailData，传入data即可。
5. 表格字段type=function，指定的key值的函数名。














