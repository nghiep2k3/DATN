import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./Login.css";
import { url, url_api } from "../../config";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    // Kiểm tra nếu đã đăng nhập thì redirect về home
    useEffect(() => {
        const isLoggedIn = Cookies.get('loggedIn') === 'true';
        const user = Cookies.get('user');
        if (isLoggedIn && user) {
            navigate('/', { replace: true });
        }
    }, [navigate]);

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

                // Lưu trạng thái đăng nhập và thông tin user vào cookie
                Cookies.set("loggedIn", "true", { expires: 7 }); // lưu 7 ngày
                Cookies.set("user", JSON.stringify(res.data.user), { expires: 7 });
                Cookies.set("name", res.data.user.name, { expires: 7 });
                Cookies.set("user_id", res.data.user.id, { expires: 7 });
                Cookies.set("user_role", res.data.user.role, { expires: 7 });

                // Chuyển hướng đến trang Home
                navigate("/", { replace: true });
            } else {
                // Đăng nhập thất bại - hiển thị thông báo lỗi
                messageApi.error({
                    content: "Sai tài khoản hoặc mật khẩu",
                    duration: 3,
                });
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            // Kiểm tra nếu là lỗi từ server (có response)
            if (error.response && error.response.data && error.response.data.error) {
                messageApi.error({
                    content: "Sai tài khoản hoặc mật khẩu",
                    duration: 3,
                });
            } else {
                // Lỗi kết nối
                messageApi.error({
                    content: "Không thể kết nối đến máy chủ",
                    duration: 3,
                });
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            {contextHolder}
            <div className="auth-container">
                <div className="auth-box">
                {/* Bên trái */}
                <div className="auth-left">
                    <img src={`${url_api}/upload/logo.png`} alt="Logo" className="auth-logo" />
                    <h2 className="auth-slogan">
                        GIẢI PHÁP THIẾT BỊ ĐO LƯỜNG <br /> VÀ CƠ KHÍ CHÍNH XÁC
                    </h2>
                </div>

                {/* Bên phải */}
                <div className="auth-right">
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
                </div>
            </div>
        </div>
        </>
    );
}
