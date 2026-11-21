class NhanVien {
  constructor(
    _taiKhoan,
    _hoTen,
    _email,
    _matKhau,
    _ngayLam,
    _luongCoBan,
    _chucVu,
    _gioLam
  ) {
    this.taiKhoan = _taiKhoan;
    this.hoTen = _hoTen;
    this.email = _email;
    this.matKhau = _matKhau;
    this.ngayLam = _ngayLam;
    this.luongCoBan = Number(_luongCoBan);
    this.chucVu = _chucVu;
    this.gioLam = Number(_gioLam);
    this.tongLuong = this.tinhTongLuong();
    this.loaiNV = this.xepLoai();
  }

  tinhTongLuong() {
    const cv = this.chucVu.trim().toLowerCase();
    if (cv === "giám đốc" || cv === "sếp") {
      return this.luongCoBan * 3;
    } else if (cv === "trưởng phòng") {
      return this.luongCoBan * 2;
    } else if (cv === "nhân viên") {
      return this.luongCoBan;
    }
    return 0;
  }

  xepLoai() {
    if (this.gioLam >= 192) {
      return "Nhân viên xuất sắc";
    } else if (this.gioLam >= 176) {
      return "Nhân viên giỏi";
    } else if (this.gioLam >= 160) {
      return "Nhân viên khá";
    } else {
      return "Nhân viên trung bình";
    }
  }
}