import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Home from './Page/Home/Home';
import About from './Page/About/About';
import Post from './Page/Post/Post';
import RegisterForm from './Page/RegisterForm/RegisterForm';
import Login from './Page/Login/Login';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import CategoryPage from './Page/CategoryPage/CategoryPage';
import ListProductWithCategory from './Page/ListProductWithCategory/ListProductWithCategory';
import Brand from './Page/Brand/Brand';
import Profile from './Page/Profile/Profile';
import FAQ from './Page/FAQ/FAQ';
import { CartProvider } from './Context/CartContext';
import Contact from './Page/Contact/Contact';
import DownloadProduct from './Components/DownloadProduct/DownloadProduct.jsx';
import SearchPage from './Page/SearchPage/SearchPage.jsx';
import SinglePost from './Page/SinglePost/SinglePost.jsx';
import ProductDetail from './Components/ProductDetail/ProductDetail.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CartProvider>
    <BrowserRouter>
      <Routes>
        {/* Layout chung đưa vào App.js */}
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/category-child/:id" element={<ListProductWithCategory />} />
          <Route path="/chi-tiet-bai-viet/:id" element={<SinglePost />} />
          <Route path="/chi-tiet-san-pham/:id" element={<ProductDetail />} />
          <Route path="brand" element={<Brand />} />
          <Route path="profile" element={<Profile />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/dev" element={<DownloadProduct />} />
        </Route>

        <Route path="post" element={<Post />} />
        <Route path="register" element={<RegisterForm />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </BrowserRouter>

  </CartProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
