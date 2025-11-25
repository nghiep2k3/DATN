import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "./carousel.css";
import { url_api } from "../../config"; // để ghép đường dẫn ảnh đúng

const Carousel = ({ title, data }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: 4 } },
            { breakpoint: 992, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 576, settings: { slidesToShow: 1 } },
        ],
    };

    return (
        <div className="box-1200px my-5">
            <h3 className="fw-bold mb-4 text-primary">{title}</h3>

            <Slider {...settings}>
                {data.map((item) => (
                    <div key={item.id} className="px-2 pb-1">
                        <Link
                            to={`/category/${item.id}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <div
                                className="bg-white border rounded-4 shadow-sm text-center p-2 card-equal hover-scale"
                                style={{
                                    height: "100%",
                                    cursor: "pointer",
                                    transition: "transform 0.3s ease",
                                }}
                            >
                                <img
                                    src={`${url_api}/${item.url_image}`} // ✅ đúng trường
                                    alt={item.category} // ✅ đúng trường
                                    className="rounded-3 mb-3"
                                    style={{
                                        width: "100%",
                                        height: "140px",
                                        objectFit: "contain",
                                    }}
                                />
                                <h6 className="fw-bold">{item.category}</h6>

                                {/* ✅ Số lượng danh mục con (nếu có) */}
                                <p className="text-primary mb-0">
                                    ({item.sub_category?.length || 0} Sản phẩm)
                                </p>
                            </div>
                        </Link>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Carousel;
