import React from "react";
import { Row, Col, Card, Typography } from "antd";
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

const { Title, Paragraph } = Typography;

const About = () => {
    return (
        <div className="about-page">
            <section className="container-box herobanner">
                <div className="box-1200px">
                    <div className="breadcrumb">Trang chủ / Về chúng tôi</div>

                    <h1 className="hero-title">Về chúng tôi</h1>

                    <p className="hero-subtitle">
                        TN Group Đơn vị tiên phong trong nghiên cứu và phát triển công nghệ
                    </p>
                </div>
            </section>

            {/* ==== GIỚI THIỆU CÔNG TY ==== */}
            <section className="container-box about-section">
                <div className="box-1200px">
                    <Row gutter={[40, 40]} align="middle">
                        <Col xs={24} md={12}>
                            <img
                                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&w=1200"
                                alt="About TECOTEC"
                                className="about-image"
                            />
                        </Col>

                        <Col xs={24} md={12}>
                            <Title level={2}>Giới thiệu về TN Group</Title>
                            <Paragraph>
                                TN Group là đơn vị cung cấp thiết bị đo lường – quan trắc – công nghệ khoa học ứng dụng cho nhiều lĩnh vực như môi trường, thời tiết, phòng thí nghiệm và công nghiệp. Chúng tôi mang đến giải pháp toàn diện, từ thiết bị đến triển khai – bảo trì – hỗ trợ kỹ thuật.
                            </Paragraph>

                            <ul className="about-list">
                                <li><CheckCircleOutlined /> Hơn 20 năm kinh nghiệm trong ngành đo lường</li>
                                <li><CheckCircleOutlined /> Đối tác chính thức của nhiều thương hiệu quốc tế</li>
                                <li><CheckCircleOutlined /> Đội ngũ kỹ thuật chuyên môn cao</li>
                                <li><CheckCircleOutlined /> Dịch vụ hậu mãi – bảo hành chuẩn quốc tế</li>
                            </ul>
                        </Col>
                    </Row>
                </div>
            </section>

            {/* ==== TẦM NHÌN – SỨ MỆNH ==== */}
            <section className="container-box vision-section">
                <div className="box-1200px">
                    <Row gutter={[32, 32]}>
                        <Col xs={24} md={12}>
                            <Card className="vision-card">
                                <Title level={3}>Tầm nhìn</Title>
                                <Paragraph>
                                    Trở thành đơn vị cung cấp công nghệ đo lường – quan trắc hàng đầu Việt Nam, mang đến giải pháp chất lượng cao giúp doanh nghiệp tiếp cận tiêu chuẩn quốc tế.
                                </Paragraph>
                            </Card>
                        </Col>

                        <Col xs={24} md={12}>
                            <Card className="vision-card">
                                <Title level={3}>Sứ mệnh</Title>
                                <Paragraph>
                                    Ứng dụng khoa học – công nghệ vào thực tiễn, hỗ trợ doanh nghiệp nâng cao năng lực sản xuất, tối ưu vận hành và đảm bảo độ chính xác trong mọi phép đo.
                                </Paragraph>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </section>

            {/* ==== TẠI SAO CHỌN CHÚNG TÔI ==== */}
            <section className="container-box">
                <div className="box-1200px">
                    <div className="text-center my-5">
                        <Title level={2}>Tại sao chọn chúng tôi?</Title>
                        <Paragraph>
                            Chúng tôi tập trung mang đến chất lượng – hiệu quả – hỗ trợ kỹ thuật lâu dài cho khách hàng.
                        </Paragraph>
                    </div>

                    <Row gutter={[24, 24]} justify="center">
                        {[
                            {
                                icon: <ThunderboltOutlined />,
                                title: "Hiệu suất cao",
                                desc: "Thiết bị tối ưu, mang lại độ chính xác cao trong mọi phép đo.",
                            },
                            {
                                icon: <SafetyOutlined />,
                                title: "Bảo mật & An toàn",
                                desc: "Quy trình kiểm định – hiệu chuẩn theo tiêu chuẩn quốc tế.",
                            },
                            {
                                icon: <TeamOutlined />,
                                title: "Đội ngũ chuyên gia",
                                desc: "Kỹ sư giàu kinh nghiệm, hỗ trợ tận nơi.",
                            },
                            {
                                icon: <CustomerServiceOutlined />,
                                title: "Hỗ trợ 24/7",
                                desc: "Luôn sẵn sàng đồng hành cùng doanh nghiệp.",
                            },
                            {
                                icon: <RocketOutlined />,
                                title: "Giải pháp toàn diện",
                                desc: "Từ thiết bị – giải pháp – phần mềm – dịch vụ.",
                            },
                            {
                                icon: <TrophyOutlined />,
                                title: "Thương hiệu uy tín",
                                desc: "Được tin dùng bởi hàng trăm doanh nghiệp lớn.",
                            },
                        ].map((item, index) => (
                            <Col xs={24} sm={12} md={8} key={index}>
                                <Card className="feature-card" hoverable>
                                    <div className="feature-icon">{item.icon}</div>
                                    <Title level={4}>{item.title}</Title>
                                    <Paragraph>{item.desc}</Paragraph>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>
        </div>
    );
};

export default About;
