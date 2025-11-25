import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, message, Progress } from "antd";
import axios from "axios";

export default function Payment() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const TOTAL_SECONDS = 300; // 5 phút = 300 giây

    const [valid, setValid] = useState(true);
    const [remaining, setRemaining] = useState(TOTAL_SECONDS);

    useEffect(() => {
        if (!state) {
            setValid(false);
            return;
        }

        // ---- Lấy hoặc tạo thời gian bắt đầu ----
        let orderStart = localStorage.getItem("orderStartTime");

        if (!orderStart) {
            orderStart = Date.now();
            localStorage.setItem("orderStartTime", orderStart);
        }

        const updateTimer = () => {
            const now = Date.now();
            const elapsed = Math.floor((now - orderStart) / 1000);
            const left = TOTAL_SECONDS - elapsed;

            if (left <= 0) {
                setRemaining(0);
                message.warning("Hết thời gian thanh toán!");
                return;
            }

            setRemaining(left);
        };

        updateTimer();
        const t = setInterval(updateTimer, 1000);

        return () => clearInterval(t);
    }, [state]);

    const amount = state?.amount;
    const content = state?.content;

    const qrUrl = state
        ? `https://qr.sepay.vn/img?acc=24112032307203&bank=VPBank&amount=${amount}&des=${encodeURIComponent(
            content
        )}`
        : "";

    const checkTransaction = async () => {
        if (!state) return;

        try {
            const apiUrl = `https://marcom.tecotec.top/check_transaction.php?amount=${amount}&content=${encodeURIComponent(
                content
            )}`;

            const res = await axios.get(apiUrl);
            const data = res.data;
            console.log("Check transaction:", apiUrl);

            if (data.match === true) {
                // Xóa thời gian để đơn sau chạy timer mới
                localStorage.removeItem("orderStartTime");
                localStorage.removeItem("cartItems");

                setTimeout(() => navigate("/success", { state: data.transaction }), 1800);
            }
        } catch (err) {
            console.error("Lỗi check:", err);
        }
    };

    useEffect(() => {
        if (!state) return;

        const interval = setInterval(checkTransaction, 5000);
        return () => clearInterval(interval);
    }, [state]);

    if (!valid) {
        return (
            <div style={{ padding: 40, textAlign: "center" }}>
                <h2>Không có dữ liệu thanh toán!</h2>
                <Button type="primary" onClick={() => navigate("/")}>
                    Về trang chủ
                </Button>
            </div>
        );
    }

    // Format MM:SS
    const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
    const seconds = String(remaining % 60).padStart(2, "0");

    const percent = (remaining / TOTAL_SECONDS) * 100;

    return (
        <div style={{ padding: "40px 0" }}>
            <div style={{ maxWidth: "900px", margin: "auto" }}>
                <Card style={{ borderRadius: 12, padding: "25px" }}>
                    <h2 style={{ textAlign: "center", fontWeight: 700, marginBottom: 25 }}>
                        Thanh toán bằng QR Code
                    </h2>

                    <div
                        style={{
                            display: "flex",
                            gap: "30px",
                            flexWrap: "wrap",
                            justifyContent: "center",
                        }}
                    >
                        {/* LEFT: QR + TIMER */}
                        <div
                            style={{
                                flex: "1 1 350px",
                                textAlign: "center",
                                minWidth: "300px",
                            }}
                        >
                            <Progress
                                type="circle"
                                percent={percent}
                                format={() => `${minutes}:${seconds}`}
                                size={120}
                                strokeColor={remaining < 20 ? "red" : "#52c41a"}
                            />

                            <div style={{ marginTop: 20 }}>
                                <img
                                    src={qrUrl}
                                    alt="QR Thanh toán"
                                    style={{
                                        width: "240px",
                                        height: "240px",
                                        objectFit: "contain",
                                        border: "1px solid #eee",
                                        padding: 10,
                                        borderRadius: 12,
                                        background: "#fafafa",
                                    }}
                                />
                            </div>
                        </div>

                        {/* RIGHT: PAY INFO */}
                        <div
                            style={{
                                flex: "1 1 350px",
                                minWidth: "300px",
                                background: "#f6ffed",
                                border: "1px solid #b7eb8f",
                                padding: "20px",
                                borderRadius: 12,
                            }}
                        >
                            <h3 style={{ fontWeight: "600", marginBottom: 15 }}>
                                Thông tin thanh toán
                            </h3>

                            <p>
                                <strong>Số tiền:</strong>
                                <br />
                                <span style={{ fontSize: 26, fontWeight: 700, color: "#cf1322" }}>
                                    {amount.toLocaleString()} đ
                                </span>
                            </p>

                            <p style={{ marginTop: 15 }}>
                                <strong>Nội dung chuyển khoản:</strong>
                                <br />
                                <span style={{ fontSize: 18 }}>{content}</span>
                            </p>

                            <p style={{ marginTop: 20 }}>
                                Hệ thống sẽ tự động xác nhận giao dịch khi bạn chuyển khoản đúng
                                số tiền và nội dung yêu cầu.
                            </p>

                            <Button
                                type="primary"
                                danger
                                block
                                size="large"
                                style={{ marginTop: 20 }}
                                onClick={() => {
                                    localStorage.removeItem("orderStartTime");
                                    navigate("/");
                                }}
                            >
                                Hủy thanh toán
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
