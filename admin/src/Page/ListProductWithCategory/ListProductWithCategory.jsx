import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Row, Col, Slider, Checkbox, Select, Input, Spin } from "antd";
import { url_api } from "../../config"; // biến môi trường url_api
import "./ListProductWithCategory.css";

export default function ListProductWithCategory() {
    const { id } = useParams(); // /category-child/:id
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [priceRange, setPriceRange] = useState([0, 100000000]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [brands, setBrands] = useState([]);

    const [sort, setSort] = useState("default");

    // --- Gọi API ---
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    `${url_api}/api/product/products_by_category.php?category_id=${id}`
                );
                if (!res.data.error) {
                    setProducts(res.data.products);
                    setFilteredProducts(res.data.products);
                    const uniqueBrands = [
                        ...new Set(res.data.products.map((p) => p.brand_name)),
                    ];
                    setBrands(uniqueBrands);
                }
            } catch (err) {
                console.error("Lỗi tải sản phẩm:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [id]);

    // --- Lọc sản phẩm ---
    useEffect(() => {
        let temp = [...products];

        // lọc theo giá
        temp = temp.filter((p) => {
            const price = parseFloat(p.price);
            return price >= priceRange[0] && price <= priceRange[1];
        });

        // lọc theo hãng
        if (selectedBrands.length > 0) {
            temp = temp.filter((p) => selectedBrands.includes(p.brand_name));
        }

        // sắp xếp
        if (sort === "priceAsc") temp.sort((a, b) => a.price - b.price);
        if (sort === "priceDesc") temp.sort((a, b) => b.price - a.price);

        setFilteredProducts(temp);
    }, [priceRange, selectedBrands, sort, products]);

    if (loading)
        return (
            <div className="text-center py-10">
                <Spin size="large" />
            </div>
        );

    return (
        <div className="list-category-page container">
            <h2 className="page-title">{products[0]?.category_name || "Danh mục"}</h2>

            <Row gutter={24}>
                {/* --- Bộ lọc bên trái --- */}
                <Col xs={24} md={6} className="filter-panel">
                    <h3>Lọc kết quả</h3>
                    <div className="sort-bar">
                        <Select
                            value={sort}
                            onChange={setSort}
                            style={{ width: '100%', margin: '1rem 0' }}
                            options={[
                                { value: "default", label: "Sắp xếp..." },
                                { value: "priceAsc", label: "Giá tăng dần" },
                                { value: "priceDesc", label: "Giá giảm dần" },
                            ]}
                        />
                    </div>
                    <div className="filter-group">
                        <p>Khoảng giá (₫)</p>
                        <Slider
                            range
                            min={0}
                            max={70000000}
                            step={100000}
                            value={priceRange}
                            onChange={setPriceRange}
                        />
                        <div className="flex-between">
                            <span>{priceRange[0].toLocaleString()} đ</span>
                            <span>{priceRange[1].toLocaleString()} đ</span>
                        </div>
                    </div>

                    <div className="filter-group">
                        <p>Hãng sản xuất</p>
                        <Checkbox.Group
                            className="flex flex-col gap-1"
                            options={brands}
                            value={selectedBrands}
                            onChange={setSelectedBrands}
                        />
                    </div>
                </Col>

                {/* --- Danh sách sản phẩm --- */}
                <Col xs={24} md={18}>


                    <Row gutter={[16, 16]}>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((p) => (
                                <Col xs={12} md={8} key={p.id}>
                                    <div className="product-card">
                                        <img
                                            src={`${url_api}${p.image_url}`}
                                            alt={p.name}
                                            className="product-image"
                                        />
                                        <h4 className="product-name">{p.name}</h4>
                                        <p className="text-gray">Model: {p.sku}</p>
                                        <p className="text-gray">Hãng: {p.brand_name}</p>
                                        <p className="price">
                                            {parseFloat(p.price).toLocaleString("vi-VN")} đ
                                        </p>
                                    </div>
                                </Col>
                            ))
                        ) : (
                            <div className="text-center w-full py-10 text-gray-500">
                                Không có sản phẩm phù hợp
                            </div>
                        )}
                    </Row>
                </Col>
            </Row>
        </div>
    );
}
