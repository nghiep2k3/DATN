import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Row, Col, Empty, Typography, message } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { url } from "../../config";
import { useCart } from "../../Context/CartContext";
import "./SearchPage.css";

const { Title, Text } = Typography;

export default function SearchPage() {
    const [results, setResults] = useState([]);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("q");
    const { addToCart } = useCart();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const stored = localStorage.getItem("searchResults");
        if (stored) {
            try {
                setResults(JSON.parse(stored));
            } catch (e) {
                console.error("Lỗi parse search results:", e);
            }
        }
    }, [location.search]);

    // Helper function để lấy URL ảnh (đảm bảo có 3 dấu ///)
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

    // Helper function để format giá
    const formatPrice = (price) => {
        const priceNum = Number(price);
        if (priceNum === 0 || isNaN(priceNum)) {
            return "Liên hệ";
        }
        return `${priceNum.toLocaleString("vi-VN")} đ`;
    };

    // Xử lý thêm vào giỏ hàng
    const handleAddToCart = async (item) => {
        try {
            await addToCart(item, 1);
            messageApi.success({ content: `Đã thêm "${item.name}" vào giỏ hàng!`, duration: 2 });
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
        }
    };

    return (
        <div className="search-page-container">
            {contextHolder}
            <div className="search-page-content">
                {/* Header Section */}
                <div className="search-header">
                    <Title level={2} className="search-title">
                        Kết quả tìm kiếm cho: <Text strong className="search-query">{query}</Text>
                    </Title>
                    {results.length > 0 && (
                        <Text type="secondary" className="search-count">
                            Tìm thấy {results.length} {results.length === 1 ? 'sản phẩm' : 'sản phẩm'}
                        </Text>
                    )}
                </div>

                {/* Products Grid */}
                {results.length > 0 ? (
                    <Row gutter={[16, 16]} className="search-results-grid">
                        {results.map((item) => (
                            <Col key={item.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                                <div className="px-2 my-1 position-relative">
                                    <Link 
                                        to={`/chi-tiet-san-pham/${item.id}`} 
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div className="card-product border rounded-4 bg-white shadow-sm p-3 position-relative d-flex flex-column">
                                            {/* Khối thông tin (title + model) */}
                                            <div className="info-block mb-2 flex-grow-1">
                                                <div className="text-center mb-2">
                                                    <img
                                                        src={getImageUrl(item)}
                                                        alt={item.name}
                                                        className="rounded-3"
                                                        style={{
                                                            width: "100%",
                                                            height: "150px",
                                                            objectFit: "contain",
                                                        }}
                                                        onError={(e) => {
                                                            e.target.src = `${url}/upload/no-image.png`;
                                                        }}
                                                    />
                                                </div>
                                                <h6 className="fw-bold text-dark text-truncate-2 mb-1">{item.name}</h6>
                                                {item.sku && (
                                                    <p className="text-secondary mb-0">
                                                        <strong>Model:</strong> {item.sku}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Giá hoặc Liên hệ */}
                                            <div className="price-block">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <p
                                                        className={`fw-semibold mb-0 ${item.price && Number(item.price) > 0
                                                            ? "text-primary"
                                                            : "text-primary fw-semibold"
                                                            }`}
                                                    >
                                                        {formatPrice(item.price)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                    <span
                                        className="cart-icon-wrapper position-absolute bottom-0 end-0 mb-3 me-4 p-2 bg-white rounded-circle shadow-sm"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleAddToCart(item);
                                        }}
                                        style={{ cursor: "pointer", zIndex: 20 }}
                                    >
                                        <ShoppingCartOutlined className="cart-icon" />
                                    </span>
                                </div>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <div className="search-empty">
                        <Empty 
                            description={
                                <span style={{ fontSize: 16 }}>
                                    Không tìm thấy sản phẩm nào phù hợp với từ khóa "<strong>{query}</strong>"
                                </span>
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
