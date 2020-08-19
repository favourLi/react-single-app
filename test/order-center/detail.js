import React from 'react';
import ReactDom from 'react-dom';
import './detail.less';
import './index.less';
import zhCN from 'antd/es/locale/zh_CN';
import { lib } from '../../src/index';
import { ConfigProvider, Modal, Button, Row, Col } from 'antd';
import { InfoCircleTwoTone, CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import Util from './util';
/*
//待支付
 WAIT_PAY(1, "待支付", true),
 //支付失败
 PAY_FAIL(7, "支付失败", false),
 //已支付
 PAY_SUCCESS(10, "已支付", false),
 //待审核
 WAIT_AUTH(13, "待审核", false),
 //已审核
 AUTH_SUCCESS(16, "已审核", false),
 //审核失败
 AUTH_FAIL(19, "审核失败", false),
 //待发货
 WAIT_SHIP(22, "待发货", true),
 //待收货
 WAIT_CONFIRM(25, "待收货", true),
 //已完成
 COMPLETE(40, "已完成", true);
*/

class OrderDetail extends React.Component{
    //构造函数
    constructor(props){
        super(props);
        this.state = {
            
        };
        if(props.data){
            Object.assign(this.state, props.data);
        }
    }
   
    componentDidMount() {
        this.state.orderId = lib.getParam('orderId');
        this.getOrderDetail();
    }
    // 获取订单详情
    getOrderDetail(){
        var self = this;
        lib.request({
            url: '/supply-admin/shopOrder/detail' , 
            data : {orderId: this.state.orderId},
            needMask : true,
            success: function(json){
                self.setState({
                    detail: json
                })
            }
        })
    }
    // 查看物流信息按钮点击
    searchLogistics(){
        var self = this;

        
    }
    // 物流信息对话框点击确定事件
    handleOk(e){
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    // 区分icon 
    createIcon(status){
        if(status==40){
           return(<CheckCircleTwoTone twoToneColor="#52C41AFF" />)
        }else if(status==-1){
            return(<CloseCircleTwoTone  twoToneColor="#FF4D4FFF" />)
        }
         return(<InfoCircleTwoTone twoToneColor="#FAAD14FF" />)
    }
    render(){
        var order = this.state.detail || {};
        var itemList = order.skuOrders?order.skuOrders:[];
        var num = itemList.length;
        var receiver = order.receiver || {};
        var payDetail = order.payDetail || {};
        var logisDetail = this.state.logisDetail || {};
        var steps = logisDetail.steps?logisDetail.steps:[];

        return (
            <ConfigProvider locale={zhCN}>
                <div className='purchase-detail'>
                    <div className='status-box'>
                        <div className='left'>
                            <div className='top'>
                                <span className='desc'>
                                    {
                                        this.createIcon(order.status)
                                    }
                                 当前状态：{order.statusStr}
                                </span>
                                {order.status==7 &&
                                    <span className='error-msg'>等待采购方付款</span>
                                }
                                
                            </div>
                            
                        </div>

                        {(order.status==25 || order.status==40) &&
                            <div className='right'>
                                <div className='btn btn-primary' onClick={this.searchLogistics.bind(this, order.id)}>查看物流</div>
                            </div>
                        }
                        
                    </div>
                    <div className='title-box'>
                        订单信息
                    </div>
                    <table className='order-table'>
                        <thead>
                            <tr className='summary-tr'>
                                <td colSpan="5">
                                    <span>交易单号：{order.orderSn}</span>
                                    <span>外部订单号：{order.outId}</span>
                                    <span>供应商：{order.shopName}</span>
                                    <span>采购方：{order.buyerName}</span>
                                    <span>下单时间：{order.createdAt}</span>
                                </td>
                            </tr>
                            <tr className='white'>
                                <th style={{width: '88px'}}>商品</th>
                                <th style={{minWidth : '504px'}}></th>
                                <th style={{minWidth : '140px'}}>采购价</th>
                                <th style={{minWidth : '220px'}}>数量</th>
                                <th style={{minWidth : '180px', textAlign: 'center'}}>订单状态</th>
                            </tr>
                        </thead>
                        <tbody>
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
                                            <td className='bd-l bd-r' style={{textAlign: 'center'}} rowSpan={num}>{order.statusStr}</td>
                                        }
                                        
                                    </tr>
                                )
                            }
                            <tr className='amount-tr bd-bt'>
                                <td colSpan="5">
                                    <div className='left'>
                                        <span className='h-22'>订单总额：</span>
                                        <span className='h-22'>运费金额：</span>
                                        <span className='h-22'>代缴税费：</span>
                                        <span className='h-28'>实付款金额：</span>
                                    </div>
                                    <div className='right'>
                                        <span className='h-22'>￥{Util.formatMoney(order.originFee)}</span>
                                        <span className='h-22'>￥{Util.formatMoney(order.shipFee)}</span>
                                        <span className='h-22'>￥{Util.formatMoney(order.tax)}</span>
                                        <span className='red h-28'>￥{Util.formatMoney(order.fee)}</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className='title-box'>收件人信息</div>
                    <Row gutter={[72, 8]} className='grid-row'>
                        <Col span={8}>
                          <div>收件人：{receiver.receiveUserName}</div>
                        </Col>
                        <Col span={8}>
                          <div>手机号码：{receiver.mobile}</div>
                        </Col>
                        <Col span={8}>
                          <div>收货地址：{receiver.detail}</div>
                        </Col>
                    </Row>
                    {order.status>9 &&
                        <React.Fragment>
                            <div className='title-box'>支付信息</div>
                            <Row gutter={[72, 8]} className='grid-row'>
                                <Col span={8}>
                                  <div>支付人：{payDetail.payUserName}</div>
                                </Col>
                                <Col span={8}>
                                  <div>支付方式：{payDetail.payChannel}</div>
                                </Col>
                                <Col span={8}>
                                  <div>支付时间：{payDetail.paidAt}</div>
                                </Col>
                            </Row>
                            <Row gutter={[72, 8]} className='grid-row'>
                                <Col span={8}>
                                  <div>支付流水号：{payDetail.paySerialNo}</div>
                                </Col>
                            </Row>
                        </React.Fragment>
                    }

                </div>
                

                <Modal
                  title="物流信息"
                  visible={this.state.visible}
                  onCancel={this.handleOk.bind(this)}
                  footer={[
                    <Button key='ensure' type="primary" onClick={this.handleOk.bind(this)}>
                      确定
                    </Button>,
                  ]}
                  width={660}
                >
                    <div style={{marginBottom : '16px'}}><span>承运公司：{logisDetail.shipmentCorpName}</span><span style={{"marginLeft":"24px"}}> 运单号：{logisDetail.shipmentSerialCode}</span></div>
                    <div className='step-h'>
                        {
                            steps.map((step, index) => {
                                return(
                                    <div className={'node ' + (index==0?'node-first':'')} key={index}>
                                        <div className='date'>{step.time}</div>
                                        <div className='des'>{step.desc}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </Modal>
            </ConfigProvider>
        )
    }
}


export default OrderDetail

