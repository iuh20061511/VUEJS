<template>
  <div
    class="container shadow-lg p-3 mb-5 bg-body rounded"
    style="width: 500px; position: absolute; top: 80px; right: 30%"
  >
    <h4 class="text-center">Thêm Sản Phẩm</h4>

    <!-- Form thêm sản phẩm -->
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
      <!-- Nút thêm sản phẩm -->
      <button type="submit" class="btn btn-primary mt-3">Thêm Sản Phẩm</button>
    </form>

    <!-- Hiển thị thông báo lỗi nếu có -->
    <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      productName: "", 
      productDescription: "",
      productPrice: 0, 
      productImage: null, 
      errorMessage: "", 
    };
  },
  computed: {
    ...mapGetters(["userInfo"]), // Lấy thông tin người dùng từ Vuex
  },
  methods: {
    // Hàm thêm sản phẩm
    async addProduct() {
      // Tạo đối tượng FormData để gửi dữ liệu
      const formData = new FormData();
      formData.append("name", this.productName);
      formData.append("description", this.productDescription);
      formData.append("price", this.productPrice);
      if (this.productImage) {
        formData.append("image", this.productImage);
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
          Swal.fire({
            title: "Thêm sản phẩm thành công",
            icon: "success",
            timer: 2000,
          });
          this.resetForm(); 

      } catch (error) {
        const { response } = error;
        if (response && response.status === 422) {
          this.errorMessage = response.data.message || "Dữ liệu không hợp lệ.";
        } else {
          this.errorMessage = "Có lỗi xảy ra. Vui lòng thử lại.";
        }
        Swal.fire({
          title: "Có lỗi xảy ra",
          text: this.errorMessage,
          icon: "error",
        });
      }
    },

    // Hàm reset form
    resetForm() {
      this.productName = "";
      this.productDescription = "";
      this.productPrice = 0;
      this.productImage = null;
      this.errorMessage = "";
    },

    // Hàm xử lý thay đổi tệp hình ảnh
    onFileChange(event) {
      const file = event.target.files[0]; // Lấy tệp hình ảnh từ input
      this.productImage = file; // Lưu trữ tệp vào biến
    },
  },
};
</script>
