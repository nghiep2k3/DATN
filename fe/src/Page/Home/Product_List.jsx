import React from 'react'
import CarouselProduct from '../../Components/CarouselProduct/CarouselProduct';

export default function Product_List() {
    const products = [
        {
            id: 1,
            name: "Thước kẹp cơ khí vạch dấu 7203-300A",
            model: "7203-300A",
            oldPrice: 955000,
            price: 2000,
            discount: 29,
            image:
                "https://tecotec.store/wp-content/uploads/2025/05/1109-13.jpg",
        },
        {
            id: 2,
            name: "Thước kẹp điện tử vạch dấu Insize 1166-150A",
            model: "1166-150A",
            oldPrice: null,
            price: null,
            discount: null,
            image:
                "https://tecotec.store/wp-content/uploads/2025/05/7203_300A-1.jpg",
        },
        {
            id: 3,
            name: "Thước kẹp cơ khí vạch dấu Insize 7202-200A",
            model: "7202-200A",
            price: null,
            image:
                "https://tecotec.store/wp-content/uploads/2025/05/7203_300A-1.jpg",
        },
        {
            id: 4,
            name: "Thước đo cao điện tử Insize 1151-600A",
            model: "1151-600A",
            price: null,
            image:
                "https://tecotec.store/wp-content/uploads/2025/05/7203_300A-1.jpg",
        },
        {
            id: 5,
            name: "Thước kẹp điện tử hệ mét Insize 1109-150",
            model: "1109-150",
            price: null,
            image:
                "https://tecotec.store/wp-content/uploads/2025/05/7203_300A-1.jpg",
        },
        {
            id: 6,
            name: "Thước kẹp điện tử hệ mét Insize 1109-150",
            model: "1109-150",
            price: null,
            image:
                "https://tecotec.store/wp-content/uploads/2025/05/7203_300A-1.jpg",
        },
    ];
    return (
        <div>
            <CarouselProduct title="Thiết bị đo cơ khí chính xác" products={products} linkMore="#" />
            <CarouselProduct title="Thiết bị đo cơ khí chính xác" products={products} linkMore="#" />
            <CarouselProduct title="Thiết bị đo cơ khí chính xác" products={products} linkMore="#" />
        </div>
    )
}
