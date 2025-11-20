import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Upload,
    Button,
    Select,
    message
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { url_api, url } from "../../config";
import "./Product.css";

export default function Product() {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");

    const [openModal, setOpenModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [form] = Form.useForm();

    // ================================
    // FETCH PRODUCTS
    // ================================
    const loadProducts = () => {
        axios
            .get(`${url_api}/api/product/get_all_products.php`)
            .then((res) => {
                if (res.data?.products) setProducts(res.data.products);
            })
            .catch((err) => console.error("Lỗi API:", err));
    };

    // FETCH BRANDS
    const loadBrands = () => {
        axios.get(`${url_api}/api/brands/getbrands.php`)
            .then((res) => {
                setBrands(res.data.data || []);
            });
    };

    // FETCH CATEGORIES
    const loadCategories = () => {
        axios.get(`${url_api}/api/categories/getcategories.php?with_children=all`)
            .then((res) => setCategories(res.data.data || []));
    };

    useEffect(() => {
        loadProducts();
        loadBrands();
        loadCategories();
    }, []);

    // Lọc
    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    // ================================
    // OPEN ADD PRODUCT
    // ================================
    const handleOpenAdd = () => {
        setEditMode(false);
        setEditingProduct(null);
        form.resetFields();
        setOpenModal(true);
    };

    // ================================
    // OPEN EDIT PRODUCT
    // ================================
    const handleOpenEdit = (p) => {
        setEditMode(true);
        setEditingProduct(p);

        form.setFieldsValue({
            id: p.id,
            name: p.name,
            sku: p.sku,
            description: p.description,
            price: p.price,
            stock_quantity: p.stock_quantity,
            brand_id: p.brand_id,
            category_id: p.category_id
        });

        setOpenModal(true);
    };

    // ================================
    // SUBMIT CREATE / UPDATE
    // ================================
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const formData = new FormData();

            Object.keys(values).forEach((key) => {
                if (key !== "images") {
                    const value =
                        typeof values[key] === "number"
                            ? String(values[key])
                            : values[key];

                    formData.append(key, value);
                }
            });

            if (values.images && values.images.length > 0) {
                values.images.forEach((fileObj) => {
                    formData.append("image[]", fileObj.originFileObj);
                });
            }
            // 🔥 Log toàn bộ FormData (bao gồm file)
            console.log("📦 FORM DATA GỬI LÊN API:");
            for (let pair of formData.entries()) {
                console.log(pair[0] + ": ", pair[1]);
            }

            const apiUrl = editMode
                ? `${url_api}/api/product/updateproduct.php`
                : `${url_api}/api/product/createproduct.php`;

            const res = await axios.post(apiUrl, formData);

            if (!res.data.error) {
                message.success(editMode ? "Cập nhật thành công" : "Tạo sản phẩm thành công");
                setOpenModal(false);
                loadProducts();
            } else {
                message.error(res.data.message);
            }

        } catch (error) {
            console.error("Lỗi submit:", error);
        }
    };

    // ================================
    // DELETE PRODUCT
    // ================================
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa sản phẩm ID: " + id)) return;

        try {
            const res = await axios.delete(`${url_api}/api/product/deleteproduct.php?id=${id}`);

            if (!res.data.error) {
                message.success("Xóa thành công");
                loadProducts();
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            message.error("Lỗi khi xóa sản phẩm");
        }
    };

    // ================================
    // UI RENDER
    // ================================
    return (
        <div className="category-container">

            <div className="category-header">
                <h2 className="category-title">Quản lý sản phẩm</h2>

                <div className="category-actions">
                    <input
                        type="text"
                        className="category-search"
                        placeholder="Tìm sản phẩm..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button className="btn-add" onClick={handleOpenAdd}>
                        + Thêm sản phẩm
                    </button>
                </div>
            </div>

            <div className="category-grid">
                {filteredProducts.map((p) => (
                    <div key={p.id} className="category-card">

                        <img
                            src={`${url}/${p.image_url}`}
                            alt={p.name}
                            className="category-image"
                        />

                        <div className="category-content">
                            <div className="category-header-row">
                                <h3 className="category-name">{p.name}</h3>

                                <div className="category-buttons">
                                    <button className="btn-edit" onClick={() => handleOpenEdit(p)}>
                                        Sửa
                                    </button>

                                    <button className="btn-delete" onClick={() => handleDelete(p.id)}>
                                        Xóa
                                    </button>
                                </div>
                            </div>

                            <p>SKU: {p.sku}</p>
                            <p>Giá: {Number(p.price).toLocaleString()} đ</p>
                            <p>Tồn kho: {p.stock_quantity}</p>
                            <p>Thương hiệu: {p.brand_name}</p>
                            <p>Danh mục: {p.category_name}</p>

                            <div className="product-thumbs">
                                {p.images.map((img, i) => (
                                    <img
                                        key={i}
                                        src={`${url}/${img}`}
                                        alt="thumb"
                                        className="thumb-image"
                                    />
                                ))}
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            {/* ============= MODAL ============= */}
            <Modal
                open={openModal}
                onCancel={() => setOpenModal(false)}
                onOk={handleSubmit}
                title={editMode ? "Sửa sản phẩm" : "Thêm sản phẩm"}
                okText={editMode ? "Cập nhật" : "Tạo mới"}
                width={700}
            >
                <Form form={form} layout="vertical">

                    {editMode && (
                        <Form.Item name="id" hidden>
                            <Input />
                        </Form.Item>
                    )}

                    <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="SKU" name="sku" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item label="Giá" name="price" rules={[{ required: true }]}>
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="Tồn kho" name="stock_quantity" rules={[{ required: true }]}>
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="Thương hiệu" name="brand_id" rules={[{ required: true }]}>
                        <Select placeholder="Chọn thương hiệu">
                            {brands.map((b) => (
                                <Select.Option key={b.id} value={b.id}>
                                    {b.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Danh mục" name="category_id" rules={[{ required: true }]}>
                        <Select placeholder="Chọn danh mục">
                            {categories.map((c) => (
                                <Select.Option key={c.id} value={c.id}>
                                    {c.category}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Ảnh sản phẩm"
                        name="images"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e.fileList}
                    >
                        <Upload beforeUpload={() => false} multiple listType="picture">
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
}
