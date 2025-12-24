import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CarouselCategory from '../../Components/Carousel/Carousel';
import { url_api } from '../../config';
import { message, Spin } from 'antd';

export default function Category_List() {
    const [categories, setCategories] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${url_api}/api/categories/getcategories.php?with_children=all`);
                if (res.data?.data) {
                    setCategories(res.data.data);
                    console.log("Danh mục tải về:", res.data);
                } else {
                    messageApi.warning({ content: "Không có dữ liệu danh mục", duration: 3 });
                }
            } catch (error) {
                console.error("Lỗi tải danh mục:", error);
                messageApi.error({ content: "Không thể tải danh mục sản phẩm", duration: 3 });
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) return <Spin tip="Đang tải danh mục..." />;
    return (
        <div className="d-flex">
            {contextHolder}
            <CarouselCategory className="box-1200px" title="Danh mục sản phẩm" data={categories} />
        </div>
    )
}
