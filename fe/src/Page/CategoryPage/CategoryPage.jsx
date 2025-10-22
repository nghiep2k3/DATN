import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { url, url_api } from '../../config';

export default function CategoryPage() {
    const { id } = useParams();
    const [category, setCategory] = useState(null);

    useEffect(() => {
        axios
            .get(`${url_api}/api/categories/getcategories.php?with_children=${id}`)
            .then((res) => {
                // Kiểm tra nếu có data hợp lệ
                if (res.data && res.data.data && res.data.data.length > 0) {
                    setCategory(res.data.data[0]);
                }
            })
            .catch((err) => console.error("Lỗi API:", err));
    }, [id]);

    if (!category) {
        return (
            <div className="container py-5 text-center">
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h3 className="fw-bold mb-4 text-primary">{category.category}</h3>

            <div className="row">
                {category.sub_category.map((child) => (
                    <div key={child.id} className="col-md-3 mb-4">
                        <div className="p-3 border rounded-4 text-center shadow-sm">
                            <Link to={`/category-child/${child.id}`} className="text-decoration-none text-dark">
                                <img
                                    src={`${url_api}/${child.url_image}`}
                                    alt={child.name}
                                    className="rounded-3 mb-3"
                                    style={{
                                        width: "100%",
                                        height: "140px",
                                        objectFit: "contain",
                                    }}
                                />
                                <h6 className="fw-bold">{child.name}</h6>
                                <p className="text-secondary small mb-0">
                                    {`Id: ${child.id}`} - {child.description}
                                </p>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
