import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Row, Col, Spin } from "antd";
import { url_api,url } from "../../config";
import "./Brand.css";

const { Search } = Input;

export default function Brand() {
    const [brands, setBrands] = useState([]);
    const [filteredBrands, setFilteredBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await axios.get(`${url_api}/api/brands/getbrands.php`);
                if (res.data?.data) {
                    setBrands(res.data.data);
                    setFilteredBrands(res.data.data);
                }
            } catch (error) {
                console.error("Lỗi tải dữ liệu hãng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBrands();
    }, []);

    // Lọc theo tên
    useEffect(() => {
        const text = search.toLowerCase();
        const filtered = brands.filter((b) => b.name.toLowerCase().includes(text));
        setFilteredBrands(filtered);
    }, [search, brands]);

    if (loading)
        return (
            <div className="brand-loading">
                <Spin size="large" />
            </div>
        );

    const featuredBrands = brands.slice(0, 5);

    return (
        <div className="brand-wrapper">
            <div className="brand-container">
                <h2 className="brand-title">Hãng sản xuất</h2>

                {/* Logo hãng nổi bật */}
                <div className="brand-featured">
                    {featuredBrands.map((brand) => (
                        <div key={brand.id} className="brand-card">
                            <img
                                src={`${url}${brand.url_image}`}
                                alt={brand.name}
                                className="brand-logo"
                            />
                        </div>
                    ))}
                </div>

                {/* Danh sách tất cả */}
                <h3 className="brand-subtitle">Danh sách các hãng sản xuất</h3>
                <Search
                    placeholder="Nhập tên hãng bạn cần tìm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    allowClear
                    className="brand-search"
                />

                <Row gutter={[16, 16]} className="brand-grid">
                    {filteredBrands.length > 0 ? (
                        filteredBrands.map((brand) => (
                            <Col xs={12} sm={8} md={6} lg={4} key={brand.id}>
                                <p className="brand-item">{brand.name}</p>
                            </Col>
                        ))
                    ) : (
                        <div className="no-result">Không tìm thấy hãng nào phù hợp</div>
                    )}
                </Row>
            </div>
        </div>
    );
}
