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
import Orders from './Page/Orders/Orders.jsx';
import Warehouse from './Warehouse/Warehouse.jsx';
import Account from './Page/Account/Account.jsx';
import QuoteRequests from './Page/QuoteRequests/QuoteRequests.jsx';

// Tạo page rỗng để tránh báo lỗi

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CartProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />

          {/* Các trang trong sidebar */}
          <Route path="/product-dashboard" element={<ProductDashboard />} />
          <Route path="/quote-requests" element={<QuoteRequests />} />
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
