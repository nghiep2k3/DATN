public_html/
   .htaccess               # duy nhất 1 htaccess: rewrite → index.php, cache static, chặn dotfiles
├─ public/                 # (webroot) CHỈ thư mục này được public ra internet
│  ├─ index.php            # front controller: bootstrap, load env, dispatch router
│  └─ assets/              # file tĩnh: css, js, images...
├─ app/                    # mã nguồn PHP thuần theo OOP (KHÔNG public)
│  ├─ Core/                # lớp lõi: Router, Request, Response, DB, Env, ErrorHandler
│  ├─ Controllers/         # controller mỏng, gọi service
│  ├─ Services/            # nghiệp vụ (business logic)
│  └─ Models/              # entity/DTO (nếu cần)
├─ config/
│  └─ .env                 # biến môi trường (DB_DSN, DB_USER, DB_PASS, APP_DEBUG...)
├─ storage/
│  └─ uploads/             # nơi lưu file người dùng upload (ảnh, tài liệu…)
├─ vendor/                 # composer autoload/libraries
└─ composer.json           # PSR-4 autoload + khai báo thư viện
