<template>
    <section class="py-5">
      <div class="container px-4 px-lg-5 my-5">
        <div class="row gx-4 gx-lg-5 align-items-center shadow p-3 mb-5 bg-body">
          <div class="col-md-6">
            <img class="card-img-top mb-5 mb-md-0" :src="image" alt="..." />
          </div>
          <div class="col-md-6">
            <div class="small mb-1">SKU: BST-498</div>
            <h1 class="display-5 fw-bolder">{{ name }}</h1>
            <div class="fs-5 mb-5">
              <span>{{ formatPrice(price) }}</span>
            </div>
            <p class="lead">{{ description }}</p>
            <div class="d-flex">
              <input
                class="form-control text-center me-3"
                id="inputQuantity"
                type="number"
                v-model.number="quantity"
                min="1"
                style="max-width: 5rem"
              />
              <button
                class="btn btn-outline-dark flex-shrink-0"
                type="button"
                @click="addToCart"
              >
                <i class="bi-cart-fill me-1"></i>
                Thêm vào giỏ hàng
              </button>
            </div>
            <p class="text-success mt-3" v-if="message">{{ message }}</p>
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
        name: "",
        price: "",
        description: "",
        image: "",
        createdAt: "",
        quantity: 1, // Số lượng mặc định khi người dùng chưa chọn
        idProduct: this.$route.params.id,
      };
    },
    computed: {
      ...mapGetters(["userInfo"]),
    },
    methods: {
      async fetchUserData() {
        try {
          const result = await axios.get(
            `http://127.0.0.1:8000/api/products/${this.idProduct}`,
            { headers: { Authorization: `Bearer ${this.userInfo.token}` } }
          );
          if (result.status === 200) {
            const productData = result.data;
            this.name = productData.name;
            this.price = productData.price;
            this.description = productData.description;
            this.image = "http://127.0.0.1:8000/storage/" + productData.image;
            this.createdAt = new Date(productData.created_at).toLocaleString();
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin sản phẩm:", error);
        }
      },
      async addToCart() {
        const toast = useToast(); // Khởi tạo toast
        try {
          const response = await axios.post(
            `http://127.0.0.1:8000/api/add-product/${this.idProduct}`,
            { quantity: this.quantity }, // Gửi số lượng sản phẩm người dùng đã chọn
            { headers: { Authorization: `Bearer ${this.userInfo.token}` } }
          );
  
          if (response.status === 200) {
            toast.success("Sản phẩm đã được thêm vào giỏ hàng!"); // Hiển thị thông báo toast
          }
        } catch (error) {
          console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
          toast.error("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau."); // Hiển thị thông báo lỗi toast
        }
      },
      formatPrice(price) {
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price);
      },
    },
    mounted() {
      this.fetchUserData();
    },
  };
  </script>
  
  <style>
  </style>
  