import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Form, Input, Upload, Button, message, Tabs } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { url_api, url } from "../../config";
import "./Product.css";

export default function ProductCategory() {
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");

    // Popup
    const [openModal, setOpenModal] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // Lưu category đang sửa
    const [editingCat, setEditingCat] = useState(null);

    const [form] = Form.useForm();

    // Fetch API
    const loadCategories = () => {
        axios.get(`${url_api}/api/categories/getcategories.php?with_children=all`)
            .then((res) => {
                if (res.data?.data) setCategories(res.data.data);
                console.log(res.data.data);

            })
            .catch((err) => console.error("Lỗi API:", err));
    };

    useEffect(() => {
        loadCategories();
    }, []);

    // Lọc danh mục theo tên
    const filteredCategories = categories.filter((cat) =>
        cat.category.toLowerCase().includes(search.toLowerCase())
    );

    // ==============================
    //  HANDLE CREATE CATEGORY
    // ==============================
    const handleOpenAdd = (parent_id = null) => {
        setEditMode(false);
        setEditingCat(null);
        form.resetFields();
        if (parent_id) form.setFieldValue("parent_id", parent_id);
        setOpenModal(true);
    };

    // ==============================
    //  HANDLE EDIT CATEGORY
    // ==============================
    const handleOpenEdit = (cat, parent_id = null) => {
        setEditMode(true);
        setEditingCat(cat);
        form.setFieldsValue({
            id: cat.id,
            name: cat.category,
            description: cat.description,
            parent_id: parent_id || cat.parent_id || "",
        });
        console.log("EDIT CAT:", cat);
        console.log("DESCRIPTION:", cat.description);

        setOpenModal(true);
    };

    // ==============================
    //  SUBMIT FORM CREATE/EDIT
    // ==============================
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const formData = new FormData();

            // Append ONLY normal fields
            Object.keys(values).forEach((key) => {
                if (key !== "url_image") {
                    if (values[key] !== undefined && values[key] !== null && values[key] !== "") {
                        formData.append(key, values[key]);
                    }
                }
            });

            if (values.url_image && values.url_image.length > 0) {
                formData.append("url_image", values.url_image[0].originFileObj);
            }

            const apiUrl = editMode
                ? `${url_api}/api/categories/updatecategory.php`
                : `${url_api}/api/categories/createcategory.php`;

            const res = await axios.post(apiUrl, formData); // ❗ không headers

            console.log("SERVER RESPONSE:", res.data);
            message.success(editMode ? "Cập nhật thành công!" : "Tạo danh mục thành công!");
            setOpenModal(false);
            loadCategories();

        } catch (error) {
            console.error("UPLOAD ERROR:", error);
        }
    };





    // ==============================
    //  DELETE CATEGORY
    // ==============================
    const handleDelete = async (id) => {
        try {
            if (!window.confirm("Đang xóa danh mục ID: " + id)) {
                return;
            }
            const res = await axios.delete(
                `${url_api}/api/categories/deletecategory.php?id=${id}`
            );

            console.log("KẾT QUẢ API XÓA:", res.data);

            // Kiểm tra phản hồi từ server
            if (!res.data.error) {
                message.success("Xóa thành công!");
                loadCategories(); // load lại danh sách
            } else {
                message.error(res.data.message || "Không thể xóa!");
            }
        } catch (err) {
            console.error("LỖI XÓA DANH MỤC:", err);
            message.error("Đã xảy ra lỗi khi xóa danh mục.");
        }
    };



    return (
        <div className="category-container">

            <div className="category-header">
                <h2 className="category-title">Quản lý danh mục sản phẩm</h2>

                <div className="category-actions">
                    <input
                        type="text"
                        className="category-search"
                        placeholder="Tìm kiếm danh mục..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button className="btn-add" onClick={() => handleOpenAdd()}>
                        + Thêm danh mục
                    </button>
                </div>
            </div>

            <div className="category-grid">
                {filteredCategories.map((cat) => (
                    <div key={cat.id} className="category-card">
                        <img
                            src={`${url}/${cat.url_image}`}
                            alt={cat.category}
                            className="category-image"
                        />

                        <div className="category-content">

                            {/* Header + buttons */}
                            <div className="category-header-row">
                                <h3 className="category-name">{cat.category}</h3>

                                <div className="category-buttons">
                                    <button
                                        onClick={() => handleOpenEdit(cat)}
                                        className="btn-edit"
                                    >
                                        Sửa
                                    </button>

                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="btn-delete"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                            <div>
                                <p className="category-description">{cat.description}</p>
                            </div>

                            {/* Sub-category list */}
                            {cat.sub_category.length > 0 ? (
                                <div className="subcategory-grid">
                                    {cat.sub_category.map((sub) => (
                                        <div key={sub.id} className="subcategory-card">

                                            <img
                                                src={`${url}/${sub.url_image}`}
                                                className="subcategory-image"
                                                alt={sub.name}
                                            />

                                            <p className="subcategory-name">{sub.name}</p>

                                            <div className="subcategory-buttons">
                                                <button
                                                    className="btn-sub-edit"
                                                    onClick={() => handleOpenEdit(sub, cat.id)}
                                                >
                                                    Sửa
                                                </button>

                                                <button
                                                    className="btn-sub-delete"
                                                    onClick={() => handleDelete(sub.id)}
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="subcategory-none">Không có danh mục con</p>
                            )}

                            <button
                                className="btn-add-sub"
                                onClick={() => handleOpenAdd(cat.id)}
                            >
                                + Thêm danh mục con
                            </button>

                        </div>
                    </div>
                ))}
            </div>

            {/* ============= POPUP ADD/EDIT CATEGORY =============== */}
            <Modal
                open={openModal}
                onCancel={() => setOpenModal(false)}
                onOk={handleSubmit}
                title={editMode ? "Sửa danh mục" : "Thêm danh mục"}
                okText={editMode ? "Cập nhật" : "Tạo mới"}
            >
                <Form form={form} layout="vertical">

                    {editMode && (
                        <Form.Item name="id" hidden>
                            <Input />
                        </Form.Item>
                    )}

                    <Form.Item label="Tên danh mục" name="name" rules={[{ required: true }]}>
                        <Input placeholder="Nhập tên danh mục" />
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item label="Parent ID" name="parent_id">
                        <Input placeholder="Để trống nếu là danh mục cha" />
                    </Form.Item>

                    <Form.Item
                        label="Ảnh minh họa"
                        name="url_image"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e && e.fileList}    // lấy fileList
                    >
                        <Upload
                            beforeUpload={() => false}                // chặn upload auto
                            maxCount={1}
                            listType="picture"
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );

}
