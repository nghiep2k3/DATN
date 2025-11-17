import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Form, Input, Upload, Button, message, Tabs } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { url_api, url } from "../../config";
import "./Product.css";
import ProductCategory from "./ProductCategory";
import ProductTag from "./ProductTag";
import ProductBrands from "./ProductBrands";
import Product from "./Product";



export default function ProductDashboard() {
    const items = [
        {
            key: '1',
            label: 'Danh mục sản phẩm',
            children: <ProductCategory />,
        },
        {
            key: '2',
            label: 'Thẻ sản phẩm',
            children: <ProductTag />,
        },
        {
            key: '3',
            label: 'Thương hiệu sản phẩm',
            children: <ProductBrands />,
        },
        {
            key: '4',
            label: 'Sản phẩm',
            children: <Product />,
        },
    ];

    return <div>
        <Tabs defaultActiveKey="1" items={items}/>
    </div>
}

