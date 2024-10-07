<template>
  <div class="container mt-5">
    <div class="card shadow-lg">
      <div class="card-header text-center">
        <h2 class="mb-0">Danh sách Người dùng</h2>
      </div>
      <div class="card-body">
        <LoadingSpinner :visible="loading" />

        <form @submit.prevent="fetchOrderStatistics" class="mb-4">
          <div class="input-group mb-3">
            <span class="input-group-text">Tìm kiếm khách hàng:</span>
            <input
              type="search"
              id="searchEmail"
              v-model="searchEmail"
              class="form-control"
              placeholder="Nhập email để tìm kiếm"
            />
            <button class="btn btn-primary" type="button" @click="fetchOrderStatistics">Tìm kiếm</button>
          </div>
        </form>

        <form @submit.prevent="fetchOrderStatistics" class="mb-4">
          <div class="mb-3">
            <label class="form-label">Sắp xếp theo:</label>
            <div class="form-check">
              <input
                type="radio"
                name="sortOption"
                value="quantity"
                v-model="sortOption"
                class="form-check-input"
                id="sortQuantity"
              />
              <label class="form-check-label" for="sortQuantity">User mua hàng có số lượng nhiều nhất</label>
            </div>
            <div class="form-check">
              <input
                type="radio"
                name="sortOption"
                value="value"
                v-model="sortOption"
                class="form-check-input"
                id="sortValue"
              />
              <label class="form-check-label" for="sortValue">User mua hàng có giá trị nhiều nhất</label>
            </div>
            <div class="form-check">
              <input
                type="radio"
                name="sortOption"
                value="none"
                v-model="sortOption"
                class="form-check-input"
                id="sortNone"
              />
              <label class="form-check-label" for="sortNone">User không mua hàng</label>
            </div>
          </div>
          <button class="btn btn-primary">Tìm</button>
        </form>

        <table class="table table-bordered table-hover mt-3">
          <thead class="table-light">
            <tr>
              <th>STT</th>
              <th>Username</th>
              <th>Email</th>
              <th>Tổng số lượng mua</th>
              <th>Tổng giá trị</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, index) in orders" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ order.username }}</td>
              <td>{{ order.email }}</td>
              <td>{{ order.total_quantity }}</td>
              <td>{{ formatPrice(order.total_value) }}</td>
            </tr>
            <tr v-if="orders.length === 0">
              <td colspan="5" class="text-center">Không tìm thấy dữ liệu.</td>
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
import LoadingSpinner from "@/components/LoadingSpinner.vue"; // Import component LoadingSpinner

export default {
  components: {
    LoadingSpinner, // Đăng ký component LoadingSpinner
  },
  data() {
    return {
      orders: [],
      searchEmail: "",
      sortOption: "quantity", // Mặc định là sắp xếp theo số lượng
      loading: false, // Trạng thái loading
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
    async fetchOrderStatistics() {
      this.loading = true; // Bắt đầu tải
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/user-purchases`, {
          params: {
            search: this.searchEmail,
            sort_by_quantity: this.sortOption === "quantity",
            sort_by_value: this.sortOption === "value",
            exclude_purchased: this.sortOption === "none", // Thêm tham số để lọc người dùng không mua hàng
          },
          headers: {
            Authorization: `Bearer ${this.userInfo.token}`,
          },
        });

        this.orders = response.data;
        console.log(this.orders);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
        // Xử lý hiển thị thông báo lỗi nếu cần thiết
      } finally {
        this.loading = false; // Kết thúc tải
      }
    },
    formatPrice(price) {
      return parseFloat(price).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    },
  },
  mounted() {
    this.fetchOrderStatistics();
  },
};
</script>

<style scoped>

.container {
  max-width: 900px; 
}

</style>
