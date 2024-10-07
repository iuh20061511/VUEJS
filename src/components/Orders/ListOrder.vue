<template>
    <div class="container shadow-lg p-3 mb-5 bg-body rounded" style="width: 100%; position: absolute; top: 60px; left: 10%">
      <h2>Danh sách đơn đã đặt</h2>
  
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th>STT</th>
            <th>Email người đặt</th>
            <th>Username</th>
            <th>Tổng tiền</th>
            <th>Ngày đặt</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in orders" :key="order.order_id">
            <td>{{ (currentPage - 1) * perPage + (index + 1) }}</td>
            <td>{{ order.email }}</td>
            <td>{{ order.username }}</td>
            <td>{{ formatPrice(order.total_order) }} VND</td>
            <td>{{ new Date(order.date).toLocaleDateString() }}</td>
            <td>
              <button class="btn btn-danger m-1" @click="deleteOrder(order.order_id)">Xóa</button>
              <button class="btn btn-info m-1" @click="showOrderDetails(order)">Chi tiết</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @page-changed="fetchOrders"
      />
  
      <div v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</div>
  
      <!-- Modal -->
      <div class="modal fade" id="orderDetailsModal" tabindex="-1" aria-labelledby="orderDetailsModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="orderDetailsModalLabel">Chi tiết đơn hàng</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div v-if="selectedOrder">
                <p><strong>Username:</strong> {{ selectedOrder.username }}</p>
                <p><strong>Email:</strong> {{ selectedOrder.email }}</p>
                <p><strong>Tổng tiền:</strong> {{ formatPrice(selectedOrder.total_order) }} VND</p>
                <p><strong>Ngày đặt:</strong> {{ new Date(selectedOrder.date).toLocaleDateString() }}</p>
                <h6>Chi tiết sản phẩm:</h6>
                <table class="table table-striped m-1">
                  <thead class="bg-info text-center">
                    <th>sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                    <th>Tổng</th>
                  </thead>
                  <tbody class="text-center">
                    <tr v-for="(detail, index) in selectedOrder.order_details" :key="index">
                      <td>{{ detail.product_name }}</td>
                      <td>{{ detail.quantity }}</td>
                      <td>{{ formatPrice(detail.unit_price) }}</td>
                      <td>{{ formatPrice(detail.total_price) }} VND</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters } from "vuex";
  import axios from "axios";
  import Pagination from "../Pagination.vue";
  import Swal from "sweetalert2";
  
  export default {
    components: {
      Pagination,
    },
    data() {
      return {
        orders: [], // Danh sách đơn hàng
        currentPage: 1,
        totalPages: 1,
        perPage: 10, // Số lượng đơn hàng trên mỗi trang
        errorMessage: "",
        selectedOrder: null, // Đơn hàng được chọn để xem chi tiết
        searchQuery: "", // Từ khóa tìm kiếm
      };
    },
    computed: {
      ...mapGetters(["userInfo"]),
    },
    methods: {
      formatPrice(price) {
        return parseFloat(price).toLocaleString(); // Định dạng giá tiền
      },
  
      async fetchOrders(page = this.currentPage, query = "") {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
  
        try {
          const { data } = await axios.get(`http://127.0.0.1:8000/api/orders`, {
            headers: {
              Authorization: `Bearer ${this.userInfo.token}`,
            },
            params: {
              search: query, // Thêm tham số tìm kiếm vào yêu cầu
              page: page, // Thêm tham số trang vào yêu cầu
            },
          });
  
          this.orders = data.orders; // Lấy danh sách đơn hàng từ dữ liệu trả về
          this.totalPages = data.pagination.last_page; // Lấy tổng số trang từ dữ liệu phân trang
  
        } catch (error) {
          console.error("Error fetching orders:", error);
          this.errorMessage = error.response
            ? error.response.data.message
            : "Có lỗi xảy ra.";
        }
      },
  
      showOrderDetails(order) {
        this.selectedOrder = order; // Lưu đơn hàng được chọn
        const modalElement = document.getElementById('orderDetailsModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show(); // Hiện modal
      },
  
  
      async deleteOrder(orderId) {
        const result = await Swal.fire({
          title: 'Bạn có chắc chắn muốn xóa đơn hàng này?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Xóa',
          cancelButtonText: 'Hủy'
        });
  
        if (result.isConfirmed) {
          try {
            await axios.delete(`http://127.0.0.1:8000/api/delete-order/${orderId}`, {
              headers: {
                Authorization: `Bearer ${this.userInfo.token}`,
              },
            });
            this.fetchOrders(this.currentPage); // Tải lại danh sách đơn hàng
            Swal.fire('Đã xóa!', 'Đơn hàng đã được xóa.', 'success');
          } catch (error) {
            console.error("Error deleting order:", error);
            Swal.fire('Lỗi!', 'Có lỗi xảy ra khi xóa đơn hàng.', 'error');
          }
        }
      }
    },
    mounted() {
      if (this.userInfo.token) {
        this.fetchOrders(this.currentPage); // Gọi API để lấy danh sách đơn hàng ban đầu
      } else {
        this.errorMessage = "Bạn cần đăng nhập trước khi truy cập trang này.";
      }
    },
  };
  </script>
  
