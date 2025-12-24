import React, { useEffect, useState } from "react";
import { Table, Card, Button, InputNumber, Popconfirm, message } from "antd";
import { DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import axios from "axios";
import { url_api } from "../../config";

export default function CartItems() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${url_api}/api/cartitem/getcart.php`);
            if (!res.data.error) {
                setData(res.data.data || []);
            } else {
                setData([]);
            }
        } catch {
            message.error("Không thể tải dữ liệu giỏ hàng");
        }
        setLoading(false);
    };

    const updateQuantity = async (record, quantity) => {
        try {
            await axios.post(
                `${url_api}/api/cartitem/updatecart.php?id=${record.id}`,
                {
                    quantity,
                    phone: record.phone,
                    price: record.price,
                }
            );
            message.success("Cập nhật số lượng thành công");
            fetchData();
        } catch {
            message.error("Cập nhật thất bại");
        }
    };

    const deleteItem = async (id) => {
        try {
            await axios.delete(`${url_api}/api/cartitem/deletecart.php?id=${id}`);
            message.success("Đã xóa item khỏi giỏ");
            fetchData();
        } catch {
            message.error("Xóa thất bại");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            width: 80,
        },
        {
            title: "User ID",
            dataIndex: "user_id",
            width: 100,
            render: (v) => v || "Guest",
        },
        {
            title: "Product ID",
            dataIndex: "product_id",
            width: 120,
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            width: 140,
        },
        {
            title: "Giá",
            dataIndex: "price",
            width: 120,
            render: (v) => Number(v).toLocaleString() + " đ",
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            width: 140,
            render: (qty, record) => (
                <InputNumber
                    min={1}
                    defaultValue={qty}
                    onBlur={(e) =>
                        updateQuantity(record, Number(e.target.value))
                    }
                />
            ),
        },
        {
            title: "Thành tiền",
            width: 140,
            render: (_, r) =>
                (r.quantity * r.price).toLocaleString() + " đ",
        },
        {
            title: "Hành động",
            width: 100,
            render: (_, record) => (
                <Popconfirm
                    title="Xóa item khỏi giỏ?"
                    onConfirm={() => deleteItem(record.id)}
                >
                    <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                    />
                </Popconfirm>
            ),
        },
    ];

    const totalPrice = data.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
    );

    return (
        <Card
            title="Quản lý Cart Items"
            extra={
                <Button
                    icon={<ReloadOutlined />}
                    onClick={fetchData}
                >
                    Reload
                </Button>
            }
        >
            <Table
                rowKey="id"
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={false}
            />

            {data.length > 0 && (
                <div
                    style={{
                        marginTop: 20,
                        textAlign: "right",
                        fontSize: 16,
                        fontWeight: 600,
                    }}
                >
                    Tổng tiền:{" "}
                    <span style={{ color: "#f5222d" }}>
                        {totalPrice.toLocaleString()} đ
                    </span>
                </div>
            )}
        </Card>
    );
}
