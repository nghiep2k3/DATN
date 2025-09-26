import React from "react";
import { Form, Input, Button, Select } from "antd";
import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    PhoneOutlined,
} from "@ant-design/icons";
import "./RegisterForm.css";
import url from "../../config";
import { Link } from "react-router-dom";

const { Option } = Select;

export default function RegisterForm() {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        console.log("Register Data:", values);
    };

    return (
        <div className="register-container">
            <div className="register-box">
                {/* Phần trái */}
                <div className="register-left">
                    <img src={`${url}/logo.svg`} alt="Logo" className="register-logo" />
                    <h2 className="slogan">
                        Giải pháp thiết bị đo lường <br /> và cơ khí chính xác
                    </h2>

                    <div className="left-actions">
                        <Link to="/">
                            <Button type="default" size="large" className="left-btn">
                                Về trang chủ
                            </Button>
                        </Link>

                        <Link to="/login">
                            <Button type="primary" size="large" className="left-btn">
                                Đến trang đăng nhập
                            </Button>
                        </Link>
                    </div>
                </div>


                {/* Phần phải */}
                <div className="register-right">
                    <h2 className="register-title">Đăng ký tài khoản</h2>
                    <Form form={form} name="register" layout="vertical" onFinish={handleFinish}>
                        <Form.Item
                            name="name"
                            label="Họ và tên"
                            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                        >
                            <Input size="large" prefix={<UserOutlined />} placeholder="Nhập họ tên" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: "Vui lòng nhập email" },
                                { type: "email", message: "Email không hợp lệ" },
                            ]}
                        >
                            <Input size="large" prefix={<MailOutlined />} placeholder="Nhập email" />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                                { required: true, message: "Vui lòng nhập số điện thoại" },
                                { pattern: /^[0-9]{9,11}$/, message: "Số điện thoại không hợp lệ" },
                            ]}
                        >
                            <Input size="large" prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                            hasFeedback
                        >
                            <Input.Password size="large" prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
                        </Form.Item>

                        <Form.Item
                            name="confirm_password"
                            label="Xác nhận mật khẩu"
                            dependencies={["password"]}
                            hasFeedback
                            rules={[
                                { required: true, message: "Vui lòng xác nhận mật khẩu" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password size="large" prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="register-btn" block>
                                Đăng ký
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
}
