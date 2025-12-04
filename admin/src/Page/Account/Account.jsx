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

// Mock dữ liệu người dùng
const mockUsers = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    phone: '0912345678',
    role: 'admin',
    status: 'active',
    lastLogin: '2025-02-10',
    createdAt: '2025-01-01',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@gmail.com',
    phone: '0923456789',
    role: 'user',
    status: 'active',
    lastLogin: '2025-02-09',
    createdAt: '2025-01-05',
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'levanc@gmail.com',
    phone: '0934567890',
    role: 'user',
    status: 'inactive',
    lastLogin: '2025-01-20',
    createdAt: '2025-01-10',
  },
  {
    id: 4,
    name: 'Phạm Minh D',
    email: 'phamminhd@gmail.com',
    phone: '0945678901',
    role: 'moderator',
    status: 'active',
    lastLogin: '2025-02-08',
    createdAt: '2025-01-15',
  },
  {
    id: 5,
    name: 'Hoàng Thu E',
    email: 'hoangthue@gmail.com',
    phone: '0956789012',
    role: 'user',
    status: 'active',
    lastLogin: '2025-02-07',
    createdAt: '2025-01-20',
  },
];

// Mock API
const mockAPI = {
  getUsers: () => new Promise((resolve) => setTimeout(() => resolve(mockUsers), 300)),
  createUser: (user) => new Promise((resolve) => setTimeout(() => resolve({ ...user, id: Date.now() }), 300)),
  updateUser: (id, user) => new Promise((resolve) => setTimeout(() => resolve({ ...user, id }), 300)),
  deleteUser: (id) => new Promise((resolve) => setTimeout(() => resolve({ id }), 300)),
};

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

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await mockAPI.getUsers();
      setUsers(data);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu');
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
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  // Xử lý lưu người dùng (thêm hoặc sửa)
  const handleSave = async (values) => {
    try {
      if (editingUser) {
        // Sửa
        await mockAPI.updateUser(editingUser.id, values);
        setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...values } : u)));
        message.success('Cập nhật người dùng thành công');
      } else {
        // Thêm
        const newUser = await mockAPI.createUser(values);
        setUsers([...users, newUser]);
        message.success('Thêm người dùng thành công');
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Lỗi khi lưu dữ liệu');
    }
  };

  // Xóa người dùng
  const handleDelete = async (id) => {
    try {
      await mockAPI.deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
      message.success('Xóa người dùng thành công');
    } catch (error) {
      message.error('Lỗi khi xóa dữ liệu');
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
      render: (text) => (
        <Space>
          <UserOutlined />
          <strong>{text}</strong>
        </Space>
      ),
      width: 180,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <Space>
          <MailOutlined />
          {text}
        </Space>
      ),
      width: 200,
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
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
      width: 110,
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
      width: 100,
    },
    {
      title: 'Lần đăng nhập cuối',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
      width: 130,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
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
            <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
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
        <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Space>
            <Input.Search
              placeholder="Tìm theo tên hoặc email"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />

            <Select
              value={filterRole}
              onChange={(val) => setFilterRole(val)}
              style={{ width: 140 }}
              options={[
                { value: 'all', label: 'Tất cả vai trò' },
                { value: 'admin', label: 'Quản trị' },
                { value: 'moderator', label: 'Quản lý' },
                { value: 'user', label: 'Người dùng' },
              ]}
            />

            <Select
              value={filterStatus}
              onChange={(val) => setFilterStatus(val)}
              style={{ width: 140 }}
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'active', label: 'Hoạt động' },
                { value: 'inactive', label: 'Vô hiệu' },
              ]}
            />

            <Button onClick={() => { setFilterRole('all'); setFilterStatus('all'); setSearchText(''); }}>
              Xóa bộ lọc
            </Button>
          </Space>

          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            Thêm người dùng
          </Button>
        </Space>

        {/* Bảng người dùng */}
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 1200 }}
        />
      </Card>

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
            label="Điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input placeholder="Nhập số điện thoại" />
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

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select
              options={[
                { value: 'active', label: 'Hoạt động' },
                { value: 'inactive', label: 'Vô hiệu' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
