import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./Login.css";
import { url_api } from "../../config";

export default function Login() {
    const [forgotMode, setForgotMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resetStage, setResetStage] = useState(false);
    const [email, setEmail] = useState("");
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const handleLogin = async (values) => {
        try {
            setLoading(true);
            const res = await axios.post(`${url_api}/api/login.php`, values, {
                headers: { "Content-Type": "application/json" },
            });

            if (!res.data.error) {
                messageApi.success({
                    content: res.data.message || "Đăng nhập thành công",
                    duration: 2,
                });

                Cookies.set("loggedIn", true, { expires: 7 }); // lưu 7 ngày
                Cookies.set("user", JSON.stringify(res.data.user), { expires: 7 });
                Cookies.set("name", res.data.user.name, { expires: 7 });
                Cookies.set("user_id", res.data.user.id, { expires: 7 });

                window.location.href = "/";
            } else {
                messageApi.error({ content: res.data.message || "Sai email hoặc mật khẩu", duration: 3 });
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            messageApi.error({ content: "Sai mật tài khoản hoặc mật khẩu", duration: 3 });
        } finally {
            setLoading(false);
        }
    };

    const handleForgot = async (values) => {
        try {
            setLoading(true);
            const res = await axios.post(`${url_api}/api/forget.php`, values, {
                headers: { "Content-Type": "application/json" },
            });

            if (!res.data.error) {
                messageApi.success({ content: res.data.message || "Đã gửi mã khôi phục tới email của bạn", duration: 2 });
                setEmail(values.email);   
                setResetStage(true);      
            } else {
                messageApi.error({ content: res.data.message || "Không thể gửi mã khôi phục", duration: 3 });
            }
        } catch (error) {
            console.error("Lỗi gửi yêu cầu khôi phục:", error);
            messageApi.error({ content: "Không thể kết nối tới máy chủ", duration: 3 });
        } finally {
            setLoading(false);
        }
    };
    const handleResetPassword = async (values) => {
        try {
            setLoading(true);
            const payload = {
                email: email, 
                code: values.code,
                new_password: values.new_password,
            };

            const res = await axios.post(`${url_api}/api/reset_password.php`, payload, {
                headers: { "Content-Type": "application/json" },
            });

            if (!res.data.error) {
                messageApi.success({ content: res.data.message || "Đặt lại mật khẩu thành công", duration: 2 });
                setResetStage(false);
                setForgotMode(false);
            } else {
                messageApi.error({ content: res.data.message || "Không thể đặt lại mật khẩu", duration: 3 });
            }
        } catch (error) {
            console.error("Lỗi đặt lại mật khẩu:", error);
            messageApi.error({ content: "Không thể kết nối đến máy chủ", duration: 3 });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="auth-container" style={{background: "url('/bg.jpg') no-repeat center center/cover"}}>
            {contextHolder}
            <div className="auth-box">
               
                <div className="auth-left">
                    <img src={`${url_api}/upload/logo.png`} alt="Logo" className="auth-logo" />
                    <h2 className="auth-slogan">
                        GIẢI PHÁP THIẾT BỊ ĐO LƯỜNG <br /> VÀ CƠ KHÍ CHÍNH XÁC
                    </h2>

                    <div className="auth-actions">
                        <Link to="/">
                            <Button className="auth-btn">Về trang chủ</Button>
                        </Link>
                        <Link to="/register">
                            <Button type="primary" className="auth-btn orange">
                                Đến trang đăng ký
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Bên phải */}
                <div className="auth-right">
                    {!forgotMode ? (
                       
                        <>
                            <h2 className="auth-title">Đăng nhập</h2>
                            <Form layout="vertical" onFinish={handleLogin}>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập email" },
                                        { type: "email", message: "Email không hợp lệ" },
                                    ]}
                                >
                                    <Input prefix={<MailOutlined />} placeholder="Nhập email" />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    label="Mật khẩu"
                                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder="Nhập mật khẩu"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        block
                                        loading={loading}
                                        className="login-btn"
                                    >
                                        Đăng nhập
                                    </Button>
                                </Form.Item>
                            </Form>

                            <div className="forgot-link">
                                <Button type="link" onClick={() => setForgotMode(true)}>
                                    Quên mật khẩu?
                                </Button>
                            </div>
                        </>
                    ) : !resetStage ? (
                        <>
                            <h2 className="auth-title">Quên mật khẩu</h2>
                            <Form layout="vertical" onFinish={handleForgot}>
                                <Form.Item
                                    name="email"
                                    label="Nhập email để đặt lại mật khẩu"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập email" },
                                        { type: "email", message: "Email không hợp lệ" },
                                    ]}
                                >
                                    <Input prefix={<MailOutlined />} placeholder="Nhập email" />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block loading={loading}>
                                        Gửi
                                    </Button>
                                </Form.Item>

                                <Button type="link" onClick={() => setForgotMode(false)}>
                                    Quay lại đăng nhập
                                </Button>
                            </Form>
                        </>
                    ) : (
                        <>
                            <h2 className="auth-title">Đặt lại mật khẩu</h2>
                            <Form layout="vertical" onFinish={handleResetPassword}>
                                <Form.Item
                                    name="code"
                                    label="Mã xác minh"
                                    rules={[{ required: true, message: "Vui lòng nhập mã xác minh" }]}
                                >
                                    <Input placeholder="Nhập mã 6 số được gửi qua email" />
                                </Form.Item>

                                <Form.Item
                                    name="new_password"
                                    label="Mật khẩu mới"
                                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
                                >
                                    <Input.Password placeholder="Nhập mật khẩu mới" />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block loading={loading}>
                                        Xác nhận đặt lại
                                    </Button>
                                </Form.Item>

                                <Button type="link" onClick={() => setResetStage(false)}>
                                    ← Quay lại
                                </Button>
                            </Form>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}
