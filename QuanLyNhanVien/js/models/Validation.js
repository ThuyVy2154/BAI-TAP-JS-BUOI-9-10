class Validation {
  hienThiLoi(spanId, message, isValid) {
    const span = document.getElementById(spanId);
    if (isValid) {
      span.innerHTML = "";
      span.style.display = "none";
      return true;
    } else {
      span.innerHTML = message;
      span.style.display = "block";
      return false;
    }
  }

  kiemTraRong(value, spanId, message) {
    return this.hienThiLoi(spanId, message, value.trim() !== "");
  }

  kiemTraPattern(value, pattern, spanId, message) {
    return this.hienThiLoi(spanId, message, pattern.test(value.trim()));
  }

  kiemTraKhoangSo(value, min, max, spanId, message) {
    const num = Number(value);
    const isValid = !isNaN(num) && num >= min && num <= max;
    return this.hienThiLoi(spanId, message, isValid);
  }

  kiemTraChucVu(selectId, spanId, message) {
    const selectEl = document.getElementById(selectId);
    const chucVuHopLe = ["giám đốc", "sếp", "trưởng phòng", "nhân viên"];
    const isValid =
      selectEl.selectedIndex !== 0 &&
      chucVuHopLe.includes(selectEl.value.trim().toLowerCase());
    return this.hienThiLoi(spanId, message, isValid);
  }

  kiemTraTrungTaiKhoan(taiKhoan, arrNV, spanId, message) {
    const isExist = arrNV.some((nv) => nv.taiKhoan === taiKhoan.trim());
    return this.hienThiLoi(spanId, message, !isExist);
  }
}