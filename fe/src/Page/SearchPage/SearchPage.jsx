import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, Row, Col, Empty } from "antd";
import { url } from "../../config";

export default function SearchPage() {
    const [results, setResults] = useState([]);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("q");

    useEffect(() => {
        const stored = localStorage.getItem("searchResults");
        if (stored) setResults(JSON.parse(stored));
    }, []);

    return (
        <div style={{ padding: "40px 80px" }}>
            <h2>
                Kết quả tìm kiếm cho: <b>{query}</b>
            </h2>

            {results.length > 0 ? (
                <Row gutter={[24, 24]}>
                    {results.map((item) => (
                        <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                            <Card
                                hoverable
                                cover={
                                    <img
                                        alt={item.name}
                                        src={`${url}${item.image_url}`}
                                        style={{ height: 200, objectFit: "cover" }}
                                    />
                                }
                            >
                                <Card.Meta
                                    title={item.name}
                                    description={
                                        <>
                                            <p>Hãng: {item.brand_name}</p>
                                            <p>Danh mục: {item.category_name}</p>
                                            <p>Giá: {parseInt(item.price).toLocaleString()} ₫</p>
                                        </>
                                    }
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <Empty description="Không có kết quả phù hợp" />
            )}
        </div>
    );
}
