import React, { useState } from "react";
import {
    Form,
    Input,
    Button,
    Upload,
    message,
    InputNumber,
    Select,
    Collapse,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";
import { url_api } from "../../config";

const { Panel } = Collapse;

export default function ReqBaoGia() {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async (values) => {
        setLoading(true);

        try {
            const user_id = Cookies.get("user_id") || "";
            const formData = new FormData();

            // Append fields
            formData.append("user_id", user_id);
            formData.append("full_name", values.full_name);
            formData.append("phone", values.phone);
            formData.append("email", values.email);
            formData.append("product_name", values.product_name || "");
            formData.append("quantity", values.quantity || "");
            formData.append("product_list", values.product_list || "");
            formData.append("notes", values.notes || "");
            formData.append("budget_range", values.budget_range || "");

            // File upload
            if (values.attachment && values.attachment.file) {
                formData.append("attachment", values.attachment.file);
            }

            const res = await axios.post(
                `${url_api}/api/rfq/createrequest.php`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (!res.data.error) {
                messageApi.success({ content: "Gửi yêu cầu báo giá thành công!", duration: 2 });
                form.resetFields();
            } else {
                messageApi.error({ content: res.data.message || "Đã xảy ra lỗi.", duration: 3 });
            }
        } catch (error) {
            messageApi.error({ content: "Không thể gửi yêu cầu. Vui lòng thử lại!", duration: 3 });
        }

        setLoading(false);
    };

    return (
        <div className="container-box" style={{ padding: "40px 0" }}>
            {contextHolder}
            <div className="box-1200px">
                <h2
                    style={{
                        marginBottom: 30,
                        fontSize: 28,
                        fontWeight: 700,
                        textAlign: "center",
                    }}
                >
                    YÊU CẦU BÁO GIÁ
                </h2>

                <Form form={form} style={{padding: '0 20%'}} layout="vertical" onFinish={handleSubmit}>
                    <Collapse defaultActiveKey={["1"]} expandIconPosition="end">

                        <Panel header="Thông tin khách hàng" key="1">
                            <Form.Item
                                label="Họ và tên"
                                name="full_name"
                                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                            >
                                <Input placeholder="Nhập họ tên..." />
                            </Form.Item>

                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                            >
                                <Input placeholder="Nhập số điện thoại..." />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: "Vui lòng nhập email" },
                                    { type: "email", message: "Email không hợp lệ" },
                                ]}
                            >
                                <Input placeholder="example@gmail.com" />
                            </Form.Item>
                        </Panel>

                        <Panel header="Thông tin sản phẩm" key="2">
                            <Form.Item label="Tên sản phẩm" name="product_name">
                                <Input placeholder="VD: Máy đo Mahr..." />
                            </Form.Item>

                            <Form.Item label="Số lượng" name="quantity">
                                <InputNumber
                                    placeholder="Nhập số lượng"
                                    min={1}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Danh sách sản phẩm (nhiều sản phẩm)"
                                name="product_list"
                            >
                                <Input.TextArea
                                    rows={3}
                                    placeholder="Nhập danh sách sản phẩm nếu bạn cần báo giá nhiều model..."
                                />
                            </Form.Item>
                        </Panel>

                        <Panel header="Thông tin bổ sung & tài liệu" key="3">
                            <Form.Item label="Khoảng ngân sách" name="budget_range">
                                <Select
                                    placeholder="Chọn ngân sách..."
                                    allowClear
                                    options={[
                                        { label: "Dưới 10 triệu", value: "<10tr" },
                                        { label: "10 - 50 triệu", value: "10-50tr" },
                                        { label: "50 - 200 triệu", value: "50-200tr" },
                                        { label: "Trên 200 triệu", value: ">200tr" },
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item label="Ghi chú bổ sung" name="notes">
                                <Input.TextArea
                                    rows={3}
                                    placeholder="Vui lòng mô tả yêu cầu thêm (nếu có)..."
                                />
                            </Form.Item>

                            <Form.Item
                                label="File đính kèm"
                                name="attachment"
                                valuePropName="file"
                                getValueFromEvent={(e) => e}
                            >
                                <Upload maxCount={1} beforeUpload={() => false}>
                                    <Button icon={<UploadOutlined />}>Chọn file</Button>
                                </Upload>
                            </Form.Item>
                        </Panel>

                    </Collapse>

                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        size="large"
                        style={{ width: "100%", marginTop: 25 }}
                    >
                        Gửi yêu cầu báo giá
                    </Button>
                </Form>
            </div>
        </div>
    );
}
