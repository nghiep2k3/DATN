import React, { useEffect, useState } from "react";
import axios from "axios";
import { url_api, url } from "../../config";
import "./ProductCategory.css";

export default function ProductCategory() {
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");

    // Fetch API
    const loadCategories = () => {
        axios.get(`${url_api}/api/categories/getcategories.php?with_children=all`)
            .then((res) => {
                if (res.data && res.data.data) {
                    setCategories(res.data.data);
                }
            })
            .catch((err) => console.error("Lỗi API:", err));
    };

    useEffect(() => {
        loadCategories();
    }, []);

    // Lọc danh mục theo tên
    const filteredCategories = categories.filter((cat) =>
        cat.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="category-container">

            <div className="category-header">
                <h2 className="category-title">Quản lý danh mục sản phẩm</h2>

                <div className="category-actions">
                    <input
                        type="text"
                        className="category-search"
                        placeholder="Tìm kiếm danh mục..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button className="btn-add" onClick={() => alert("Thêm danh mục")}>
                        + Thêm danh mục
                    </button>
                </div>
            </div>

            <div className="category-grid">
                {filteredCategories.map((cat) => (
                    <div key={cat.id} className="category-card">

                        <img
                            src={`${url}/${cat.url_image}`}
                            alt={cat.category}
                            className="category-image"
                        />

                        <div className="category-content">

                            <div className="category-header-row">
                                <h3 className="category-name">{cat.category}</h3>

                                <div className="category-buttons">
                                    <button onClick={() => alert("Sửa: " + cat.id)} className="btn-edit">Sửa</button>
                                    <button onClick={() => alert("Xóa: " + cat.id)} className="btn-delete">Xóa</button>
                                </div>
                            </div>

                            {/* Subcategory image + name */}
                            {cat.sub_category.length > 0 ? (
                                <div className="subcategory-grid">
                                    {cat.sub_category.map((sub) => (
                                        <div key={sub.id} className="subcategory-card ">

                                            <img
                                                src={`${url}/${sub.url_image}`}
                                                className="subcategory-image"
                                                alt={sub.name}
                                            />

                                            <p className="subcategory-name">{sub.name}</p>

                                            <div className="subcategory-buttons">
                                                <button className="btn-sub-edit" onClick={() => alert("Sửa con: " + sub.id)}>Sửa</button>
                                                <button className="btn-sub-delete" onClick={() => alert("Xóa con: " + sub.id)}>Xóa</button>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="subcategory-none">Không có danh mục con</p>
                            )}

                            <button className="btn-add-sub" onClick={() => alert("Thêm danh mục con cho " + cat.id)}>
                                + Thêm danh mục con
                            </button>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
