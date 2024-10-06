<template>
  <div
    class="container shadow-lg p-3 mb-5 bg-body rounded"
    style="width: 100%; position: absolute; top: 60px; left: 10%"
  >
    <h2>Danh sách sản phẩm</h2>
    <table class="table table-striped table-sm">
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên sản phẩm</th>
          <th>Mô tả</th>
          <th>Giá</th>
          <th>Hình ảnh</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, index) in products" :key="product.id">
          <td>{{ (currentPage - 1) * perPage + (index + 1) }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.description }}</td>
          <td>{{ formatPrice(product.price) }} VND</td>
          <td>
            <img
              :src="getFullImageUrl(product.image)"
              alt="Image"
              style="width: 100px; height: auto"
            />
          </td>
          <td>
            <button
              class="btn btn-danger m-1"
              @click="deleteProduct(product.id)"
            >
              Xóa
            </button>
            <button class="btn btn-warning m-1">
              <router-link :to="'/products/edit/' + product.id"
                >Sửa</router-link
              >
            </button>
            <button class="btn btn-info m-1">
              <router-link :to="'/products/detail/' + product.id"
                >Chi tiết</router-link
              >
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-changed="fetchProducts"
    />

    <div v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</div>
  </div>
</template>
  
  <script>
import { mapGetters } from "vuex";
import axios from "axios";
import Pagination from "../Pagination.vue";
import Swal from "sweetalert2";

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      products: [],
      currentPage: 1,
      totalPages: 1,
      perPage: 10, // Số lượng sản phẩm trên mỗi trang
      errorMessage: "",
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    formatPrice(price) {
      return parseFloat(price).toLocaleString();
    },
    getFullImageUrl(imagePath) {
      return `http://127.0.0.1:8000/storage/${imagePath}`;
    },
    async fetchProducts(page = this.currentPage) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;

      try {
        const { data } = await axios.get(
          `http://127.0.0.1:8000/api/products?page=${this.currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${this.userInfo.token}`,
            },
          }
        );

        this.products = data.data;
        this.totalPages = data.last_page;
      } catch (error) {
        console.error("Error fetching products:", error);
        this.errorMessage = error.response
          ? error.response.data.message
          : "Có lỗi xảy ra.";
      }
    },
    async deleteProduct(productId) {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
        text: "Sau khi xóa, bạn sẽ không thể phục hồi lại!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Có, xóa!",
        cancelButtonText: "Hủy",
      });

      if (!result.isConfirmed) return;

      try {
        await axios.delete(`http://127.0.0.1:8000/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${this.userInfo.token}` },
        });

        Swal.fire({ title: "Xóa thành công", icon: "success", timer: 1000 });
        this.fetchProducts(this.currentPage);
      } catch (error) {
        Swal.fire({
          title: "Có lỗi xảy ra!",
          text: error.response?.data?.message || "Không thể xóa sản phẩm.",
          icon: "error",
        });
      }
    },
  },
  mounted() {
    if (this.userInfo.token) {
      this.fetchProducts(this.currentPage);
    } else {
      this.errorMessage = "Bạn cần đăng nhập trước khi truy cập trang này.";
    }
  },
};
</script>
  