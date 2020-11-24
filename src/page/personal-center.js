import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import { Button, message, Modal, Space, Form, Select, Input, Tree, Card, Row, Col, ConfigProvider } from 'antd';
import { ConfigCenter, Uploader, lib } from '../index';
import { CheckCircleTwoTone, InfoCircleTwoTone } from "@ant-design/icons";
import "./personal-center.less";
// import 'antd/dist/antd.css';
import moment from 'moment';
const FormItem = Form.Item;
moment.locale('zh-cn');
const FormLayout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 16 },
}

function PersonalCenter() {
	let [detail, setDetail] = useState({});
	let [pwVisible, setPwVisible] = useState(false);
	let [mobileVisible, setMobileVisible] = useState(false);
	let [emailVisible, setEmailVisible] = useState(false);
	let [nickNameVisible, setNickNameVisible] = useState(false);

	useEffect(() => {
		fetchDetail();
	}, [])

	// 获取角色详情
	function fetchDetail() {
		lib.request({
			url: "/ucenter-account/current/userDetails",
      needMask: true,
			success: res => setDetail(res)
		})
	}

	return <div className="react-single-app-personal-center">
		<div className="welcome">
			hey,{detail?.userName}
		</div>
		<div className="item">
			<b className="item_head">手机号码</b>
			<span className="item_body">{detail?.mobile}</span>
			<span className="item_operation" onClick={() => setMobileVisible(true)}>
				<CheckCircleTwoTone twoToneColor="#73D13D" />&nbsp;&nbsp;去修改&gt;
      </span>
		</div>
		<div className="item">
			<b className="item_head">电子邮箱</b>
			<span className="item_body">{detail?.email}</span>
			<span className="item_operation" onClick={() => setEmailVisible(true)}>
				<CheckCircleTwoTone twoToneColor="#73D13D" />&nbsp;&nbsp;去修改&gt;
      </span>
		</div>
		<div className="item">
			<b className="item_head">昵称</b>
			<span className="item_body">{detail?.nickName}</span>
			<span className="item_operation" onClick={() => setNickNameVisible(true)}>
				{detail?.nickName ? <CheckCircleTwoTone twoToneColor="#73D13D" /> : <InfoCircleTwoTone twoToneColor="#FFA940" />}
        &nbsp;&nbsp;去修改&gt;
      </span>
		</div>
		<div className="item">
			<b className="item_head">修改密码</b>
			<span className="item_operation" onClick={() => setPwVisible(true)}>&nbsp;&nbsp;去修改&gt;</span>
		</div>
		{pwModal({ pwVisible, setPwVisible, fetchDetail })}
		{mobileModal({ mobileVisible, setMobileVisible, fetchDetail })}
		{emailModal({ emailVisible, setEmailVisible, fetchDetail })}
		{nickNameModal({ nickNameVisible, setNickNameVisible, fetchDetail, detail })}
	</div>
}

function nickNameModal({ nickNameVisible, setNickNameVisible, fetchDetail, detail }) {
	let [form] = Form.useForm();

	useEffect(() => {
		form.resetFields();
	}, [nickNameVisible])

	function onOk() {
		form.validateFields()
			.then(values => {
				if (!values.nickName) {
					form.resetFields();
					setNickNameVisible(false);
					fetchDetail();
				}
				lib.request({
					url: "/ucenter-account/current/updateUserInfo",
					data: {
						nickName: values.nickName,
					},
      		needMask: true,
					success: res => {
						form.resetFields();
						setNickNameVisible(false);
						fetchDetail();
					}
				})
			})
	}

	return <Modal
		title="修改昵称"
		visible={nickNameVisible}
		getContainer={false}
		onOk={() => onOk()}
		onCancel={() => {
			form.resetFields();
			setNickNameVisible(false)}}
		destroyOnClose
	>
		<Form form={form} {...FormLayout} initialValues={detail}>
			<FormItem label="昵称" name="nickName">
				<Input />
			</FormItem>
		</Form>
	</Modal>
}

function pwModal({ pwVisible, setPwVisible, fetchDetail }) {
	let [form] = Form.useForm();

	function onOk() {
		form.validateFields()
			.then(values => {
				lib.request({
					url: "/ucenter-account/current/updatePwd",
					data: {
						oldPassword: values.oldPassword,
						password: values.password
					},
      		needMask: true,
					success: res => {
						setPwVisible(false);
						fetchDetail();
						form.resetFields();
					}
				})
			})
	}

	return <Modal
		title="修改密码"
		visible={pwVisible}
		onOk={() => onOk()}
		onCancel={() => {
			form.resetFields();
			setPwVisible(false)}}
		getContainer={false}
	>
		<Form form={form} {...FormLayout}>
			<FormItem label="旧密码" name="oldPassword"  rules={[{required: true}]}>
				<Input type="password" />
			</FormItem>
			<FormItem label="新密码" name="password" rules={[{required: true}]}>
				<Input type="password" />
			</FormItem>
			<FormItem label="确认密码" name="password2" rules={[
				{
					required: true,
					message: "请输入确认密码"
				},
				({ getFieldValue }) => ({
					validator(rule, value) {
						if (!value || getFieldValue('password') === value) {
							return Promise.resolve()
						}
						return Promise.reject('两次输入密码不相同');
					}
				})]}>
				<Input type="password" />
			</FormItem>
		</Form>
	</Modal>
}

