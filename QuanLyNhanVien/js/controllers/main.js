const dsnv = new DanhSachNhanVien();
const validation = new Validation();

const getEle = (id) => document.getElementById(id);

function resetThongBaoLoi() {
  document.querySelectorAll(".sp-thongbao").forEach((el) => {
    el.innerHTML = "";
    el.style.display = "none";
  });
}

function setLocalStorage() {
  localStorage.setItem("DSNV", JSON.stringify(dsnv.arr));
}

function getLocalStorage() {
  const data = localStorage.getItem("DSNV");
  if (data) {
    const arrParse = JSON.parse(data);
    dsnv.arr = arrParse.map(
      (item) =>
        new NhanVien(
          item.taiKhoan,
          item.hoTen,
          item.email,
          item.matKhau,
          item.ngayLam,
          item.luongCoBan,
          item.chucVu,
          item.gioLam
        )
    );
    renderTable(dsnv.arr);
  }
}

// 1. IN RA TABLE DANH SÁCH NHÂN VIÊN
function renderTable(arr) {
  let content = "";
  arr.forEach((nv) => {
    content += `
      <tr>
        <td>${nv.taiKhoan}</td>
        <td>${nv.hoTen}</td>
        <td>${nv.email}</td>
        <td>${nv.ngayLam}</td>
        <td>${nv.chucVu}</td>
        <td>${nv.tongLuong.toLocaleString("vi-VN")}</td>
        <td>${nv.loaiNV}</td>
        <td>
          <button class="btn btn-info btn-sm mb-1" data-toggle="modal" data-target="#myModal" onclick="suaNV('${nv.taiKhoan}')">Sửa</button>
          <button class="btn btn-danger btn-sm mb-1" onclick="xoaNV('${nv.taiKhoan}')">Xóa</button>
        </td>
      </tr>
    `;
  });
  getEle("tableDanhSach").innerHTML = content;
}

getLocalStorage();

// 2. THÊM NHÂN VIÊN MỚI
// Mở Modal ở chế độ Thêm nhân viên
getEle("btnThem").onclick = function () {
  getEle("header-title").innerHTML = "Thêm nhân viên";
  getEle("tknv").disabled = false;
  getEle("btnThemNV").style.display = "inline-block";
  getEle("btnCapNhat").style.display = "none";

  document.querySelector("#myModal form").reset();
  resetThongBaoLoi();
};

// Xử lý sự kiện click nút "Thêm người dùng"
getEle("btnThemNV").onclick = function () {
  const nv = layThongTinNV(true);
  if (nv) {
    dsnv.themNV(nv);
    renderTable(dsnv.arr);
    setLocalStorage();
    getEle("btnDong").click();
  }
};

// 3. TẠO ĐỐI TƯỢNG NHÂN VIÊN VỚI THÔNG TIN LẤY TỪ FORM
function layThongTinNV(isAdd) {
  const taiKhoan = getEle("tknv").value;
  const hoTen = getEle("name").value;
  const email = getEle("email").value;
  const matKhau = getEle("password").value;
  const ngayLam = getEle("datepicker").value;
  const luongCB = getEle("luongCB").value;
  const chucVu = getEle("chucvu").value;
  const gioLam = getEle("gioLam").value;

  // Gọi kiểm tra dữ liệu đầu vào 
  const isValid = kiemTraHopLe(
    taiKhoan,
    hoTen,
    email,
    matKhau,
    ngayLam,
    luongCB,
    gioLam,
    isAdd
  );

  if (!isValid) return null;

  // Khởi tạo đối tượng NhanVien 
  return new NhanVien(
    taiKhoan,
    hoTen,
    email,
    matKhau,
    ngayLam,
    luongCB,
    chucVu,
    gioLam
  );
}

