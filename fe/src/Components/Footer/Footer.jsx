import React from "react";
import {
    FacebookFilled,
    MailFilled,
    LinkedinFilled,
    YoutubeFilled,
    HomeOutlined,
    PhoneOutlined,
} from "@ant-design/icons";
import styles from "./Footer.module.css";
import { url, url_api } from "../../config";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Cột 1 */}
                <div className={styles.col}>
                    <img
                        src={`${url_api}/upload/logo.png`}
                        alt="Thiện Nghiệp"
                        className={styles.logo}
                    />
                    <h4>Công ty Cổ phần Thiện Nghiệp Group</h4>
                    <p>Nhà cung cấp thiết bị đo lường hàng đầu Việt Nam.</p>

                    <p className={styles.socialLabel}>Mạng xã hội:</p>
                    <div className={styles.socialIcons}>
                        <a href="#"><FacebookFilled /></a>
                        <a href="#"><MailFilled /></a>
                        <a href="#"><LinkedinFilled /></a>
                        <a href="#"><YoutubeFilled /></a>
                    </div>
                </div>

                {/* Cột 2 */}
                <div className={styles.col}>
                    <h5>LIÊN KẾT NHANH</h5>
                    <ul>
                        <li><a href="/">Trang chủ</a></li>
                        <li><a href="/about">Giới thiệu</a></li>
                        <li><a href="/brand">Hãng sản xuất</a></li>
                        <li><a href="/yeu-cau-bao-gia">Yêu cầu báo giá</a></li>
                        <li><a href="/cau-hoi-thuong-gap">Câu hỏi thường gặp</a></li>
                        <li><a href="/contact">Liên hệ</a></li>
                    </ul>
                </div>

                {/* Cột 3 */}
                <div className={styles.col}>
                    <h5>DANH MỤC SẢN PHẨM</h5>
                    <ul>
                        <li><a href="#">Thiết bị đo cơ khí chính xác</a></li>
                        <li><a href="#">Thiết bị đo điện</a></li>
                        <li><a href="#">Thiết bị đo tần số, vô tuyến điện tử</a></li>
                        <li><a href="#">Thiết bị kiểm tra không phá hủy - NDT</a></li>
                        <li><a href="#">Thiết bị quan trắc môi trường</a></li>
                        <li><a href="#">Dụng cụ cầm tay - Hand tools</a></li>
                        <li><a href="#">Thiết bị nâng hạ</a></li>
                        <li><a href="#">Thiết bị và máy móc công nghiệp</a></li>
                    </ul>
                </div>

                {/* Cột 4 */}
                <div className={styles.col}>
                    <h5>LIÊN HỆ VỚI CHÚNG TÔI</h5>
                    <ul className={styles.contactList}>
                        <li>
                            <HomeOutlined className={styles.icon} />
                            <span>
                                Tầng 2, Tòa nhà CT3A, KĐT Mễ Trì Thượng, Phường Mễ Trì, Quận Nam Từ Liêm, Hà Nội
                            </span>
                        </li>
                        <li>
                            <PhoneOutlined className={styles.icon} />
                            <span>Hotline: <strong>0966.580.080</strong></span>
                        </li>
                        <li>
                            <MailFilled className={styles.icon} />
                            <span>Email: <strong>info@tecostore.vn</strong></span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className={styles.bottomBar}>
                <p>
                    © 2025 <strong>Thiện Nghiệp Group</strong>. Tất cả các quyền được bảo lưu.
                    GPĐKKD: 0101038659 do Sở KH&ĐT TP. Hà Nội cấp ngày 26/05/2009.
                </p>
            </div>
        </footer>
    );
}
