<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <div class="card mb-4 shadow-sm">
          <div class="card-header">
            <h6 class="mb-0">Đơn Hàng</h6>
          </div>
          <div class="card-body">
            <div
              v-for="(order, orderIndex) in orders"
              :key="orderIndex"
              class="mb-4"
            >
              <hr />
              <h6>Đơn Hàng #{{ order.order_id }}</h6>
              <table class="table table-borderless">
                <thead>
                  <tr>
                    <th>Tên Sản Phẩm</th>
                    <th>Đơn Giá</th>
                    <th>Số Lượng</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(orderDetail, index) in order.order_details"
                    :key="index"
                  >
                    <td>{{ orderDetail.product_name }}</td>
                    <td>{{ formatPrice(orderDetail.unit_price) }} VNĐ</td>
                    <td>{{ orderDetail.quantity }}</td>
                    <td>{{ formatPrice(orderDetail.total_price) }} VNĐ</td>
                  </tr>
                  <tr>
                    <td>Tổng tiền</td>
                    <td></td>
                    <td></td>
                    <td class="text-danger h5">
                      {{ formatPrice(order.total_order) }} VNĐ
                    </td>
                  </tr>
                </tbody>
              </table>
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
      orders: [], // Thay đổi từ orderDetails thành orders
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    formatPrice(price) {
      return parseFloat(price).toLocaleString();
    },
    async fetchOrders() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/orders`, {
          headers: {
            Authorization: `Bearer ${this.userInfo.token}`,
          },
        });
        this.orders = response.data; // Lưu tất cả đơn hàng
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    },
  },
  mounted() {
    this.fetchOrders();
  },
};
</script>
    
  <style>
</style>
  