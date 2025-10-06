import React from 'react';
import {
    ToolOutlined,
    CarOutlined,
    SafetyCertificateOutlined,
    CustomerServiceOutlined,
} from "@ant-design/icons";
import CarouselCategory from '../../Components/Carousel/Carousel';
import CarouselProduct from '../../Components/CarouselProduct/CarouselProduct';
import { Carousel } from 'antd';
const contentStyle = {
    margin: 0,
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};

const Home = () => {
    const categories = [
        {
            id: 1,
            name: "Thiết bị quan trắc môi trường",
            count: 766,
            image: "https://tecotec.store/wp-content/uploads/2025/08/thiet-bi-quan-trac-moi-truong.webp",
        },
        {
            id: 2,
            name: "Thiết bị kiểm tra không phá hủy - NDT",
            count: 863,
            image: "https://tecotec.store/wp-content/uploads/2025/08/thiet-bi-quan-trac-moi-truong.webp",
        },
        {
            id: 3,
            name: "Thiết bị đo tần số, vô tuyến điện tử",
            count: 293,
            image: "https://tecotec.store/wp-content/uploads/2025/08/thiet-bi-quan-trac-moi-truong.webp",
        },
        {
            id: 4,
            name: "Thiết bị đo điện",
            count: 847,
            image: "https://tecotec.store/wp-content/uploads/2025/08/thiet-bi-quan-trac-moi-truong.webp",
        },
        {
            id: 5,
            name: "Thiết bị đo cơ khí chính xác",
            count: 9299,
            image: "https://tecotec.store/wp-content/uploads/2025/08/thiet-bi-quan-trac-moi-truong.webp",
        },
        {
            id: 6,
            name: "Thiết bị đo cơ khí chính xác",
            count: 9299,
            image: "https://tecotec.store/wp-content/uploads/2025/08/thiet-bi-quan-trac-moi-truong.webp",
        },
    ];

    const products = [
        {
            id: 1,
            name: "Thước kẹp cơ khí vạch dấu 7203-300A",
            model: "7203-300A",
            oldPrice: 955000,
            price: 679000,
            discount: 29,
            image:
                "https://tecotec.store/wp-content/uploads/2025/05/1109-13.jpg",
        },
        {
            id: 2,
            name: "Thước kẹp điện tử vạch dấu Insize 1166-150A",
            model: "1166-150A",
            oldPrice: null,
            price: null,
            discount: null,
            image:
                "https://tecotec.store/wp-content/uploads/2025/05/7203_300A-1.jpg",
        },
        {
            id: 3,
            name: "Thước kẹp cơ khí vạch dấu Insize 7202-200A",
            model: "7202-200A",
            price: null,
            image:
                "https://tecotec.store/wp-content/uploads/2025/05/7203_300A-1.jpg",
        },
        {
            id: 4,
            name: "Thước đo cao điện tử Insize 1151-600A",
            model: "1151-600A",
            price: null,
            image:
                "https://tecotec.store/wp-content/uploads/2025/05/7203_300A-1.jpg",
        },
        {
            id: 5,
            name: "Thước kẹp điện tử hệ mét Insize 1109-150",
            model: "1109-150",
            price: null,
            image:
                "https://tecotec.store/wp-content/uploads/2025/05/7203_300A-1.jpg",
        },
        {
            id: 6,
            name: "Thước kẹp điện tử hệ mét Insize 1109-150",
            model: "1109-150",
            price: null,
            image:
                "https://tecotec.store/wp-content/uploads/2025/05/7203_300A-1.jpg",
        },
    ];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 0' }}>
            <div className="row g-4">

                {/* Cột trái - Sony Headphone */}
                <div className="col-md-6">
                    <div
                        className="position-relative rounded-4 overflow-hidden text-white"
                        style={{
                            height: '100%',
                            backgroundColor: '#000',
                        }}
                    >
                        <img
                            src="https://tecotec.store/wp-content/uploads/2025/05/slide01.webp"
                            alt="Sony Headphone"
                            className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover opacity-75"
                        />
                        <div className="position-relative p-5 d-flex flex-column justify-content-center h-100 align-items-start">
                            <h2 className="fw-bold mb-3" style={{ color: '#ff9800' }}>
                                Sony 5G Headphone
                            </h2>
                            <p className="fw-semibold mb-4">Only Music. Nothing Else.</p>
                            <button className="btn btn-success px-4 py-2 fw-semibold">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cột phải */}
                <div className="col-md-6 d-flex flex-column gap-4">

                    {/* Air Mavic 3 */}
                    <div
                        className="rounded-4 text-white p-5 position-relative overflow-hidden"
                        style={{ backgroundColor: '#00796B' }}
                    >
                        <div className="position-relative z-2">
                            <h3 className="fw-bold display-6">Air Mavic 3</h3>
                            <p className="fw-semibold">As powerful as it is portable</p>
                            <button className="btn btn-light text-success fw-semibold mt-3">
                                Xem ngay
                            </button>
                        </div>
                    </div>

                    {/* Hai ô nhỏ dưới */}
                    <div className="row g-4">

                        {/* Thiết bị đo rung */}
                        <div className="col-md-6">
                            <div className="rounded-4 bg-light p-4 h-100 position-relative">
                                <div className="position-relative">
                                    <h5 className="fw-bold">
                                        Thiết bị đo rung - ồn RION
                                    </h5>
                                    <p className="text-muted mb-2">Cảm biến độ nhạy cao</p>
                                    <a href="#" className="fw-semibold text-dark text-decoration-none">
                                        Xem ngay →
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Thiết bị kiểm soát bụi */}
                        <div className="col-md-6">
                            <div className="rounded-4 bg-light p-4 h-100 position-relative">
                                <div className="position-relative">
                                    <h5 className="fw-bold">
                                        Thiết bị kiểm soát bụi trong phòng sạch Kanomax
                                    </h5>
                                    <p className="fw-semibold text-primary mb-2">Giảm tới 30%</p>
                                    <a href="#" className="fw-semibold text-dark text-decoration-none">
                                        Xem ngay →
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            {/* Carousel Component */}
            <CarouselCategory title="Danh mục sản phẩm" data={categories} />
            <CarouselProduct title="Thiết bị đo cơ khí chính xác" products={products} linkMore="#" />
            <CarouselProduct title="Thiết bị đo tần số vô tuyến" products={products} linkMore="#" />
            <CarouselProduct title="Thiết bị kiểm tra không phá hủy" products={products} linkMore="#" />
            <Carousel autoplay style={{ padding: '0 20px', marginTop: '40px', marginBottom: '40px' }}>
                <div>
                    <h3 style={contentStyle}>1</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>2</h3>
                </div>
            </Carousel>

            <section
                className="py-5"
                style={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: "12px",
                    marginTop: "40px",
                }}
            >
                <div className="container">
                    <h2 className="fw-bold text-center mb-5 text-dark">
                        Dịch vụ của chúng tôi
                    </h2>

                    <div className="row g-4">
                        {/* Dịch vụ 1 */}
                        <div className="col-md-6 col-lg-3">
                            <div
                                className="border rounded-4 text-center p-4 bg-white shadow-sm h-100"
                                style={{ transition: "0.3s ease" }}
                            >
                                <div
                                    className="d-flex justify-content-center align-items-center mx-auto mb-3"
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        borderRadius: "50%",
                                        backgroundColor: "rgba(24,144,255,0.1)",
                                    }}
                                >
                                    <ToolOutlined style={{ fontSize: "30px", color: "#1890ff" }} />
                                </div>
                                <h5 className="fw-bold text-dark mb-2">
                                    Hiệu chuẩn & bảo trì thiết bị
                                </h5>
                                <p className="text-muted small">
                                    Dịch vụ kiểm định, hiệu chuẩn, bảo dưỡng thiết bị đo lường định kỳ
                                    theo tiêu chuẩn quốc tế.
                                </p>
                            </div>
                        </div>

                        {/* Dịch vụ 2 */}
                        <div className="col-md-6 col-lg-3">
                            <div
                                className="border rounded-4 text-center p-4 bg-white shadow-sm h-100"
                                style={{ transition: "0.3s ease" }}
                            >
                                <div
                                    className="d-flex justify-content-center align-items-center mx-auto mb-3"
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        borderRadius: "50%",
                                        backgroundColor: "rgba(24,144,255,0.1)",
                                    }}
                                >
                                    <CarOutlined style={{ fontSize: "30px", color: "#1890ff" }} />
                                </div>
                                <h5 className="fw-bold text-dark mb-2">Giao hàng nhanh chóng</h5>
                                <p className="text-muted small">
                                    Giao hàng toàn quốc với đối tác vận chuyển uy tín, đảm bảo đúng
                                    thời gian và an toàn tuyệt đối.
                                </p>
                            </div>
                        </div>

                        {/* Dịch vụ 3 */}
                        <div className="col-md-6 col-lg-3">
                            <div
                                className="border rounded-4 text-center p-4 bg-white shadow-sm h-100"
                                style={{ transition: "0.3s ease" }}
                            >
                                <div
                                    className="d-flex justify-content-center align-items-center mx-auto mb-3"
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        borderRadius: "50%",
                                        backgroundColor: "rgba(24,144,255,0.1)",
                                    }}
                                >
                                    <SafetyCertificateOutlined
                                        style={{ fontSize: "30px", color: "#1890ff" }}
                                    />
                                </div>
                                <h5 className="fw-bold text-dark mb-2">Bảo hành chính hãng</h5>
                                <p className="text-muted small">
                                    Tất cả thiết bị đều được bảo hành chính hãng, hỗ trợ đổi mới nếu
                                    lỗi kỹ thuật.
                                </p>
                            </div>
                        </div>

                        {/* Dịch vụ 4 */}
                        <div className="col-md-6 col-lg-3">
                            <div
                                className="border rounded-4 text-center p-4 bg-white shadow-sm h-100"
                                style={{ transition: "0.3s ease" }}
                            >
                                <div
                                    className="d-flex justify-content-center align-items-center mx-auto mb-3"
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        borderRadius: "50%",
                                        backgroundColor: "rgba(24,144,255,0.1)",
                                    }}
                                >
                                    <CustomerServiceOutlined
                                        style={{ fontSize: "30px", color: "#1890ff" }}
                                    />
                                </div>
                                <h5 className="fw-bold text-dark mb-2">Tư vấn kỹ thuật 24/7</h5>
                                <p className="text-muted small">
                                    Đội ngũ kỹ sư hỗ trợ tư vấn kỹ thuật và giải pháp thiết bị đo phù
                                    hợp mọi nhu cầu.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
