import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Spin, Select, Space } from "antd";
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

const COLORS = ["#146eb4", "#ff9900", "#52c41a", "#ff4d4f", "#722ed1", "#13c2c2", "#fa541c", "#eb2f96"];

export default function Home() {
    const [revenueToday, setRevenueToday] = useState(0);
    const [revenueMonth, setRevenueMonth] = useState(0);
    const [orderCountToday, setOrderCountToday] = useState(0);
    const [revenueStatusData, setRevenueStatusData] = useState([]);
    const [salesByDayData, setSalesByDayData] = useState([]);
    const [allSalesData, setAllSalesData] = useState([]); // Lưu toàn bộ dữ liệu
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Tháng hiện tại (1-12)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Năm hiện tại
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

    // Fetch và xử lý dữ liệu đơn hàng để tính doanh thu theo danh mục và số lượng theo ngày
    const fetchOrderData = async () => {
        try {
            const res = await axios.get(`${url_api}/api/orders/getorders.php`);
            if (!res.data.error && Array.isArray(res.data.data)) {
                // Tạo object để nhóm theo category_name
                const categoryMap = {};
                // Tạo object để nhóm theo ngày
                const dayMap = {};

                // Duyệt qua tất cả đơn hàng
                res.data.data.forEach((order) => {
                    if (order.product_list && Array.isArray(order.product_list)) {
                        // Lấy ngày từ created_at
                        let fullDateKey = null;
                        let dayKey = null;
                        if (order.created_at) {
                            const date = new Date(order.created_at);
                            fullDateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD để sort
                            dayKey = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                            
                            // Khởi tạo dayMap nếu chưa có
                            if (!dayMap[fullDateKey]) {
                                dayMap[fullDateKey] = {
                                    day: dayKey,
                                    fullDate: fullDateKey,
                                    qty: 0,
                                };
                            }
                        }

                        // Duyệt qua từng sản phẩm trong đơn hàng
                        order.product_list.forEach((product) => {
                            const quantity = parseInt(product.quantity || 1);
                            
                            // Xử lý số lượng theo ngày
                            if (fullDateKey && dayMap[fullDateKey]) {
                                dayMap[fullDateKey].qty += quantity;
                            }

                            // Xử lý category
                            const categoryName = product.category_name || "Không phân loại";
                            const price = parseFloat(product.price || product.product_price || 0);
                            const totalPrice = price * quantity;

                            // Nếu category chưa tồn tại, tạo mới
                            if (!categoryMap[categoryName]) {
                                categoryMap[categoryName] = {
                                    name: categoryName,
                                    value: 0, // Tổng giá tiền
                                    quantity: 0, // Tổng số lượng
                                };
                            }

                            // Cộng dồn giá tiền và số lượng
                            categoryMap[categoryName].value += totalPrice;
                            categoryMap[categoryName].quantity += quantity;
                        });
                    }
                });

                // Chuyển object thành array và sắp xếp theo giá tiền giảm dần
                const categoryArray = Object.values(categoryMap).sort((a, b) => b.value - a.value);
                setRevenueStatusData(categoryArray);

                // Xử lý dữ liệu theo ngày: Chuyển object thành array, sắp xếp theo ngày
                // Lưu toàn bộ dữ liệu (không chỉ 30 ngày gần nhất)
                const dayArray = Object.values(dayMap)
                    .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));
                
                setAllSalesData(dayArray);
            }
        } catch (error) {
            console.error("Lỗi lấy dữ liệu đơn hàng:", error);
            setRevenueStatusData([]);
            setSalesByDayData([]);
        }
    };

    // Hàm filter dữ liệu theo tháng và năm
    const filterDataByMonth = (data, month, year) => {
        return data.filter((item) => {
            const date = new Date(item.fullDate);
            return date.getMonth() + 1 === month && date.getFullYear() === year;
        }).map((item) => {
            // Chỉ lấy ngày trong tháng (DD)
            const date = new Date(item.fullDate);
            return {
                ...item,
                day: String(date.getDate()).padStart(2, '0'), // DD
            };
        });
    };

    // Load data khi component mount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([
                fetchRevenueToday(),
                fetchRevenueMonth(),
                fetchOrderData(),
            ]);
            setLoading(false);
        };
        loadData();
    }, []);

    // Filter dữ liệu khi selectedMonth hoặc selectedYear thay đổi
    useEffect(() => {
        if (allSalesData.length > 0) {
            const filtered = filterDataByMonth(allSalesData, selectedMonth, selectedYear);
            setSalesByDayData(filtered);
        }
    }, [selectedMonth, selectedYear, allSalesData]);

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
                        title="Số lượng sản phẩm bán theo ngày"
                        extra={
                            <Space>
                                <Select
                                    value={selectedYear}
                                    onChange={setSelectedYear}
                                    style={{ width: 100 }}
                                    options={(() => {
                                        const currentYear = new Date().getFullYear();
                                        return [
                                            { value: currentYear - 1, label: currentYear - 1 },
                                            { value: currentYear, label: currentYear },
                                            { value: currentYear + 1, label: currentYear + 1 },
                                        ];
                                    })()}
                                />
                                <Select
                                    value={selectedMonth}
                                    onChange={setSelectedMonth}
                                    style={{ width: 120 }}
                                    options={[
                                        { value: 1, label: "Tháng 1" },
                                        { value: 2, label: "Tháng 2" },
                                        { value: 3, label: "Tháng 3" },
                                        { value: 4, label: "Tháng 4" },
                                        { value: 5, label: "Tháng 5" },
                                        { value: 6, label: "Tháng 6" },
                                        { value: 7, label: "Tháng 7" },
                                        { value: 8, label: "Tháng 8" },
                                        { value: 9, label: "Tháng 9" },
                                        { value: 10, label: "Tháng 10" },
                                        { value: 11, label: "Tháng 11" },
                                        { value: 12, label: "Tháng 12" },
                                    ]}
                                />
                            </Space>
                        }
                        style={{
                            borderRadius: 12,
                            background: "#fafbfd",
                        }}
                    >
                        {loading ? (
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
                                <Spin />
                            </div>
                        ) : salesByDayData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={salesByDayData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
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
                                        formatter={(value) => [`${value} sản phẩm`, "Số lượng"]}
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
                        ) : (
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
                                <Text>Chưa có dữ liệu</Text>
                            </div>
                        )}
                    </Card>

                </Col>

                <Col xs={24} md={10}>
                    <Card title="Doanh thu theo danh mục" style={{ borderRadius: 12 }}>
                        {loading ? (
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
                                <Spin />
                            </div>
                        ) : revenueStatusData.length > 0 ? (
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
                                        formatter={(value) => formatCurrency(value)}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
                                <Text>Chưa có dữ liệu</Text>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
