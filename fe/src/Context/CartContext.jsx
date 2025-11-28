import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

// Tạo context
const CartContext = createContext();

// Hook sử dụng dễ hơn
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [needPhoneModal, setNeedPhoneModal] = useState(false);
    const [pendingProduct, setPendingProduct] = useState(null);
    const [cartItems, setCartItems] = useState(() => {
        const stored = localStorage.getItem("cartItems");
        return stored ? JSON.parse(stored) : [];
    });

    // Cập nhật localStorage khi cart thay đổi
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);



    // Thêm vào giỏ hàng
    const addToCart = (product) => {
        const loggedIn = Cookies.get("loggedIn");

        if (!loggedIn) {
            // Chưa login → mở modal
            setPendingProduct(product);
            setNeedPhoneModal(true);
            return;
        }
        // Đã login → thêm vào giỏ hàng
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                // Nếu đã có thì tăng số lượng
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            // Nếu chưa có, thêm mới
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    // Khi xác nhận số điện thoại → cho phép addToCart
    const confirmPhone = (phone) => {
        Cookies.set("temp_phone", phone, { expires: 1 });

        if (pendingProduct) {
            setCartItems((prev) => [...prev, { ...pendingProduct, quantity: 1 }]);
        }

        setNeedPhoneModal(false);
        setPendingProduct(null);
    };

    const updateQuantity = (id, newQty) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, newQty) }
                    : item
            )
        );
    };


    // Xóa sản phẩm
    const removeFromCart = (id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    // Tổng số lượng sản phẩm
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                totalQuantity,
                needPhoneModal,
                confirmPhone,
                closePhoneModal: () => setNeedPhoneModal(false),
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
