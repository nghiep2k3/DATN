import React from "react";
import { Row, Col, Button } from "antd";
import styles from "./Home.module.css";

export default function HeroBanner() {
    return (
        <div className="container-box">
            <Row className="box-1200px" gutter={[10, 24]}>
                {/* === BOX LỚN === */}
                <Col xs={24} md={12} lg={12}>
                    <div
                        className={`${styles.campaignBox} ${styles.big}`}
                        style={{
                            backgroundImage:
                                "url('https://shop.tecotec.vn/wp-content/uploads/thiet-bi-do-hang-Mahr.webp')",
                        }}
                    >
                        <div className={styles.campaignContent}>
                            <h2 className={styles.title}>
                                Giá giảm lên đến <span>55%</span> thiết bị đo hãng Mahr từ 01/04 – 30/06
                            </h2>

                            <Button type="primary" className={styles.btnBlue}>
                                MUA SẮM NGAY
                            </Button>
                        </div>
                    </div>
                </Col>

                {/* === BOX 2 === */}
                <Col xs={24} md={6} lg={6}>
                    <div
                        className={`${styles.campaignBox} ${styles.big}`}
                        style={{
                            backgroundImage:
                                "url('https://shop.tecotec.vn/wp-content/uploads/ojojojojjojojj.webp')",
                            backgroundPosition: '-230px 80px',
                        }}
                    >
                        <div className={styles.campaignContent}>
                            <h3 className={styles.titleSmall}>Máy đo bụi Kanomax 3888 và 3889</h3>

                            <Button className={styles.btnOrange}>KHÁM PHÁ NGAY</Button>
                        </div>
                    </div>
                </Col>

                {/* === BOX 3 + BOX 4 === */}
                <Col xs={24} md={6} lg={6} className="d-flex flex-column justify-content-between">
                    <div
                        className={`${styles.campaignBox} ${styles.small}`}
                        style={{
                            backgroundImage:
                                "url('https://shop.tecotec.vn/wp-content/uploads/May-do-gio-nhiet-do-cao-Kanomax-6162.webp')",
                            backgroundPosition: '0px -40px',
                        }}
                    >
                        <div className={styles.campaignContent}>
                            <h3 className={styles.titleSmall}>Máy đo gió nhiệt độ cao Kanomax 6162</h3>

                            <Button className={styles.btnOrange}>TÌM HIỂU THÊM</Button>
                        </div>
                    </div>

                    <div
                        className={`${styles.campaignBox} ${styles.small} overflow-hidden`}
                        style={{
                            backgroundImage:
                                "url('https://shop.tecotec.vn/wp-content/uploads/MAHR7.webp')",
                        }}
                    >
                        <div className={styles.campaignContent}>
                            <h3 className={styles.titleSmall}>Máy đo độ nhám cầm tay Marsurf PS10</h3>

                            <Button className={styles.btnBlue}>MUA NGAY</Button>
                        </div>
                    </div>
                </Col>

            </Row>
        </div>
    );
}
