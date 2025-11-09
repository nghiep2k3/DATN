import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carouselProduct.css"; // file css riêng để tùy chỉnh

export default function CarouselProduct({ title, linkMore, products }) {
    const settings = {
        dots: false, // có thể bật true nếu muốn dot dưới
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
        <div className="box-1200px py-5">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-dark">{title}</h3>
                {linkMore && (
                    <a href={linkMore} className="text-primary fw-semibold text-decoration-none">
                        Xem thêm
                    </a>
                )}
            </div>

            <Slider {...settings}>
                {products.map((item) => (
                    <div key={item.id} className="px-2">
                        <div className="card-product border rounded-4 bg-white shadow-sm p-3 h-100 ">
                            {/* Label giảm giá */}
                            {item.discount && (
                                <span className="badge bg-danger position-absolute top-0 end-0 m-2 px-3 py-2">
                                    -{item.discount}%
                                </span>
                            )}

                            {/* Ảnh sản phẩm */}
                            <div className="mb-1">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="rounded-3"
                                    style={{
                                        width: "100%",
                                        minHeight: "120px",
                                        objectFit: "contain",
                                    }}
                                />
                            </div>

                            {/* Thông tin sản phẩm */}
                            <h6 className="fw-bold text-dark">{item.name}</h6>
                            <span className="mb-1">
                                <strong>Model:</strong> {item.model}
                            </span>

                            {/* Giá */}
                            {item.oldPrice ? (
                                <div>
                                    <p className="text-muted text-decoration-line-through mb-0">
                                        {item.oldPrice.toLocaleString()}₫
                                    </p>
                                    <p className="text-primary fw-bold mb-0">
                                        {item.price.toLocaleString()}₫
                                    </p>
                                </div>
                            ) : (
                                <p className="text-primary fw-semibold mb-0">Liên hệ</p>
                            )}
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}
