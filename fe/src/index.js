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


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      {/* Layout chung đưa vào App.js */}
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
      </Route>

      <Route path="post" element={<Post />} />
      <Route path="register" element={<RegisterForm />} />
      <Route path="login" element={<Login />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
