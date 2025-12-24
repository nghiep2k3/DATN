import React, { useState, useEffect } from "react";
import {
    ToolOutlined,
    CarOutlined,
    SafetyCertificateOutlined,
    CustomerServiceOutlined,
} from "@ant-design/icons";
import CarouselCategory from '../../Components/Carousel/Carousel';
import CarouselProduct from '../../Components/CarouselProduct/CarouselProduct';
import { url, url_api } from "../../config";
import { Carousel, message, Spin } from 'antd';
import axios from "axios";
import Category_List from "./Category_List";
import Product_List from "./Product_List";
import ProductCard from "../../Components/ProductCard/ProductCard";
import HeroBanner from "./HeroBanner";

const contentStyle = {
    margin: 0,
    height: '280px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#364d79',
};


const Home = () => {
    const [loading, setLoading] = useState(false);

    if (loading) return <Spin tip="Đang tải danh mục..." />;
    return (
        <div style={{ padding: '20px 0' }}>
            <HeroBanner />
            <Category_List />
            <Product_List />
            <div className="container-box ">
                <div className="box-1200px row">
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
                                    Thiết bị đo điện
                                </h2>
                                <p className="fw-semibold mb-4">Chuyên cung cấp thiết bị đo điện chính hãng</p>
                                <button className="btn btn-success px-4 py-2 fw-semibold">
                                    Xem ngay
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 d-flex flex-column gap-4">

                        <div
                            className="rounded-4 text-white p-5 position-relative overflow-hidden"
                            style={{ backgroundColor: '#00796B' }}
                        >
                            <div className="position-relative z-2">
                                <h3 className="fw-bold display-6">Thiết bị dùng nước</h3>
                                <p className="fw-semibold">Chuyên cung cấp thiết bị dùng nước chính hãng</p>
                                <button className="btn btn-light text-success fw-semibold mt-3">
                                    Xem ngay
                                </button>
                            </div>
                        </div>

                        <div className="row g-4">

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
            </div>
            <Carousel autoplay style={{ marginTop: '40px', marginBottom: '40px' }}>
                <div>
                    <div style={{ height: '450px', backgroundImage: 'url(https://tecotec.store/wp-content/uploads/2025/10/banner-ngang-01-scaled.webp)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} ></div>
                </div>
                <div>
                    <div style={{ height: '450px', backgroundImage: 'url(https://tecotec.store/wp-content/uploads/2025/10/banner-ngang-04-scaled.webp)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} ></div>
                </div>
                <div>
                    <div style={{ height: '450px', backgroundImage: 'url(https://tecotec.store/wp-content/uploads/2025/10/banner-ngang-MERITZ-SEIKI-scaled.webp)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} ></div>
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
