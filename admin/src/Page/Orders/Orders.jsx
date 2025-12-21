import React, { useEffect, useState } from "react";
import { Table, Tag, Card, Input, Select, Space, Button, message, Popconfirm, Form, Modal, Row, Col } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { url_api } from "../../config";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchText, setSearchText] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [createForm] = Form.useForm();
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${url_api}/api/orders/getorders.php`, {
                headers: { "Content-Type": "application/json" },
            });

            if (!res.data.error && Array.isArray(res.data.data)) {
                // Mapping dữ liệu từ API
                const mapped = res.data.data.map((o) => ({
                    ...o,
                    // Giữ nguyên các trường từ API
                    id: o.id,
                    full_name: o.full_name,
                    phone: o.phone,
                    email: o.email,
                    status: o.status,
                    total_price: Number(o.total_price || 0),
                    shipping_address: o.shipping_address,
                    note: o.note || "",
                    payment_method: o.payment_method,
                    contentCk: o.contentCk || "",
                    created_at: o.created_at,
                    // Map product_list từ API - hỗ trợ cả 2 format (name/qty và product_name/quantity)
                    product_list: (o.product_list || []).map((p) => ({
                        ...p, // Giữ nguyên tất cả các trường gốc
                        cart_id: p.cart_id,
                        user_id: p.user_id,
                        product_id: p.product_id,
                        // Hỗ trợ cả 2 format: quantity hoặc qty
                        quantity: Number(p.quantity || p.qty || 1),
                        phone: p.phone,
                        price: Number(p.price || p.product_price || p.unit_price || 0),
                        // Hỗ trợ cả 2 format: product_name hoặc name
                        product_name: p.product_name || p.name || '',
                        name: p.product_name || p.name || '',
                        sku: p.sku,
                        description: p.description,
                        product_price: Number(p.product_price || p.unit_price || p.price || 0),
                        stock_quantity: p.stock_quantity,
                        brand_name: p.brand_name,
                        category_name: p.category_name,
                        images: p.images || [],
                        // Giữ thêm các trường để tương thích với UI
                        qty: Number(p.quantity || p.qty || 1),
                        unit_price: Number(p.price || p.product_price || p.unit_price || 0),
                    })),
                    // Các trường để tương thích với UI cũ
                    customer: o.full_name,
                    items: (o.product_list || []).map((p) => ({
                        sku: p.sku || p.product_id,
                        name: p.product_name || p.name || '',
                        qty: Number(p.quantity || p.qty || 1),
                        price: Number(p.price || p.product_price || p.unit_price || 0),
                        product_id: p.product_id,
                        unit_price: Number(p.price || p.product_price || p.unit_price || 0),
                    })),
                    date: o.created_at,
                    total: Number(o.total_price || 0),
                }));
                setOrders(mapped);
            } else {
                message.error(res.data.message || "Không thể tải danh sách đơn hàng");
            }
        } catch (error) {
            console.error("Lỗi tải danh sách đơn hàng:", error);
            message.error("Không thể kết nối đến máy chủ");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoadingProducts(true);
            const res = await axios.get(`${url_api}/api/product/get_all_products.php`, {
                headers: { "Content-Type": "application/json" },
            });

            if (!res.data.error && Array.isArray(res.data.products)) {
                setProducts(res.data.products);
            } else {
                message.error(res.data.message || "Không thể tải danh sách sản phẩm");
            }
        } catch (error) {
            console.error("Lỗi tải danh sách sản phẩm:", error);
            message.error("Không thể kết nối đến máy chủ");
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
        fetchProducts(); // Load sản phẩm khi mở modal
    };

    const statusMap = {
        "Chưa thanh toán": { color: "orange", text: "Chưa thanh toán" },
        "Đã thanh toán": { color: "green", text: "Đã thanh toán" },
        "Đang giao hàng": { color: "blue", text: "Đang giao hàng" },
        "Đã hủy": { color: "red", text: "Đã hủy" },
    };

    const updateOrderStatus = async (id, newStatus) => {
        const target = orders.find((o) => o.id === id);
        if (!target) return;

        const updated = { ...target, status: newStatus };

        const payload = {
            full_name: updated.full_name,
            phone: updated.phone,
            email: updated.email,
            status: updated.status,
            product_list: (updated.product_list || updated.items || []).map((it) => ({
                product_id: it.product_id || it.sku,
                name: it.name,
                qty: it.qty,
                unit_price: it.unit_price || it.price,
            })),
            note: updated.note || "",
            payment_method: updated.payment_method,
            shipping_address: updated.shipping_address,
            total_price: updated.total_price || updated.total,
        };

        try {
            await axios.post(`${url_api}/api/orders/updateorder.php?id=${id}`, payload, {
                headers: { "Content-Type": "application/json" },
            });
            setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
            const s = statusMap[newStatus];
            message.success(`Cập nhật trạng thái đơn #${id}${s ? ` → ${s.text}` : ""}`);
        } catch (error) {
            console.error("Lỗi cập nhật đơn hàng:", error);
            message.error("Không thể cập nhật đơn hàng");
        }
    };

    const deleteOrder = async (id) => {
        try {
            const res = await axios.delete(`${url_api}/api/orders/deleteorder.php?id=${id}`);
            if (!res.data.error) {
                setOrders((prev) => prev.filter((o) => o.id !== id));
                message.success(res.data.message || "Đã xoá đơn hàng");
            } else {
                message.error(res.data.message || "Xoá đơn hàng thất bại");
            }
        } catch (error) {
            console.error("Lỗi xoá đơn hàng:", error);
            message.error("Không thể kết nối đến máy chủ");
        }
    };

    const handleCreateOrder = async (values) => {
        // Xử lý product_list từ Form.List
        if (!values.product_list || values.product_list.length === 0) {
            message.error("Vui lòng thêm ít nhất một sản phẩm");
            return;
        }

        const product_list = values.product_list.map((item) => ({
            product_id: item.product_id || 0,
            name: item.product_name || "",
            qty: Number(item.qty || 1),
            unit_price: Number(item.unit_price || 0),
        }));

        // Tính tổng tiền
        const totalPrice = product_list.reduce((sum, item) => sum + item.qty * item.unit_price, 0);

        const payload = {
            user_id: null,
            full_name: values.full_name,
            phone: values.phone,
            email: values.email,
            status: values.status || "Chưa thanh toán",
            product_list,
            shipping_address: values.shipping_address,
            note: values.note || "",
            payment_method: values.payment_method,
            total_price: totalPrice,
            contentCk: "",
        };

        try {
            setCreating(true);
            const res = await axios.post(`${url_api}/api/orders/createorder.php`, payload, {
                headers: { "Content-Type": "application/json" },
            });

            if (!res.data.error) {
                message.success(res.data.message || "Thêm đơn hàng thành công");
                setIsCreateModalOpen(false);
                createForm.resetFields();
                // load lại danh sách để chắc chắn đồng bộ với DB
                await fetchOrders();
            } else {
                message.error(res.data.message || "Không thể tạo đơn hàng");
            }
        } catch (error) {
            console.error("Lỗi tạo đơn hàng:", error);
            message.error("Không thể kết nối đến máy chủ");
        } finally {
            setCreating(false);
        }
    };

    const columns = [
        {
            title: "Mã đơn",
            dataIndex: "id",
            key: "id",
            render: (text) => <strong>#{text}</strong>,
            width: 100,
        },
        {
            title: "Khách hàng",
            dataIndex: "customer",
            key: "customer",
            width: 180,
        },
        {
            title: "Sản phẩm",
            dataIndex: "product_list",
            key: "product_list",
            render: (productList) => {
                if (!productList || productList.length === 0) return <i>Không có sản phẩm</i>;
                const display = productList.slice(0, 2).map((p, index) => {
                    const productName = p.product_name || p.name || 'Sản phẩm không tên';
                    const quantity = p.quantity || p.qty || 1;
                    return (
                        <Tag key={p.product_id || p.cart_id || index} style={{ marginBottom: 6 }}>
                            {productName} x{quantity}
                        </Tag>
                    );
                });
                if (productList.length > 2) {
                    display.push(
                        <Tag key="more">+{productList.length - 2} khác</Tag>
                    );
                }
                return <div>{display}</div>;
            },
            width: 250,
        },
        {
            title: "Tổng tiền",
            dataIndex: "total_price",
            key: "total_price",
            sorter: (a, b) => {
                const valA = Number(a.total_price || a.total || 0);
                const valB = Number(b.total_price || b.total || 0);
                return valA - valB;
            },
            render: (_, record) => {
                const value = Number(record.total_price || record.total || 0);
                return value.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                });
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status, record) => {
                const s = statusMap[status] || { color: "default", text: status };
                return (
                    <Space direction="vertical">
                        <Tag color={s.color}>{s.text}</Tag>
                        <Select
                            value={status}
                            onChange={(val) => updateOrderStatus(record.id, val)}
                            options={[
                                { value: "Chưa thanh toán", label: "Chưa thanh toán" },
                                { value: "Đã thanh toán", label: "Đã thanh toán" },
                                { value: "Đang giao hàng", label: "Đang giao hàng" },
                                { value: "Đã hủy", label: "Đã hủy" },
                            ]}
                            style={{ width: 140 }}
                        />
                    </Space>
                );
            },
        },
        {
            title: "Ngày đặt",
            dataIndex: "created_at",
            key: "created_at",
            sorter: (a, b) => {
                const dateA = new Date(a.created_at || a.date);
                const dateB = new Date(b.created_at || b.date);
                return dateA - dateB;
            },
            render: (date, record) => {
                const dateStr = date || record.date || record.created_at;
                if (!dateStr) return "-";
                return new Date(dateStr).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                });
            },
            width: 180,
        },
        {
            title: "Thao tác",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Popconfirm
                        title="Xoá đơn hàng"
                        description={`Bạn có chắc muốn xoá đơn #${record.id}?`}
                        okText="Xoá"
                        cancelText="Huỷ"
                        onConfirm={() => deleteOrder(record.id)}
                    >
                        <Button danger>Xoá</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Áp dụng filter và search trước khi render table
    const filteredOrders = orders.filter((o) => {
        const matchStatus = filterStatus === "all" ? true : o.status === filterStatus;
        const searchLower = searchText.trim().toLowerCase();
        const matchSearch =
            searchLower === ""
                ? true
                : String(o.id).toLowerCase().includes(searchLower) ||
                  (o.full_name && o.full_name.toLowerCase().includes(searchLower)) ||
                  (o.phone && o.phone.includes(searchLower)) ||
                  (o.email && o.email.toLowerCase().includes(searchLower));
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
                        placeholder="Tìm theo mã đơn, tên, SĐT, email"
                        allowClear
                        onSearch={(val) => setSearchText(val)}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                    />

                    <Select
                        value={filterStatus}
                        onChange={(val) => setFilterStatus(val)}
                        style={{ width: 160 }}
                        options={[
                            { value: "all", label: "Tất cả trạng thái" },
                            { value: "Chưa thanh toán", label: "Chưa thanh toán" },
                            { value: "Đã thanh toán", label: "Đã thanh toán" },
                            { value: "Đang giao hàng", label: "Đang giao hàng" },
                            { value: "Đã hủy", label: "Đã hủy" },
                        ]}
                    />
                    <Button onClick={() => { setFilterStatus('all'); setSearchText(''); }}>Xóa bộ lọc</Button>
                </Space>

                <Space>
                    <div>
                        <strong>Tổng đơn đã lọc: </strong>{filteredOrders.length}
                    </div>
                    <Button type="primary" onClick={handleOpenCreateModal}>
                        Thêm đơn hàng
                    </Button>
                </Space>
            </Space>

            <Table
                columns={columns}
                dataSource={filteredOrders}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                expandable={{
                    expandedRowRender: (record) => {
                        const productList = record.product_list || record.items || [];
                        if (productList.length === 0) return <i>Không có sản phẩm chi tiết</i>;
                        return (
                            <div style={{ padding: '16px' }}>
                                <Row gutter={[16, 16]}>
                                    <Col span={24}>
                                        <div style={{ marginBottom: '12px' }}>
                                            <strong>Thông tin khách hàng:</strong>
                                            <div>Họ tên: {record.full_name}</div>
                                            <div>Điện thoại: {record.phone}</div>
                                            <div>Email: {record.email}</div>
                                            <div>Địa chỉ: {record.shipping_address}</div>
                                            <div>Phương thức thanh toán: {record.payment_method}</div>
                                            {record.note && <div>Ghi chú: {record.note}</div>}
                                        </div>
                                    </Col>
                                    <Col span={24}>
                                        <strong>Chi tiết sản phẩm:</strong>
                                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: '8px' }}>
                                            {productList.map((p, index) => {
                                                const productName = p.product_name || p.name;
                                                const quantity = Number(p.quantity || p.qty || 1);
                                                const price = Number(p.price || p.product_price || p.unit_price || 0);
                                                const total = price * quantity;
                                                const imageUrl = p.images && p.images.length > 0 
                                                    ? `${url_api}${p.images[0]}` 
                                                    : null;
                                                
                                                return (
                                                    <Card 
                                                        key={p.product_id || p.cart_id || index} 
                                                        size="small" 
                                                        style={{ minWidth: 280 }}
                                                        cover={imageUrl ? (
                                                            <img 
                                                                alt={productName}
                                                                src={imageUrl}
                                                                style={{ height: 120, objectFit: 'cover' }}
                                                            />
                                                        ) : null}
                                                    >
                                                        <div><strong>{productName}</strong></div>
                                                        {p.sku && <div>SKU: {p.sku}</div>}
                                                        {p.brand_name && <div>Thương hiệu: {p.brand_name}</div>}
                                                        {p.category_name && <div>Danh mục: {p.category_name}</div>}
                                                        <div>Số lượng: {quantity}</div>
                                                        <div>Đơn giá: {price.toLocaleString('vi-VN')} VND</div>
                                                        <div style={{ marginTop: '8px', fontWeight: 'bold', color: '#1890ff' }}>
                                                            Tổng: {total.toLocaleString('vi-VN')} VND
                                                        </div>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        );
                    }
                }}
            />

            <Modal
                title="Thêm đơn hàng"
                open={isCreateModalOpen}
                onCancel={() => setIsCreateModalOpen(false)}
                footer={null}
                destroyOnClose
                width={900}
            >
                <Form
                    layout="vertical"
                    form={createForm}
                    onFinish={handleCreateOrder}
                    initialValues={{
                        status: "Chưa thanh toán",
                        payment_method: "Thanh toán QR code",
                        product_list: [{ qty: 1 }], // Khởi tạo với 1 sản phẩm
                    }}
                >
                    <Row gutter={16}>
                        {/* Cột trái */}
                        <Col span={12}>
                            <Form.Item
                                name="full_name"
                                label="Họ tên khách hàng"
                                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                            >
                                <Input placeholder="Nguyễn Văn A" />
                            </Form.Item>

                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                            >
                                <Input placeholder="0987xxxxxx" />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: "Vui lòng nhập email" },
                                    { type: "email", message: "Email không hợp lệ" },
                                ]}
                            >
                                <Input placeholder="email@example.com" />
                            </Form.Item>

                            <Form.Item
                                name="shipping_address"
                                label="Địa chỉ giao hàng"
                                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                            >
                                <Input.TextArea rows={2} placeholder="Số nhà, đường, quận/huyện, tỉnh/thành" />
                            </Form.Item>

                            <Form.Item name="status" label="Trạng thái">
                                <Select
                                    options={[
                                        { value: "Chưa thanh toán", label: "Chưa thanh toán" },
                                        { value: "Đã thanh toán", label: "Đã thanh toán" },
                                        { value: "Đang giao hàng", label: "Đang giao hàng" },
                                        { value: "Đã hủy", label: "Đã hủy" },
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item
                                name="payment_method"
                                label="Phương thức thanh toán"
                                rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán" }]}
                            >
                                <Select
                                    options={[
                                        { value: "Thanh toán QR code", label: "Thanh toán QR code" },
                                        { value: "COD", label: "Thanh toán khi nhận hàng (COD)" },
                                        { value: "Chuyển khoản", label: "Chuyển khoản" },
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item name="note" label="Ghi chú">
                                <Input.TextArea rows={3} placeholder="Ghi chú cho đơn hàng (tùy chọn)" />
                            </Form.Item>
                        </Col>

                        {/* Cột phải - Danh sách sản phẩm */}
                        <Col span={12}>
                            <Form.Item label="Danh sách sản phẩm" required>
                                <Form.List name="product_list">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map(({ key, name, ...restField }) => {
                                                return (
                                                    <Card
                                                        key={key}
                                                        size="small"
                                                        style={{ marginBottom: 12 }}
                                                        extra={
                                                            fields.length > 1 ? (
                                                                <Button
                                                                    type="text"
                                                                    danger
                                                                    icon={<DeleteOutlined />}
                                                                    onClick={() => remove(name)}
                                                                />
                                                            ) : null
                                                        }
                                                    >
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, "product_id"]}
                                                            label="Chọn sản phẩm"
                                                            rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
                                                        >
                                                            <Select
                                                                placeholder="Chọn sản phẩm"
                                                                showSearch
                                                                optionFilterProp="children"
                                                                loading={loadingProducts}
                                                                onChange={(value) => {
                                                                    const selectedProduct = products.find((p) => p.id === value);
                                                                    if (selectedProduct) {
                                                                        // Tự động điền tên và giá sản phẩm
                                                                        const currentList = createForm.getFieldValue("product_list") || [];
                                                                        const updatedList = currentList.map((item, idx) =>
                                                                            idx === name
                                                                                ? {
                                                                                      ...item,
                                                                                      product_id: selectedProduct.id,
                                                                                      product_name: selectedProduct.name,
                                                                                      unit_price: Number(selectedProduct.price || 0),
                                                                                  }
                                                                                : item
                                                                        );
                                                                        createForm.setFieldsValue({
                                                                            product_list: updatedList,
                                                                        });
                                                                    }
                                                                }}
                                                            >
                                                                {products.map((product) => (
                                                                    <Select.Option key={product.id} value={product.id}>
                                                                        #{product.id} - {product.name}
                                                                    </Select.Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>

                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, "product_name"]}
                                                            hidden
                                                        >
                                                            <Input />
                                                        </Form.Item>

                                                        <Row gutter={8}>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, "qty"]}
                                                                    label="Số lượng"
                                                                    rules={[{ required: true, message: "Nhập số lượng" }]}
                                                                >
                                                                    <Input type="number" min={1} placeholder="1" />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, "unit_price"]}
                                                                    label="Đơn giá (VND)"
                                                                    rules={[{ required: true, message: "Nhập đơn giá" }]}
                                                                >
                                                                    <Input type="number" min={0} placeholder="0" />
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                );
                                            })}
                                            <Button
                                                type="dashed"
                                                onClick={() => add({ qty: 1 })}
                                                block
                                                icon={<PlusOutlined />}
                                                style={{ marginTop: 8 }}
                                            >
                                                Thêm sản phẩm
                                            </Button>
                                        </>
                                    )}
                                </Form.List>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ marginTop: 16, marginBottom: 0 }}>
                        <Space style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button onClick={() => setIsCreateModalOpen(false)}>Huỷ</Button>
                            <Button type="primary" htmlType="submit" loading={creating}>
                                Lưu đơn hàng
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}
