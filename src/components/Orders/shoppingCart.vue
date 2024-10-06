<template>
  <section class="vh-100" style="background-color: #fdccbc">
    <div class="container h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col">
          <p>
            <span class="h2">Shopping Cart </span>
            <span class="h4">({{ totalItems }} items in your cart)</span>
          </p>
          <div
            v-for="(product, index) in carts.order_details"
            :key="index"
            class="card mb-1"
          >
            <div class="card-body">
              <div class="row align-items-center text-center">
                <!-- Hình ảnh sản phẩm -->
                <div class="col-md-3">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/1.webp"
                    class="img-fluid"
                    alt="Product Image"
                    style="width: 100px"
                  />
                </div>

                <div class="col-md-3">
                  <p class="small text-muted">Name</p>
                  <p class="lead fw-normal">{{ product.product_name }}</p>
                </div>

                <!-- Số lượng sản phẩm -->
                <div class="col-md-2">
                  <p class="small text-muted">Quantity</p>
                  <p class="lead fw-normal">{{ product.quantity }}</p>
                </div>

                <!-- Giá đơn vị sản phẩm -->
                <div class="col-md-2">
                  <p class="small text-muted">Unit Price</p>
                  <p class="lead fw-normal">
                    {{ formatPrice(product.unit_price) }} đ
                  </p>
                </div>

                <!-- Tổng giá sản phẩm -->
                <div class="col-md-2">
                  <p class="small text-muted">Total</p>
                  <p class="lead fw-normal">
                    {{ formatPrice(product.total_price) }} đ
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Hiển thị tổng tiền của giỏ hàng -->
          <div class="card mb-5">
            <div class="card-body p-4">
              <div class="float-end">
                <p class="mb-0 me-5 d-flex align-items-center">
                  <span class="small text-muted me-2">Order total:</span>
                  <span class="lead fw-normal">
                    {{ formatPrice(carts.total_order) }} đ
                  </span>
                </p>
              </div>
            </div>
          </div>

          <!-- Nút hành động -->
          <div class="d-flex justify-content-end">
            <button
              type="button"
              data-mdb-button-init
              data-mdb-ripple-init
              class="btn btn-light btn-lg me-2"
            >
              Continue shopping
            </button>
            <button
              type="button"
              data-mdb-button-init
              data-mdb-ripple-init
              class="btn btn-primary btn-lg"
              @click="placeOrder"
            >
              Đặt hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import axios from "axios";
import { mapGetters } from "vuex";
import Swal from "sweetalert2"; // Import SweetAlert2

export default {
  data() {
    return {
      carts: {
        order_details: [],
        total_order: 0,
      },
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    totalItems() {
      return this.carts.order_details ? this.carts.order_details.length : 0;
    },
  },
  methods: {
    formatPrice(price) {
      return parseFloat(price).toLocaleString();
    },

    async fetchcarts() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/cart`, {
          headers: {
            Authorization: `Bearer ${this.userInfo.token}`,
          },
        });

        this.carts = response.data[0];
        console.log(this.carts);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    },

    async placeOrder() {
      try {
        // Gửi yêu cầu POST đến API đặt hàng
        const response = await axios.post(
          `http://127.0.0.1:8000/api/order`,
          {
            order_details: this.carts.order_details,
            total_order: this.carts.total_order,
          },
          {
            headers: {
              Authorization: `Bearer ${this.userInfo.token}`,
            },
          }
        );

        if (response.status === 200) {
          // Sử dụng SweetAlert2 để thông báo thành công
          await Swal.fire({
            icon: "success",
            title: "Đặt hàng thành công!",
            text: "Cảm ơn bạn đã đặt hàng!",
          });

          // Xóa giỏ hàng trong state
          this.carts.order_details = [];
          this.carts.total_order = 0;

          // Cập nhật lại giao diện nếu cần
          // Ví dụ: chuyển hướng đến trang khác
          // this.$router.push('/thank-you');
        }
      } catch (error) {
        console.error("Error placing order:", error);
        // Sử dụng SweetAlert2 để thông báo thất bại
        await Swal.fire({
          icon: "error",
          title: "Đặt hàng thất bại!",
          text: "Vui lòng thử lại.",
        });
      }
    },
  },
  mounted() {
    this.fetchcarts();
  },
};
</script>
