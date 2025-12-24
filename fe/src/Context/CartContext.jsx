import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { url_api } from "../config";

// Tạo context
const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [needPhoneModal, setNeedPhoneModal] = useState(false);
    const [pendingProduct, setPendingProduct] = useState(null);
    const [cartItems, setCartItems] = useState(() => {
        const stored = localStorage.getItem("cartItems");
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const fetchCart = async () => {
        const loggedIn = Cookies.get("loggedIn");
        const userId = Cookies.get("user_id");
        const phone = Cookies.get("temp_phone");

        try {
            let url = `${url_api}/api/cartItem/getcart.php`;

            if (loggedIn && userId) {
                url += `?user_id=${userId}`;
            } else if (phone) {
                url += `?phone=${phone}`;
            } else {
                return;
            }

            const response = await axios.get(url);

            if (!response.data.error && response.data.data) {
                const cartData = Array.isArray(response.data.data)
                    ? response.data.data
                    : [response.data.data];

                setCartItems(cartData);
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error("Lỗi", error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);



    const addToCart = async (product, quantity = 1) => {
        const loggedIn = Cookies.get("loggedIn");
        const userId = Cookies.get("user_id");
        const phone = Cookies.get("temp_phone");
        // If user is logged in, allow adding using user_id even without phone
        // Default phone for logged-in users should be "0"
        if (loggedIn) {
            return await sendAddToCartRequest(product, quantity, userId, phone || "0", loggedIn);
        }

        // If not logged in but phone exists, add using phone
        if (phone) {
            return await sendAddToCartRequest(product, quantity, "", phone, false);
        }

        // Not logged in and no phone -> prompt for phone
        setPendingProduct({ ...product, quantity });
        setNeedPhoneModal(true);
    };


    const sendAddToCartRequest = async (product, quantity, userId, phone, loggedIn) => {
        const payload = {
            user_id: loggedIn ? userId : "",
            product_id: String(product.id),
            quantity: String(quantity),
            phone: phone,
            price: String(product.price || 0)
        };

        try {
            const res = await axios.post(
                `${url_api}/api/cartitem/addcart.php`,
                payload,
                { headers: { "Content-Type": "application/json" } }
            );

            if (!res.data.error) {
                await fetchCart();
            }
        } catch (error) {
            console.error("Lỗi axios:", error);
        }
    };




    // Khi xác nhận số điện thoại → cho phép addToCart
    const confirmPhone = (phone) => {
        Cookies.set("temp_phone", phone, { expires: 1 });

        if (pendingProduct) {
            sendAddToCartRequest(
                pendingProduct,
                pendingProduct.quantity || 1,
                Cookies.get("user_id"),
                phone,
                Cookies.get("loggedIn")
            );
        }

        setNeedPhoneModal(false);
        setPendingProduct(null);
    };




    const updateQuantity = async (id, newQty) => {
        const phone = Cookies.get("temp_phone") || "";
        const currentItem = cartItems.find(item => item.cart_id === id || item.id === id);

        try {
            const payload = {
                quantity: String(newQty),
                phone: phone,
                price: String(currentItem?.price || 0)
            };

            console.log("Payload cập nhật số lượng:", payload);

            const response = await axios.put(
                `${url_api}/api/cartItem/updatecart.php?id=${id}`,
                payload,
                { headers: { "Content-Type": "application/json" } }
            );

            if (!response.data.error) {
                console.log("Cập nhật số lượng thành công:", response.data);
                await fetchCart();
            } else {
                console.error("Lỗi API:", response.data.message);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật số lượng:", error);
        }
    };


    // Xóa sản phẩm
    const removeFromCart = async (id) => {
        try {
            const response = await axios.delete(
                `${url_api}/api/cartItem/deletecart.php?id=${id}`
            );

            setCartItems((prev) => prev.filter((item) => item.cart_id !== id && item.id !== id));
            console.log("Xóa sản phẩm thành công:", response.data);

            await fetchCart();
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
        }
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
