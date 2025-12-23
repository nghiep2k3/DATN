import React, { useState, useEffect } from 'react'
import { url_api } from '../../config'
import axios from 'axios'
import { Form, Input, Button, Card, message, Spin } from 'antd'
import { UserOutlined, MailOutlined, PhoneOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons'
import Cookies from 'js-cookie'

export default function Profile() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [editing, setEditing] = useState(false)
  const [userData, setUserData] = useState(null)

  // Lấy thông tin user khi component mount
  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setFetching(true)
      const userId = Cookies.get('user_id')
      
      if (!userId) {
        message.error('Vui lòng đăng nhập để xem thông tin')
        return
      }

      const response = await axios.get(`${url_api}/api/user/getusers.php?id=${userId}`)
      
      if (!response.data.error && response.data.data) {
        const user = response.data.data
        setUserData(user)
        form.setFieldsValue({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
        })
      } else {
        message.error(response.data.message || 'Không thể tải thông tin người dùng')
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin user:', error)
      message.error('Không thể kết nối đến máy chủ')
    } finally {
      setFetching(false)
    }
  }

  const handleUpdate = async (values) => {
    try {
      setLoading(true)
      const userId = Cookies.get('user_id')
      
      if (!userId) {
        message.error('Vui lòng đăng nhập')
        return
      }

      const payload = {
        id: parseInt(userId),
        name: values.name,
        email: values.email,
        phone: values.phone,
      }

      const response = await axios.put(`${url_api}/api/user/updateuser.php`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.data.error) {
        message.success('Cập nhật thông tin thành công')
        setEditing(false)
        // Cập nhật lại thông tin user trong cookie nếu có
        if (response.data.data) {
          Cookies.set('name', response.data.data.name, { expires: 7 })
          Cookies.set('user', JSON.stringify(response.data.data), { expires: 7 })
        }
        fetchUserData() // Lấy lại thông tin mới nhất
      } else {
        message.error(response.data.message || 'Cập nhật thất bại')
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error)
      message.error('Không thể kết nối đến máy chủ')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    // Reset form về giá trị ban đầu
    if (userData) {
      form.setFieldsValue({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
      })
    }
  }

  if (fetching) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!userData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Không tìm thấy thông tin người dùng</p>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserOutlined />
            <span>Thông tin cá nhân</span>
          </div>
        }
        extra={
          !editing && (
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={() => setEditing(true)}
            >
              Chỉnh sửa
            </Button>
          )
        }
        style={{ maxWidth: '600px', margin: '20px auto' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          disabled={!editing}
        >
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Nhập họ và tên"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Nhập email"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' },
            ]}
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="Nhập số điện thoại"
            />
          </Form.Item>

          {editing && (
            <Form.Item>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <Button onClick={handleCancel}>
                  Hủy
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  Lưu thay đổi
                </Button>
              </div>
            </Form.Item>
          )}
        </Form>
      </Card>
    </div>
  )
}
