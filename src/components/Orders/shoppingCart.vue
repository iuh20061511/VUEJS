<template>
  <section class="vh-100" style="background-color: #fdccbc; margin-top: 40px;">
    <div class="container h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col">
          <p>
            <span class="h6">Giỏ hàng </span>
            <span class="">({{ totalItems }} sản phẩm)</span>
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
                    :src="getFullImageUrl(product.image)"
                    alt="Image"
                    style="width: 100px; height: auto"
                  />
                </div>

                <div class="col-md-2">
                  <p class="small text-muted">Tên</p>
                  <p class="lead fw-normal">{{ product.product_name }}</p>
                </div>

                <!-- Số lượng sản phẩm -->
                <div class="col-md-2">
                  <p class="small text-muted">Số lượng</p>
                  <div class="d-flex justify-content-center">
                    <button
                      class="btn btn-outline-dark me-1"
                      @click="updateQuantity(product, index, product.quantity - 1)"
                      :disabled="product.quantity <= 1"
                    >
                      -
                    </button>
                    <input
                      class="form-control text-center me-1"
                      type="number"
                      v-model.number="product.quantity"
                      min="0"
                      @change="updateQuantity(product, index, product.quantity)"
                      style="max-width: 5rem"
                    />
                    <button
                      class="btn btn-outline-dark"
                      @click="updateQuantity(product, index, product.quantity + 1)"
                    >
                      +
                    </button>
                  </div>
                </div>

                <!-- Giá đơn vị sản phẩm -->
                <div class="col-md-2">
                  <p class="small text-muted">Đơn giá</p>
                  <p class="lead fw-normal">
                    {{ formatPrice(product.unit_price) }} đ
                  </p>
                </div>

                <!-- Tổng giá sản phẩm -->
                <div class="col-md-2">
                  <p class="small text-muted">Thành tiền</p>
                  <p class="lead fw-normal">
                    {{ formatPrice(product.unit_price * product.quantity) }} đ
                  </p>
                </div>

                <div class="col-1">
                     <button class="border-0" style="background: none;" @click="deleteProductcart(product)">
                      <i class="bi bi-x-circle"></i>
                    </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Hiển thị tổng tiền của giỏ hàng -->
          <div class="card mb-5">
            <div class="card-body p-4">
              <div class="float-end" style="margin-right: 8%;">
                <p class="mb-0 me-5  d-flex align-items-center">
                  <span class="small text-muted me-2">Tổng tiền:</span>
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
import Swal from "sweetalert2";
import { useToast } from "vue-toastification"; 
export default {
  data() {
    return {
      carts: {
        order_details: [],
        order_id: 0,
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
    getFullImageUrl(imagePath) {
      return `http://127.0.0.1:8000/storage/${imagePath}`;
    },

    async fetchcarts() {


      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/cart`, {
          headers: {
            Authorization: `Bearer ${this.userInfo.token}`,
          },
        });

        this.carts = response.data[0];

        this.updateTotalOrder();
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
   console.log(this.carts.sum_quantity)

    },

    async placeOrder() {
      try {
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
          await Swal.fire({
            icon: "success",
            title: "Đặt hàng thành công!",
            text: "Cảm ơn bạn đã đặt hàng!",
          });

          this.carts.order_details = [];
          this.carts.total_order = 0;
        }
      } catch (error) {
        console.error("Error placing order:", error);
        await Swal.fire({
          icon: "error",
          title: "Đặt hàng thất bại!",
          text: "Vui lòng thử lại.",
        });
      }
    },

    async updateQuantity(product, index, newQuantity) {
      const order_id = this.carts.order_id; // Lấy order_id từ giỏ hàng
      const product_id = product.id_product; // Lấy product_id từ sản phẩm

      // Kiểm tra xem có lấy đúng product_id không
      console.log("Product ID:", product_id);
      console.log("Order ID:", order_id);
      console.log("New Quantity:", newQuantity);

      // Nếu không tìm thấy product_id, hiển thị thông báo lỗi
      if (!product_id) {
        console.error("Không tìm thấy id_product trong product:", product);
        await Swal.fire({
          icon: "error",
          title: "Lỗi sản phẩm!",
          text: "Không thể tìm thấy ID sản phẩm. Vui lòng thử lại.",
        });
        return;
      }

      if (newQuantity >= 1) {
        // Cập nhật số lượng trong giỏ hàng
        this.carts.order_details[index].quantity = newQuantity;
        this.carts.order_details[index].total_price =
          this.carts.order_details[index].unit_price * newQuantity;

        // Gọi API để cập nhật số lượng sản phẩm trên backend
        await this.updateCartQuantity(order_id, product_id, newQuantity);
      }

      // Cập nhật tổng tiền của giỏ hàng
      this.updateTotalOrder();
    },

    async updateCartQuantity(order_id, product_id, quantity) {
      try {
        console.log("Updating quantity for order:", order_id, "product:", product_id);

        if (!order_id || !product_id) {
          console.error("Thiếu order_id hoặc product_id:", { order_id, product_id });
          await Swal.fire({
            icon: "error",
            title: "Cập nhật thất bại!",
            text: "Không thể cập nhật số lượng sản phẩm. Vui lòng thử lại.",
          });
          return;
        }

        const response = await axios.post(
          `http://127.0.0.1:8000/api/update-cart/${order_id}/${product_id}`,
          { quantity },
          {
            headers: {
              Authorization: `Bearer ${this.userInfo.token}`,
            },
          }
        );

        console.log("Update successful:", response.data);
      } catch (error) {
        console.error("Error updating cart quantity:", error);
        await Swal.fire({
          icon: "error",
          title: "Cập nhật thất bại!",
          text: "Không thể cập nhật số lượng sản phẩm. Vui lòng thử lại.",
        });
      }
    },


    async  deleteProductcart(product){
      const order_id = this.carts.order_id; 
      const product_id = product.id_product; 
      const response = await axios.delete(
          `http://127.0.0.1:8000/api/delete-product-cart/${order_id}/${product_id}`,
          {
            headers: {
              Authorization: `Bearer ${this.userInfo.token}`,
            },
          }
        );
        const toast = useToast();
        if(response.status==200){
          this.fetchcarts();
          toast.error("Xóa sản phẩm khỏi giỏ hàng thành công!"); 
          setTimeout(() => {}, 1000);
          }
    },

    updateTotalOrder() {
      this.carts.total_order = this.carts.order_details.reduce(
        (total, item) => total + item.unit_price * item.quantity,
        0
      );
    },
  },

  mounted() {
    this.fetchcarts();
  },
};
</script>
