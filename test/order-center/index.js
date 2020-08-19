import React from 'react';
import { ConfigCenter, lib } from '../../src/index';
import Util from './util';
import './index.less';
/*
//待审核
 WAIT_AUTH(13, "待审核", false),
 //审核失败
 AUTH_SUCCESS(16, "已审核", false),
 //已审核通过
 AUTH_FAIL(19, "审核失败", false);
 */
class OrderList extends ConfigCenter{
    constructor(props){
        super(props);
    }
    componentDidMount(){
    }
    
    renderTable(){
        var orderList = this.state.dataList?this.state.dataList:[];
        var timestamp = new Date().getTime();
        return (
            <table className='order-table'>
                <thead>
                    <tr>
                        <th colSpan="2" style={{minWidth : '462px'}}>商品信息</th>
                        <th style={{minWidth : '130px'}}>采购价</th>
                        <th style={{minWidth : '130px'}}>数量</th>
                        <th style={{minWidth : '152px', textAlign: 'center'}}>实付款</th>
                        <th style={{minWidth : '110px', textAlign: 'center'}}>交易状态</th>
                    </tr>
                    
                </thead>
                <tbody>
                    {
                        orderList.map((order, index) => {
                            var itemList = order.skuOrders;
                            if(!itemList || !itemList.length){
                                itemList = [{}];
                            }
                            var num = (itemList).length ;
                            return (
                                <React.Fragment key={index}>
                                    <tr className='empty' ></tr>
                                    <tr className='summary-tr'>
                                        <td colSpan="6">
                                            <span>交易单号：{order.orderSn}</span>
                                            <span>外部订单号：{order.outId}</span>
                                            <span>供应商：{order.shopName}</span>
                                            <span>采购方：{order.buyerName}</span>
                                            <span>下单时间：{order.createdAt}</span>
                                        </td>
                                    </tr>
                                    {
                                        itemList.map((sku, skuIndex) =>
                                            <tr className="info-tr" key={skuIndex}>
                                                <td style={{paddingRight: 0, width: '89px'}}>
                                                    <img src={sku.skuImage}></img>
                                                </td>
                                                <td><label className={order.isBonded==1?'business-type bonded':'business-type normal'}>{sku.isBondedStr}</label>{sku.itemName}</td>
                                                <td>¥{Util.formatMoney(sku.fee)}</td>
                                                <td>{sku.quantity}</td>
                                                {skuIndex==0 &&
                                                    <React.Fragment>
                                                        <td className='bd-r bd-l fee-box' style={{textAlign: 'center'}} rowSpan={num}>
                                                            <span className='bold-text'>¥{Util.formatMoney(order.fee)}</span>
                                                            {order.isBonded==1 &&
                                                                <React.Fragment>
                                                                    <span className='light-word'>(含运费：¥{Util.formatMoney(order.shipFee)}</span>
                                                                    <span className='light-word'>税费：¥{Util.formatMoney(order.tax)})</span>
                                                                </React.Fragment>
                                                            }
                                                            {order.isBonded!=1 &&
                                                                    <span className='light-word'>(含运费：¥{Util.formatMoney(order.shipFee)})</span>
                                                            }
                                                            
                                                        </td>
                                                        <td className='bd-r fee-box' style={{textAlign: 'center'}} rowSpan={num}>
                                                            <span className='status-lab'>{order.statusStr}
                                                            </span>
                                                            <div className='primary' onClick={() => lib.openPage(`/order-detail/${timestamp}?pageTitle=订单管理&orderId=${order.id}`)}>
                                                                查看详情
                                                            </div>
                                                        </td>
                                                    </React.Fragment>
                                                }
                                                
                                            </tr>
                                        )
                                    }
                                    
                                </React.Fragment>
                            )
                        })
                    }
                </tbody>
            </table>
        )
    }
}

export default OrderList