// 4. VALIDATION
function kiemTraHopLe(taiKhoan, hoTen, email, matKhau, ngayLam, luongCB, gioLam, isAdd) {
  let isValid = true;

  // Tài khoản: 4-6 ký số, không để trống (kiểm tra trùng khi thêm mới)
  isValid &=
    validation.kiemTraRong(taiKhoan, "tbTKNV", "Tài khoản không được để trống") &&
    validation.kiemTraPattern(taiKhoan, /^\d{4,6}$/, "tbTKNV", "Tài khoản phải gồm 4 - 6 ký số") &&
    (isAdd
      ? validation.kiemTraTrungTaiKhoan(taiKhoan, dsnv.arr, "tbTKNV", "Tài khoản đã tồn tại")
      : true);

  // Tên nhân viên: phải là chữ, không để trống
  const regexTen = /^[a-zA-ZÀ-ỹ\s]+$/;
  isValid &=
    validation.kiemTraRong(hoTen, "tbTen", "Tên nhân viên không được để trống") &&
    validation.kiemTraPattern(hoTen, regexTen, "tbTen", "Tên nhân viên phải là chữ");

  // Email: đúng định dạng, không để trống
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  isValid &=
    validation.kiemTraRong(email, "tbEmail", "Email không được để trống") &&
    validation.kiemTraPattern(email, regexEmail, "tbEmail", "Email không đúng định dạng");

  // Mật khẩu: 6-10 ký tự (chứa ít nhất 1 số, 1 chữ in hoa, 1 ký tự đặc biệt), không để trống
  const regexPass = /^(?=.*\d)(?=.*[A-Z])(?=.*[^a-zA-Z0-9\s]).{6,10}$/;
  isValid &=
    validation.kiemTraRong(matKhau, "tbMatKhau", "Mật khẩu không được để trống") &&
    validation.kiemTraPattern(
      matKhau,
      regexPass,
      "tbMatKhau",
      "Mật khẩu từ 6-10 ký tự (chứa ít nhất 1 số, 1 chữ in hoa, 1 ký tự đặc biệt)"
    );

  // Ngày làm: không để trống, định dạng mm/dd/yyyy
  const regexDate = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
  isValid &=
    validation.kiemTraRong(ngayLam, "tbNgay", "Ngày làm không được để trống") &&
    validation.kiemTraPattern(ngayLam, regexDate, "tbNgay", "Ngày làm phải theo định dạng mm/dd/yyyy");

  // Lương cơ bản: 1.000.000 - 20.000.000, không để trống
  isValid &=
    validation.kiemTraRong(luongCB, "tbLuongCB", "Lương cơ bản không được để trống") &&
    validation.kiemTraKhoangSo(
      luongCB,
      1000000,
      20000000,
      "tbLuongCB",
      "Lương cơ bản phải từ 1.000.000 đến 20.000.000"
    );

  // Chức vụ: phải chọn chức vụ hợp lệ
  isValid &= validation.kiemTraChucVu("chucvu", "tbChucVu", "Vui lòng chọn chức vụ hợp lệ");

  // Số giờ làm trong tháng: 80 - 200 giờ, không để trống
  isValid &=
    validation.kiemTraRong(gioLam, "tbGiolam", "Giờ làm không được để trống") &&
    validation.kiemTraKhoangSo(gioLam, 80, 200, "tbGiolam", "Số giờ làm trong tháng phải từ 80 - 200 giờ");

  return Boolean(isValid);
}

// 5. PHƯƠNG THỨC TÍNH TỔNG LƯƠNG & 6. PHƯƠNG THỨC XẾP LOẠI
// được xây dựng trong lớp NhanVien (js/models/NhanVien.js)
// và tự động thực thi khi khởi tạo đối tượng ở Mục 3.

// 7. XÓA NHÂN VIÊN
function xoaNV(taiKhoan) {
  dsnv.xoaNV(taiKhoan);
  renderTable(dsnv.arr);
  setLocalStorage();
}

// 8. CẬP NHẬT NHÂN VIÊN (CÓ VALIDATION)
// Đổ dữ liệu nhân viên cần sửa lên Modal
function suaNV(taiKhoan) {
  resetThongBaoLoi();
  const nv = dsnv.layThongTinNV(taiKhoan);
  if (nv) {
    getEle("header-title").innerHTML = "Cập nhật nhân viên";
    getEle("tknv").value = nv.taiKhoan;
    getEle("tknv").disabled = true; 
    getEle("name").value = nv.hoTen;
    getEle("email").value = nv.email;
    getEle("password").value = nv.matKhau;
    getEle("datepicker").value = nv.ngayLam;
    getEle("luongCB").value = nv.luongCoBan;
    getEle("chucvu").value = nv.chucVu;
    getEle("gioLam").value = nv.gioLam;

    getEle("btnThemNV").style.display = "none";
    getEle("btnCapNhat").style.display = "inline-block";
  }
}

// Lưu thông tin sau khi chỉnh sửa
getEle("btnCapNhat").onclick = function () {
  const nv = layThongTinNV(false);
  if (nv) {
    dsnv.capNhatNV(nv);
    renderTable(dsnv.arr);
    setLocalStorage();
    getEle("btnDong").click();
  }
};

// 9. TÌM NHÂN VIÊN THEO LOẠI VÀ HIỂN THỊ
function xuLyTimKiem() {
  const tuKhoa = getEle("searchName").value;
  const mangKetQua = dsnv.timKiemTheoLoai(tuKhoa);
  renderTable(mangKetQua);
}

getEle("searchName").onkeyup = xuLyTimKiem;
getEle("btnTimNV").onclick = xuLyTimKiem;