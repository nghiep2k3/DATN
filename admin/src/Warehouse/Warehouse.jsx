import React, { useState, useEffect } from 'react';
import { Card, Table, Row, Col, Statistic, Tag, Alert, Space, Input, Select, Button, message, Spin } from 'antd';
import { ShopOutlined, ShoppingCartOutlined, DollarOutlined, AlertOutlined} from '@ant-design/icons';
import axios from 'axios';
import { url_api } from '../config';

export default function Warehouse() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchText, setSearchText] = useState('');
    const [lowStockOnly, setLowStockOnly] = useState(false);
    const [minStockDefault] = useState(5); // Mức tồn kho tối thiểu mặc định

    // Gọi API lấy danh sách sản phẩm
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${url_api}/api/product/get_all_products.php`, {
                headers: { "Content-Type": "application/json" },
            });

            if (!res.data.error && Array.isArray(res.data.products)) {
                // Map dữ liệu từ API
                const mappedProducts = res.data.products.map((p) => ({
                    id: p.id,
                    name: p.name,
                    sku: p.sku,
                    category: p.category_name || 'Chưa phân loại',
                    quantity: Number(p.stock_quantity || 0),
                    minStock: minStockDefault, // Sử dụng giá trị mặc định
                    price: Number(p.price || 0),
                    brand_name: p.brand_name || 'Chưa có thương hiệu',
                    image_url: p.image_url,
                    images: p.images || [],
                    description: p.description,
                    created_at: p.created_at,
                }));
                setProducts(mappedProducts);
            } else {
                message.error(res.data.message || "Không thể tải danh sách sản phẩm");
            }
        } catch (error) {
            console.error("Lỗi tải danh sách sản phẩm:", error);
            message.error("Không thể kết nối đến máy chủ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Tính toán thống kê
    const totalProducts = products.length;
    const totalQuantity = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
    const totalValue = products.reduce((sum, p) => sum + ((p.quantity || 0) * (p.price || 0)), 0);
    const lowStockCount = products.filter(p => (p.quantity || 0) < (p.minStock || minStockDefault)).length;

    // Lọc dữ liệu
    const filteredProducts = products.filter((p) => {
        const matchCategory = filterCategory === 'all' || p.category === filterCategory;
        const searchLower = searchText.trim().toLowerCase();
        const matchSearch = searchLower === '' || 
            (p.name && p.name.toLowerCase().includes(searchLower)) || 
            (p.sku && p.sku.toLowerCase().includes(searchLower)) ||
            (p.brand_name && p.brand_name.toLowerCase().includes(searchLower));
        const matchStock = lowStockOnly ? (p.quantity || 0) < (p.minStock || minStockDefault) : true;
        return matchCategory && matchSearch && matchStock;
    });

    const handleRestockAlert = (productId, productName) => {
        message.info(`Gửi yêu cầu bổ sung hàng cho ${productName}`);
        // TODO: Có thể thêm logic gửi yêu cầu bổ sung hàng qua API
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
            width: 120,
            sorter: (a, b) => (a.quantity || 0) - (b.quantity || 0),
            render: (qty) => <strong style={{ fontSize: 16, color: (qty || 0) < minStockDefault ? '#f5222d' : '#52c41a' }}>
                {qty || 0}
            </strong>,
        },
        {
            title: 'Hạn tối thiểu',
            dataIndex: 'minStock',
            key: 'minStock',
            width: 120,
            render: (minStock) => minStock || minStockDefault,
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 120,
            render: (_, record) => {
                const qty = record.quantity || 0;
                const minStock = record.minStock || minStockDefault;
                if (qty < minStock) {
                    return <Tag color="red">Còn ít</Tag>;
                } else if (qty >= minStock && qty < minStock * 1.5) {
                    return <Tag color="orange">Sắp hết</Tag>;
                }
                return <Tag color="green">Bình thường</Tag>;
            },
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => (a.price || 0) - (b.price || 0),
            render: (price) => {
                const priceNum = Number(price || 0);
                return priceNum > 0 
                    ? priceNum.toLocaleString('vi-VN') + ' VND'
                    : <span style={{ color: '#999' }}>Chưa có giá</span>;
            },
            width: 150,
        },
        {
            title: 'Tổng giá trị',
            key: 'totalValue',
            sorter: (a, b) => {
                const valA = (a.quantity || 0) * (a.price || 0);
                const valB = (b.quantity || 0) * (b.price || 0);
                return valA - valB;
            },
            render: (_, record) => {
                const total = (record.quantity || 0) * (record.price || 0);
                return total > 0 
                    ? total.toLocaleString('vi-VN') + ' VND'
                    : <span style={{ color: '#999' }}>-</span>;
            },
            width: 150,
        },
        {
            title: 'Thương hiệu',
            dataIndex: 'brand_name',
            key: 'brand_name',
            width: 150,
            render: (brand) => brand || 'Chưa có',
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_, record) => {
                const qty = record.quantity || 0;
                const minStock = record.minStock || minStockDefault;
                return (
                    <Space>
                        {qty < minStock && (
                            <Button
                                type="primary"
                                danger
                                size="small"
                                onClick={() => handleRestockAlert(record.id, record.name)}
                            >
                                Bổ sung
                            </Button>
                        )}
                    </Space>
                );
            },
        },
    ];

    // Lấy danh sách danh mục từ products
    const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

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
                            precision={0}
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
                            placeholder="Tìm theo tên, SKU hoặc thương hiệu"
                            allowClear
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 280 }}
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
                    loading={loading}
                    pagination={{ 
                        pageSize: 10, 
                        total: filteredProducts.length,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} sản phẩm`
                    }}
                    scroll={{ x: 'max-content' }}
                    size="middle"
                />
            </Card>
        </div>
    );
}
