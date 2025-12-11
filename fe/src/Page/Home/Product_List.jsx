import React, { useEffect, useState } from "react";
import CarouselProduct from "../../Components/CarouselProduct/CarouselProduct";
import axios from "axios";
import { url_api } from "../../config";

export default function Product_List() {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${url_api}/api/product/get_all_products.php`);
            const data = res.data;

            if (!data.error && Array.isArray(data.products)) {
                const mapped = data.products.map(item => {
                    // Xử lý ảnh
                    const base = url_api.replace("/api", "");
                    const mainImage = item.images?.length > 0 
                        ? base + item.images[0]
                        : item.image_url 
                        ? base + item.image_url
                        : "/no-image.png";

                    return {
                        id: item.id,
                        name: item.name,
                        model: item.sku,
                        oldPrice: null,          // API chưa có
                        price: Number(item.price) > 0 ? Number(item.price) : null,
                        discount: null,          // API chưa có discount
                        image: mainImage,
                    };
                });

                setProducts(mapped);
            }
        } catch (error) {
            console.error("Lỗi API:", error);
        }
    };

    // Chia sản phẩm thành từng nhóm 5
    const group1 = products.slice(0, 5);
    const group2 = products.slice(5, 10);
    const group3 = products.slice(10, 15);

    return (
        <div>
            <CarouselProduct
                title="Thiết bị đo cơ khí chính xác"
                products={group1}
                linkMore="#"
            />

            <CarouselProduct
                title="Thiết bị đo điện – điện tử"
                products={group2}
                linkMore="#"
            />

            <CarouselProduct
                title="Thiết bị phòng thí nghiệm"
                products={group3}
                linkMore="#"
            />
        </div>
    );
}
