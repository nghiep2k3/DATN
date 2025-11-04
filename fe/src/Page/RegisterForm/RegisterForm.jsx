import React, { useState } from "react";
import { Form, Input, Button, Modal, message } from "antd";
import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    PhoneOutlined,
    SafetyOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";
import "./RegisterForm.css";
import { url, url_api } from "../../config";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterForm() {
    const [form] = Form.useForm();
    const [verifyVisible, setVerifyVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [verifyCode, setVerifyCode] = useState("");
    const navigate = useNavigate();

    // ✅ Gửi thông tin đăng ký
    const handleFinish = async (values) => {
        setLoading(true);
        try {
            const res = await axios.post(`${url_api}/api/register.php`, values, {
                headers: { "Content-Type": "application/json" },
            });

            if (!res.data.error) {
                message.success("Đăng ký thành công, vui lòng nhập mã xác minh!");
                setEmail(values.email);
                setVerifyVisible(true); // mở popup nhập mã
            } else {
                message.error(res.data.message || "Đăng ký thất bại");
            }
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            message.error("Không thể kết nối đến máy chủ");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Gửi mã xác minh
    const handleVerify = async () => {
        if (!verifyCode) {
            message.warning("Vui lòng nhập mã xác minh!");
            return;
        }
        try {
            const res = await axios.post(`${url_api}/api/verify_account.php`, {
                email,
                code: verifyCode,
            });

            if (!res.data.error) {
                message.success("Xác minh thành công! Tài khoản đã được kích hoạt.");

                // ✅ Lưu thông tin đăng nhập
                Cookies.set("loggedIn", true, { expires: 7 });
                Cookies.set("user", JSON.stringify(res.data.user), { expires: 7 });

                setVerifyVisible(false);
                navigate("/login"); // chuyển về trang đăng nhập
            } else {
                message.error(res.data.message || "Mã xác minh không hợp lệ");
            }
        } catch (error) {
            console.error("Lỗi xác minh:", error);
            message.error("Không thể kết nối đến máy chủ");
        }
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
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined />}
                                placeholder="Nhập mật khẩu"
                            />
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
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined />}
                                placeholder="Nhập lại mật khẩu"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="register-btn"
                                block
                                loading={loading}
                            >
                                Đăng ký
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>

            {/* ✅ Modal xác minh tài khoản */}
            <Modal
                title="Xác minh tài khoản"
                open={verifyVisible}
                onCancel={() => setVerifyVisible(false)}
                footer={null}
                centered
            >
                <p>Vui lòng nhập mã gồm 6 số được gửi đến email: <b>{email}</b></p>
                <Input
                    prefix={<SafetyOutlined />}
                    placeholder="Nhập mã xác minh"
                    maxLength={6}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    style={{ textAlign: "center", fontSize: "18px", letterSpacing: "5px" }}
                />
                <Button
                    type="primary"
                    onClick={handleVerify}
                    block
                    style={{ marginTop: 20 }}
                >
                    Xác minh
                </Button>
            </Modal>
        </div>
    );
}
