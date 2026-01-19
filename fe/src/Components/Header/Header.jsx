import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Col, Input, Button, Flex, Dropdown, Menu, Drawer, Badge, List, Avatar, message } from "antd";
import Cookies from "js-cookie";
import styles from "./Header.module.css";
import { url, url_api } from "../../config";
import {
    RightOutlined,
    LoginOutlined,
    UserAddOutlined,
    UserOutlined,
    LogoutOutlined,
} from "@ant-design/icons";

import { useCart } from "../../Context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Search } = Input;

export default function Header() {
    const navigate = useNavigate();
    const [isSticky, setIsSticky] = useState(false);
    const [userName, setUserName] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const { cartItems, totalQuantity, removeFromCart, updateQuantity } = useCart();
    const showDrawer = () => setOpen(true);
    const onClose = () => setOpen(false);

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
                }
            ],
        },
        {
            id: 21,
            category: "Thiết bị đo điện",
            url_image: "upload/20251104_174031_992faf418067.webp",
            sub_category: [
                
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
        {
            id: 37,
            category: "Thiết bị nâng hạ",
            url_image: "upload/20251104_174425_ec109c27ee08.jpg",
            sub_category: [],
        },
    ];

    useEffect(() => {
        const name = Cookies.get("name");
        if (name) setUserName(name);
        
        loadAllProducts();
    }, []);

    const loadAllProducts = async () => {
        try {
            const res = await axios.get(`${url_api}/api/product/get_all_products.php`);
            if (!res.data.error && res.data.products) {
                setAllProducts(res.data.products);
            }
        } catch (err) {
            console.error("Lỗi khi load sản phẩm:", err);
        }
    };

    useEffect(() => {
        const handleScroll = () => setIsSticky(window.scrollY > 90);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        
        if (value.trim().length > 0) {
            const keyword = value.trim().toLowerCase();
            const results = allProducts.filter((p) =>
                p.name.toLowerCase().includes(keyword)
            ).slice(0, 5); 
            
            setSearchResults(results);
            setShowSearchResults(results.length > 0);
        } else {
            setSearchResults([]);
            setShowSearchResults(false);
        }
    };

    const onSearch = (value) => {
        const keyword = value.trim().toLowerCase();
        if (!keyword) {
            messageApi.warning({ content: "Vui lòng nhập từ khóa tìm kiếm!", duration: 3 });
            return;
        }

        const results = allProducts.filter((p) =>
            p.name.toLowerCase().includes(keyword)
        );

        if (results.length > 0) {
            localStorage.setItem("searchResults", JSON.stringify(results));
            navigate(`/search?q=${encodeURIComponent(value)}`);
            setShowSearchResults(false);
        } else {
            messageApi.info({ content: "Không tìm thấy sản phẩm nào phù hợp.", duration: 3 });
        }
    };

    const getImageUrl = (item) => {
        let imgPath = null;
        if (item.images && item.images.length > 0) {
            imgPath = item.images[0];
        } else if (item.image_url) {
            imgPath = item.image_url;
        }
        
        if (imgPath) {
            const cleanPath = imgPath.startsWith('/') ? imgPath.substring(1) : imgPath;
            return `${url}/${cleanPath}`;
        }
        return `${url}/upload/no-image.png`;
    };

    const formatPrice = (price) => {
        const priceNum = Number(price);
        if (priceNum === 0 || isNaN(priceNum)) {
            return "Liên hệ";
        }
        return `${priceNum.toLocaleString("vi-VN")} đ`;
    };


    const handleLogout = () => {
        Cookies.remove("loggedIn");
        Cookies.remove("user");
        Cookies.remove("name");
        Cookies.remove("temp_phone");
        Cookies.remove("user_id");
        setUserName(null);
        localStorage.removeItem("cartItems");
        window.location.href = "/"; 
    };

    const menu = (
        <Menu>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                <Link to="/profile">Thông tin cá nhân</Link>
            </Menu.Item>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                <Link to="/yeu-cau-bao-gia-cua-toi">Yêu cầu báo giá của tôi</Link>
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    return (
        <header>
            {contextHolder}
            <Flex className={styles.topBar} justify="center" align={"center"}>
                <Flex className={styles.topBar_content} justify="space-between" align={"center"}>
                    <Flex align={"center"} gap={20}>
                        <Col >
                            <div className={styles.logo}>
                                <a href="/"><img src={`${url}/upload/logo.png`} alt="Logo" /></a>
                            </div>
                        </Col>

                        <Col style={{ width: 500, position: "relative" }}>
                            <div className={styles.searchBox} style={{ position: "relative" }}>
                                <Search
                                    className="custom_search"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    allowClear
                                    value={searchValue}
                                    onChange={handleSearchChange}
                                    onSearch={onSearch}
                                    onFocus={() => {
                                        if (searchResults.length > 0) {
                                            setShowSearchResults(true);
                                        }
                                    }}
                                    onBlur={() => {
                                        setTimeout(() => setShowSearchResults(false), 200);
                                    }}
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
                                
                                {showSearchResults && searchResults.length > 0 && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "100%",
                                            left: 0,
                                            right: 0,
                                            background: "#fff",
                                            border: "1px solid #ddd",
                                            borderRadius: "4px",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                            zIndex: 1000,
                                            maxHeight: "400px",
                                            overflowY: "auto",
                                            marginTop: "4px"
                                        }}
                                        onMouseDown={(e) => e.preventDefault()}
                                    >
                                        <div style={{ padding: "12px", borderBottom: "1px solid #f0f0f0" }}>
                                            <strong style={{ fontSize: "14px", color: "#333" }}>SẢN PHẨM</strong>
                                        </div>
                                        {searchResults.map((item) => (
                                            <Link
                                                key={item.id}
                                                to={`/chi-tiet-san-pham/${item.id}`}
                                                style={{
                                                    display: "flex",
                                                    padding: "12px",
                                                    textDecoration: "none",
                                                    color: "inherit",
                                                    borderBottom: "1px solid #f0f0f0",
                                                    transition: "background 0.2s"
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = "#f5f5f5";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = "#fff";
                                                }}
                                                onClick={() => {
                                                    setShowSearchResults(false);
                                                    setSearchValue("");
                                                }}
                                            >
                                                <img
                                                    src={getImageUrl(item)}
                                                    alt={item.name}
                                                    style={{
                                                        width: "60px",
                                                        height: "60px",
                                                        objectFit: "contain",
                                                        marginRight: "12px",
                                                        background: "#f5f5f5",
                                                        borderRadius: "4px",
                                                        padding: "4px"
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src = `${url}/upload/no-image.png`;
                                                    }}
                                                />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#007fc0",
                                                            fontWeight: 500,
                                                            marginBottom: "4px",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap"
                                                        }}
                                                    >
                                                        {item.name}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: "12px",
                                                            color: "#666"
                                                        }}
                                                    >
                                                        {formatPrice(item.price)}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                        {searchResults.length >= 5 && (
                                            <div
                                                style={{
                                                    padding: "12px",
                                                    textAlign: "center",
                                                    borderTop: "1px solid #f0f0f0",
                                                    background: "#fafafa"
                                                }}
                                            >
                                                <Link
                                                    to={`/search?q=${encodeURIComponent(searchValue)}`}
                                                    style={{
                                                        color: "#00796B",
                                                        textDecoration: "none",
                                                        fontSize: "13px",
                                                        fontWeight: 500
                                                    }}
                                                    onClick={() => {
                                                        localStorage.setItem("searchResults", JSON.stringify(
                                                            allProducts.filter((p) =>
                                                                p.name.toLowerCase().includes(searchValue.trim().toLowerCase())
                                                            )
                                                        ));
                                                        setShowSearchResults(false);
                                                    }}
                                                >
                                                    Xem tất cả kết quả →
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Flex>


                    <Flex align={"center"} gap={20}>
                        <Col>
                            <Button
                                size="large"
                                icon={<UserOutlined />}
                                style={{
                                    color: "#00796B",
                                    borderColor: "#FF9900",
                                    fontWeight: "700",
                                }}
                                href="/yeu-cau-bao-gia"
                            >
                                Yêu cầu báo giá
                            </Button>
                        </Col>

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

                                    </Button>
                                </div>
                            )}
                        </Col>
                    </Flex>

                </Flex>
            </Flex>

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
                                                <a href={`/category-child/${cat.id}`} style={{display: 'block', color: 'black'}}>{cat.category}</a>
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
                        <div><Link to="/cau-hoi-thuong-gap" className={`${styles.categoryLink}`}>CÂU HỎI THƯỜNG GẶP</Link></div>
                        <div><Link to="/contact" className={`${styles.categoryLink}`}>LIÊN HỆ</Link></div>
                    </div>

                    <div className={styles.cartBtn}>
                        <Badge count={totalQuantity} size="large" offset={[2, 8]}>
                            <Button
                                type="primary"
                                size="medium"
                                style={{ backgroundColor: "#ff6600", borderColor: "#ff6600" }}
                                onClick={showDrawer}
                            >
                                GIỎ HÀNG 🛒
                            </Button>
                        </Badge>

                        <Drawer
                            title="Giỏ hàng của bạn"
                            onClose={onClose}
                            open={open}
                            footer={
                                <div
                                    style={{
                                        borderTop: "1px solid #f0f0f0",
                                        padding: "12px 16px",
                                        background: "#fff",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        <strong>Tổng tiền:</strong>
                                        <span
                                            style={{
                                                fontWeight: "bold",
                                                color: "#ff6600",
                                                fontSize: "16px",
                                            }}
                                        >
                                            {cartItems.length > 0
                                                ? `${cartItems
                                                    .reduce(
                                                        (sum, item) => sum + (item.price ? item.price * item.quantity : 0),
                                                        0
                                                    )
                                                    .toLocaleString()}₫`
                                                : "0₫"}
                                        </span>
                                    </div>

                                    <Button
                                        type="primary"
                                        block
                                        size="large"
                                        style={{
                                            backgroundColor: "#ff6600",
                                            borderColor: "#ff6600",
                                            fontWeight: 600,
                                        }}
                                        onClick={() => navigate("/checkout")}
                                        disabled={cartItems.length === 0}
                                    >
                                        🧾 Thanh toán ngay
                                    </Button>
                                </div>
                            }
                        >
                            <List
                                dataSource={cartItems}
                                locale={{ emptyText: "Chưa có sản phẩm nào trong giỏ hàng" }}
                                renderItem={(item) => (
                                    <List.Item
                                        actions={[
                                            <a key="remove" onClick={() => removeFromCart(item.cart_id || item.id)}>
                                                Xóa
                                            </a>,
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar 
                                                    src={item.images && item.images.length > 0 ? `${url}${item.images[0]}` : item.image} 
                                                    shape="square" 
                                                />
                                            }
                                            title={<span style={{ fontWeight: 500 }}>{item.product_name || item.name}</span>}
                                            description={
                                                <>
                                                    {/* Nút tăng giảm */}
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: 6 }}>
                                                        <Button
                                                            size="small"
                                                            onClick={() => updateQuantity(item.cart_id || item.id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            -
                                                        </Button>

                                                        <span style={{ fontWeight: 600 }}>{item.quantity}</span>

                                                        <Button
                                                            size="small"
                                                            onClick={() => updateQuantity(item.cart_id || item.id, item.quantity + 1)}
                                                        >
                                                            +
                                                        </Button>
                                                    </div>

                                                    {/* Giá */}
                                                    <div>
                                                        Giá:{" "}
                                                        {item.price
                                                            ? `${Number(item.price).toLocaleString()}₫`
                                                            : "Liên hệ"}
                                                    </div>
                                                </>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </Drawer>


                    </div>
                </div>
            </nav>

        </header>
    );
}
