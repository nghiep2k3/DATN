import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carouselProduct.css";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useCart } from "../../Context/CartContext";
import { Link } from "react-router-dom";

export default function CarouselProduct({ title, linkMore, products }) {
    const { addToCart } = useCart();

    const handleAddToCart = async (item) => {
        await addToCart(item);
    };

    const settings = {
        dots: false,
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
                    <div key={item.id} className="px-2 my-1 position-relative">
                        <Link to={`/chi-tiet-san-pham/${item.id}`} style={{ textDecoration: 'none' }}>
                            <div className="card-product border rounded-4 bg-white shadow-sm p-3 position-relative d-flex flex-column">
                                {item.discount && (
                                    <span className="badge bg-danger position-absolute top-0 end-0 m-2 px-3 py-2">
                                        -{item.discount}%
                                    </span>
                                )}

                                <div className="info-block mb-2 flex-grow-1">
                                    <div className="text-center mb-2">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="rounded-3"
                                            style={{
                                                width: "100%",
                                                height: "150px",
                                                objectFit: "contain",
                                            }}
                                        />
                                    </div>
                                    <h6 className="fw-bold text-dark text-truncate-2 mb-1">{item.name}</h6>
                                    <p className="text-secondary mb-0">
                                        <strong>Model:</strong> {item.model}
                                    </p>
                                </div>

                                {/* Giá hoặc Liên hệ */}
                                <div className="price-block">
                                    {item.oldPrice && (
                                        <p className="text-muted text-decoration-line-through mb-0 small">
                                            {item.oldPrice.toLocaleString()}₫
                                        </p>
                                    )}

                                    <div className="d-flex justify-content-between align-items-center">
                                        <p
                                            className={`fw-semibold mb-0 ${item.price
                                                ? "text-primary"
                                                : "text-primary fw-semibold"
                                                }`}
                                        >
                                            {item.price
                                                ? `${item.price.toLocaleString()}₫`
                                                : "Liên hệ"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <span
                            className="cart-icon-wrapper position-absolute bottom-0 end-0 mb-3 me-4 p-2 bg-white rounded-circle shadow-sm"
                            onClick={() => handleAddToCart(item)}
                            style={{ cursor: "pointer", zIndex: 20 }}
                        >
                            <ShoppingCartOutlined className="cart-icon" />
                        </span>
                    </div>
                ))}
            </Slider>
        </div>
    );
}
