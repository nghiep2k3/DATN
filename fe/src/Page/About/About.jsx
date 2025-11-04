import React from "react";
import { Row, Col, Card, Button, Typography, Layout, Space } from "antd";
import {
    ThunderboltOutlined,
    SafetyOutlined,
    TeamOutlined,
    CustomerServiceOutlined,
    RocketOutlined,
    TrophyOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import "./About.css";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const About = () => {
    return (
        <Layout className="about-page">
            {/* ===== HERO SECTION ===== */}
            <section className="hero-section">
                <div className="hero-content">
                    <Text className="hero-badge">Giải pháp hàng đầu cho doanh nghiệp</Text>
                    <Title level={1} className="hero-title">
                        Chuyển đổi số thành công cùng chúng tôi
                    </Title>
                    <Paragraph className="hero-sub">
                        Cung cấp các giải pháp công nghệ tiên tiến, giúp doanh nghiệp tăng
                        trưởng vượt bậc và tối ưu hóa quy trình làm việc.
                    </Paragraph>

                    <Space size="large" className="hero-buttons">
                        <Button type="primary" size="large" className="btn-orange">
                            Bắt đầu ngay
                        </Button>
                        <Button size="large">Tìm hiểu thêm</Button>
                    </Space>

                    <Row justify="center" gutter={40} className="hero-stats">
                        <Col>
                            <Title level={3}>500+</Title>
                            <Text>Khách hàng</Text>
                        </Col>
                        <Col>
                            <Title level={3}>98%</Title>
                            <Text>Hài lòng</Text>
                        </Col>
                        <Col>
                            <Title level={3}>10+</Title>
                            <Text>Năm kinh nghiệm</Text>
                        </Col>
                    </Row>
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <Content className="features-section">
                <div className="text-center mb-5">
                    <Title level={2}>Tại sao chọn chúng tôi?</Title>
                    <Paragraph>
                        Chúng tôi cung cấp các tính năng vượt trội giúp doanh nghiệp của
                        bạn luôn đi đầu trong thị trường.
                    </Paragraph>
                </div>

                <Row gutter={[24, 24]} justify="center" className="feature-grid">
                    {[
                        {
                            icon: <ThunderboltOutlined />,
                            title: "Hiệu suất cao",
                            desc: "Giải pháp đo lường tối ưu hóa giúp tăng tốc độ xử lý lên đến 10 lần.",
                        },
                        {
                            icon: <SafetyOutlined />,
                            title: "Bảo mật tuyệt đối",
                            desc: "Hệ thống bảo mật đa lớp đảm bảo an toàn tuyệt đối cho dữ liệu.",
                        },
                        {
                            icon: <TeamOutlined />,
                            title: "Dễ dàng quản lý",
                            desc: "Giao diện thân thiện, dễ sử dụng cho mọi đối tượng người dùng.",
                        },
                        {
                            icon: <CustomerServiceOutlined />,
                            title: "Hỗ trợ 24/7",
                            desc: "Đội ngũ kỹ thuật luôn sẵn sàng hỗ trợ bạn mọi lúc mọi nơi.",
                        },
                        {
                            icon: <RocketOutlined />,
                            title: "Tăng trưởng bền vững",
                            desc: "Giúp doanh nghiệp phát triển ổn định với công cụ chuyên sâu.",
                        },
                        {
                            icon: <TrophyOutlined />,
                            title: "Chất lượng đảm bảo",
                            desc: "Cam kết mang đến sản phẩm và dịch vụ tốt nhất cho khách hàng.",
                        },
                    ].map((f, i) => (
                        <Col xs={24} sm={12} md={8} key={i}>
                            <Card className="feature-card" hoverable>
                                <div className="feature-icon">{f.icon}</div>
                                <Title level={4}>{f.title}</Title>
                                <Paragraph>{f.desc}</Paragraph>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Content>

            {/* ===== TRUST SECTION ===== */}
            <section className="trust-section">
                <Row
                    gutter={[40, 40]}
                    align="middle"
                    justify="center"
                    className="max-w-6xl mx-auto px-6"
                >
                    <Col xs={24} md={10}>
                        <div className="trust-image" />
                    </Col>
                    <Col xs={24} md={14}>
                        <Text className="trust-label">Về chúng tôi</Text>
                        <Title level={2}>
                            Đối tác đáng tin cậy cho sự phát triển của bạn
                        </Title>
                        <Paragraph>
                            Với hơn 10 năm kinh nghiệm trong lĩnh vực công nghệ, chúng tôi đã
                            giúp hàng trăm doanh nghiệp chuyển đổi số thành công.
                        </Paragraph>

                        <ul className="trust-list">
                            {[
                                "Giảm thời gian vận hành lên đến 50%",
                                "Tăng năng suất làm việc vượt trội",
                                "Tích hợp dễ dàng với hệ thống hiện có",
                                "Báo cáo và phân tích thời gian thực",
                                "Khả năng mở rộng linh hoạt",
                                "Chi phí tối ưu và minh bạch",
                            ].map((item, idx) => (
                                <li key={idx}>
                                    <CheckCircleOutlined className="check-icon" /> {item}
                                </li>
                            ))}
                        </ul>

                        <Button type="primary" className="btn-blue">
                            Xem thêm dự án
                        </Button>
                    </Col>
                </Row>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="cta-section text-center">
                <Title level={2} className="text-white">
                    Sẵn sàng bắt đầu hành trình chuyển đổi số?
                </Title>
                <Paragraph className="text-white">
                    Hãy để chúng tôi giúp bạn đưa doanh nghiệp lên tầm cao mới. Liên hệ
                    ngay hôm nay để được tư vấn miễn phí.
                </Paragraph>
                <Button type="primary" size="large" className="btn-white">
                    Liên hệ ngay
                </Button>
            </section>


        </Layout>
    );
};

export default About;
