import { Outlet, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    AppstoreOutlined,
    FileTextOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    HomeOutlined,
    DatabaseOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import Cookies from "js-cookie";

const { Header, Sider, Content } = Layout;

export default function App() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuItems = [
        {
            key: "/",
            icon: <HomeOutlined />,
            label: "Bảng điều khiển",
        },
        {
            key: "/product-dashboard",
            icon: <AppstoreOutlined />,
            label: "Sản phẩm",
        },
        {
            key: "/quote-requests",
            icon: <FileTextOutlined />,
            label: "Yêu cầu báo giá",
        },
        {
            key: "/cart-user",
            icon: <ShoppingCartOutlined />,
            label: "Giỏ hàng người dùng",
        },
        {
            key: "/orders",
            icon: <ShoppingCartOutlined />,
            label: "Đơn hàng",
        },
        {
            key: "/warehouse",
            icon: <DatabaseOutlined />,
            label: "Quản lý kho hàng",
        },
        {
            key: "/account",
            icon: <UserOutlined />,
            label: "Quản lý tài khoản",
        },
        {
            key: "/logout",
            icon: <LogoutOutlined />,
            label: "Đăng xuất",
            onClick: () => {
                Cookies.remove("loggedIn");
                Cookies.remove("user");
                Cookies.remove("name");
                navigate("/login");
            }
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={240}
                style={{ padding: 4 }}
                collapsedWidth={80}
            >
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={["/"]}
                    items={menuItems}
                    onClick={(e) => navigate(e.key)}
                />
            </Sider>

            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={
                            collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: "16px",
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>

                <Content
                    style={{
                        margin: "24px 16px",
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}
