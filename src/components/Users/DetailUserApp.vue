<template>
  <div class="container">
    <h2 class="text-center mb-4 text-primary">Danh sách sản phẩm</h2>
    <table class="table">
      <thead>
        <tr>
          <th>Tên sản phẩm</th>
          <th>Giá</th>
          <th>Mô tả</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.name }}</td>
          <td>{{ product.price }}</td>
          <td>{{ product.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
  <script>
import { mapGetters } from "vuex"; // Đảm bảo import này
import axios from "axios";

export default {
  data() {
    return {
      products: [], // Khai báo danh sách sản phẩm
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/products", {
          headers: { Authorization: `Bearer ${this.userInfo.token}` },
        });
        this.products = response.data.data; // Lưu danh sách sản phẩm vào biến
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    },
  },
  mounted() {
    this.fetchProducts(); // Gọi hàm lấy danh sách sản phẩm khi component được mount
  },
};
</script>
  