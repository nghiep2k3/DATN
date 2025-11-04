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
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const res = await axios.post(`${url_api}/api/login.php`, values, {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.data.error) {
        message.success(res.data.message || "Đăng nhập thành công");

        // Lưu trạng thái đăng nhập (hoặc thông tin user) vào cookie
        Cookies.set("loggedIn", true, { expires: 7 }); // lưu 7 ngày
        Cookies.set("user", JSON.stringify(res.data.user), { expires: 7 });
        Cookies.set("name", res.data.user.name, { expires: 7 });

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
    console.log("Forgot Password Email:", values);
    message.info("Chức năng quên mật khẩu đang được phát triển.");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* Bên trái */}
        <div className="auth-left">
          <img src={`${url}/logo.png`} alt="Logo" className="auth-logo" />
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
          ) : (
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
                  <Button type="primary" htmlType="submit" block>
                    Gửi
                  </Button>
                </Form.Item>

                <Button type="link" onClick={() => setForgotMode(false)}>
                  Quay lại đăng nhập
                </Button>
              </Form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
