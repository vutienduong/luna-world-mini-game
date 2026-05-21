# Tiny Fairy Playland

Một mini game universe đơn giản cho bé, gom các game HTML độc lập thành một bản đồ chung có cảm giác tiến trình.

Tên Việt gợi ý: **Bé Gái Cổ Tích: Mini Game World**  
Tên hiện dùng trong hub: **Tiny Fairy Playland**

## Hiện Trạng

Repo này đang là một static site thuần HTML/CSS/JS, không cần build step.

- `index.html`: bản đồ chính của thế giới game.
- `tiem-an-co-tich.html`: Tiệm Ăn Cổ Tích.
- `vuong-hoa-cau-vong.html`: Vườn Hoa Cầu Vồng.
- `phong-kham-thu-cung.html`: Phòng Khám Thú Cưng.
- `time-banh-ngot-cua-be.html`: Tiệm Bánh Ngọt Của Bé.
- `nha-tam-bong-bong.html`: Nhà Tắm Bong Bóng.
- `cua-hang-thoi-trang-cho-be-xinh.html`: Cửa Hàng Thời Trang Bé Xinh.
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

`index.html` đang dùng `localStorage` với key:

```text
tinyFairyPlaylandProgress
```

Hiện có các phần thưởng nhẹ:

- Mỗi khu đã ghé mở một sticker.
- Mỗi khu đã ghé cộng sao và xu nhỏ.
- Nút `Nhận thưởng hôm nay` cộng thêm sao/xu một lần mỗi ngày.
- Khi chơi đủ vài khu, mascot Luna có phụ kiện mới trên bản đồ.

Lưu ý: tiến trình hiện tại là local theo từng browser/device, chưa có account hay backend.

## Hướng Phát Triển Tiếp

### 1. Làm Tiến Trình Thật Hơn

Hiện tại hub ghi nhận "đã ghé" khi bé bấm vào game. Bước tiếp theo nên là mỗi game tự báo hoàn thành màn:

- Khi bé hoàn thành một nhiệm vụ, game gọi hàm lưu tiến trình.
- Lưu `completedLevels`, `stars`, `coins`, `stickers` theo từng game.
- Hub đọc dữ liệu đó để hiển thị trạng thái chính xác hơn.

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

### 2. Thêm Màn Kết Thúc Ngày

Mỗi game có thể có một màn "Hoàn thành hôm nay":

- Bé nhận sticker.
- Nhận 1-3 sao.
- Nhận xu nhỏ.
- Có nút `Về bản đồ`.

Điều này giúp bé cảm thấy mỗi mini game là một chuyến đi có kết quả, không chỉ là mở trang khác.

### 3. Mở Cửa Hàng Trang Trí Bản Đồ

Dùng xu để mua đồ trang trí cho `index.html`:

- Cây kẹo.
- Ghế picnic.
- Cầu vồng nhỏ.
- Đèn sao.
- Nhà thỏ.
- Bảng tên của bé.

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

### 5. Thêm 2-3 Game Mới

Các ý tưởng hợp với universe hiện tại:

- **Xưởng Gấu Bông**: nhồi bông, chọn vải, may nút, đóng hộp quà.
- **Siêu Thị Mini**: chọn đồ theo danh sách, học đếm và phân loại.
- **Lớp Học Phép Thuật Nhỏ**: ghép màu, hình, biểu tượng để tạo vật phẩm cute.

Nếu thêm game mới, chỉ cần tạo file HTML mới và thêm một khu vực mới trong `index.html`.

### 6. Thêm Parent Mode Nhẹ

Một màn nhỏ cho phụ huynh có thể hữu ích:

- Reset tiến trình.
- Bật/tắt âm thanh.
- Chọn thời lượng chơi trong ngày.
- Xem bé thích game nào nhất dựa trên số lượt chơi.

Vẫn có thể làm toàn bộ bằng `localStorage`, chưa cần backend.

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

