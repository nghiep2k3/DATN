import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Spin } from "antd";
import {
    DollarOutlined,
    CalendarOutlined,
    ShoppingCartOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { url_api } from "../../config";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    CartesianGrid,
} from "recharts";

const { Title, Text } = Typography;

// Fake data cho biểu đồ 30 ngày
const productData = [
    { day: "01", qty: 12 },
    { day: "02", qty: 14 },
    { day: "03", qty: 10 },
    { day: "04", qty: 16 },
    { day: "05", qty: 22 },
    { day: "06", qty: 18 },
    { day: "07", qty: 20 },
    { day: "08", qty: 15 },
    { day: "09", qty: 17 },
    { day: "10", qty: 18 },
    { day: "11", qty: 21 },
    { day: "12", qty: 19 },
    { day: "13", qty: 14 },
    { day: "14", qty: 23 },
    { day: "15", qty: 25 },
    { day: "16", qty: 22 },
    { day: "17", qty: 20 },
    { day: "18", qty: 24 },
    { day: "19", qty: 18 },
    { day: "20", qty: 17 },
    { day: "21", qty: 21 },
    { day: "22", qty: 23 },
    { day: "23", qty: 19 },
    { day: "24", qty: 20 },
    { day: "25", qty: 30 },
    { day: "26", qty: 28 },
    { day: "27", qty: 26 },
    { day: "28", qty: 24 },
    { day: "29", qty: 22 },
    { day: "30", qty: 28 },
    { day: "31", qty: 27 },
];


// Fake data cho pie chart doanh thu tháng
// const revenuePie = [
//     { name: "Thiết bị đo", value: 45 },
//     { name: "Cơ khí", value: 25 },
//     { name: "Sensor", value: 15 },
//     { name: "Tooling", value: 15 },
// ];

const COLORS = ["#146eb4", "#ff9900", "#52c41a", "#ff4d4f"];

