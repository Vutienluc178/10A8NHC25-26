# Website lớp 10A8 – Classic MVP v0.2.1
**Triển khai trong 7 ngày** – Google Sheets + Apps Script + Bootstrap (không Tailwind).  
**Bối cảnh:** Sĩ số 44 · GVCN: thầy Vũ Tiến Lực · THPT Nguyễn Hữu Cảnh.

## 0) Kiến trúc & Triết lý
- Frontend tĩnh (GitHub Pages/Vercel) + Backend JSON (Apps Script Web App).
- Dữ liệu lưu trong Google Sheets theo schema ở thư mục `data/`.
- Màu chủ đạo: `#1d4ed8` (xanh dương). Lighthouse mục tiêu ≥ 90 (mobile).

## 1) Cấu trúc thư mục
```
.
├─ index.html
├─ assets/
│  ├─ style.css
│  └─ app.js
├─ gas/
│  ├─ Code.gs
│  └─ appsscript.json
└─ data/
   ├─ sample_students.csv
   ├─ sample_news.csv
   ├─ sample_schedule.csv
   ├─ sample_renluyen.csv
   ├─ sample_album.csv
   └─ sample_tailieu.csv
```

## 2) Thiết lập Google Sheets
Tạo Google Spreadsheet với các sheet và cột tương ứng:
- **TinTuc:** ID, TieuDe, NoiDung, Ngay, TacGia, Anh
- **LichHoc:** Ngay, Mon, Tiet, GhiChu
- **RenLuyen:** Tuan, HoTen, Diem, XepLoai
- **Album:** ID, TieuDe, LinkAnh, Ngay
- **TaiLieu:** ID, TenFile, Link, Mon, MoTa
- **Rbac:** Email, Role (GVCN, BCS, Viewer)

> Gợi ý: import nhanh dữ liệu mẫu từ thư mục `data/` (CSV).

## 3) Triển khai Apps Script (Backend)
1. Vào `script.google.com` → New project → liên kết Spreadsheet vừa tạo.
2. Dán nội dung `gas/Code.gs` vào, sửa `SPREADSHEET_ID` cho đúng.
3. Triển khai: Deploy → New deployment → type: Web app
   - Execute as: **Me (owner)**
   - Who has access: **Anyone**
4. Lấy URL web app dán vào `assets/app.js` biến `SCRIPT_URL`.

> Nếu cần chặn CORS, cấu hình whitelist origin trong `ALLOWED_ORIGINS` ở `Code.gs`.

## 4) Triển khai Frontend
### GitHub Pages
- Tạo repo mới, upload toàn bộ thư mục (trừ `gas/` nếu muốn tách).
- Settings → Pages → Deploy from branch → root hoặc `/`.
- Đợi vài phút để website hoạt động.

### Vercel
- Import repo → Project Settings → Framework: **Other** → Deploy.
- Thêm domain tuỳ chọn.

## 5) Sửa biến cấu hình
- `assets/app.js`: `SCRIPT_URL` là URL Apps Script web app của bạn.
- `gas/Code.gs`: `SPREADSHEET_ID`, `ALLOWED_ORIGINS`.

## 6) Dữ liệu mẫu
- 10 học sinh, 5 bài đăng, 2 sự kiện, 1 tuần điểm rèn luyện. Xem trong thư mục `data/`.

## 7) Kiểm thử nhanh
- Mở web → Navbar điều hướng đến: Tin tức, Lịch, Rèn luyện, Album, Tài liệu, Liên hệ.
- Nhấn “Ping API” (góc phải) để kiểm tra kết nối.
- Dùng Lighthouse trong Chrome DevTools, mục tiêu ≥ 90.

## 8) Bảo mật & Quyền
- Backend đọc email qua `Session.getActiveUser().getEmail()` nếu ở chế độ domain; trong web app công khai, dùng sheet `Rbac` để kiểm quyền theo email khai báo.
- Không lưu API key trên frontend.
- Chặn CORS mở bằng `ALLOWED_ORIGINS` (danh sách domain của bạn).

## 9) Gỡ lỗi thường gặp
- **{
  "error": "Bạn cần truyền action"
}** → Thiếu query `?action=` khi gọi backend.
- **CORS** → Thêm domain frontend vào `ALLOWED_ORIGINS`.
- **Không đọc được Sheet** → Kiểm tra `SPREADSHEET_ID` và quyền share.

## 10) Giấy phép
MIT. Cộng tác tự do.  
Cập nhật: 2025-08-14.
