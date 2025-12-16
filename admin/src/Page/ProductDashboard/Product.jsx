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
    message,
    Row,
    Col,
    Card
} from "antd";
import { UploadOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
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

        // Parse document_url từ JSON string thành array
        let documentList = [];
        if (p.document_url) {
            try {
                const parsed = typeof p.document_url === 'string' 
                    ? JSON.parse(p.document_url) 
                    : p.document_url;
                if (Array.isArray(parsed)) {
                    // Convert existing links thành fileList format cho Upload component
                    documentList = parsed.map((doc, idx) => ({
                        uid: `doc-${idx}`,
                        name: doc.link.split('/').pop() || `document${idx + 1}.pdf`,
                        status: 'done',
                        url: `${url}/${doc.link}`,
                        link: doc.link, // Giữ lại link gốc
                    }));
                }
            } catch (e) {
                console.error("Lỗi parse document_url:", e);
            }
        }

        form.setFieldsValue({
            id: p.id,
            name: p.name,
            sku: p.sku,
            description: p.description,
            price: p.price,
            stock_quantity: p.stock_quantity,
            brand_id: p.brand_id,
            category_id: p.category_id,
            document_url: documentList
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
                if (key === "images" || key === "document_url") return;

                const value =
                    typeof values[key] === "number"
                        ? String(values[key])
                        : values[key];

                formData.append(key, value);
            });

            // Xử lý upload ảnh
            if (values.images && values.images.length > 0) {
                values.images.forEach((fileObj) => {
                    if (fileObj.originFileObj) {
                        formData.append("image[]", fileObj.originFileObj);
                    }
                });
            }

            // Xử lý upload document files
            const documentLinks = [];
            const newDocuments = [];
            
            if (values.document_url && values.document_url.length > 0) {
                values.document_url.forEach((doc) => {
                    if (doc.originFileObj) {
                        // File mới được upload
                        newDocuments.push(doc.originFileObj);
                    } else if (doc.link) {
                        // File đã có sẵn (khi edit)
                        documentLinks.push({ link: doc.link });
                    }
                });
            }

            // Upload file mới
            if (newDocuments.length > 0) {
                newDocuments.forEach((file) => {
                    formData.append("document[]", file);
                });
            }

            // Nếu có document cũ (khi edit và không upload file mới), gửi JSON string
            // Nếu có cả file mới và file cũ, backend sẽ merge lại
            if (documentLinks.length > 0) {
                formData.append("document_url", JSON.stringify(documentLinks));
            }

            // 🔥 Log toàn bộ FormData (bao gồm file)
            console.log("📦 FORM DATA GỬI LÊN API:");
            for (let pair of formData.entries()) {
                console.log(pair[0] + ": ", pair[1]);
            }

            const apiUrl = editMode
                ? `${url_api}/api/product/updateproduct.php`
                : `${url_api}/api/product/createproduct.php`;

            const res = await axios.post(apiUrl, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (!res.data.error) {
                message.success(editMode ? "Cập nhật thành công" : "Tạo sản phẩm thành công");
                setOpenModal(false);
                loadProducts();
            } else {
                message.error(res.data.message);
            }

        } catch (error) {
            console.error("Lỗi submit:", error);
            message.error("Có lỗi xảy ra khi lưu sản phẩm");
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

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="SKU" name="sku" rules={[{ required: true }]}>
                                <Input />
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
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Mô tả" name="description">
                                <Input.TextArea rows={3} />
                            </Form.Item>

                            <Form.Item label="Tài liệu (document_url)">
                                <Form.List name="document_url">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map(({ key, name, ...restField }) => (
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
                                                        name={name}
                                                        valuePropName="fileList"
                                                        getValueFromEvent={(e) => {
                                                            if (Array.isArray(e)) {
                                                                return e;
                                                            }
                                                            return e?.fileList;
                                                        }}
                                                        rules={[{ required: true, message: "Vui lòng chọn file tài liệu" }]}
                                                    >
                                                        <Upload
                                                            beforeUpload={() => false}
                                                            maxCount={1}
                                                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                                                        >
                                                            <Button icon={<UploadOutlined />}>Chọn file tài liệu</Button>
                                                        </Upload>
                                                    </Form.Item>
                                                </Card>
                                            ))}
                                            <Button
                                                type="dashed"
                                                onClick={() => add()}
                                                block
                                                icon={<PlusOutlined />}
                                                style={{ marginTop: 8 }}
                                            >
                                                Thêm tài liệu
                                            </Button>
                                        </>
                                    )}
                                </Form.List>
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
                        </Col>
                    </Row>

                </Form>
            </Modal>
        </div>
    );
}
