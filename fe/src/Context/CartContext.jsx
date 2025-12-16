import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { url_api } from "../config";

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

    // ================== FETCH CART ==================
    const fetchCart = async () => {
        const loggedIn = Cookies.get("loggedIn");
        const userId = Cookies.get("user_id");
        const phone = Cookies.get("temp_phone");

        try {
            let url = `${url_api}/api/cartItem/getcart.php`;

            if (loggedIn && userId) {
                // Nếu đã login → lấy theo user_id
                url += `?user_id=${userId}`;
                console.log("📥 Fetching cart for user:", userId);
            } else if (phone) {
                // Nếu chưa login nhưng có phone → lấy theo phone
                url += `?phone=${phone}`;
                console.log("📥 Fetching cart for phone:", phone);
            } else {
                // Nếu chưa có điều kiện nào → return
                console.log("⚠️ No user_id or phone available");
                return;
            }

            const response = await axios.get(url);

            if (!response.data.error && response.data.data) {
                const cartData = Array.isArray(response.data.data)
                    ? response.data.data
                    : [response.data.data];

                setCartItems(cartData);
                console.log("✅ Cart fetched:", cartData);
            } else {
                console.log("⚠️ No cart data found");
                setCartItems([]);
            }
        } catch (error) {
            console.error("❌ Error fetching cart:", error);
        }
    };

    // Fetch cart khi component mount hoặc khi login status thay đổi
    useEffect(() => {
        fetchCart();
    }, []);



    // Thêm vào giỏ hàng
    // ================== ADD TO CART ==================
    const addToCart = async (product, quantity = 1) => {
        const loggedIn = Cookies.get("loggedIn");
        const userId = Cookies.get("user_id");
        const phone = Cookies.get("temp_phone");

        // 1. Có phone → gọi API luôn
        if (phone) {
            return await sendAddToCartRequest(product, quantity, userId, phone, loggedIn);
        }

        // 2. Chưa login & chưa phone → mở popup
        if (!loggedIn && !phone) {
            setPendingProduct({ ...product, quantity });
            setNeedPhoneModal(true);
            return;
        }

        // 3. Login nhưng chưa phone
        if (loggedIn && !phone) {
            setPendingProduct({ ...product, quantity });
            setNeedPhoneModal(true);
            return;
        }
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
            console.error("❌ Lỗi axios:", error);
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

            console.log("📝 Payload cập nhật số lượng:", payload);

            const response = await axios.put(
                `${url_api}/api/cartItem/updatecart.php?id=${id}`,
                payload,
                { headers: { "Content-Type": "application/json" } }
            );

            if (!response.data.error) {
                console.log("✅ Cập nhật số lượng thành công:", response.data);
                // Fetch lại giỏ hàng để sync realtime
                await fetchCart();
            } else {
                console.error("❌ Lỗi API:", response.data.message);
            }
        } catch (error) {
            console.error("❌ Lỗi khi cập nhật số lượng:", error);
        }
    };


    // Xóa sản phẩm
    const removeFromCart = async (id) => {
        try {
            const response = await axios.delete(
                `${url_api}/api/cartItem/deletecart.php?id=${id}`
            );

            // Xóa thành công → cập nhật state ngay (xóa khỏi local)
            // Sau đó gọi fetchCart để lấy dữ liệu mới từ server
            setCartItems((prev) => prev.filter((item) => item.cart_id !== id && item.id !== id));
            console.log("✅ Xóa sản phẩm thành công:", response.data);

            // Fetch lại giỏ hàng từ server (có thể trống hoặc còn sản phẩm khác)
            await fetchCart();
        } catch (error) {
            console.error("❌ Lỗi khi xóa sản phẩm:", error);
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
