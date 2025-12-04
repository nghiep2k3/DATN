import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./Login.css";
import { url, url_api } from "../../config";

export default function Login() {
    const [forgotMode, setForgotMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resetStage, setResetStage] = useState(false);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (values) => {
        try {
            setLoading(true);
            const res = await axios.post(`${url_api}/api/login.php`, values, {
                headers: { "Content-Type": "application/json" },
            });

            if (!res.data.error) {
                message.success(res.data.message || "Đăng nhập thành công");

                Cookies.set("loggedIn", true, { expires: 7 }); // lưu 7 ngày
                Cookies.set("user", JSON.stringify(res.data.user), { expires: 7 });
                Cookies.set("name", res.data.user.name, { expires: 7 });
                Cookies.set("user_id", res.data.user.id, { expires: 7 });

                navigate("/");
            } else {
                message.error(res.data.message || "Sai email hoặc mật khẩu");
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            message.error("Không thể kết nối đến máy chủ");
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
                message.success(res.data.message || "Đã gửi mã khôi phục tới email của bạn");
                setEmail(values.email);   // lưu email để dùng bước tiếp theo
                setResetStage(true);      // hiển thị form nhập mã + mật khẩu mới
            } else {
                message.error(res.data.message || "Không thể gửi mã khôi phục");
            }
        } catch (error) {
            console.error("Lỗi gửi yêu cầu khôi phục:", error);
            message.error("Không thể kết nối tới máy chủ");
        } finally {
            setLoading(false);
        }
    };
    const handleResetPassword = async (values) => {
        try {
            setLoading(true);
            const payload = {
                email: email, // dùng email đã nhập ở bước trước
                code: values.code,
                new_password: values.new_password,
            };

            const res = await axios.post(`${url_api}/api/reset_password.php`, payload, {
                headers: { "Content-Type": "application/json" },
            });

            if (!res.data.error) {
                message.success(res.data.message || "Đặt lại mật khẩu thành công");
                setResetStage(false);
                setForgotMode(false);
            } else {
                message.error(res.data.message || "Không thể đặt lại mật khẩu");
            }
        } catch (error) {
            console.error("Lỗi đặt lại mật khẩu:", error);
            message.error("Không thể kết nối đến máy chủ");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="auth-container" style={{background: "url('/bg.jpg') no-repeat center center/cover"}}>
            <div className="auth-box">
                {/* Bên trái */}
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
                        // ==== ĐĂNG NHẬP ====
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
                        // ==== BƯỚC 1: GỬI EMAIL ====
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
                        // ==== BƯỚC 2: NHẬP MÃ + MẬT KHẨU MỚI ====
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
