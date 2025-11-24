import React, { useState } from "react";
import axios from "axios";
import { Button, message, Card, Typography, Space } from "antd";
import { FileAddOutlined, CloudUploadOutlined, CheckCircleTwoTone } from "@ant-design/icons";
import { url_api } from "../../config";

const { Title, Paragraph, Text } = Typography;

export default function DownloadProduct() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const handleGenerate = async () => {
        try {
            setLoading(true);
            setStatus(null);
            message.loading("Đang tải dữ liệu sản phẩm...", 1);

            const res = await axios.get(`${url_api}/api/product/get_all_products.php`);
            if (res.data.error) {
                message.error("Không thể tải sản phẩm từ server");
                return;
            }

            const jsonData = JSON.stringify(res.data, null, 2);

            const upload = await axios.post(`${url_api}/api/upload_product_json.php`, jsonData, {
                headers: { "Content-Type": "application/json" },
            });

            if (!upload.data.error) {
                message.success("Đã tạo file be/search/product.json thành công!");
                setStatus("success");
            } else {
                message.error(upload.data.message);
                setStatus("error");
            }
        } catch (err) {
            console.error("Lỗi tạo JSON:", err);
            message.error("Không thể kết nối tới máy chủ");
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center py-20 bg-gradient-to-b from-white to-[#f8fafc] min-h-[80vh]">
            <Card
                bordered={false}
                className="shadow-lg w-full max-w-lg rounded-2xl text-center bg-white p-10"
                style={{ borderTop: "4px solid #ff6600" }}
            >
                <Space direction="vertical" size="large" className="w-full">
                    <FileAddOutlined style={{ fontSize: 50, color: "#ff6600" }} />
                    <Title level={3} style={{ marginBottom: 0 }}>
                        Tạo file JSON sản phẩm
                    </Title>
                    <Paragraph>
                        Hệ thống sẽ tải toàn bộ sản phẩm từ cơ sở dữ liệu và lưu thành file{" "}
                        <Text code>be/search/product.json</Text> trên server.
                    </Paragraph>

                    <Button
                        type="primary"
                        size="large"
                        icon={<CloudUploadOutlined />}
                        onClick={handleGenerate}
                        loading={loading}
                        style={{
                            backgroundColor: "#ff6600",
                            borderColor: "#ff6600",
                            width: "100%",
                            height: "48px",
                            fontSize: "16px",
                            fontWeight: 600,
                        }}
                    >
                        {loading ? "Đang tạo file..." : "Tạo file product.json"}
                    </Button>

                    {status === "success" && (
                        <div className="flex flex-col items-center mt-4 text-green-600">
                            <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 30 }} />
                            <Text strong>Đã tạo file thành công!</Text>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="flex flex-col items-center mt-4 text-red-500">
                            <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
                            <Text strong>Đã xảy ra lỗi khi tạo file!</Text>
                        </div>
                    )}
                </Space>
            </Card>
        </div>
    );
}
