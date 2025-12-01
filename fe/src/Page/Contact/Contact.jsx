import React from "react";
import { Form, Input, Button, Row, Col, Card } from "antd";
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function Contact() {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log("Thông tin liên hệ:", values);
        form.resetFields();
    };

    return (
        <div style={{ padding: "40px 20px", background: "#fafafa", minHeight: "80vh" }}>
            <Row gutter={[32, 32]} justify="center">
                {/* Thông tin liên hệ */}
                <Col xs={24} md={10}>
                    <Card
                        variant="borderless"
                        style={{
                            height: "100%",
                            backgroundColor: "#fff",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            borderRadius: "12px",
                        }}
                    >
                        <h2 style={{ color: "#ff6600" }}>Liên hệ với chúng tôi</h2>
                        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#333" }}>
                            Chúng tôi luôn sẵn sàng lắng nghe mọi ý kiến, câu hỏi hay nhu cầu hợp tác của bạn.
                            Đội ngũ tư vấn viên của <strong>TN GROUP</strong> cam kết phản hồi trong thời gian nhanh nhất,
                            nhằm mang đến cho bạn trải nghiệm hỗ trợ chuyên nghiệp, tận tâm và hiệu quả.
                        </p>
                        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#333" }}>
                            Dù bạn cần tư vấn về sản phẩm đo lường, thiết bị công nghiệp hay dịch vụ hậu mãi,
                            chúng tôi luôn đồng hành cùng bạn trong mọi bước của quá trình mua hàng và sử dụng.
                            Hãy để lại thông tin, chúng tôi sẽ liên hệ ngay để hỗ trợ chi tiết.
                        </p>

                        <div style={{ marginTop: 24 }}>
                            <p>
                                <EnvironmentOutlined style={{ color: "#ff6600", marginRight: 8 }} />
                                <strong>Địa chỉ:</strong> Số 86A Tây Mỗ - Nam Từ Liêm - Hà Nội
                            </p>
                            <p>
                                <PhoneOutlined style={{ color: "#ff6600", marginRight: 8 }} />
                                <strong>Điện thoại:</strong> 0378 936 624
                            </p>
                            <p>
                                <MailOutlined style={{ color: "#ff6600", marginRight: 8 }} />
                                <strong>Email:</strong> nguyennghiep1320@gmail.com
                            </p>
                        </div>
                    </Card>
                </Col>


                {/* Form liên hệ */}
                <Col xs={24} md={10}>
                    <Card
                        variant="borderless"
                        style={{
                            backgroundColor: "#fff",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            borderRadius: "12px",
                        }}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                name="name"
                                label="Họ và tên"
                                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                            >
                                <Input placeholder="Nhập họ và tên của bạn" />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: "Vui lòng nhập email!" },
                                    { type: "email", message: "Email không hợp lệ!" },
                                ]}
                            >
                                <Input placeholder="example@gmail.com" />
                            </Form.Item>

                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                            >
                                <Input placeholder="Nhập số điện thoại của bạn" />
                            </Form.Item>

                            <Form.Item
                                name="message"
                                label="Nội dung"
                                rules={[{ required: true, message: "Vui lòng nhập nội dung liên hệ!" }]}
                            >
                                <TextArea rows={4} placeholder="Nội dung bạn muốn gửi..." />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    style={{
                                        backgroundColor: "#ff6600",
                                        borderColor: "#ff6600",
                                        width: "100%",
                                    }}
                                >
                                    Gửi liên hệ
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
