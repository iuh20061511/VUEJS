<template>
  <div
    class="container shadow-lg p-3 mb-5 bg-body rounded"
    style="width: 500px; position: absolute; top: 80px; right: 30%"
  >
    <h4 class="text-center">Chỉnh Sửa Sản Phẩm</h4>

    <div v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</div>
    <h6 v-if="successMessage" class="alert alert-success text-center">
      {{ successMessage }}
    </h6>

    <!-- Form chỉnh sửa sản phẩm -->
    <form @submit.prevent="editProduct">
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
        <label for="productImage">Hình Ảnh (Tùy chọn):</label>
        <input
          type="file"
          @change="onFileChange"
          class="form-control"
          id="productImage"
          accept="image/*"
        />

        <img
          v-if="existingImage"
          :src="`http://127.0.0.1:8000/storage/${existingImage}`"
          alt="Hình ảnh sản phẩm hiện tại"
          class="img-thumbnail mt-2"
          width="200"
        />
      </div>
      <button type="submit" class="btn btn-primary mt-3">Lưu Thay Đổi</button>
    </form>
  </div>
</template>
  
  <script>
import { mapGetters } from "vuex";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

export default {
  data() {
    return {
      productName: "", // Tên sản phẩm
      productDescription: "", // Mô tả sản phẩm
      productPrice: 0, // Giá sản phẩm
      productImage: null, // Hình ảnh sản phẩm
      existingImage: "", // URL của ảnh hiện tại
      errorMessage: "", // Thông báo lỗi
      successMessage: "", // Thông báo thành công
    };
  },
  computed: {
    ...mapGetters(["userInfo"]), // Lấy thông tin người dùng từ Vuex
  },
  created() {
    this.getProductDetails(); // Lấy chi tiết sản phẩm khi component được tạo
  },
  methods: {
    // Hàm lấy chi tiết sản phẩm từ API
    async getProductDetails() {
      try {
        const productId = this.$route.params.id; // Lấy ID sản phẩm từ URL
        const { data } = await axios.get(
          `http://127.0.0.1:8000/api/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${this.userInfo.token}`, // Thêm token xác thực
            },
          }
        );

        // Kiểm tra phản hồi từ server và gán dữ liệu vào biến
        if (data) {
          this.productName = data.name;
          this.productDescription = data.description;
          this.productPrice = data.price;
          this.existingImage = data.image; // Lưu URL của ảnh hiện tại
        }
      } catch (error) {
        this.errorMessage = "Có lỗi xảy ra khi lấy chi tiết sản phẩm.";
      }
    },

    // Hàm chỉnh sửa sản phẩm
    async editProduct() {
      const formData = new FormData();
      formData.append("name", this.productName);
      formData.append("description", this.productDescription);
      formData.append("price", this.productPrice);
      if (this.productImage) {
        formData.append("image", this.productImage);
      }

      console.log("Dữ liệu gửi đi:", formData);

      try {
        const productId = this.$route.params.id;
        const { data } = await axios.patch(
          `http://127.0.0.1:8000/api/products/${productId}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.userInfo.token}`,
            },
          }
        );

        console.log("Phản hồi từ server:", data);

        if (data.product) {
          // Thay thông báo thành công bằng Swal.fire
          Swal.fire({
            title: "Cập nhật thành công",
            icon: "success",
            timer: 2000,
          });

          this.productName = data.product.name;
          this.productDescription = data.product.description;
          this.productPrice = parseFloat(data.product.price);
          this.existingImage = data.product.image;
        } else {
          this.errorMessage = "Chỉnh sửa không thành công.";
        }
      } catch (error) {
        const { response } = error;
        console.error("Lỗi:", response);
        if (response && response.status === 422) {
          this.errorMessage = response.data.message || "Dữ liệu không hợp lệ.";
        } else {
          this.errorMessage = "Có lỗi xảy ra. Vui lòng thử lại.";
        }
      }
    },

    // Hàm xử lý thay đổi tệp hình ảnh
    onFileChange(event) {
      const file = event.target.files[0]; // Lấy tệp hình ảnh từ input
      this.productImage = file; // Lưu trữ tệp vào biến
    },
  },
};
</script>
  