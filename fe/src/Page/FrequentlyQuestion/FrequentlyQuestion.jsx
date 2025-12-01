import React from "react";
import { Flex, Col, Collapse, Typography, Anchor, Row } from "antd";
import "./FrequentlyQuestion.css";

const { Title, Text } = Typography;

export default function FrequentlyQuestion() {

    const sections = [
        {
            id: "shipping",
            title: "Đơn Hàng và Giao Hàng",
            items: [
                { q: "Có thể vận chuyển hàng đến những đâu?", a: "TN GROUP hỗ trợ giao hàng toàn quốc và xuất khẩu theo yêu cầu dự án." },
                { q: "Đơn hàng của tôi sẽ được vận chuyển theo cách nào?", a: "Tùy theo sản phẩm, TN GROUP sử dụng dịch vụ giao hàng nhanh, vận chuyển kỹ thuật hoặc logistics dự án." },
                { q: "Làm sao tôi biết khi nào đơn hàng tới?", a: "Bạn sẽ nhận được thông báo qua SMS/Email và có thể theo dõi tình trạng đơn hàng trong tài khoản." },
                { q: "Tôi có cần phải trả các nghĩa vụ/thuế không?", a: "Một số đơn hàng có thể phát sinh thuế VAT hoặc thuế nhập khẩu, tùy theo quy định pháp luật." },
                { q: "Tôi có thể đổi – trả hàng không?", a: "TN GROUP hỗ trợ đổi trả trong 7 ngày đối với sản phẩm lỗi từ nhà sản xuất." }
            ]
        },
        {
            id: "payment",
            title: "Thanh Toán",
            items: [
                { q: "Tôi có thể yêu cầu báo giá không?", a: "Bạn có thể gửi yêu cầu báo giá trực tiếp trên website hoặc liên hệ phòng kinh doanh của TN GROUP." },
                { q: "Tôi có thể thanh toán bằng phương thức nào?", a: "Hỗ trợ chuyển khoản, quét mã QR, COD hoặc thanh toán qua ví điện tử." },
                { q: "Làm thế nào để tôi yên tâm rằng thông tin thanh toán của tôi được bảo vệ?", a: "TN GROUP mã hóa toàn bộ dữ liệu thanh toán và không lưu trữ thông tin thẻ của khách hàng." }
            ]
        },
        {
            id: "support",
            title: "Dịch Vụ Khách Hàng",
            items: [
                { q: "Làm cách nào để liên hệ với dịch vụ khách hàng?", a: "Bạn có thể gọi hotline 1900 9999 hoặc email support@tngroup.vn." },
                { q: "Thời gian hoạt động của dịch vụ chăm sóc khách hàng?", a: "Từ 8:00 – 17:30 (Thứ 2 – Thứ 7)." }
            ]
        },
        {
            id: "promo",
            title: "Khuyến Mãi và Giảm Giá",
            items: [
                { q: "Có các chương trình khuyến mãi hoặc giảm giá đặc biệt không?", a: "TN GROUP thường xuyên triển khai ưu đãi theo tháng hoặc theo thương hiệu." },
                { q: "Làm thế nào để tôi nhận được thông tin ưu đãi mới nhất?", a: "Bạn có thể đăng ký nhận email hoặc theo dõi Fanpage chính thức." },
                { q: "Có chính sách giá đặc biệt cho đơn hàng lớn không?", a: "Có. TN GROUP có chính sách chiết khấu theo số lượng hoặc theo dự án." }
            ]
        },
        {
            id: "product",
            title: "Thương Hiệu – Sản Phẩm",
            items: [
                { q: "Tôi có thể tìm kiếm sản phẩm bằng cách nào?", a: "Bạn có thể dùng thanh tìm kiếm hoặc duyệt theo danh mục sản phẩm trên website." },
                { q: "Tôi đọc thông số kỹ thuật ở đâu?", a: "Thông tin kỹ thuật được hiển thị trong các tab chi tiết sản phẩm." },
                { q: "Sản phẩm của TN GROUP có bảo hành không?", a: "Có, thời gian bảo hành tùy sản phẩm (1–12 tháng hoặc theo hãng sản xuất)." },
                { q: "Cách sử dụng sản phẩm của TN GROUP như thế nào?", a: "Sản phẩm đi kèm hướng dẫn sử dụng, hoặc bạn có thể tải bản PDF trên website." }
            ]
        },
    ];

    return (
        <div className="faq-page">

            {/* HERO */}
            <Flex className="faq-hero" vertical align="center" justify="center">
                <Title level={1} className="faq-title">Câu hỏi thường gặp (FAQ)</Title>
                <Text className="faq-subtitle">Tổng hợp thông tin hỗ trợ dành cho khách hàng của TN GROUP</Text>
            </Flex>

            {/* CONTENT + TOC */}
            <Row justify="center" className="my-4" style={{ marginTop: 40 }} gutter={[40, 40]}>
                
                {/* TABLE OF CONTENT */}
                <Col xs={22} md={6} lg={5}>
                    <div className="toc-box">
                        <Title level={4} style={{ marginBottom: 20 }}>Mục lục</Title>
                        <Anchor
                            items={sections.map(sec => ({
                                key: sec.id,
                                href: `#${sec.id}`,
                                title: sec.title
                            }))}
                        />
                    </div>
                </Col>

                {/* FAQ SECTIONS */}
                <Col xs={22} md={14} lg={12}>
                    {sections.map((sec) => (
                        <div id={sec.id} key={sec.id} className="faq-section">
                            <Title level={3} className="faq-section-title">{sec.title}</Title>

                            <Collapse
                                accordion
                                expandIconPosition="end"
                                className="faq-collapse"
                                items={sec.items.map((item, index) => ({
                                    key: `${sec.id}-${index}`,
                                    label: item.q,
                                    children: <p>{item.a}</p>,
                                }))}
                            />
                        </div>
                    ))}
                </Col>

            </Row>
        </div>
    );
}
