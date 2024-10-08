<template>

  <section class="py-5 mt-3">
            <div class="container px-4 px-lg-5 mt-5">
                <div class="row gx-4 gx-lg-5 row-cols-6 justify-content-center">
                    <div class="col mb-5" v-for="product in products" :key="product.id" >
                        <div class="card h-100">
                            <!-- Product image-->
                            <img class="card-img-top" :src="getImageUrl(product.image)" alt="..." />
                            <!-- Product details-->
                            <div class="card-body p-4">
                                <div class="text-center">
                                    <!-- Product name-->
                                    <h5 class="fw-bolder">{{ product.name }}</h5>
                                    {{ formatPrice(product.price) }}
                                </div>
                            </div>
                            <!-- Product actions-->
                            <div class="card-footer p-2 pt-1 border-top-0 bg-transparent">
                                <div class="text-center ">
                                  <router-link class="text-decoration-none" :to="'/products/detail-shop/'+ product.id">
                                    Chi tiết
                                  </router-link>
                                </div>
                            </div>
                            <button class="btn btn-danger" :class="{ 'btn-success': addedProducts.includes(product.id) }" @click="addToCart(product.id)"
                             :disabled="addedProducts.includes(product.id)" style="width: 40px; position: absolute; bottom: 10px; right: 10px;">
                             <span v-if="addedProducts.includes(product.id)">✔</span>
                             <span v-else><i class="bi bi-cart-plus"></i></span></button>
                        </div>
                    </div>
                  </div>
            </div>
        </section>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { useToast } from "vue-toastification"; // Sử dụng useToast

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
  const toast = useToast(); // Khởi tạo toast

  try {
    // Sửa lại cấu trúc axios.post
    await axios.post(
      `http://127.0.0.1:8000/api/add-product/${productId}`, 
      {},
      { headers: { Authorization: `Bearer ${this.userInfo.token}` } }
    );

    this.addedProducts.push(productId);
    toast.success("Thêm sản phẩm vào giỏ hàng thành công!"); 
    setTimeout(() => {
      this.removeProductFromAdded(productId);
    }, 1000);
  } catch (error) {
    console.error("Error adding product to cart:", error);
    alert("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.");
  }
}
,
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
  background-color: #22f553 !important;
  border-color: #10e442 !important;
  color: white !important;
}
</style>
