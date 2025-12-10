import React, { useEffect, useState } from "react";
import { Card, Table, Tag, Button } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { url_api } from "../../config";

export default function MyReqBaoGia() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const user_id = Cookies.get("user_id") || "";

    // ======================
    // GET API – My RFQ
    // ======================
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${url_api}/api/rfq/myrequest.php?user_id=${user_id}`);

            if (!res.data.error) {
                setData(res.data.data);
            }
        } catch (error) {
            console.log("Lỗi tải dữ liệu:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ======================
    // STATUS BADGE
    // ======================
    const statusColors = {
        pending: "blue",
        processing: "orange",
        done: "green",
        cancelled: "red",
    };

    const statusLabels = {
        pending: "Chờ xử lý",
        processing: "Đang xử lý",
        done: "Hoàn thành",
        cancelled: "Đã hủy",
    };

    // ======================
    // TABLE COLUMNS
    // ======================
    const columns = [
        {
            title: "Mã yêu cầu",
            dataIndex: "request_code",
            render: (t) => <strong>{t}</strong>,
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "product_name",
            ellipsis: true,
            width: 200,
        },
        {
            title: "SL",
            dataIndex: "quantity",
            width: 70,
        },
        {
            title: "Ghi chú",
            dataIndex: "notes",
            width: 180,
            ellipsis: true,
        },
        {
            title: "File đính kèm",
            dataIndex: "attachment_url",
            render: (file) =>
                file ? (
                    <a href={`${url_api}/${file}`} target="_blank">
                        Tải xuống
                    </a>
                ) : (
                    <span>Không có</span>
                ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            width: 130,
            render: (st) => <Tag color={statusColors[st]}>{statusLabels[st]}</Tag>,
        },
        {
            title: "Ngày tạo",
            dataIndex: "created_at",
            width: 160,
            render: (d) => new Date(d).toLocaleString("vi-VN"),
        },
    ];

    return (
        <div className="container-box">
            <Card
                title="Yêu cầu báo giá của tôi"
                className="box-1200px"
                style={{ borderRadius: 12, margin: 24 }}
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 6 }}
                />
            </Card>
        </div>
    );
}