function mobileModal({ mobileVisible, setMobileVisible, fetchDetail }) {
	let [form] = Form.useForm();
	let [value, setValue] = useState("发送验证码");
	function onOk() {
		form.validateFields()
			.then(values => {
				lib.request({
					url: "/ucenter-account/current/updateMobile",
					data: {
						mobile: values.mobile,
						password: values.password,
						code: values.code
					},
      		needMask: true,
					success: res => {
						setMobileVisible(false);
						fetchDetail();
						form.resetFields();
					}
				})
			})
	}

	useEffect(() => {
		let t = setInterval(() => {
			if (value === 0) {
				setValue("发送验证码")
			} else if (value !== "发送验证码") {
				setValue(--value)
			}
		}, 1000)
		return () => clearInterval(t)
	}, [value])

	function sendCode() {
		if (value !== "发送验证码") return;
		if (form.getFieldValue("mobile")) {
			lib.request({
				url: "/ucenter-account/sms/send",
				data: {
					mobile: form.getFieldValue("mobile"),
					type: "EDIT_MOBILE"
				},
      	needMask: true,
				success: res => {
					setValue(60)
				}
			})
		} else {
			message.warning("请输入新手机号")
		}
	}

	return <Modal
		title="修改手机号"
		visible={mobileVisible}
		getContainer={false}
		onOk={() => onOk()}
		onCancel={() => {
			form.resetFields();
			setMobileVisible(false)}}
	>
		<Form form={form} {...FormLayout}>
			<FormItem label="请输入密码" name="password"  rules={[{required: true}]}>
				<Input type="password" />
			</FormItem>
			<FormItem label="新手机号" name="mobile"  rules={[{required: true}]}>
				<Row>
					<Col span={16}>
						<Input />
					</Col>
					<Col span={8}>
						<Button style={{width: "100%"}} onClick={() => sendCode()}>{value}</Button>
					</Col>
				</Row>
			</FormItem>
			<FormItem label="验证码" name="code"  rules={[{required: true}]}>
				<Input />
			</FormItem>

		</Form>
	</Modal>
}

function emailModal({ emailVisible, setEmailVisible, fetchDetail }) {
	let [form] = Form.useForm();
	let [value, setValue] = useState("发送验证码");

	function onOk() {
		form.validateFields()
			.then(values => {
				lib.request({
					url: "/ucenter-account/current/updateEmail",
					data: {
						email: values.email,
						password: values.password,
						code: values.code
					},
      		needMask: true,
					success: res => {
						setEmailVisible(false);
						fetchDetail();
						form.resetFields();
					}
				})
			})
	}

	useEffect(() => {
		let t = setInterval(() => {
			if (value === 0) {
				setValue("发送验证码")
			} else if (value !== "发送验证码") {
				setValue(--value)
			}
		}, 1000)
		return () => clearInterval(t)
	}, [value])

	function sendCode() {
		if (value !== "发送验证码") return;
		if (form.getFieldValue("email")) {
			lib.request({
				url: "/ucenter-account/email/send",
				data: {
					email: form.getFieldValue("email"),
					type: "EDIT_EMAIL"
				},
      	needMask: true,
				success: res => {
					setValue(60)
				}
			})
		} else {
			message.warning("请输入新电子邮箱")
		}
	}

	return <Modal
		title="修改电子邮箱"
		visible={emailVisible}
		getContainer={false}
		onOk={() => onOk()}
		onCancel={() => {
			form.resetFields();
			setEmailVisible(false);
		}}
	>
		<Form form={form} {...FormLayout}>
			<FormItem label="请输入密码" name="password"  rules={[{required: true}]}>
				<Input type="password" />
			</FormItem>
			<FormItem label="新电子邮箱" name="email"  rules={[{required: true}]}>
				<Row>
					<Col span={16}>
						<Input />
					</Col>
					<Col span={8}>
						<Button style={{width: "100%"}} onClick={() => sendCode()}>{value}</Button>
					</Col>
				</Row>
			</FormItem>
			<FormItem label="验证码" name="code"  rules={[{required: true}]}>
				<Input />
			</FormItem>
		</Form>
	</Modal>
}

export default PersonalCenter