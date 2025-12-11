import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "antd";

export default function Success() {
    const navigate = useNavigate();
    const [seconds, setSeconds] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    window.location.href = "/"; 
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div style={{ padding: "60px 0" }}>
            <div style={{ maxWidth: "600px", margin: "auto" }}>
                <Card
                    style={{
                        textAlign: "center",
                        padding: "50px",
                        borderRadius: "16px",
                    }}
                >
                    {/* ANIMATION CHECKMARK */}
                    <div style={{ marginBottom: 25 }}>
                        <div style={styles.circle}>
                            <svg
                                style={styles.checkmark}
                                viewBox="0 0 52 52"
                            >
                                <circle
                                    style={styles.circlePath}
                                    cx="26"
                                    cy="26"
                                    r="25"
                                />
                                <path
                                    style={styles.checkPath}
                                    d="M14 27l7 7 17-17"
                                />
                            </svg>
                        </div>
                    </div>

                    <h2 style={{ fontWeight: 700, marginBottom: 10 }}>Thanh toán thành công!</h2>

                    <p style={{ color: "#555", marginBottom: 25 }}>
                        Hệ thống sẽ chuyển về trang chủ sau{" "}
                        <strong>{seconds} giây</strong>.
                    </p>

                    <Button
                        type="primary"
                        size="large"
                        block
                        onClick={() => window.location.href = "/"}
                    >
                        Về trang chủ ngay
                    </Button>
                </Card>
            </div>
        </div>
    );
}

// ================== CSS ANIMATION ==================
const styles = {
    circle: {
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        background: "rgba(82, 196, 26, 0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "pop 0.5s ease-out forwards",
        margin: "auto",
    },
    checkmark: {
        width: "85px",
        height: "85px",
        stroke: "#52c41a",
        strokeWidth: "4",
        fill: "none",
    },
    circlePath: {
        strokeDasharray: "166",
        strokeDashoffset: "166",
        animation: "strokeCircle 0.6s ease-out forwards",
    },
    checkPath: {
        strokeDasharray: "48",
        strokeDashoffset: "48",
        animation: "strokeCheck 0.4s ease-out 0.6s forwards",
    },
};

/* Inject CSS Keyframes directly into the DOM */
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes strokeCircle {
    to { stroke-dashoffset: 0; }
}
@keyframes strokeCheck {
    to { stroke-dashoffset: 0; }
}
@keyframes pop {
    0% { transform: scale(0.4); opacity: 0; }
    60% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); }
}
`;
document.head.appendChild(styleSheet);
