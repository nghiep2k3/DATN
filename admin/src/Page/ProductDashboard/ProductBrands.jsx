import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { url_api, url } from "../../config";
import "./Product.css";

export default function ProductBrands() {

    const [brands, setBrands] = useState([]);
    const [search, setSearch] = useState("");

    const [openModal, setOpenModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);

    const [form] = Form.useForm();

    // ===========================
    // LOAD BRANDS
    // ===========================
    const loadBrands = () => {
        axios.get(`${url_api}/api/brands/getbrands.php`)
            .then((res) => {
                if (res.data?.data) {
                    setBrands(res.data.data);
                }
            })
            .catch((err) => console.error("Lỗi API:", err));
    };

    useEffect(() => {
        loadBrands();
    }, []);

    const filteredBrands = brands.filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase())
    );

    // ===========================
    // OPEN ADD
    // ===========================
    const handleOpenAdd = () => {
        setEditMode(false);
        setEditingBrand(null);
        form.resetFields();
        setOpenModal(true);
    };

    // ===========================
    // OPEN EDIT
    // ===========================
    const handleOpenEdit = (brand) => {
        setEditMode(true);
        setEditingBrand(brand);

        form.setFieldsValue({
            id: brand.id,
            name: brand.name,
            description: brand.description,
        });

        setOpenModal(true);
    };

    // ===========================
    // SUBMIT CREATE / UPDATE
    // ===========================
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();

            // Normal fields
            Object.keys(values).forEach((key) => {
                if (key !== "url_image") {
                    if (values[key]) formData.append(key, values[key]);
                }
            });

            // Upload image
            if (values.url_image && values.url_image.length > 0) {
                formData.append("url_image", values.url_image[0].originFileObj);
            }

            const apiUrl = editMode
                ? `${url_api}/api/brands/updatebrand.php`
                : `${url_api}/api/brands/createbrand.php`;

            const res = await axios.post(apiUrl, formData);

            if (!res.data.error) {
                message.success(editMode ? "Cập nhật thương hiệu thành công!" : "Tạo thương hiệu thành công!");
                setOpenModal(false);
                loadBrands();
            } else {
                message.error(res.data.message);
            }

        } catch (error) {
            console.error("Lỗi upload:", error);
        }
    };

    // ===========================
    // DELETE BRAND
    // ===========================
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa thương hiệu ID: " + id + " ?")) return;

        try {
            const res = await axios.delete(`${url_api}/api/brands/deletebrand.php?id=${id}`);

            if (!res.data.error) {
                message.success("Xóa thành công!");
                loadBrands();
            } else {
                message.error(res.data.message || "Không thể xóa!");
            }

        } catch (err) {
            console.error("Lỗi xóa thương hiệu:", err);
            message.error("Đã xảy ra lỗi khi xóa.");
        }
    };

    // ===========================
    // RENDER UI
    // ===========================
    return (
        <div className="category-container">

            <div className="category-header">
                <h2 className="category-title">Quản lý thương hiệu sản phẩm</h2>

                <div className="category-actions">
                    <input
                        type="text"
                        className="category-search"
                        placeholder="Tìm kiếm thương hiệu..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button className="btn-add" onClick={handleOpenAdd}>
                        + Thêm thương hiệu
                    </button>
                </div>
            </div>

            <div className="category-grid">
                {filteredBrands.map((brand) => (
                    <div key={brand.id} className="category-card">

                        <img
                            src={`${url}/${brand.url_image}`}
                            alt={brand.name}
                            className="brand-image"
                        />

                        <div className="category-content">
                            <div className="category-header-row">
                                <h3 className="category-name">{brand.name}</h3>

                                <div className="category-buttons">
                                    <button className="btn-edit" onClick={() => handleOpenEdit(brand)}>
                                        Sửa
                                    </button>

                                    <button className="btn-delete" onClick={() => handleDelete(brand.id)}>
                                        Xóa
                                    </button>
                                </div>
                            </div>

                            <p className="category-description">{brand.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* POPUP */}
            <Modal
                open={openModal}
                onCancel={() => setOpenModal(false)}
                onOk={handleSubmit}
                title={editMode ? "Sửa thương hiệu" : "Thêm thương hiệu"}
                okText={editMode ? "Cập nhật" : "Tạo mới"}
            >
                <Form form={form} layout="vertical">

                    {editMode && (
                        <Form.Item name="id" hidden>
                            <Input />
                        </Form.Item>
                    )}

                    <Form.Item
                        label="Tên thương hiệu"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên thương hiệu" }]}
                    >
                        <Input placeholder="Nhập tên thương hiệu" />
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                        label="Logo thương hiệu"
                        name="url_image"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e && e.fileList}
                    >
                        <Upload beforeUpload={() => false} maxCount={1} listType="picture">
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
}
