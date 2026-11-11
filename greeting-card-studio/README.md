# Thiệp Xinh Studio

Website thiết kế thiệp kéo thả, lưu thiệp trên Supabase, chia sẻ liên kết chỉ xem. Dự án dành cho GitHub Pages của `nguyenvanthien13`.

## Cài đặt

1. Cài Node.js 22, chạy `npm install`.
2. Tạo project Supabase, chạy nội dung `supabase.sql` trong SQL Editor.
3. Sao chép `.env.example` thành `.env.local` và điền `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (publishable/anon key, **không dùng service_role key**).
4. Chạy `npm run dev` để kiểm tra, `npm run build` để build.
5. Tạo repository `greeting-card-studio` trên GitHub, đẩy toàn bộ mã nguồn lên nhánh `main` (nếu có `package-lock.json` thì tải lên cùng).
6. Vào GitHub repository > Settings > Secrets and variables > Actions, thêm `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`.
7. Vào Settings > Pages > Build and deployment > Source chọn **GitHub Actions**. Workflow sẽ triển khai mỗi lần push `main`.
8. Trong Supabase > Authentication > URL Configuration, cấu hình Site URL thành `https://nguyenvanthien13.github.io/greeting-card-studio/` và thêm địa chỉ này vào Redirect URLs.

## Bảo mật và giới hạn

- Row Level Security giới hạn quyền sửa/xóa cho chủ sở hữu.
- Liên kết chia sẻ là bearer token: bất kỳ ai có link đều xem được, **chưa có xác thực riêng người nhận B**.
- Hình ảnh tải lên được nhúng vào JSON dưới dạng data URL. Cách này phù hợp demo ảnh nhỏ; bản production nên chuyển sang Supabase Storage với giới hạn dung lượng và chính sách truy cập.
- Phiên bản đầu hỗ trợ văn bản, hình ảnh, hình khối và màu nền; chưa có nhạc, hiệu ứng 3D, sticker hoặc trình chỉnh sửa nhiều trang.
- Chưa có giao diện thu hồi liên kết (có thể xóa bản ghi trong `card_shares` từ Supabase Dashboard).
- GitHub Pages là hosting tĩnh, Supabase xử lý xác thực và lưu trữ.
