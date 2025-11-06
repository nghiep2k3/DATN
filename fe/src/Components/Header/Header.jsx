import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Col, Input, Button, Flex, Dropdown, Menu } from "antd";
import Cookies from "js-cookie";
import styles from "./Header.module.css";
import { url } from "../../config";
import {
    RightOutlined,
    LoginOutlined,
    UserAddOutlined,
    UserOutlined,
    LogoutOutlined,
} from "@ant-design/icons";

const { Search } = Input;

export default function Header() {
    const [isSticky, setIsSticky] = useState(false);
    const [userName, setUserName] = useState(null);
    const [showDropdown, setShowDropdown] = useState(true);
    const categories = [
        {
            id: 20,
            category: "Thiết bị đo cơ khí chính xác",
            url_image: "upload/20251104_173842_efbe9e0479bb.webp",
            sub_category: [
                {
                    id: 29,
                    name: "Thước kẹp",
                    description: "Thước kẹp",
                    url_image: "upload/20251013_095137_e588d591906d.webp",
                    created_at: "2025-10-13 14:51:37",
                },
                {
                    id: 30,
                    name: "Thước panme",
                    description: "Thước panme",
                    url_image: "upload/20251013_095225_ad4dec6fb1a8.webp",
                    created_at: "2025-10-13 14:52:25",
                },
                {
                    id: 31,
                    name: "Thước đo lỗ",
                    description: "Thước đo lỗ",
                    url_image: "upload/20251013_095333_80328e57b383.webp",
                    created_at: "2025-10-13 14:53:33",
                },
                {
                    id: 32,
                    name: "Đồng hồ so",
                    description: "Đồng hồ so",
                    url_image: "upload/20251013_095345_7b87e86654ac.webp",
                    created_at: "2025-10-13 14:53:45",
                },
                {
                    id: 29,
                    name: "Thước kẹp",
                    description: "Thước kẹp",
                    url_image: "upload/20251013_095137_e588d591906d.webp",
                    created_at: "2025-10-13 14:51:37",
                },
                {
                    id: 30,
                    name: "Thước panme",
                    description: "Thước panme",
                    url_image: "upload/20251013_095225_ad4dec6fb1a8.webp",
                    created_at: "2025-10-13 14:52:25",
                },
                {
                    id: 31,
                    name: "Thước đo lỗ",
                    description: "Thước đo lỗ",
                    url_image: "upload/20251013_095333_80328e57b383.webp",
                    created_at: "2025-10-13 14:53:33",
                },
                {
                    id: 32,
                    name: "Đồng hồ so",
                    description: "Đồng hồ so",
                    url_image: "upload/20251013_095345_7b87e86654ac.webp",
                    created_at: "2025-10-13 14:53:45",
                },
            ],
        },
        {
            id: 21,
            category: "Thiết bị đo điện",
            url_image: "upload/20251104_174031_992faf418067.webp",
            sub_category: [
                {
                    id: 29,
                    name: "Thước kẹp",
                    description: "Thước kẹp",
                    url_image: "upload/20251013_095137_e588d591906d.webp",
                    created_at: "2025-10-13 14:51:37",
                },
                {
                    id: 30,
                    name: "Thước panme",
                    description: "Thước panme",
                    url_image: "upload/20251013_095225_ad4dec6fb1a8.webp",
                    created_at: "2025-10-13 14:52:25",
                },
                {
                    id: 31,
                    name: "Thước đo lỗ",
                    description: "Thước đo lỗ",
                    url_image: "upload/20251013_095333_80328e57b383.webp",
                    created_at: "2025-10-13 14:53:33",
                },
                {
                    id: 32,
                    name: "Đồng hồ so",
                    description: "Đồng hồ so",
                    url_image: "upload/20251013_095345_7b87e86654ac.webp",
                    created_at: "2025-10-13 14:53:45",
                },
                {
                    id: 29,
                    name: "Thước kẹp",
                    description: "Thước kẹp",
                    url_image: "upload/20251013_095137_e588d591906d.webp",
                    created_at: "2025-10-13 14:51:37",
                },
                {
                    id: 30,
                    name: "Thước panme",
                    description: "Thước panme",
                    url_image: "upload/20251013_095225_ad4dec6fb1a8.webp",
                    created_at: "2025-10-13 14:52:25",
                },
                {
                    id: 31,
                    name: "Thước đo lỗ",
                    description: "Thước đo lỗ",
                    url_image: "upload/20251013_095333_80328e57b383.webp",
                    created_at: "2025-10-13 14:53:33",
                },
                {
                    id: 32,
                    name: "Đồng hồ so",
                    description: "Đồng hồ so",
                    url_image: "upload/20251013_095345_7b87e86654ac.webp",
                    created_at: "2025-10-13 14:53:45",
                },
            ],
        },
        {
            id: 33,
            category: "Thiết bị quan trắc môi trường",
            url_image: "upload/20251104_174059_072a9f1f456e.webp",
            sub_category: [],
        },
        {
            id: 34,
            category: "Thiết bị kiểm tra không phá hủy - NDT",
            url_image: "upload/20251104_174223_a1edde3f1788.webp",
            sub_category: [],
        },
        {
            id: 35,
            category: "Thiết bị đo tần số, vô tuyến điện tử",
            url_image: "upload/20251104_174254_639d20e8da96.webp",
            sub_category: [],
        },
        {
            id: 36,
            category: "Thiết bị dùng nước",
            url_image: "upload/20251104_174425_ec109c27ee08.jpg",
            sub_category: [],
        },
    ];

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
                        <div
                            className={styles.categoryMenu}
                            onMouseEnter={() => setShowDropdown(true)}
                            onMouseLeave={() => setShowDropdown(false)}
                        >
                            <Link to="/category" className={`${styles.categoryLink} text-white`}>
                                <span className={`${styles.menuIcon}`}>☰</span> DANH MỤC SẢN PHẨM ▾
                            </Link>

                            {showDropdown && (
                                <div className={styles.dropdownMenu}>
                                    {categories.map((cat) => (
                                        <div key={cat.id} className={styles.dropdownItem}>
                                            <span>
                                                {cat.category}
                                                {cat.sub_category.length > 0 && (
                                                    <RightOutlined className={styles.arrowIcon} />
                                                )}
                                            </span>

                                            {cat.sub_category.length > 0 && (
                                                <div className={styles.subMenu}>
                                                    {cat.sub_category.map((sub) => (
                                                        <Link
                                                            key={sub.id}
                                                            to={`/subcategory/${sub.id}`}
                                                            className={styles.subMenuLink}
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div><Link to="/brand" className={`${styles.categoryLink}`}>HÃNG SẢN XUẤT ▾</Link></div>
                        <div><Link to="/about" className={`${styles.categoryLink}`}>GIỚI THIỆU</Link></div>
                        <div><Link to="/faq" className={`${styles.categoryLink}`}>CÂU HỎI THƯỜNG GẶP</Link></div>
                        <div><Link to="/contact" className={`${styles.categoryLink}`}>LIÊN HỆ</Link></div>
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
