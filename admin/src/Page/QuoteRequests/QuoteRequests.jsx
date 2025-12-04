import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Card,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  InputNumber,
  Select,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";
import { url_api } from "../../config";

export default function QuoteRequests() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Add / Edit
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [form] = Form.useForm();

  // =========================================
  // GET API — Load list
  // =========================================
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url_api}/api/rfq/getrequest.php`);
      if (!res.data.error) setData(res.data.data);
    } catch {
      message.error("Không thể tải danh sách yêu cầu.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================================
  // HANDLE CREATE / UPDATE RFQ
  // =========================================
  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      const user_id = Cookies.get("user_id") || "";

      // Common fields
      formData.append("user_id", user_id);
      formData.append("full_name", values.full_name);
      formData.append("phone", values.phone);
      formData.append("email", values.email);
      formData.append("product_name", values.product_name || "");
      formData.append("quantity", values.quantity || "");
      formData.append("product_list", values.product_list || "");
      formData.append("notes", values.notes || "");
      formData.append("budget_range", values.budget_range || "");
      formData.append("status", values.status || "pending");

      if (values.attachment?.file) {
        formData.append("attachment", values.attachment.file);
      }

      let res;
      if (isEdit) {
        // UPDATE
        res = await axios.post(
          `${url_api}/api/rfq/updaterequest.php?id=${currentId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        // CREATE
        res = await axios.post(
          `${url_api}/api/rfq/createrequest.php`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      if (!res.data.error) {
        message.success(isEdit ? "Cập nhật thành công!" : "Tạo yêu cầu thành công!");
        setOpenModal(false);
        form.resetFields();
        fetchData();
      } else {
        message.error(res.data.message);
      }
    } catch {
      message.error("Có lỗi xảy ra khi gửi dữ liệu.");
    }
  };

  // =========================================
  // DELETE RFQ
  // =========================================
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${url_api}/api/rfq/deleterequest.php?id=${id}`);
      if (!res.data.error) {
        message.success("Đã xoá yêu cầu");
        fetchData();
      } else {
        message.error(res.data.message);
      }
    } catch {
      message.error("Không thể xoá yêu cầu.");
    }
  };

  // =========================================
  // TABLE COLUMNS
  // =========================================
  const columns = [
    {
      title: "Mã yêu cầu",
      dataIndex: "request_code",
      render: (t) => <strong>{t}</strong>,
    },
    {
      title: "Khách hàng",
      dataIndex: "full_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 200,
    },
    {
      title: "Sản phẩm",
      dataIndex: "product_name",
      ellipsis: true,
    },
    {
      title: "SL",
      dataIndex: "quantity",
      width: 60,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (st) => {
        const colors = {
          pending: "blue",
          processing: "orange",
          done: "green",
          cancelled: "red",
        };
        const labels = {
          pending: "Chờ xử lý",
          processing: "Đang xử lý",
          done: "Hoàn thành",
          cancelled: "Đã hủy",
        };
        return <Tag color={colors[st]}>{labels[st]}</Tag>;
      },
    },
    {
      title: "File",
      dataIndex: "attachment_url",
      render: (file) =>
        file ? (
          <a href={`${url_api}/${file}`} target="_blank">
            Tải xuống
          </a>
        ) : (
          "—"
        ),
    },
    {
      title: "Thao tác",
      width: 140,
      render: (_, record) => (
        <>
          <Button
            size="small"
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => {
              setIsEdit(true);
              setCurrentId(record.id);
              form.setFieldsValue(record);
              setOpenModal(true);
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xác nhận xoá yêu cầu?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xoá"
            cancelText="Hủy"
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Xoá
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Card
      title="Danh sách yêu cầu báo giá"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setIsEdit(false);
            form.resetFields();
            setOpenModal(true);
          }}
        >
          Thêm yêu cầu
        </Button>
      }
      style={{ margin: 24, borderRadius: 12 }}
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 6 }}
      />

      {/* =========================
          MODAL ADD + EDIT FORM
      ========================= */}
      <Modal
        title={isEdit ? "Cập nhật yêu cầu báo giá" : "Thêm yêu cầu báo giá"}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={() => form.submit()}
        width={700}
        okText={isEdit ? "Cập nhật" : "Thêm mới"}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Họ tên" name="full_name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Tên sản phẩm" name="product_name">
            <Input />
          </Form.Item>

          <Form.Item label="Số lượng" name="quantity">
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>

          <Form.Item label="Danh sách sản phẩm" name="product_list">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Ngân sách" name="budget_range">
            <Select
              allowClear
              options={[
                { value: "<10tr", label: "Dưới 10 triệu" },
                { value: "10-50tr", label: "10 - 50 triệu" },
                { value: "50-200tr", label: "50 - 200 triệu" },
                { value: ">200tr", label: "Trên 200 triệu" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Ghi chú" name="notes">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item label="Trạng thái" name="status">
            <Select
              options={[
                { value: "pending", label: "Chờ xử lý" },
                { value: "processing", label: "Đang xử lý" },
                { value: "done", label: "Hoàn thành" },
                { value: "cancelled", label: "Đã huỷ" },
              ]}
            />
          </Form.Item>

          <Form.Item label="File đính kèm" name="attachment">
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
