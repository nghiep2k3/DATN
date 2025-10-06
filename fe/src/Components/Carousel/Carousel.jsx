import React from "react";
import Slider from "react-slick";
import "./carousel.css"; 

const Carousel = ({ title, data }) => {
  const settings = {
    dots: true, // hiển thị dot tròn
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true, // có mũi tên
    autoplay: false,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 992, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4 text-primary">{title}</h3>

      <Slider {...settings}>
        {data.map((item) => (
          <div key={item.id} className="px-2">
            <div
              className="bg-white border rounded-4 shadow-sm text-center p-3 card-equal"
              style={{
                height: "100%",
                cursor: "pointer",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                className="rounded-3 mb-3"
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "cover",
                }}
              />
              <h6 className="fw-bold">{item.name}</h6>
              <p className="text-primary mb-0">
                ({item.count.toLocaleString()} Sản phẩm)
              </p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