export default function Home() {
    const [revenueToday, setRevenueToday] = useState(0);
    const [revenueMonth, setRevenueMonth] = useState(0);
    const [orderCountToday, setOrderCountToday] = useState(0);
    const [revenueStatusData, setRevenueStatusData] = useState([]);

    const [loading, setLoading] = useState(true);

    // Format số tiền theo định dạng VND
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    // Fetch doanh thu hôm nay
    const fetchRevenueToday = async () => {
        try {
            const res = await axios.get(`${url_api}/api/revenue/revenue_days.php`);
            if (!res.data.error) {
                setRevenueToday(res.data.revenue || 0);
                setOrderCountToday(res.data.order_count || 0);
            }
        } catch (error) {
            console.error("Lỗi lấy doanh thu hôm nay:", error);
        }
    };

    // Fetch doanh thu tháng này
    const fetchRevenueMonth = async () => {
        try {
            const res = await axios.get(`${url_api}/api/revenue/revenue_month.php`);
            if (!res.data.error) {
                setRevenueMonth(res.data.revenue || 0);
            }
        } catch (error) {
            console.error("Lỗi lấy doanh thu tháng này:", error);
        }
    };

    const fetchOrdersForPie = async () => {
        try {
            const res = await axios.get(`${url_api}/api/orders/getorders.php`);
            if (!res.data.error) {
                const pieData = buildRevenueByStatus(res.data.data);
                setRevenueStatusData(pieData);
            }
        } catch (err) {
            console.error("Lỗi load orders:", err);
        }
    };


    const buildRevenueByStatus = (orders) => {
        const map = {};

        orders.forEach(order => {
            const status = order.status || "Không xác định";
            const price = Number(order.total_price) || 0;

            map[status] = (map[status] || 0) + price;
        });

        return Object.keys(map).map(key => ({
            name: key,
            value: map[key],
        }));
    };


    // Load data khi component mount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([
                fetchRevenueToday(),
                fetchRevenueMonth(),
                fetchOrdersForPie(),
            ]);
            setLoading(false);
        };
        loadData();
    }, []);


    return (
        <div style={{ padding: "24px" }}>
            <Row gutter={[24, 24]}>
                {/* ===== ROW 1 - KPI ===== */}
                <Col xs={24} md={6}>
                    <Card style={{ borderRadius: 12, background: "#E6F4FF" }}>
                        {loading ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <DollarOutlined style={{ fontSize: 36, color: "#1677ff" }} />
                                <Spin />
                            </div>
                        ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <DollarOutlined style={{ fontSize: 36, color: "#1677ff" }} />
                                <div>
                                    <Text strong style={{ fontSize: 16 }}>
                                        Doanh thu hôm nay
                                    </Text>
                                    <Title level={3} style={{ margin: 0 }}>
                                        {formatCurrency(revenueToday)}
                                    </Title>
                                </div>
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} md={6}>
                    <Card style={{ borderRadius: 12, background: "#FFF7E6" }}>
                        {loading ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <CalendarOutlined style={{ fontSize: 36, color: "#fa8c16" }} />
                                <Spin />
                            </div>
                        ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <CalendarOutlined style={{ fontSize: 36, color: "#fa8c16" }} />
                                <div>
                                    <Text strong style={{ fontSize: 16 }}>
                                        Doanh thu tháng này
                                    </Text>
                                    <Title level={3} style={{ margin: 0 }}>
                                        {formatCurrency(revenueMonth)}
                                    </Title>
                                </div>
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} md={6}>
                    <Card style={{ borderRadius: 12, background: "#E8F8F2" }}>
                        {loading ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <ShoppingCartOutlined style={{ fontSize: 36, color: "#52c41a" }} />
                                <Spin />
                            </div>
                        ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <ShoppingCartOutlined style={{ fontSize: 36, color: "#52c41a" }} />
                                <div>
                                    <Text strong style={{ fontSize: 16 }}>
                                        Số đơn hàng hôm nay
                                    </Text>
                                    <Title level={3} style={{ margin: 0 }}>
                                        {orderCountToday} đơn
                                    </Title>
                                </div>
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} md={6}>
                    <Card style={{ borderRadius: 12, background: "#FFE8E6" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <WarningOutlined style={{ fontSize: 36, color: "#ff4d4f" }} />
                            <div>
                                <Text strong style={{ fontSize: 16 }}>
                                    Sản phẩm sắp hết hàng
                                </Text>
                                <Title level={3} style={{ margin: 0 }}>
                                    4 sản phẩm
                                </Title>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* ===== ROW 2 - CHARTS ===== */}
                <Col xs={24} md={14}>
                    <Card
                        title="Số lượng sản phẩm bán trong 30 ngày"
                        style={{
                            borderRadius: 12,
                            background: "#fafbfd",
                        }}
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={productData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />

                                {/* Trục X */}
                                <XAxis
                                    dataKey="day"
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                {/* Trục Y */}
                                <YAxis
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                {/* Tooltip đẹp kiểu GA */}
                                <Tooltip
                                    contentStyle={{
                                        background: "#fff",
                                        borderRadius: 8,
                                        border: "1px solid #e5e7eb",
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                                    }}
                                    labelStyle={{ color: "#6b7280" }}
                                />

                                {/* Line Style Google Analytics */}
                                <Line
                                    type="monotone"
                                    dataKey="qty"
                                    stroke="#1a73e8"
                                    strokeWidth={3}
                                    dot={{ r: 3, stroke: "#1a73e8", strokeWidth: 2, fill: "#fff" }}
                                    activeDot={{ r: 5, fill: "#1a73e8" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>

                </Col>

                <Col xs={24} md={10}>
                    <Card title="Doanh thu theo danh mục" style={{ borderRadius: 12 }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={revenueStatusData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    label={({ name, percent }) =>
                                        `${name} (${(percent * 100).toFixed(0)}%)`
                                    }
                                >
                                    {revenueStatusData.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) =>
                                        formatCurrency(value)
                                    }
                                />
                                <Legend />
                            </PieChart>

                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
