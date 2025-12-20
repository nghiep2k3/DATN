import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Tag,
  Popconfirm,
  message,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { url_api } from '../../config';

export default function Account() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchText, setSearchText] = useState('');

  // Load users
  useEffect(() => {
    loadUsers();
  }, []);

  // Chuyển đổi dữ liệu từ backend sang format frontend
  const mapBackendToFrontend = (backendUser) => {
    return {
      id: backendUser.id,
      name: backendUser.name || '',
      email: backendUser.email || '',
      phone: backendUser.phone || '',
      role: backendUser.role || 'user',
      status: backendUser.verified_account === 1 ? 'active' : 'inactive',
      lastLogin: null, // Backend không có trường này
      createdAt: null, // Backend có created_at nhưng không trả về trong toPublicArray
    };
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url_api}/api/user/getusers.php`);
      if (res.data.error) {
        message.error(res.data.message || 'Lỗi khi tải dữ liệu');
        setUsers([]);
      } else {
        // Map dữ liệu từ backend sang frontend
        const mappedUsers = res.data.data.map(mapBackendToFrontend);
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      message.error('Không thể kết nối đến máy chủ');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Mở modal thêm người dùng
  const openAddModal = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Mở modal sửa người dùng
  const openEditModal = (user) => {
    setEditingUser(user);
    // Không set password khi edit
    const { password, ...userWithoutPassword } = user;
    form.setFieldsValue(userWithoutPassword);
    setIsModalOpen(true);
  };

  // Xử lý lưu người dùng (thêm hoặc sửa)
  const handleSave = async (values) => {
    try {
      if (editingUser) {
        // Sửa - không cần password nếu không thay đổi
        const updateData = {
          id: editingUser.id,
          name: values.name,
          email: values.email,
          phone: values.phone,
          role: values.role,
        };
        
        // Chỉ thêm password nếu có thay đổi
        if (values.password && values.password.trim() !== '') {
          updateData.password = values.password;
        }

        const res = await axios.put(`${url_api}/api/user/updateuser.php`, updateData, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (res.data.error) {
          message.error(res.data.message || 'Cập nhật thất bại');
          return;
        }

        // Cập nhật lại danh sách
        await loadUsers();
        message.success('Cập nhật người dùng thành công');
      } else {
        // Thêm - cần password
        if (!values.password || values.password.trim() === '') {
          message.error('Vui lòng nhập mật khẩu');
          return;
        }

        const createData = {
          name: values.name,
          email: values.email,
          password: values.password,
          phone: values.phone || null,
          role: values.role || 'user',
        };

        const res = await axios.post(`${url_api}/api/user/createuser.php`, createData, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (res.data.error) {
          message.error(res.data.message || 'Tạo người dùng thất bại');
          return;
        }

        // Cập nhật lại danh sách
        await loadUsers();
        message.success('Thêm người dùng thành công');
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
      message.error('Không thể kết nối đến máy chủ');
    }
  };

  // Xóa người dùng
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${url_api}/api/user/deleteuser.php?id=${id}`);
      
      if (res.data.error) {
        message.error(res.data.message || 'Xóa thất bại');
        return;
      }

      // Cập nhật lại danh sách
      await loadUsers();
      message.success('Xóa người dùng thành công');
    } catch (error) {
      console.error('Lỗi khi xóa dữ liệu:', error);
      message.error('Không thể kết nối đến máy chủ');
    }
  };

  // Lọc dữ liệu
  const filteredUsers = users.filter((u) => {
    const matchRole = filterRole === 'all' || u.role === filterRole;
    const matchStatus = filterStatus === 'all' || u.status === filterStatus;
    const matchSearch =
      searchText.trim() === '' ||
      u.name.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase());
    return matchRole && matchStatus && matchSearch;
  });

  // Columns
  const columns = [
    {
      title: 'Tên người dùng',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <Space>
            <UserOutlined />
            <span style={{ fontWeight: 500 }}>{text}</span>
          </Space>
          {/* Hiển thị email trên mobile - sử dụng CSS class */}
          <div className="mobile-email" style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
            <MailOutlined style={{ marginRight: '4px' }} />
            {record.email}
          </div>
        </div>
      ),
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <Space>
          <MailOutlined />
          <span style={{ fontSize: '13px' }}>{text}</span>
        </Space>
      ),
      ellipsis: true,
      responsive: ['sm'], // Ẩn trên mobile (< 576px), hiện từ tablet trở lên
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => text || '-',
      ellipsis: true,
      responsive: ['md'], // Ẩn trên mobile và tablet nhỏ, hiện từ md (>= 768px)
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const colors = { admin: 'red', moderator: 'orange', user: 'blue' };
        const text = { admin: 'Quản trị', moderator: 'Quản lý', user: 'Người dùng' };
        return <Tag color={colors[role]}>{text[role]}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = { active: 'green', inactive: 'red' };
        const text = { active: 'Hoạt động', inactive: 'Vô hiệu' };
        return <Tag color={colors[status]}>{text[status]}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" direction="vertical" wrap className="mobile-actions">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            className="mobile-btn"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa người dùng"
            description="Bạn chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button 
              type="primary" 
              danger 
              size="small" 
              icon={<DeleteOutlined />}
              className="mobile-btn"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Tính toán thống kê
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const adminUsers = users.filter((u) => u.role === 'admin').length;

  return (
    <div style={{ padding: '24px' }}>
      {/* Thống kê */}
      <Card style={{ borderRadius: 12, marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Statistic title="Tổng người dùng" value={totalUsers} valueStyle={{ color: '#1890ff' }} />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Statistic title="Người dùng hoạt động" value={activeUsers} valueStyle={{ color: '#52c41a' }} />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Statistic title="Quản trị viên" value={adminUsers} valueStyle={{ color: '#f5222d' }} />
          </Col>
        </Row>
      </Card>

      {/* Danh sách người dùng */}
      <Card title="Quản lý người dùng" style={{ borderRadius: 12 }}>
        {/* Bộ lọc và tìm kiếm */}
        <Space 
          direction="vertical" 
          size="middle" 
          style={{ width: '100%', marginBottom: 16 }}
        >
          {/* Row 1: Search và Button thêm */}
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={16} md={18}>
              <Input.Search
                placeholder="Tìm theo tên hoặc email"
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={openAddModal}
                block
                style={{ width: '100%' }}
              >
                Thêm người dùng
              </Button>
            </Col>
          </Row>

          {/* Row 2: Filters */}
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={8} md={6}>
              <Select
                value={filterRole}
                onChange={(val) => setFilterRole(val)}
                style={{ width: '100%' }}
                options={[
                  { value: 'all', label: 'Tất cả vai trò' },
                  { value: 'admin', label: 'Quản trị' },
                  { value: 'moderator', label: 'Quản lý' },
                  { value: 'user', label: 'Người dùng' },
                ]}
              />
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Select
                value={filterStatus}
                onChange={(val) => setFilterStatus(val)}
                style={{ width: '100%' }}
                options={[
                  { value: 'all', label: 'Tất cả trạng thái' },
                  { value: 'active', label: 'Hoạt động' },
                  { value: 'inactive', label: 'Vô hiệu' },
                ]}
              />
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Button 
                onClick={() => { setFilterRole('all'); setFilterStatus('all'); setSearchText(''); }}
                block
                style={{ width: '100%' }}
              >
                Xóa bộ lọc
              </Button>
            </Col>
          </Row>
        </Space>

        {/* Bảng người dùng */}
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            loading={loading}
            pagination={{ 
              pageSize: 8,
              showSizeChanger: false,
              responsive: true,
              showTotal: (total) => `Tổng ${total} người dùng`,
              simple: false,
            }}
            size="middle"
            tableLayout="auto"
            scroll={{ x: 'max-content' }}
          />
        </div>
      </Card>

      {/* CSS cho responsive */}
      <style>{`
        /* Ẩn email trong cột Tên trên desktop, hiện trên mobile */
        @media (min-width: 576px) {
          .mobile-email {
            display: none !important;
          }
        }
        
        /* Hiển thị email trong cột Tên trên mobile */
        @media (max-width: 575px) {
          .mobile-email {
            display: block !important;
          }
        }
        
        /* Điều chỉnh nút hành động trên mobile */
        @media (max-width: 767px) {
          .mobile-actions {
            flex-direction: column !important;
            width: 100%;
          }
          .mobile-btn {
            width: 100% !important;
            margin-bottom: 4px;
          }
        }
        
        /* Điều chỉnh padding bảng trên mobile */
        @media (max-width: 767px) {
          .ant-table {
            font-size: 12px;
          }
          .ant-table-thead > tr > th {
            padding: 8px 4px;
            font-size: 11px;
          }
          .ant-table-tbody > tr > td {
            padding: 8px 4px;
          }
        }
      `}</style>

      {/* Modal thêm/sửa */}
      <Modal
        title={editingUser ? 'Sửa người dùng' : 'Thêm người dùng'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={editingUser ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Tên người dùng"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
          >
            <Input placeholder="Nhập tên người dùng" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: !editingUser, message: 'Vui lòng nhập mật khẩu' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
            ]}
          >
            <Input.Password 
              placeholder={editingUser ? "Để trống nếu không đổi mật khẩu" : "Nhập mật khẩu"} 
            />
          </Form.Item>

          <Form.Item
            label="Điện thoại"
            name="phone"
          >
            <Input placeholder="Nhập số điện thoại (tùy chọn)" />
          </Form.Item>

          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select
              options={[
                { value: 'admin', label: 'Quản trị' },
                { value: 'moderator', label: 'Quản lý' },
                { value: 'user', label: 'Người dùng' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
