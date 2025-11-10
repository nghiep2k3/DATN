import React from "react";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Button } from "antd";

export default function ProductCard() {
    const products = [
        {
            id: 1,
            name: "Thước kẹp cơ khí vạch dấu 7203-300A",
            model: "7203-300A",
            oldPrice: 955000,
            price: 679000,
            discount: 29,
            image: "https://tecotec.store/wp-content/uploads/2025/05/1109-13.jpg",
        },
        {
            id: 2,
            name: "Thước kẹp điện tử vạch dấu Insize 1166-150A",
            model: "1166-150A",
            price: null,
            image: "https://tecotec.store/wp-content/uploads/2025/05/7203_300A-1.jpg",
        },
        {
            id: 3,
            name: "Thước kẹp cơ khí vạch dấu Insize 7202-200A",
            model: "7202-200A",
            price: null,
            image: "https://tecotec.store/wp-content/uploads/2025/05/7203_300A-1.jpg",
        },
        {
            id: 4,
            name: "Thước đo cao điện tử Insize 1151-600A",
            model: "1151-600A",
            price: null,
            image: "https://tecotec.store/wp-content/uploads/2025/05/7203_300A-1.jpg",
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((item) => (
                <div
                    key={item.id}
                    className="relative flex flex-col justify-between bg-white border rounded-2xl shadow-sm p-3 hover:shadow-lg transition-all duration-300"
                >
                    {/* Badge giảm giá */}
                    {item.discount && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                            -{item.discount}%
                        </span>
                    )}

                    {/* Ảnh sản phẩm */}
                    <div className="flex justify-center items-center h-40 mb-2">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="max-h-36 object-contain rounded-md"
                        />
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="flex flex-col flex-grow">
                        <h6 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">
                            {item.name}
                        </h6>
                        <p className="text-gray-600 text-xs mb-2">
                            <strong>Model:</strong> {item.model}
                        </p>

                        {/* Giá */}
                        {item.price ? (
                            <div>
                                {item.oldPrice && (
                                    <p className="text-gray-400 text-xs line-through mb-0">
                                        {item.oldPrice.toLocaleString()}₫
                                    </p>
                                )}
                                <p className="text-blue-600 font-bold text-base">
                                    {item.price.toLocaleString()}₫
                                </p>
                            </div>
                        ) : (
                            <p className="text-blue-600 font-semibold text-sm mb-2">Liên hệ</p>
                        )}
                    </div>

                    {/* Nút thêm vào giỏ */}
                    <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        className="mt-2 w-full rounded-lg"
                        onClick={() => alert(`Đã thêm "${item.name}" vào giỏ hàng!`)}
                    >
                        Thêm vào giỏ
                    </Button>
                </div>
            ))}
        </div>
    );
}
