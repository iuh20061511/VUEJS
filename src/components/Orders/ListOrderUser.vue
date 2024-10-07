<template>
  <div class="container mt-4">
    <div class="row"  style="margin-top: 60px;">
      <div class="col-12">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-danger text-center text-white">
            <h5 class="mb-0">Đơn Hàng Của Bạn</h5>
          </div>
          <div class="card-body">
            <div
              v-for="(order, orderIndex) in orders"
              :key="orderIndex"
              class="order-card mb-3 p-3 border rounded"
            >
              <div class="d-flex justify-content-between align-items-center" @click="toggleOrderDetails(orderIndex)">
                <h6 class="text-dark cursor-pointer">Đơn Hàng #{{ order.order_id }}</h6>
                <span class="badge bg-success">Đã đặt</span>
              </div>
              <div class="text-muted mb-2">
                Ngày đặt: {{ new Date(order.date).toLocaleDateString() }}
              </div>

              <!-- Chi tiết đơn hàng -->
              <div v-if="openOrderDetails === orderIndex" class="order-details">
                <table class="table table-borderless">
                  <thead class="table-light">
                    <tr>
                      <th>Tên Sản Phẩm</th>
                      <th>Đơn Giá</th>
                      <th>Số Lượng</th>
                      <th>Thành Tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(orderDetail, index) in order.order_details" :key="index">
                      <td>{{ orderDetail.product_name }}</td>
                      <td>{{ formatPrice(orderDetail.unit_price) }} VNĐ</td>
                      <td>{{ orderDetail.quantity }}</td>
                      <td>{{ formatPrice(orderDetail.total_price) }} VNĐ</td>
                    </tr>
                    <tr class="table-info">
                      <td><strong>Tổng Tiền</strong></td>
                      <td></td>
                      <td></td>
                      <td class="text-danger h5"><strong>{{ formatPrice(order.total_order) }} VNĐ</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div v-if="orders.length === 0" class="text-center text-muted">
              <p>Hiện tại bạn chưa có đơn hàng nào.</p>
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
      orders: [],
      openOrderDetails: null, // Để theo dõi đơn hàng nào đang mở
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
        const response = await axios.get(`http://127.0.0.1:8000/api/orders-user`, {
          headers: {
            Authorization: `Bearer ${this.userInfo.token}`,
          },
        });
        this.orders = response.data;
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    },
    toggleOrderDetails(index) {
      // Nếu đơn hàng đã mở thì đóng nó lại, nếu không thì mở
      this.openOrderDetails = this.openOrderDetails === index ? null : index;
    },
  },
  mounted() {
    this.fetchOrders();
  },
};
</script>


