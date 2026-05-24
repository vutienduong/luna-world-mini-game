# Tiny Fairy Playland

Một mini game universe đơn giản cho bé, gom các game HTML độc lập thành một bản đồ chung có cảm giác tiến trình.

Tên Việt gợi ý: **Bé Gái Cổ Tích: Mini Game World**  
Tên hiện dùng trong hub: **Tiny Fairy Playland**

## Hiện Trạng

Repo này đang là một static site thuần HTML/CSS/JS, không cần build step.

- `index.html`: bản đồ chính của thế giới game.
- `assets/progress.js`: hệ thống tiến trình, phần thưởng, shop và completion overlay dùng chung.
- `tiem-an-co-tich.html`: Tiệm Ăn Cổ Tích.
- `vuong-hoa-cau-vong.html`: Vườn Hoa Cầu Vồng.
- `phong-kham-thu-cung.html`: Phòng Khám Thú Cưng.
- `time-banh-ngot-cua-be.html`: Tiệm Bánh Ngọt Của Bé.
- `nha-tam-bong-bong.html`: Nhà Tắm Bong Bóng.
- `cua-hang-thoi-trang-cho-be-xinh.html`: Cửa Hàng Thời Trang Bé Xinh.
- `xuong-gau-bong.html`: Xưởng Gấu Bông.
- `sieu-thi-mini.html`: Siêu Thị Mini.
- `lop-hoc-phep-thuat.html`: Lớp Học Phép Thuật Nhỏ.
- `trang-diem-cong-chua.html`: Trang Điểm Công Chúa.
- `be-tap-ve-tranh.html`: Bé Tập Vẽ Tranh.
- `PRD.md`: ý tưởng và định hướng sản phẩm ban đầu.

Mỗi game có nút `🏡 Bản đồ` để quay lại `index.html`.

## Cách Chạy Local

Chạy static server ở thư mục repo:

```bash
python3 -m http.server 4173
```

Sau đó mở:

```text
http://localhost:4173
```

Cũng có thể mở trực tiếp `index.html` trong browser, nhưng chạy qua local server sẽ gần giống môi trường deploy hơn.

## Deploy Vercel

Vì đây là static site thuần HTML:

1. Push repo lên GitHub.
2. Import repo vào Vercel.
3. Framework preset: `Other`.
4. Build command: để trống.
5. Output directory: để trống hoặc root mặc định.
6. Deploy.

Vercel sẽ serve `index.html` ở trang chủ.

## Tiến Trình Trong Game

`index.html` và các game đang dùng `localStorage` với key:

```text
tinyFairyPlaylandProgress
```

Structure hiện tại được quản lý trong `assets/progress.js`, gồm:

- `games`: tiến trình theo từng game, gồm `completed`, `completedLevels`, `stars`, `coins`, `plays`, `stickers`.
- `stickers`: sticker đã mở toàn universe.
- `coins`: xu nhỏ dùng cho shop trang trí.
- `stars`: tổng sao đã nhận.
- `decorations`: đồ trang trí đã mua cho bản đồ.
- `settings`: parent mode, gồm âm thanh và gợi ý thời lượng chơi.

Hiện có các phần thưởng nhẹ:

- Mỗi game tự báo hoàn thành khi bé xong nhiệm vụ hoặc màn.
- Mỗi lần hoàn thành mở sticker, sao và xu nhỏ.
- Nút `Nhận thưởng hôm nay` cộng thêm sao/xu một lần mỗi ngày.
- Khi chơi đủ vài khu, mascot Luna có phụ kiện mới trên bản đồ.
- Cửa hàng trang trí cho phép dùng xu mua `Cây kẹo`, `Ghế picnic`, `Cầu vồng nhỏ`, `Đèn sao`, `Nhà thỏ`, `Bảng tên của bé`.
- Parent mode cho phép reset tiến trình, bật/tắt âm thanh, chọn thời lượng chơi gợi ý, xem game bé mở nhiều nhất.

Lưu ý: tiến trình hiện tại là local theo từng browser/device, chưa có account hay backend.

## Hướng Phát Triển Tiếp

### 1. Làm Tiến Trình Sâu Hơn

Hiện tại mỗi game đã tự báo hoàn thành màn. Bước tiếp theo nên là lưu chi tiết hơn theo nhiệm vụ:

- Lưu tên nhiệm vụ cụ thể, ví dụ `serve-burger`, `heal-cat`, `make-cupcake-pink`.
- Lưu ngày chơi và chuỗi ngày liên tiếp.
- Hiển thị tiến trình từng game trên hub, ví dụ `3/7 ngày Tiệm Ăn`.
- Cho mỗi game có bộ sticker riêng thay vì chỉ một sticker đại diện.

Gợi ý structure:

