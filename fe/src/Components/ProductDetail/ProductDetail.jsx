import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Image, Button, Divider, Typography, Card, InputNumber, Tag } from "antd";
import { PhoneOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import axios from "axios";
import { useCart } from "../../Context/CartContext";
import { url_api, url } from "../../config";

const { Title, Text } = Typography;

export default function ProductDetail() {
    const { addToCart } = useCart();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    // Ảnh đang được hiển thị lớn
    const [activeImage, setActiveImage] = useState(null);

    // Helper function để tạo đường dẫn ảnh đúng format (có 3 dấu ///)
    const getImageUrl = (imgPath) => {
        if (!imgPath) return '';
        // Loại bỏ dấu / ở đầu nếu có để tránh trùng
        const cleanPath = imgPath.startsWith('/') ? imgPath.substring(1) : imgPath;
        // url đã có dấu / ở cuối, thêm 1 dấu / nữa để có 3 dấu ///
        // Kết quả: http://localhost:8081/datn/be/ + / + upload/... = http://localhost:8081/datn/be///upload/...
        return `${url}/${cleanPath}`;
    };

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${url_api}/api/product/getproduct.php?id=${id}`)
            .then((res) => {
                if (!res.data.error) {
                    const data = res.data.product;
                    setProduct(data);

                    // Tạo danh sách ảnh không trùng lặp
                    const allImages = [];
                    if (data.image_url) {
                        allImages.push(data.image_url);
                    }
                    if (data.images && Array.isArray(data.images)) {
                        data.images.forEach((img) => {
                            if (img && !allImages.includes(img)) {
                                allImages.push(img);
                            }
                        });
                    }

                    // Gán ảnh mặc định (ảnh đầu tiên)
                    if (allImages.length > 0) {
                        setActiveImage(getImageUrl(allImages[0]));
                    }
                }
            })
            .catch((err) => {
                console.error("Lỗi khi tải sản phẩm:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div style={{ padding: 40, textAlign: "center" }}>
                <Text>Đang tải...</Text>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ padding: 40, textAlign: "center" }}>
                <Text type="danger">Không tìm thấy sản phẩm</Text>
            </div>
        );
    }

    // Tạo danh sách ảnh không trùng lặp
    const allImages = [];
    if (product.image_url) {
        allImages.push(product.image_url);
    }
    if (product.images && Array.isArray(product.images)) {
        product.images.forEach((img) => {
            if (img && !allImages.includes(img)) {
                allImages.push(img);
            }
        });
    }

    // Format description (chuyển \r\n thành <br/>)
    const formatDescription = (text) => {
        if (!text) return "Chưa có mô tả";
        return text.split(/\r?\n/).map((line, idx) => (
            <React.Fragment key={idx}>
                {line}
                {idx < text.split(/\r?\n/).length - 1 && <br />}
            </React.Fragment>
        ));
    };

    // Kiểm tra tình trạng hàng
    const stockStatus = product.stock_quantity > 0 ? "Còn hàng" : "Hết hàng";
    const stockColor = product.stock_quantity > 0 ? "green" : "red";

    return (
        <div className="product-detail-page" style={{ padding: "30px 0" }}>

            {/* ==== Breadcrumb ==== */}
            <div style={{ width: "1200px", margin: "0 auto", padding: "0 20px" }}>
                <Text>
                    <Link to="/" style={{ color: "#007fc0" }}>Trang chủ</Link>
                    {product.category_name && (
                        <>
                            {" / "}
                            <Link to={`/danh-muc/${product.category_id}`} style={{ color: "#007fc0" }}>
                                {product.category_name}
                            </Link>
                        </>
                    )}
                    {" / "}
                    <strong>{product.name}</strong>
                </Text>
            </div>

            {/* ==== HERO SECTION ==== */}
            <section className="container-box">
                <div className="box-1200px" style={{ marginTop: 20 }}>
                    <Row gutter={[40, 40]}>
                        {/* LEFT IMAGES */}
                        <Col xs={24} md={10}>

                            {/* Ảnh lớn */}
                            {activeImage && (
                                <div style={{ border: "1px solid #eee", padding: 10, borderRadius: 4 }}>
                                    <Image
                                        src={activeImage}
                                        alt={product.name}
                                        width="100%"
                                        style={{ maxHeight: 400, objectFit: "contain" }}
                                        preview={true}
                                    />
                                </div>
                            )}

                            {/* Thumbnails */}
                            {allImages.length > 0 && (
                                <Row
                                    gutter={10}
                                    style={{
                                        marginTop: 15,
                                        display: "flex",
                                        flexWrap: "nowrap",
                                        overflowX: "auto",
                                    }}
                                >
                                    {allImages.map((img, idx) => {
                                        const imgUrl = getImageUrl(img);
                                        const isActive = activeImage === imgUrl;
                                        return (
                                            <Col key={idx} flex="none">
                                                <div
                                                    onClick={() => setActiveImage(imgUrl)}
                                                    style={{
                                                        border: isActive ? "2px solid #ff8126" : "1px solid #ddd",
                                                        borderRadius: 4,
                                                        padding: 4,
                                                        cursor: "pointer",
                                                        width: 90,
                                                        height: 90,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        background: "#fff",
                                                        transition: "all 0.3s",
                                                        opacity: isActive ? 1 : 0.8,
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!isActive) e.currentTarget.style.opacity = "1";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (!isActive) e.currentTarget.style.opacity = "0.8";
                                                    }}
                                                >
                                                    <Image
                                                        src={imgUrl}
                                                        alt={`Thumbnail ${idx + 1}`}
                                                        width={80}
                                                        height={80}
                                                        style={{
                                                            objectFit: "contain"
                                                        }}
                                                        preview={false}
                                                    />
                                                </div>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            )}
                        </Col>

                        {/* RIGHT INFO */}
                        <Col xs={24} md={14}>
                            <Title level={3}>{product.name}</Title>

                            <Text strong style={{ fontSize: 20, color: "#007fc0" }}>
                                {Number(product.price) === 0
                                    ? "Liên hệ"
                                    : Number(product.price).toLocaleString() + " đ"}
                            </Text>

                            <Divider />

                            <div style={{ marginBottom: 10 }}>
                                <Text strong>Mã sản phẩm:</Text> {product.sku || "N/A"}
                            </div>
                            <div style={{ marginBottom: 10 }}>
                                <Text strong>Hãng sản xuất:</Text> {product.brand_name || "Chưa có thông tin"}
                            </div>
                            <div style={{ marginBottom: 10 }}>
                                <Text strong>Danh mục:</Text> {product.category_name || "Chưa có thông tin"}
                            </div>
                            <div style={{ marginBottom: 10 }}>
                                <Text strong>Tình trạng:</Text>{" "}
                                <Tag color={stockColor}>{stockStatus}</Tag>
                                {product.stock_quantity > 0 && (
                                    <Text type="secondary" style={{ marginLeft: 8 }}>
                                        ({product.stock_quantity} sản phẩm)
                                    </Text>
                                )}
                            </div>

                            <div style={{ marginBottom: 20 }}>
                                <Text strong>Số lượng:</Text>
                                <div style={{ marginTop: 8 }}>
                                    <InputNumber
                                        min={1}
                                        max={product.stock_quantity > 0 ? product.stock_quantity : 999}
                                        value={quantity}
                                        onChange={(value) => setQuantity(value || 1)}
                                        size="large"
                                        disabled={product.stock_quantity === 0}
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                <Button
                                    size="large"
                                    type="primary"
                                    icon={<PhoneOutlined />}
                                    style={{
                                        background: "#007964",
                                        borderColor: "#007964",
                                        fontSize: 16,
                                        height: 45,
                                    }}
                                    onClick={() => addToCart(product, quantity)}
                                    disabled={product.stock_quantity === 0}
                                >
                                    Thêm vào giỏ hàng
                                </Button>

                                <Button
                                    size="large"
                                    type="primary"
                                    icon={<PhoneOutlined />}
                                    style={{
                                        background: "#ff8126",
                                        borderColor: "#ff8126",
                                        fontSize: 16,
                                        height: 45,
                                    }}
                                >
                                    <a href="tel:0378936624" style={{ color: "#fff" }}>Gọi ngay: 0378936624</a>
                                </Button>

                                <Button
                                    size="large"
                                    type="default"
                                    icon={<ArrowRightOutlined />}
                                    style={{ height: 45 }}
                                >
                                    <Link to="/yeu-cau-bao-gia">Yêu cầu báo giá</Link>
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </section>

            {/* ==== DESCRIPTION & DOCUMENTS ==== */}
            <section className="container-box" style={{ marginTop: 40 }}>
                <div className="box-1200px">
                    <Card>
                        <Tabs defaultActiveKey="description">
                            <Tabs.TabPane tab="Mô tả sản phẩm" key="description">
                                <div style={{ lineHeight: 1.8, fontSize: 15 }}>
                                    {formatDescription(product.description)}
                                </div>
                            </Tabs.TabPane>

                            {/* ===== TAB TÀI LIỆU ===== */}
                            <Tabs.TabPane tab="Tài liệu kỹ thuật" key="documents">
                                {Array.isArray(product.document_url) &&
                                    product.document_url.length > 0 ? (
                                    <ul style={{ paddingLeft: 20, listStyle: "none" }}>
                                        {product.document_url.map((doc, idx) => {
                                            const docLink = doc.link || doc;
                                            const docName = doc.name || docLink.split('/').pop() || `Tài liệu ${idx + 1}`;
                                            const docUrl = getImageUrl(docLink);
                                            return (
                                                <li key={idx} style={{ marginBottom: 12 }}>
                                                    <a
                                                        href={docUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            color: "#007fc0",
                                                            fontSize: 15,
                                                            textDecoration: "none",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 8,
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.textDecoration = "underline";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.textDecoration = "none";
                                                        }}
                                                    >
                                                        <span style={{ fontSize: 18 }}>📄</span>
                                                        {docName}
                                                    </a>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <Text type="secondary">Chưa có tài liệu đính kèm</Text>
                                )}
                            </Tabs.TabPane>
                        </Tabs>
                    </Card>
                </div>
            </section>

        </div>
    );
}
