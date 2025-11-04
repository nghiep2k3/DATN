import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Col, Input, Button, Flex, Dropdown, Menu } from "antd";
import Cookies from "js-cookie";
import styles from "./Header.module.css";
import { url } from "../../config";
import {
    AudioOutlined,
    LoginOutlined,
    UserAddOutlined,
    UserOutlined,
    LogoutOutlined,
} from "@ant-design/icons";

const { Search } = Input;

export default function Header() {
    const [isSticky, setIsSticky] = useState(false);
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        const name = Cookies.get("name");
        if (name) setUserName(name);
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsSticky(window.scrollY > 90);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const onSearch = (value) => {
        console.log("Search:", value);
    };

    // Xử lý đăng xuất
    const handleLogout = () => {
        Cookies.remove("loggedIn");
        Cookies.remove("user");
        Cookies.remove("name");
        setUserName(null);
        window.location.href = "/"; // reload về trang chủ
    };

    // Menu thả xuống khi đã đăng nhập
    const menu = (
        <Menu>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                <Link to="/profile">Thông tin cá nhân</Link>
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    return (
        <header>
            {/* Section 1 */}
            <Flex className={styles.topBar} justify="center" align={"center"}>
                <Flex className={styles.topBar_content} justify="space-between" align={"center"}>
                    <Flex align={"center"} gap={20}>
                        <Col >
                            <div className={styles.logo}>
                                <a href="/"><img src={`${url}/logo.png`} alt="Logo" /></a>
                            </div>
                        </Col>

                        <Col style={{ width: 400 }}>
                            <div className={styles.searchBox}>
                                <Search
                                    className="custom_search"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    allowClear
                                    onSearch={onSearch}
                                    size="large"
                                    enterButton={
                                        <Button
                                            type="primary"
                                            style={{ backgroundColor: "#00796B", borderColor: "#00796B" }}
                                        >
                                            Search
                                        </Button>
                                    }
                                />
                            </div>
                        </Col>
                    </Flex>

                    {/* Nếu đã đăng nhập -> Hiển thị tên user */}
                    <Col>
                        {userName ? (
                            <Dropdown overlay={menu} placement="bottomRight" arrow>
                                <Button
                                    size="large"
                                    icon={<UserOutlined />}
                                    style={{
                                        color: "black",
                                        borderColor: "#00796B",
                                        fontWeight: "500",
                                    }}
                                >
                                    {userName}
                                </Button>
                            </Dropdown>
                        ) : (
                            <div className={styles.authButtons}>
                                <Button
                                    href="/login"
                                    icon={<LoginOutlined />}
                                    size="large"
                                    style={{
                                        marginRight: "10px",
                                        borderColor: "#00796B",
                                        color: "#00796B",
                                    }}
                                >
                                    Đăng nhập
                                </Button>

                                <Button
                                    href="/register"
                                    type="primary"
                                    size="large"
                                    icon={<UserAddOutlined />}
                                    style={{
                                        backgroundColor: "#ff6600",
                                        borderColor: "#ff6600",
                                    }}
                                >
                                    Đăng ký
                                </Button>
                            </div>
                        )}
                    </Col>
                </Flex>
            </Flex>

            {/* Section 2 - Categories */}
            <nav className={`${styles.nav} ${isSticky ? styles.sticky : ""}`}>
                <div className={styles.navContent}>
                    <div className={styles.menu}>
                        <div className={styles.categoryMenu}>
                            <Link to="#">
                                <span className={styles.menuIcon}>☰</span> DANH MỤC SẢN PHẨM ▾
                            </Link>
                        </div>
                        <div><Link to="/brand">HÃNG SẢN XUẤT ▾</Link></div>
                        <div><Link to="/about">GIỚI THIỆU</Link></div>
                        <div><Link to="/faq">CÂU HỎI THƯỜNG GẶP</Link></div>
                        <div><Link to="/contact">LIÊN HỆ</Link></div>
                    </div>

                    <div className={styles.cartBtn}>
                        <Button
                            type="primary"
                            size="large"
                            style={{ backgroundColor: "#ff6600", borderColor: "#ff6600" }}
                        >
                            GIỎ HÀNG / 0 ₫ 🛒
                        </Button>
                    </div>
                </div>
            </nav>
        </header>
    );
}
