<template>
    <div class="container mt-5">
      <div class="card shadow-lg">
        <div class="card-header text-center">
          <h2 class="mb-0">Danh sách sản phẩm</h2>
        </div>
        <div class="card-body">
          <!-- Loading Spinner -->
          <LoadingSpinner :visible="loading" />
  
          <!-- Tìm kiếm sản phẩm -->
          <form @submit.prevent="fetchProductList" class="mb-4">
            <div class="input-group mb-3">
              <span class="input-group-text">Tìm kiếm sản phẩm:</span>
              <input
                type="search"
                v-model="searchKeyword"
                class="form-control"
                placeholder="Nhập từ khóa sản phẩm"
              />
              <button class="btn btn-primary" type="button" @click="fetchProductList">Tìm kiếm</button>
            </div>
          </form>
  
          <!-- Bộ lọc sản phẩm -->
          <form @submit.prevent="fetchProductList" class="mb-4">
            <div class="mb-3 d-flex">
              <label class="form-label m-3">Lọc theo:</label>
              <div class="form-check m-3">
                <input
                  type="radio"
                  id="allProducts"
                  value=""
                  v-model="filterOption"
                  name="productFilter"
                  class="form-check-input"
                />
                <label class="form-check-label" for="allProducts">Tất cả sản phẩm</label>
              </div>
              <div class="form-check m-3">
                <input
                  type="radio"
                  id="mostSold"
                  value="mostSold"
                  v-model="filterOption"
                  name="productFilter"
                  class="form-check-input"
                />
                <label class="form-check-label" for="mostSold">Sản phẩm bán nhiều nhất</label>
              </div>
              <div class="form-check m-3">
                <input
                  type="radio"
                  id="leastSold"
                  value="leastSold"
                  v-model="filterOption"
                  name="productFilter"
                  class="form-check-input"
                />
                <label class="form-check-label" for="leastSold">Sản phẩm bán ít nhất</label>
              </div>
            <button class="btn btn-primary m-2" style="height: 40px;">Lọc</button>
            </div>
          </form>
  
          <!-- Danh sách sản phẩm -->
          <table class="table table-bordered table-hover mt-3">
            <thead class="table-light">
              <tr>
                <th>STT</th>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Mô tả</th>
                <th>Số lượng đã bán</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in products" :key="product.name">
                <td>{{ index + 1 }}</td>
                <td><img :src="getFullImageUrl(product.image)" alt="Product Image" style="width: 50px; height: 50px;"></td>
                <td>{{ product.name }}</td>
                <td>{{ formatPrice(product.price) }}</td>
                <td>{{ product.description }}</td>
                <td>{{ product.total_quantity_sold }}</td>
              </tr>
              <tr v-if="products.length === 0">
                <td colspan="6" class="text-center">Không tìm thấy dữ liệu.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import { mapGetters } from "vuex"; 
  import LoadingSpinner from "@/components/LoadingSpinner.vue";
  
  export default {
    components: {
      LoadingSpinner, 
    },
    data() {
      return {
        products: [], // Danh sách sản phẩm
        searchKeyword: "", // Từ khóa tìm kiếm
        filterOption: "", // Tùy chọn lọc sản phẩm
        loading: false, // Trạng thái tải dữ liệu
      };
    },
    computed: {
      ...mapGetters(['userInfo']), // Lấy thông tin userInfo từ Vuex Store
    },
    methods: {
    getFullImageUrl(imagePath) {
      return `http://127.0.0.1:8000/storage/${imagePath}`;
    },
      // Lấy danh sách sản phẩm từ API
      async fetchProductList() {
        this.loading = true; // Bắt đầu trạng thái tải
        try {
          // Gửi yêu cầu đến API product-list với các tham số lọc và tìm kiếm
          const response = await axios.get(`http://127.0.0.1:8000/api/product-list`, {
            params: {
              search: this.searchKeyword, // Từ khóa tìm kiếm sản phẩm
              most_sold: this.filterOption === "mostSold" ? "true" : "false", // Lọc sản phẩm bán nhiều nhất
              least_sold: this.filterOption === "leastSold" ? "true" : "false", // Lọc sản phẩm bán ít nhất
            },
            headers: {
              Authorization: `Bearer ${this.userInfo.token}`, // Sử dụng token từ Vuex Store
            },
          });
  
          // Kiểm tra dữ liệu trả về và gán dữ liệu vào products
          if (response && response.data) {
            this.products = response.data.data || []; // Gán dữ liệu sản phẩm vào products
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin sản phẩm:", error);
          alert("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
        } finally {
          this.loading = false; // Kết thúc trạng thái tải
        }
      },
      // Định dạng giá sản phẩm
      formatPrice(price) {
        return parseFloat(price).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
      },
    },
    mounted() {
      this.fetchProductList(); // Lấy danh sách sản phẩm khi component được mount
    },
  };
  </script>
  
  <style scoped>

  </style>
  