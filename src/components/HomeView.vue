<template>
  <div class="container" style="margin-top: 100px">
    <h1 class="text-center my-4">Danh Sách Sản Phẩm</h1>

    <div v-if="loading" class="text-center">Đang tải sản phẩm...</div>
    <div v-else>
      <div class="row">
        <div class="col-md-2" v-for="product in products" :key="product.id">
          <div class="card product-card">
            <img
              :src="getImageUrl(product.image)"
              class="card-img-top product-image"
              :alt="product.name"
            />
            <div class="card-body">
              <h5 class="card-title">{{ product.name }}</h5>
              <p class="card-text price">
                Giá: {{ formatPrice(product.price) }} VNĐ
              </p>
              <p class="card-text">{{ product.description }}</p>
              <button
                class="btn btn-primary"
                :class="{ 'btn-success': addedProducts.includes(product.id) }"
                @click="addToCart(product.id)"
                :disabled="addedProducts.includes(product.id)"
              >
                <span v-if="addedProducts.includes(product.id)">✔ Đã thêm</span>
                <span v-else>Thêm vào giỏ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      products: [],
      loading: true,
      addedProducts: [], // Biến lưu trạng thái sản phẩm đã thêm vào giỏ
    };
  },
  created() {
    this.fetchProducts();
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    async fetchProducts() {
      if (!this.userInfo || !this.userInfo.token) {
        this.$router.push("/login");
        return;
      }

      this.loading = true;
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/products/",
          {
            headers: {
              Authorization: `Bearer ${this.userInfo.token}`,
            },
          }
        );
        this.products = response.data.data;
      } catch (error) {
        console.error("Error fetching products:", error);
        alert("Không thể lấy danh sách sản phẩm. Vui lòng thử lại sau.");
      } finally {
        this.loading = false;
      }
    },
    async addToCart(productId) {
      try {
        await axios.get(`http://127.0.0.1:8000/api/add-product/${productId}`, {
          headers: { Authorization: `Bearer ${this.userInfo.token}` },
        });
        
        this.addedProducts.push(productId);
        
    
        setTimeout(() => {
          this.removeProductFromAdded(productId);
        }, 1000);
      } catch (error) {
        console.error("Error adding product to cart:", error);
        alert("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.");
      }
    },
    removeProductFromAdded(productId) {
      const index = this.addedProducts.indexOf(productId);
      if (index !== -1) {
        this.addedProducts.splice(index, 1);
      }
    },
    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    },
    getImageUrl(imagePath) {
      return `http://127.0.0.1:8000/storage/${imagePath}`;
    },
  },
};
</script>

<style scoped>

.btn-success {
  background-color: #28a745 !important;
  border-color: #28a745 !important;
  color: white !important;
}
</style>
