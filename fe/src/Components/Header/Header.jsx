import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Input, Button, Flex } from "antd";
import styles from "./Header.module.css";
import url from "../../config";
import {
    AudioOutlined,
    LoginOutlined,
    UserAddOutlined
} from '@ant-design/icons';

const { Search } = Input;

export default function Header() {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 90) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const onSearch = (value) => {
        console.log("Search:", value);
    };


    return (
        <header>
            {/* Section 1 */}
            <Flex className={styles.topBar} justify="center" align={"center"}>

                <Flex className={styles.topBar_content} justify="space-between" align={"center"}>
                    <Flex align={"center"} gap={20}>
                        <Col>
                            <div className={styles.logo}>
                                <img src={`${url}/logo.png`} alt="Logo" />
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
                                    enterButton={<Button type="primary" style={{ backgroundColor: "#00796B", borderColor: "#00796B" }}>Search</Button>}
                                />
                            </div>
                        </Col>
                    </Flex>


                    <Col>
                        <div className={styles.authButtons}>
                            <Button
                                href="/login"
                                icon={<LoginOutlined />}
                                size="large"
                                style={{
                                    marginRight: "10px",
                                    borderColor: "#00796B",
                                    color: "#00796B"
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
                                    borderColor: "#ff6600"
                                }}
                            >
                                Đăng ký
                            </Button>
                        </div>
                    </Col>
                </Flex>

            </Flex>

            {/* Section 2 - Categories */}
            <nav className={`${styles.nav} ${isSticky ? styles.sticky : ""}`}>
                <div className={styles.navContent}>
                    <div className={styles.menu}>
                        {/* Danh mục sản phẩm */}
                        <div className={styles.categoryMenu}>
                            <Link to="#">
                                <span className={styles.menuIcon}>☰</span> DANH MỤC SẢN PHẨM ▾
                            </Link>
                        </div>

                        {/* Các menu khác */}
                        <div><Link to="/brand">HÃNG SẢN XUẤT ▾</Link></div>
                        <div><Link to="/about">GIỚI THIỆU</Link></div>
                        <div><Link to="/faq">CÂU HỎI THƯỜNG GẶP</Link></div>
                        <div><Link to="/contact">LIÊN HỆ</Link></div>
                    </div>

                    {/* Nút giỏ hàng */}
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


        </header >
    );
}
