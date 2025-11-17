import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Home from './Page/Home/Home';
import Login from './Page/Login/Login';

import ProductDashboard from './Page/ProductDashboard/ProductDashboard.jsx';
import DownloadProduct from './Components/DownloadProduct/DownloadProduct.jsx';

import { CartProvider } from './Context/CartContext';

// Tạo page rỗng để tránh báo lỗi
const PostCategory = () => <h2>Danh mục bài viết</h2>;
const Orders = () => <h2>Đơn hàng</h2>;
const Account = () => <h2>Thông tin tài khoản</h2>;
const Warehouse = () => <h2>Thông tin kho hàng</h2>;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CartProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />

          {/* Các trang trong sidebar */}
          <Route path="/product-dashboard" element={<ProductDashboard />} />
          <Route path="/post-category" element={<PostCategory />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/account" element={<Account />} />
          <Route path="/warehouse" element={<Warehouse />} />

          {/* Trang có sẵn */}
          {/* <Route path="/category/:id" element={<ProductCategory />} /> */}
          <Route path="/dev" element={<DownloadProduct />} />
        </Route>

        <Route path="login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </CartProvider>
);

reportWebVitals();
