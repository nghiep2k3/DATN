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
import { url_api } from "../../config";

const { Title, Paragraph } = Typography;

const About = () => {
    return (
        <div className="about-page">
            <div className="container-box">
                <Row className="box-1200px" gutter={[10, 24]}>
                    <Col xs={24} md={24} lg={24}>
                        <section style={{ padding: "10px 0" }}>
                            <h2 style={{
                                fontSize: "28px",
                                fontWeight: "700",
                                color: "#f8991d",
                                marginBottom: "20px",
                                textTransform: "uppercase"
                            }}>
                                Về chúng tôi
                            </h2>

                            <Paragraph style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
                                TECOTEC Group hiện là <strong style={{ color: "#0066cc" }}>đơn vị đứng đầu</strong>
                                trong lĩnh vực nhập khẩu và phân phối
                                <strong style={{ color: "#0066cc" }}> thiết bị đo lường, thí nghiệm, tự động hóa, công nghiệp, dụng cụ cầm tay...</strong>
                                tại Việt Nam.Song song với đó, TECOTEC Group còn là công ty cung cấp các dịch vụ
                                <strong style={{ color: "#0066cc" }}> tư vấn giải pháp công nghệ, đo lường kỹ thuật; hiệu chuẩn; sửa chữa; chế tạo máy móc</strong>
                                theo yêu cầu của khách hàng.Chúng tôi chú trọng tìm kiếm những giải pháp, sản phẩm ngành đo kiểm chính xác để đem đến các thiết bị chất lượng,
                                tăng năng suất cho các doanh nghiệp Chế biến – Chế tạo, từ đó góp phần
                                <strong style={{ color: "#0066cc" }}> thúc đẩy nền công nghiệp Chế biến – Chế tạo của Việt Nam</strong>
                                lên một tầm cao mới.
                            </Paragraph>
                        </section>
                    </Col>

                    <Row gutter={[0, 40]} align="middle">
                        <Col className="pe-3 px-xs-3" xs={24} md={12} lg={12}>
                            <Title level={2}>Giới thiệu về TN Group</Title>
                            <Paragraph>
                                TN Group là đơn vị cung cấp thiết bị đo lường – quan trắc – công nghệ khoa học ứng dụng cho nhiều lĩnh vực như môi trường, thời tiết, phòng thí nghiệm và công nghiệp. Chúng tôi mang đến giải pháp toàn diện, từ thiết bị đến triển khai – bảo trì – hỗ trợ kỹ thuật.
                            </Paragraph>

                            <ul className="about-list">
                                <li className="d-flex"><CheckCircleOutlined /><Paragraph className="mb-0">Hơn 20 năm kinh nghiệm trong ngành đo lường</Paragraph></li>
                                <li className="d-flex"><CheckCircleOutlined /><Paragraph className="mb-0">Đối tác chính thức của nhiều thương hiệu quốc tế</Paragraph></li>
                                <li className="d-flex"><CheckCircleOutlined /><Paragraph className="mb-0">Đội ngũ kỹ thuật chuyên môn cao</Paragraph></li>
                                <li className="d-flex"><CheckCircleOutlined /><Paragraph className="mb-0">Dịch vụ hậu mãi – bảo hành chuẩn quốc tế</Paragraph></li>
                            </ul>
                        </Col>
                        <Col xs={24} md={12} lg={12}>
                            <img style={{ width: "100%" }}
                                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&w=1200"
                                alt="About TECOTEC"
                                className="about-image"
                            />
                        </Col>
                    </Row>

                    <Col className="box-1200px">
                        <img
                            src={`${url_api}/upload/anh-gioi-thieu.webp`}
                            alt="About Us Banner"
                            style={{ width: "100%", borderRadius: "8px" }}
                        />
                    </Col>

                </Row>

            </div>



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

            <section className="container-box" style={{ padding: "40px 0" }}>
                <div className="box-1200px">
                    <h2
                        style={{
                            textAlign: "center",
                            fontSize: "28px",
                            fontWeight: "700",
                            color: "#f8991d",
                            marginBottom: "40px",
                            textTransform: "uppercase",
                        }}
                    >
                        Dịch vụ của chúng tôi
                    </h2>

                    {/* ======= HÀNG TRÊN (TEXT + ẢNH LỚN) ======= */}
                    <Row gutter={[30, 30]} align="middle">
                        <Col xs={24} md={12}>
                            <h3 style={{ fontSize: "22px", fontWeight: "700" }}>
                                Cung cấp thiết bị đo lường hiệu chuẩn
                            </h3>
                            <p style={{ fontSize: "16px", lineHeight: "1.6", marginTop: "10px" }}>
                                Thiết bị đo môi trường, Thiết bị đo cơ khí, Thiết bị đo điện,
                                Thiết bị thí nghiệm… của các hãng{" "}
                                <strong>Rion, Kanomax, Insize, Mahr, Nagman, GW Instek, Pico Technology...</strong>
                            </p>
                        </Col>

                        <Col xs={24} md={12}>
                            <div className="img-hover-box">
                                <img
                                    src="https://shop.tecotec.vn/wp-content/uploads/cung-cap-thiet-bi.webp"
                                    alt="service"
                                    className="img-hover"
                                />
                            </div>
                        </Col>

                    </Row>
                    <div className="my-4"></div>
                    {/* ======= HÀNG DƯỚI (4 BOX DỊCH VỤ) ======= */}
                    <Row gutter={[30, 30]} style={{ marginTop: "90px !important" }} className="p-0">
                        {/* BOX 1 */}
                        <Col className="img-hover-box" xs={24} md={12} lg={6}>
                            <img
                                src="https://shop.tecotec.vn/wp-content/uploads/tu-van-giai-phap.webp"
                                className="img-hover"
                                style={{
                                    width: "100%",
                                    height: "160px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                }}
                            />
                            <h4 style={{ fontSize: "18px", fontWeight: "700", marginTop: "12px" }}>
                                Tư vấn giải pháp kỹ thuật
                            </h4>
                            <p style={{ fontSize: "15px", lineHeight: "1.6" }}>
                                Hệ thống đo tự động, hệ thống điều khiển, thu thập dữ liệu lĩnh vực
                                vô tuyến, kiểm tra bo mạch chuyên dụng,...
                            </p>
                        </Col>

                        {/* BOX 2 */}
                        <Col className="img-hover-box" xs={24} md={12} lg={6}>
                            <img
                                src="https://shop.tecotec.vn/wp-content/uploads/dich-vu-hieu-chinh-hieu-chuan.webp"
                                className="img-hover"
                                style={{
                                    width: "100%",
                                    height: "160px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                }}
                            />
                            <h4 style={{ fontSize: "18px", fontWeight: "700", marginTop: "12px" }}>
                                Dịch vụ hiệu chỉnh – hiệu chuẩn thiết bị
                            </h4>
                            <p style={{ fontSize: "15px", lineHeight: "1.6" }}>
                                Đo lường, sửa chữa hiệu chuẩn hệ thống đo lường, cảm biến, điện kiểm,
                                phục hồi bo mạch… của các hãng Keysight, GW Instek...
                            </p>
                        </Col>

                        {/* BOX 3 */}
                        <Col className="img-hover-box" xs={24} md={12} lg={6}>
                            <img

                                src="https://shop.tecotec.vn/wp-content/uploads/dich-vu-sua-chua-thiet-bi.webp"
                                className="img-hover"
                                style={{
                                    width: "100%",
                                    height: "160px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                }}
                            />
                            <h4 style={{ fontSize: "18px", fontWeight: "700", marginTop: "12px" }}>
                                Dịch vụ sửa chữa thiết bị
                            </h4>
                            <p style={{ fontSize: "15px", lineHeight: "1.6" }}>
                                Dụng cụ điện, máy đo, kiểm tra độ cứng; đo độ tròn; đo bề mặt;
                                xử lý lỗi thiết bị hiện trường…
                            </p>
                        </Col>

                        {/* BOX 4 */}
                        <Col className="img-hover-box" xs={24} md={12} lg={6}>
                            <img
                                src="https://shop.tecotec.vn/wp-content/uploads/che-tao-khuon-mau.webp"
                                className="img-hover"
                                style={{
                                    width: "100%",
                                    height: "160px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                }}
                            />
                            <h4 style={{ fontSize: "18px", fontWeight: "700", marginTop: "12px" }}>
                                Dịch vụ chế tạo khuôn mẫu, máy móc
                            </h4>
                            <p style={{ fontSize: "15px", lineHeight: "1.6" }}>
                                Sản xuất khuôn mẫu, gia công chi tiết nhựa kỹ thuật, sản phẩm nhựa
                                dân dụng, gia công theo yêu cầu…
                            </p>
                        </Col>
                    </Row>
                </div>
            </section>

            {/* ==== TẠI SAO CHỌN CHÚNG TÔI ==== */}
            <section className="container-box mb-4">
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
