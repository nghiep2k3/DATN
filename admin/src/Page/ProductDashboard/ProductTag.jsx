import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Form, Input, Button, message } from "antd";
import { url_api } from "../../config";
import "./Product.css";

export default function ProductTag() {

    const [tags, setTags] = useState([]);
    const [search, setSearch] = useState("");

    const [openModal, setOpenModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingTag, setEditingTag] = useState(null);

    const [form] = Form.useForm();

    // ===========================
    // LOAD TAGS
    // ===========================
    const loadTags = () => {
        axios.get(`${url_api}/api/tags/gettags.php`)
            .then((res) => {
                if (res.data?.data) {
                    setTags(res.data.data);
                }
            })
            .catch((err) => console.error("Lỗi API:", err));
    };

    useEffect(() => {
        loadTags();
    }, []);

    const filteredTags = tags.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    // ===========================
    // OPEN ADD
    // ===========================
    const handleOpenAdd = () => {
        setEditMode(false);
        setEditingTag(null);
        form.resetFields();
        setOpenModal(true);
    };

    // ===========================
    // OPEN EDIT
    // ===========================
    const handleOpenEdit = (tag) => {
        setEditMode(true);
        setEditingTag(tag);

        form.setFieldsValue({
            id: tag.id,
            name: tag.name,
        });

        setOpenModal(true);
    };

    // ===========================
    // SUBMIT
    // ===========================
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            // URL API
            const apiUrl = editMode
                ? `${url_api}/api/tags/updatetag.php`
                : `${url_api}/api/tags/createtag.php`;

            // Payload
            const payload = editMode
                ? { id: values.id, name: values.name }
                : { name: values.name };

            // CALL API
            const res = await axios({
                method: editMode ? "put" : "post",
                url: apiUrl,
                data: payload,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.data.error) {
                message.success(editMode ? "Cập nhật tag thành công!" : "Tạo tag thành công!");
                setOpenModal(false);
                loadTags();
            } else {
                message.error(res.data.message);
            }

        } catch (error) {
            console.error("Lỗi submit:", error);
        }
    };


    // ===========================
    // DELETE TAG
    // ===========================
    const handleDelete = async (id) => {
        if (!window.confirm("Xóa Tag ID: " + id + " ?")) return;

        try {
            const res = await axios.delete(`${url_api}/api/tags/deletetag.php?id=${id}`);

            if (!res.data.error) {
                message.success("Xóa thành công!");
                loadTags();
            } else {
                message.error(res.data.message || "Không thể xóa!");
            }

        } catch (err) {
            console.error("Lỗi xóa tag:", err);
            message.error("Đã xảy ra lỗi khi xóa.");
        }
    };

    // ===========================
    // UI
    // ===========================
    return (
        <div className="category-container">

            <div className="category-header">
                <h2 className="category-title">Quản lý Tag sản phẩm</h2>

                <div className="category-actions">
                    <input
                        type="text"
                        className="category-search"
                        placeholder="Tìm kiếm tag..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button className="btn-add" onClick={handleOpenAdd}>
                        + Thêm tag
                    </button>
                </div>
            </div>

            <div className="category-grid">
                {filteredTags.map((tag) => (
                    <div key={tag.id} className="category-card">

                        <div className="category-content">
                            <div className="category-header-row">
                                <h3 className="category-name">{tag.name}</h3>

                                <div className="category-buttons">
                                    <button className="btn-edit" onClick={() => handleOpenEdit(tag)}>
                                        Sửa
                                    </button>

                                    <button className="btn-delete" onClick={() => handleDelete(tag.id)}>
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {/* MODAL */}
            <Modal
                open={openModal}
                onCancel={() => setOpenModal(false)}
                onOk={handleSubmit}
                title={editMode ? "Sửa Tag" : "Thêm Tag"}
                okText={editMode ? "Cập nhật" : "Tạo mới"}
            >
                <Form form={form} layout="vertical">

                    {editMode && (
                        <Form.Item name="id" hidden>
                            <Input />
                        </Form.Item>
                    )}

                    <Form.Item
                        label="Tên Tag"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên Tag" }]}
                    >
                        <Input placeholder="Nhập tên Tag" />
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
}
