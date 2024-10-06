<template>
  <section class="vh-100" style="background-color: #f8f9fa">
    <div class="container h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col">
          <h2 class="text-center mb-4">Sản phẩm đã bán</h2>

          <div v-if="soldProducts.length === 0" class="text-center mb-4">
            <p class="lead">Chưa có sản phẩm nào được bán.</p>
          </div>

          <div
            v-for="(item, index) in soldProducts"
            :key="index"
            class="card mb-3 shadow-sm"
          >
            <div class="row g-0">
              <div class="col-md-4">
                <img
                  :src="item.product.image"
                  class="img-fluid rounded-start"
                  alt="Product Image"
                  style="height: 200px; object-fit: cover"
                />
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">{{ item.product.name }}</h5>
                  <p class="card-text">{{ item.product.description }}</p>
                  <p class="card-text">
                    <small class="text-muted"
                      >Giá: {{ formatPrice(item.product.price) }} đ</small
                    >
                  </p>
                  <p class="card-text">
                    <strong>Số lượng đã bán: {{ item.total_sold }}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
  
  <script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      soldProducts: [], // Danh sách sản phẩm đã bán
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    formatPrice(price) {
      return parseFloat(price).toLocaleString(); // Định dạng giá
    },

    async fetchSoldProducts() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/total`, {
          headers: {
            Authorization: `Bearer ${this.userInfo.token}`,
          },
        });
        this.soldProducts = response.data.data; // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Error fetching sold products:", error);
      }
    },
  },
  mounted() {
    this.fetchSoldProducts(); // Gọi hàm khi component được mount
  },
};
</script>
  
  <style scoped>
.card {
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  transition: box-shadow 0.3s ease;
}
.card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Hiệu ứng đổ bóng khi hover */
}
.img-fluid {
  max-height: 200px; /* Giới hạn chiều cao hình ảnh */
}
</style>
  