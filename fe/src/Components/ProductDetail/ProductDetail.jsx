import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Image, Button, Divider, Typography, Card } from "antd";
import { PhoneOutlined, ArrowRightOutlined } from "@ant-design/icons";
import axios from "axios";
import { url_api } from "../../config";

const { Title, Text } = Typography;

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    // Ảnh đang được hiển thị lớn
    const [activeImage, setActiveImage] = useState(null);

    useEffect(() => {
        axios
            .get(`${url_api}/api/product/getproduct.php?id=${id}`)
            .then((res) => {
                if (!res.data.error) {
                    const data = res.data.product;
                    setProduct(data);

                    // Gán ảnh mặc định
                    setActiveImage(`${url_api}/${data.image_url}`);
                }
            })
            .catch((err) => console.log(err));
    }, [id]);

    if (!product) return <div style={{ padding: 40 }}>Đang tải...</div>;

    // Tập ảnh đầy đủ
    const fullImages = [
        `${url_api}/${product.image_url}`,
        ...(product.images?.map((img) => `${url_api}/${img}`) || [])
    ];

    return (
        <div className="product-detail-page" style={{ padding: "30px 0" }}>

            {/* ==== Breadcrumb ==== */}
            <div style={{ width: "1200px", margin: "0 auto" }}>
                <Text>
                    Trang chủ / Thiết bị đo cơ khí chính xác / Thước kẹp /{" "}
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
                            <div style={{ border: "1px solid #eee", padding: 10 }}>
                                <Image
                                    src={activeImage}
                                    alt={product.name}
                                    width="100%"
                                    style={{ maxHeight: 400, objectFit: "contain" }}
                                />
                            </div>

                            {/* Thumbnails */}
                            <Row
                                gutter={10}
                                style={{
                                    marginTop: 15,
                                    display: "flex",
                                    flexWrap: "nowrap",
                                }}
                            >
                                {fullImages.map((img, idx) => (
                                    <Col key={idx}>
                                        <div
                                            onClick={() => setActiveImage(img)}
                                            style={{
                                                border: activeImage === img ? "2px solid #ff8126" : "1px solid #ddd",
                                                borderRadius: 4,
                                                padding: 4,
                                                cursor: "pointer",
                                                width: 90,
                                                height: 90,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                background: "#fff"
                                            }}
                                        >
                                            <Image
                                                src={img}
                                                alt="thumb"
                                                width={80}
                                                height={80}
                                                style={{
                                                    objectFit: "contain"
                                                }}
                                                preview={false}
                                            />
                                        </div>
                                    </Col>
                                ))}
                            </Row>
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
                                <Text strong>Mã sản phẩm:</Text> {product.sku}
                            </div>
                            <div style={{ marginBottom: 10 }}>
                                <Text strong>Hãng sản xuất:</Text> Insize
                            </div>
                            <div style={{ marginBottom: 10 }}>
                                <Text strong>Danh mục:</Text> Thước kẹp
                            </div>
                            <div style={{ marginBottom: 10 }}>
                                <Text strong>Tình trạng:</Text> Còn hàng
                            </div>

                            <Divider />

                            {/* Buttons */}
                            <div style={{ display: "flex", gap: 12 }}>
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
                                    Gọi ngay: 0966580008
                                </Button>

                                <Button
                                    size="large"
                                    type="default"
                                    icon={<ArrowRightOutlined />}
                                    style={{ height: 45 }}
                                >
                                    Đề nghị báo giá
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </section>

            {/* ==== DESCRIPTION ==== */}
            <section className="container-box" style={{ marginTop: 40 }}>
                <div className="box-1200px">
                    <Card>
                        <Title level={4}>Mô tả</Title>
                        <Divider />
                        <div
                            dangerouslySetInnerHTML={{
                                __html: product.description,
                            }}
                        ></div>
                    </Card>
                </div>
            </section>
        </div>
    );
}
