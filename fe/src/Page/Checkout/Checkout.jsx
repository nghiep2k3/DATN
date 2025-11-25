import React, { useEffect, useMemo } from "react";
import { Row, Col, Card, Input, Form, Button } from "antd";
import { useCart } from "../../Context/CartContext";
import { useNavigate } from "react-router-dom";
export default function Checkout() {
    const { cartItems, removeFromCart } = useCart();
    const navigate = useNavigate();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Tính tổng tiền (memo để tối ưu)
    const totalPrice = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            const price = item.price ? item.price * item.quantity : 0;
            return sum + price;
        }, 0);
    }, [cartItems]);

    const handleSubmit = (values) => {
        const orderData = {
            ...values,
            amount: totalPrice,
            content: "DONHANG" + Date.now(),   // nội dung chuyển khoản
            cart: cartItems
        };

        // Điều hướng đến trang thanh toán QR
        navigate("/payment", { state: orderData });
    };

    return (
        <div style={{ padding: "40px 0" }}>
            <div style={{ maxWidth: "1200px", margin: "auto" }}>
                <h2
                    style={{
                        fontSize: "28px",
                        fontWeight: "700",
                        marginBottom: "30px",
                        textAlign: "center",
                    }}
                >
                    Checkout
                </h2>

                <Row gutter={[30, 30]}>
                    {/* ============== GIỎ HÀNG ============== */}
                    <Col xs={24} lg={16}>
                        <Card title="Sản phẩm trong giỏ hàng">
                            {cartItems.length === 0 ? (
                                <p>Giỏ hàng trống</p>
                            ) : (
                                cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        style={{
                                            display: "flex",
                                            gap: "15px",
                                            marginBottom: "20px",
                                            borderBottom: "1px solid #eee",
                                            paddingBottom: "15px",
                                            position: "relative"
                                        }}
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            style={{
                                                width: "90px",
                                                height: "90px",
                                                objectFit: "cover",
                                                borderRadius: "6px",
                                            }}
                                        />

                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: 0, fontWeight: 600 }}>
                                                {item.name}
                                            </h4>

                                            <p style={{ margin: "4px 0" }}>
                                                Model: <strong>{item.model}</strong>
                                            </p>

                                            {item.price ? (
                                                <p>
                                                    Giá:{" "}
                                                    <strong>{item.price.toLocaleString()} đ</strong> ×{" "}
                                                    {item.quantity}
                                                </p>
                                            ) : (
                                                <p style={{ color: "red" }}>
                                                    Giá: <strong>Liên hệ</strong> × {item.quantity}
                                                </p>
                                            )}

                                            {/* ===== Nút XÓA ===== */}
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                style={{
                                                    border: "none",
                                                    background: "none",
                                                    color: "red",
                                                    cursor: "pointer",
                                                    fontWeight: "600",
                                                    padding: 0,
                                                    marginTop: "6px",
                                                }}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </Card>
                    </Col>


                    {/* ============== FORM CHECKOUT ============== */}
                    <Col xs={24} lg={8}>
                        <Card title="Thông tin khách hàng">
                            <Form layout="vertical" onFinish={handleSubmit}>
                                <Form.Item
                                    label="Họ và tên"
                                    name="name"
                                    rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                                >
                                    <Input size="large" placeholder="Nguyễn Văn A" />
                                </Form.Item>

                                <Form.Item
                                    label="Số điện thoại"
                                    name="phone"
                                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                                >
                                    <Input size="large" placeholder="0123 456 789" />
                                </Form.Item>

                                <Form.Item label="Email" name="email">
                                    <Input size="large" placeholder="email@gmail.com" />
                                </Form.Item>

                                <Form.Item
                                    label="Địa chỉ giao hàng"
                                    name="address"
                                    rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
                                >
                                    <Input size="large" placeholder="Số nhà / Đường / Quận / TP" />
                                </Form.Item>

                                <Form.Item label="Ghi chú" name="note">
                                    <Input.TextArea rows={3} placeholder="Ghi chú thêm (nếu có)" />
                                </Form.Item>

                                <h3>
                                    Tổng thanh toán:{" "}
                                    <span style={{ color: "red", fontWeight: "700" }}>
                                        {totalPrice > 0
                                            ? totalPrice.toLocaleString() + " đ"
                                            : "Liên hệ"}
                                    </span>
                                </h3>

                                <Button
                                    type="primary"
                                    size="large"
                                    htmlType="submit"
                                    style={{ marginTop: "15px", width: "100%" }}
                                >
                                    Xác nhận đặt hàng
                                </Button>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
