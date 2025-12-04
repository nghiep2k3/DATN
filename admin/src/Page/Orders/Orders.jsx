import React, { useEffect, useState } from "react";
import { Table, Tag, Card, Input, Select, Space, Button, message } from "antd";

// Fake API trả về dữ liệu đơn hàng (với `items` để minh hoạ)
// Các ví dụ minh hoạ:
// - Đơn 1: 1 sản phẩm đơn lẻ
// - Đơn 2: Nhiều sản phẩm (hiển thị nhiều tag)
// - Đơn 3: Giao dịch B2B với nhiều sản phẩm
// - Đơn 4: Đơn đã huỷ (không có items)
// - Đơn 5: Có giảm giá/chiết khấu (ví dụ giá đã cập nhật trong `price`)
const mockOrders = [
    {
        id: "DH001",
        customer: "Nguyễn Văn A",
        items: [
            { sku: "SP001", name: "Laptop ABC", qty: 1, price: 5200000 },
        ],
        status: "processing",
        date: "2025-02-10",
    },
    {
        id: "DH002",
        customer: "Trần Thị B",
        items: [
            { sku: "SP010", name: "Tai nghe X", qty: 1, price: 290000 },
            { sku: "SP011", name: "Chuột Y", qty: 2, price: 500000 },
        ],
        status: "completed",
        date: "2025-02-09",
    },
    {
        id: "DH003",
        customer: "Công ty Nam Hoà",
        items: [
            { sku: "SP020", name: "Server Rack", qty: 2, price: 3000000 },
            { sku: "SP021", name: "UPS 3kVA", qty: 1, price: 2990000 },
            { sku: "SP022", name: "Cáp mạng CAT6 (100m)", qty: 10, price: 10000 },
        ],
        status: "processing",
        date: "2025-02-09",
    },
    {
        id: "DH004",
        customer: "Phạm Minh K",
        items: [], // ví dụ đơn bị huỷ, không có items
        status: "cancelled",
        date: "2025-02-08",
    },
    {
        id: "DH005",
        customer: "Lê Văn C",
        items: [
            // ví dụ có chiết khấu: giá đã là giá sau chiết khấu
            { sku: "SP030", name: "Điện thoại Z (KM)", qty: 1, price: 4200000 },
        ],
        status: "completed",
        date: "2025-02-07",
    },
    {
        id: "DH006",
        customer: "Lê Văn C",
        items: [
            // ví dụ có chiết khấu: giá đã là giá sau chiết khấu
            { sku: "SP030", name: "Điện thoại Z (KM)", qty: 1, price: 4200000 },
        ],
        status: "completed",
        date: "2025-02-07",
    },
    {
        id: "DH007",
        customer: "Lê Văn C",
        items: [
            // ví dụ có chiết khấu: giá đã là giá sau chiết khấu
            { sku: "SP030", name: "Điện thoại Z (KM)", qty: 1, price: 4200000 },
        ],
        status: "completed",
        date: "2025-02-07",
    },
];

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        // Giả lập API call — load sau 0.5s
        setTimeout(() => {
            setOrders(mockOrders);
        }, 500);
    }, []);

    const statusMap = {
        processing: { color: "blue", text: "Đang xử lý" },
        completed: { color: "green", text: "Hoàn thành" },
        cancelled: { color: "red", text: "Đã hủy" },
    };

    const updateOrderStatus = (id, newStatus) => {
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
        message.success(`Cập nhật trạng thái ${id} → ${statusMap[newStatus].text}`);
    };

    const columns = [
        {
            title: "Mã đơn",
            dataIndex: "id",
            key: "id",
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: "Khách hàng",
            dataIndex: "customer",
            key: "customer",
        },
        {
            title: "Sản phẩm",
            dataIndex: "items",
            key: "items",
            render: (items) => {
                if (!items || items.length === 0) return <i>Không có sản phẩm</i>;
                // hiển thị tối đa 2 tag, còn lại hiện "..."
                const display = items.slice(0, 2).map((it) => (
                    <Tag key={it.sku} style={{ marginBottom: 6 }}>
                        {it.name} x{it.qty}
                    </Tag>
                ));
                if (items.length > 2) {
                    display.push(
                        <Tag key="more">+{items.length - 2} khác</Tag>
                    );
                }
                return <div>{display}</div>;
            },
        },
        {
            title: "Tổng tiền",
            dataIndex: "items",
            key: "total",
            sorter: (a, b) => {
                const sum = (o) => (o.items || []).reduce((s, it) => s + it.price * it.qty, 0);
                return sum(a) - sum(b);
            },
            render: (items, record) => {
                const total = (record.items || []).reduce((s, it) => s + it.price * it.qty, 0);
                // nếu ko có items, fallback sang record.total (legacy)
                const value = total || record.total || 0;
                return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status, record) => {
                const s = statusMap[status] || { color: 'default', text: status };
                return (
                    <Space direction="vertical">
                        <Tag color={s.color}>{s.text}</Tag>
                        <Select
                            value={status}
                            onChange={(val) => updateOrderStatus(record.id, val)}
                            options={[
                                { value: 'processing', label: 'Đang xử lý' },
                                { value: 'completed', label: 'Hoàn thành' },
                                { value: 'cancelled', label: 'Đã hủy' },
                            ]}
                            style={{ width: 140 }}
                        />
                    </Space>
                );
            },
        },
        {
            title: "Ngày đặt",
            dataIndex: "date",
            key: "date",
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
            render: (date) => new Date(date).toLocaleDateString("vi-VN"),
        },
    ];

    // Áp dụng filter và search trước khi render table
    const filteredOrders = orders.filter((o) => {
        const matchStatus = filterStatus === 'all' ? true : o.status === filterStatus;
        const matchSearch = searchText.trim() === '' ? true : o.id.toLowerCase().includes(searchText.trim().toLowerCase());
        return matchStatus && matchSearch;
    });

    return (
        <Card
            title="Danh sách đơn hàng"
            style={{ borderRadius: 12, margin: 24 }}
        >
            <Space style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
                <Space>
                    <Input.Search
                        placeholder="Tìm theo mã đơn (VD: DH001)"
                        allowClear
                        onSearch={(val) => setSearchText(val)}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 280 }}
                    />

                    <Select
                        value={filterStatus}
                        onChange={(val) => setFilterStatus(val)}
                        style={{ width: 160 }}
                        options={[
                            { value: 'all', label: 'Tất cả trạng thái' },
                            { value: 'processing', label: 'Đang xử lý' },
                            { value: 'completed', label: 'Hoàn thành' },
                            { value: 'cancelled', label: 'Đã hủy' },
                        ]}
                    />
                    <Button onClick={() => { setFilterStatus('all'); setSearchText(''); }}>Xóa bộ lọc</Button>
                </Space>

                <div>
                    <strong>Tổng đơn đã lọc: </strong>{filteredOrders.length}
                </div>
            </Space>

            <Table
                columns={columns}
                dataSource={filteredOrders}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                expandable={{
                    expandedRowRender: (record) => {
                        if (!record.items || record.items.length === 0) return <i>Không có sản phẩm chi tiết</i>;
                        return (
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                {record.items.map((it) => (
                                    <Card key={it.sku} size="small" style={{ minWidth: 220 }}>
                                        <div><strong>{it.name}</strong></div>
                                        <div>Số lượng: {it.qty}</div>
                                        <div>Đơn giá: {it.price.toLocaleString('vi-VN')} VND</div>
                                        <div>Tổng: {(it.price * it.qty).toLocaleString('vi-VN')} VND</div>
                                    </Card>
                                ))}
                            </div>
                        );
                    }
                }}
            />
        </Card>
    );
}
