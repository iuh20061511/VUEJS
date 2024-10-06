<template>
  <div
    class="container shadow-lg p-3 mb-5 bg-body rounded"
    style="width: 500px; position: absolute; top: 80px; right: 30%"
  >
    <h4 class="text-center">Thêm Sản Phẩm</h4>

    <div v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</div>
    <h6 v-if="successMessage" class="alert alert-success text-center">
      {{ successMessage }}
    </h6>

    <form @submit.prevent="addProduct">
      <div class="form-group">
        <label for="productName">Tên Sản Phẩm:</label>
        <input
          type="text"
          v-model="productName"
          class="form-control"
          id="productName"
          required
        />
      </div>
      <div class="form-group">
        <label for="productDescription">Mô Tả:</label>
        <textarea
          v-model="productDescription"
          class="form-control"
          id="productDescription"
          rows="3"
          required
        ></textarea>
      </div>
      <div class="form-group">
        <label for="productPrice">Giá:</label>
        <input
          type="number"
          v-model="productPrice"
          class="form-control"
          id="productPrice"
          required
        />
      </div>
      <div class="form-group">
        <label for="productImage">Hình Ảnh:</label>
        <input
          type="file"
          @change="onFileChange"
          class="form-control"
          id="productImage"
          accept="image/*"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary mt-3">Thêm Sản Phẩm</button>
    </form>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      productName: "", // Tên sản phẩm
      productDescription: "", // Mô tả sản phẩm
      productPrice: 0, // Giá sản phẩm
      productImage: null, // Hình ảnh sản phẩm
      errorMessage: "", // Thông báo lỗi
      successMessage: "", // Thông báo thành công
    };
  },
  computed: {
    ...mapGetters(["userInfo"]), // Lấy thông tin người dùng từ Vuex
  },
  methods: {
    // Hàm thêm sản phẩm
    async addProduct() {
      const formData = new FormData(); // Tạo đối tượng FormData để gửi dữ liệu
      formData.append("name", this.productName); // Thêm tên sản phẩm
      formData.append("description", this.productDescription); // Thêm mô tả
      formData.append("price", this.productPrice); // Thêm giá
      if (this.productImage) {
        formData.append("image", this.productImage); // Thêm hình ảnh nếu có
      }

      try {
        // Gửi yêu cầu POST đến API để thêm sản phẩm
        const { data } = await axios.post(
          "http://127.0.0.1:8000/api/products",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Định dạng gửi dữ liệu
              Authorization: `Bearer ${this.userInfo.token}`, // Thêm token xác thực
            },
          }
        );

        // Kiểm tra phản hồi từ server
        if (data.success) {
          this.successMessage = data.message || "Thêm sản phẩm thành công!";
          this.resetForm(); // Reset form nếu thành công
        } else {
          this.errorMessage = data.message; // Hiển thị thông báo lỗi nếu không thành công
        }
      } catch (error) {
        const { response } = error;
        if (response && response.status === 422) {
          this.errorMessage = response.data.message || "Dữ liệu không hợp lệ.";
        } else {
          this.errorMessage = "Có lỗi xảy ra. Vui lòng thử lại.";
        }
      }
    },

    // Hàm reset form
    resetForm() {
      this.productName = "";
      this.productDescription = "";
      this.productPrice = 0;
      this.productImage = null;
      this.errorMessage = "";
      this.successMessage = "";
    },

    // Hàm xử lý thay đổi tệp hình ảnh
    onFileChange(event) {
      const file = event.target.files[0]; // Lấy tệp hình ảnh từ input
      this.productImage = file; // Lưu trữ tệp vào biến
    },
  },
};
</script>
