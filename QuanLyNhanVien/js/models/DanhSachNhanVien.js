class DanhSachNhanVien {
  constructor() {
    this.arr = [];
  }

  themNV(nv) {
    this.arr.push(nv);
  }

  timViTri(taiKhoan) {
    return this.arr.findIndex((nv) => nv.taiKhoan === taiKhoan);
  }

  xoaNV(taiKhoan) {
    const index = this.timViTri(taiKhoan);
    if (index !== -1) {
      this.arr.splice(index, 1);
    }
  }

  layThongTinNV(taiKhoan) {
    const index = this.timViTri(taiKhoan);
    return index !== -1 ? this.arr[index] : null;
  }

  capNhatNV(nvMoi) {
    const index = this.timViTri(nvMoi.taiKhoan);
    if (index !== -1) {
      this.arr[index] = nvMoi;
    }
  }

  timKiemTheoLoai(tuKhoa) {
    const keyword = tuKhoa.trim().toLowerCase();
    return this.arr.filter((nv) =>
      nv.loaiNV.toLowerCase().includes(keyword)
    );
  }
}