```js
{
  games: {
    food: { completed: 3, stars: 9 },
    garden: { completed: 2, stars: 6 }
  },
  stickers: ["food-1", "garden-1"],
  coins: 42,
  accessories: ["bow", "crown"]
}
```

### 2. Nâng Cấp Màn Kết Thúc Ngày

Mỗi game hiện đã có overlay "Hoàn thành hôm nay" dùng chung. Có thể nâng cấp:

- Cho từng game có câu chúc riêng phong phú hơn.
- Thêm animation sticker bay vào kho của Luna.
- Thêm album ảnh kỷ niệm sau mỗi lần hoàn thành.
- Thêm lựa chọn `Chơi màn kế tiếp` rõ hơn.

Điều này giúp mỗi mini game có cảm giác là một chuyến đi có kết quả, không chỉ là mở trang khác.

### 3. Mở Rộng Cửa Hàng Trang Trí Bản Đồ

Shop hiện đã có các món cơ bản. Có thể thêm:

- Nhiều vị trí trang trí hơn.
- Chọn bật/tắt món đã mua.
- Kéo thả trang trí trên bản đồ.
- Theme theo mùa: Trung thu, Giáng sinh, sinh nhật.
- Trang trí chỉ mở khóa khi hoàn thành một bộ game.

Đây là cách tạo tiến trình dài hạn mà không cần gameplay phức tạp.

### 4. Chuẩn Hóa UI Chung

Hiện 6 game được build riêng nên style có thể hơi khác nhau. Có thể gom các phần chung:

- Nút `Bản đồ`.
- Font.
- Màu pastel chính.
- Toast hoàn thành.
- Âm thanh click/pop.
- Helper lưu tiến trình.

Khi project lớn hơn, nên tách thành:

```text
assets/
  shared.css
  progress.js
  sounds/
```

### 5. Thêm Game Mới

Đã thêm:

- **Xưởng Gấu Bông**: nhồi bông, chọn vải, may nút, đóng hộp quà.
- **Siêu Thị Mini**: chọn đồ theo danh sách, học đếm và phân loại.
- **Lớp Học Phép Thuật Nhỏ**: ghép màu, hình, biểu tượng để tạo vật phẩm cute.

Các ý tưởng tiếp theo:

- **Rạp Xiếc Bong Bóng**: sắp xếp tiết mục, học thứ tự trước/sau.
- **Bưu Điện Cầu Vồng**: ghép tem, phân loại thư theo màu/hình.
- **Lớp Nhạc Nhỏ**: nghe âm thanh, chọn nhạc cụ giống mẫu.

Nếu thêm game mới, cần tạo file HTML mới, thêm khu vực trong `index.html`, rồi đăng ký game trong `assets/progress.js`.

### 6. Thêm Parent Mode Nhẹ

Parent mode hiện đã có:

- Reset tiến trình.
- Bật/tắt âm thanh.
- Chọn thời lượng chơi trong ngày.
- Xem bé thích game nào nhất dựa trên số lượt chơi.

Có thể phát triển tiếp:

- PIN đơn giản để bé không tự reset.
- Thống kê theo ngày.
- Gợi ý hôm nay chơi game nào để cân bằng kỹ năng.
- Xuất/nhập tiến trình bằng file JSON để chuyển thiết bị.

### 7. Làm Mobile-First Kỹ Hơn

Đối tượng chính là bé 5 tuổi nên cần ưu tiên tablet/mobile:

- Nút lớn, dễ chạm.
- Ít chữ trên màn chơi.
- Không có thao tác quá chính xác.
- Không có trạng thái phạt nặng.
- Luôn có phản hồi vui khi bé bấm đúng.

### 8. Thêm Âm Thanh Và Voice

Âm thanh nên ngắn, mềm, không gây mệt:

- Click nhẹ.
- Pop bong bóng.
- Sao rơi.
- Hoàn thành nhiệm vụ.
- Giọng đọc lời hướng dẫn ngắn.

Nên có nút bật/tắt âm thanh rõ ràng ở từng game.

## Nguyên Tắc Thiết Kế

- Bé luôn biết bấm vào đâu tiếp theo.
- Mỗi màn chỉ nên có một nhiệm vụ chính.
- Đúng thì vui, sai thì hướng dẫn lại nhẹ nhàng.
- Ưu tiên thao tác kéo/thả, chọn hình, chọn màu, đếm số nhỏ.
- Không cần điểm số cạnh tranh, chỉ cần sao, sticker và trang trí.
- Mỗi game nên chơi được trong 2-5 phút.

## Checklist Khi Thêm Game Mới

- Tạo file HTML mới ở root repo.
- Thêm link từ `index.html`.
- Thêm nút `🏡 Bản đồ` trong game.
- Nếu có hoàn thành màn, cập nhật `localStorage`.
- Test trên mobile width nhỏ.
- Kiểm tra deploy Vercel không cần build.
