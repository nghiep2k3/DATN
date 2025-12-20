import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Home from './Page/Home/Home';
import Login from './Page/Login/Login';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';

import ProductDashboard from './Page/ProductDashboard/ProductDashboard.jsx';
import DownloadProduct from './Components/DownloadProduct/DownloadProduct.jsx';

import { CartProvider } from './Context/CartContext';
import Orders from './Page/Orders/Orders.jsx';
import Warehouse from './Warehouse/Warehouse.jsx';
import Account from './Page/Account/Account.jsx';
import QuoteRequests from './Page/QuoteRequests/QuoteRequests.jsx';
import NotFound from './Page/NotFound/NotFound.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CartProvider>
    <BrowserRouter>
      <Routes>
        {/* Route đăng nhập - không cần bảo vệ */}
        <Route path="/login" element={<Login />} />

        {/* Các route được bảo vệ - cần đăng nhập */}
        <Route path="/" element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }>
          <Route index element={<Home />} />

          {/* Các trang trong sidebar */}
          <Route path="/product-dashboard" element={<ProductDashboard />} />
          <Route path="/quote-requests" element={<QuoteRequests />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/account" element={<Account />} />
          <Route path="/warehouse" element={<Warehouse />} />

          {/* Trang có sẵn */}
          <Route path="/dev" element={<DownloadProduct />} />
        </Route>

        {/* Redirect mặc định về login nếu không match route nào */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </CartProvider>
);

reportWebVitals();
