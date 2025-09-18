-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:4306
-- Thời gian đã tạo: Th9 18, 2025 lúc 11:00 AM
-- Phiên bản máy phục vụ: 10.4.28-MariaDB
-- Phiên bản PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `thien_nghiep_ecommerce`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `url_image` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `brands`
--

INSERT INTO `brands` (`id`, `name`, `description`, `url_image`, `created_at`) VALUES
(30, 'Rion', 'Rion', '/upload/logo-hang-rion-_68ca70e7068ba8.06134944.svg', '2025-09-17 15:27:19'),
(31, 'Mahr', 'Mahr', '/upload/logo-hang-mahr_68ca722ceb22f5.85611947.svg', '2025-09-17 15:32:44'),
(32, 'Insize', 'Insize', '/upload/logo-hang-insize_68ca72745f6752.07953023.svg', '2025-09-17 15:33:56');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cartitems`
--

CREATE TABLE `cartitems` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `url_image` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `parent_id`, `url_image`, `created_at`) VALUES
(20, 'Điện - Điện tử', 'Danh mục cha về thiết bị điện tử', NULL, 'upload/20250918_093156_fb3d0d3bc863.png', '2025-09-18 11:41:45'),
(21, 'Thiết bị đo điện A', 'Thiết bị đo điện A', NULL, 'upload/20250918_103216_2ab886494838.webp', '2025-09-18 15:32:16'),
(26, 'Test A', 'Test A', NULL, 'upload/20250918_091312_be46c6eb19c1.png', '2025-09-18 14:13:12'),
(27, 'Test A_B', 'Test A_B', 26, 'upload/20250918_093156_fb3d0d3bc863.png', '2025-09-18 14:31:56'),
(28, 'Test A_B_C', 'Test A_B_C', 26, 'upload/20250918_093602_0dd470b2e144.png', '2025-09-18 14:36:02');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orderitems`
--

CREATE TABLE `orderitems` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `shipping_address` text DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` varchar(50) DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `stock_quantity` int(11) DEFAULT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `name`, `sku`, `description`, `price`, `stock_quantity`, `brand_id`, `category_id`, `image_url`, `created_at`) VALUES
(11, 'iPhone 15 128GB', 'APL-IP15-128', 'iPhone 15 bản 128GB', 22990000.00, 20, NULL, NULL, 'https://cdn.tgdd.vn/Products/Images/42/291099/iphone-15-1-600x600.jpg', '2025-08-18 23:57:26'),
(12, 'iPhone 15 Pro Max 256GB', 'APL-IP15PM-256', 'iPhone 15 Pro Max 256GB', 30990000.00, 15, NULL, NULL, 'https://cdn.tgdd.vn/Products/Images/42/307691/iphone-15-pro-max-600x600.jpg', '2025-08-18 23:57:26'),
(13, 'Galaxy S24 256GB', 'SAM-S24-256', 'Samsung Galaxy S24 256GB', 22990000.00, 25, NULL, NULL, 'https://cdn.tgdd.vn/Products/Images/42/325056/samsung-galaxy-s24-5g-256gb-600x600.jpg', '2025-08-18 23:57:26'),
(14, 'Galaxy S24 Ultra 256GB', 'SAM-S24U-256', 'Samsung Galaxy S24 Ultra 256GB', 32990000.00, 10, NULL, NULL, 'https://cdn.tgdd.vn/Products/Images/42/325057/samsung-galaxy-s24-ultra-5g-256gb-600x600.jpg', '2025-08-18 23:57:26'),
(15, 'Redmi Note 13 8/128', 'XIA-RN13-128', 'Xiaomi Redmi Note 13 8/128', 5490000.00, 50, NULL, NULL, 'https://cdn.tgdd.vn/Products/Images/42/314471/xiaomi-redmi-note-13-600x600.jpg', '2025-08-18 23:57:26'),
(16, 'OPPO A79 5G', 'OPP-A79-5G', 'OPPO A79 5G', 6490000.00, 35, NULL, NULL, 'https://cdn.tgdd.vn/Products/Images/42/316296/oppo-a79-5g-600x600.jpg', '2025-08-18 23:57:26'),
(17, 'vivo Y36', 'VIV-Y36', 'vivo Y36', 4990000.00, 30, NULL, NULL, 'https://cdn.tgdd.vn/Products/Images/42/308889/vivo-y36-600x600.jpg', '2025-08-18 23:57:26'),
(18, 'realme C67', 'RLM-C67', 'realme C67', 4690000.00, 40, NULL, NULL, 'https://cdn.tgdd.vn/Products/Images/42/316308/realme-c67-600x600.jpg', '2025-08-18 23:57:26'),
(19, 'Sony WH-1000XM5', 'SNY-WH1000XM5', 'Tai nghe chống ồn cao cấp', 8990000.00, 30, NULL, NULL, 'https://cdn.tgdd.vn/Products/Images/54/299043/tai-nghe-chup-tai-bluetooth-sony-wh-1000xm5-600x600.jpg', '2025-08-18 23:57:26'),
(20, 'Apple Watch Series 9 41mm', 'APL-AWS9-41', 'Apple Watch Series 9 41mm GPS', 10990000.00, 15, NULL, NULL, 'https://cdn.tgdd.vn/Products/Images/7077/316367/apple-watch-series-9-41mm-600x600.jpg', '2025-08-18 23:57:26');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `producttags`
--

CREATE TABLE `producttags` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `tag_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `rating` tinyint(4) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shipments`
--

CREATE TABLE `shipments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `carrier` varchar(100) DEFAULT NULL,
  `tracking_number` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `shipped_at` datetime DEFAULT NULL,
  `delivered_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tags`
--

INSERT INTO `tags` (`id`, `name`) VALUES
(1, 'Tag A'),
(2, 'Tag B');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `usertokens`
--

CREATE TABLE `usertokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` text NOT NULL,
  `type` enum('access','refresh') DEFAULT 'access',
  `expired_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `cartitems`
--
ALTER TABLE `cartitems`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_categories_parent` (`parent_id`);

--
-- Chỉ mục cho bảng `orderitems`
--
ALTER TABLE `orderitems`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `brand_id` (`brand_id`),
  ADD KEY `products_ibfk_2` (`category_id`);

--
-- Chỉ mục cho bảng `producttags`
--
ALTER TABLE `producttags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `shipments`
--
ALTER TABLE `shipments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Chỉ mục cho bảng `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `usertokens`
--
ALTER TABLE `usertokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT cho bảng `cartitems`
--
ALTER TABLE `cartitems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT cho bảng `orderitems`
--
ALTER TABLE `orderitems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `producttags`
--
ALTER TABLE `producttags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `shipments`
--
ALTER TABLE `shipments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `usertokens`
--
ALTER TABLE `usertokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `cartitems`
--
ALTER TABLE `cartitems`
  ADD CONSTRAINT `cartitems_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `cartitems_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Các ràng buộc cho bảng `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_categories_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `orderitems`
--
ALTER TABLE `orderitems`
  ADD CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `producttags`
--
ALTER TABLE `producttags`
  ADD CONSTRAINT `producttags_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `producttags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`);

--
-- Các ràng buộc cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Các ràng buộc cho bảng `shipments`
--
ALTER TABLE `shipments`
  ADD CONSTRAINT `shipments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Các ràng buộc cho bảng `usertokens`
--
ALTER TABLE `usertokens`
  ADD CONSTRAINT `usertokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
