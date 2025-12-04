import React, { useState, useEffect } from 'react';
import { Card, Table, Row, Col, Statistic, Tag, Alert, Space, Input, Select, Button, message } from 'antd';
import { ShopOutlined, ShoppingCartOutlined, DollarOutlined, AlertOutlined} from '@ant-design/icons';

// Mock dữ liệu kho hàng
const mockWarehouseData = [
    { id: 'SP001', name: 'Laptop ABC', sku: 'LAP-ABC-001', category: 'Công nghệ', quantity: 5, minStock: 10, price: 5200000, supplier: 'Công ty X', lastUpdate: '2025-02-10' },
    { id: 'SP010', name: 'Tai nghe X', sku: 'HEAD-X-001', category: 'Phụ kiện', quantity: 25, minStock: 20, price: 290000, supplier: 'Công ty Y', lastUpdate: '2025-02-09' },
    { id: 'SP011', name: 'Chuột Y', sku: 'MOUSE-Y-001', category: 'Phụ kiện', quantity: 18, minStock: 15, price: 250000, supplier: 'Công ty Z', lastUpdate: '2025-02-08' },
    { id: 'SP020', name: 'Server Rack', sku: 'SERV-RACK-001', category: 'Công nghệ', quantity: 2, minStock: 3, price: 3000000, supplier: 'Công ty A', lastUpdate: '2025-02-07' },
    { id: 'SP021', name: 'UPS 3kVA', sku: 'UPS-3K-001', category: 'Năng lượng', quantity: 8, minStock: 5, price: 2990000, supplier: 'Công ty B', lastUpdate: '2025-02-06' },
    { id: 'SP022', name: 'Cáp mạng CAT6 (100m)', sku: 'CABLE-CAT6-100', category: 'Cáp', quantity: 50, minStock: 30, price: 10000, supplier: 'Công ty C', lastUpdate: '2025-02-05' },
    { id: 'SP030', name: 'Điện thoại Z', sku: 'PHONE-Z-001', category: 'Công nghệ', quantity: 3, minStock: 5, price: 4200000, supplier: 'Công ty D', lastUpdate: '2025-02-04' },
    { id: 'SP031', name: 'Bàn phím Cơ', sku: 'KEY-MECH-001', category: 'Phụ kiện', quantity: 12, minStock: 10, price: 1500000, supplier: 'Công ty E', lastUpdate: '2025-02-03' },
];

export default function Warehouse() {
    const [products, setProducts] = useState([]);
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchText, setSearchText] = useState('');
    const [lowStockOnly, setLowStockOnly] = useState(false);

    useEffect(() => {
        setTimeout(() => setProducts(mockWarehouseData), 300);
    }, []);

    // Tính toán thống kê
    const totalProducts = products.length;
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
    const lowStockCount = products.filter(p => p.quantity < p.minStock).length;

    // Lọc dữ liệu
    const filteredProducts = products.filter((p) => {
        const matchCategory = filterCategory === 'all' || p.category === filterCategory;
        const matchSearch = searchText.trim() === '' || p.name.toLowerCase().includes(searchText.toLowerCase()) || p.sku.toLowerCase().includes(searchText.toLowerCase());
        const matchStock = lowStockOnly ? p.quantity < p.minStock : true;
        return matchCategory && matchSearch && matchStock;
    });

    const handleRestockAlert = (productId, productName) => {
        message.info(`Gửi yêu cầu bổ sung hàng cho ${productName}`);
    };

    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <strong>{text}</strong>,
            width: 200,
        },
        {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
            width: 120,
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            render: (category) => <Tag color="blue">{category}</Tag>,
        },
        {
            title: 'Số lượng tồn',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 100,
            sorter: (a, b) => a.quantity - b.quantity,
            render: (qty) => <strong style={{ fontSize: 16 }}>{qty}</strong>,
        },
        {
            title: 'Hạn tối thiểu',
            dataIndex: 'minStock',
            key: 'minStock',
            width: 100,
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 100,
            render: (_, record) => {
                if (record.quantity < record.minStock) {
                    return <Tag color="red">Còn ít</Tag>;
                } else if (record.quantity >= record.minStock && record.quantity < record.minStock * 1.5) {
                    return <Tag color="orange">Sắp hết</Tag>;
                }
                return <Tag color="green">Bình thường</Tag>;
            },
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => price.toLocaleString('vi-VN') + ' VND',
            width: 120,
        },
        {
            title: 'Tổng giá trị',
            key: 'totalValue',
            render: (_, record) => (record.quantity * record.price).toLocaleString('vi-VN') + ' VND',
            width: 120,
        },
        {
            title: 'Nhà cung cấp',
            dataIndex: 'supplier',
            key: 'supplier',
            width: 120,
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space>
                    {record.quantity < record.minStock && (
                        <Button
                            type="primary"
                            danger
                            size="small"
                            onClick={() => handleRestockAlert(record.id, record.name)}
                        >
                            Bổ sung
                        </Button>
                    )}
                    <Button size="small">Chi tiết</Button>
                </Space>
            ),
        },
    ];

    const categories = ['all', ...new Set(products.map(p => p.category))];

    return (
        <div style={{ padding: '24px' }}>
            <Card title="Thông tin kho hàng" style={{ borderRadius: 12, marginBottom: 24 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={6}>
                        <Statistic
                            title="Tổng sản phẩm"
                            value={totalProducts}
                            prefix={<ShopOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Statistic
                            title="Tổng số lượng"
                            value={totalQuantity}
                            prefix={<ShoppingCartOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Statistic
                            title="Tổng giá trị kho"
                            value={totalValue}
                            prefix={<DollarOutlined />}
                            formatter={(value) => value.toLocaleString('vi-VN')}
                            valueStyle={{ color: '#faad14' }}
                            suffix="VND"
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Statistic
                            title="Hàng còn ít"
                            value={lowStockCount}
                            prefix={<AlertOutlined />}
                            valueStyle={{ color: '#f5222d' }}
                        />
                    </Col>
                </Row>
            </Card>

            {lowStockCount > 0 && (
                <Alert
                    message={`⚠️ Có ${lowStockCount} sản phẩm hết hoặc sắp hết hàng. Vui lòng bổ sung kịp thời!`}
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                    closable
                />
            )}

            <Card title="Danh sách sản phẩm kho" style={{ borderRadius: 12 }}>
                <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <Space>
                        <Input.Search
                            placeholder="Tìm theo tên hoặc SKU"
                            allowClear
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 250 }}
                        />

                        <Select
                            value={filterCategory}
                            onChange={(val) => setFilterCategory(val)}
                            style={{ width: 160 }}
                            options={categories.map(cat => ({
                                value: cat,
                                label: cat === 'all' ? 'Tất cả danh mục' : cat
                            }))}
                        />

                        <Button
                            danger={lowStockOnly}
                            onClick={() => setLowStockOnly(!lowStockOnly)}
                        >
                            {lowStockOnly ? 'Hiện tất cả' : 'Chỉ còn ít'}
                        </Button>

                        <Button onClick={() => { setFilterCategory('all'); setSearchText(''); setLowStockOnly(false); }}>
                            Xóa bộ lọc
                        </Button>
                    </Space>
                </Space>

                <Table
                    columns={columns}
                    dataSource={filteredProducts}
                    rowKey="id"
                    pagination={{ pageSize: 8, total: filteredProducts.length }}
                    scroll={{ x: 1200 }}
                    size="middle"
                />
            </Card>
        </div>
    );
}
