<template>
  <div
    class="container shadow-lg p-3 mb-5 bg-body rounded"
    style="width: 100%; position: absolute; top: 60px; left: 10%"
  >
    <h2>Danh sách người dùng</h2>
    <table class="table table-striped table-sm">
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên</th>
          <th>Tên đăng nhập</th>
          <th>Email</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.id">
          <td>{{ (currentPage - 1) * 10 + (index + 1) }}</td>
          <td>{{ user.first_name }} {{ user.last_name }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>
            <!-- Chỉ hiển thị nút Sửa nếu role_id của người dùng hiện tại là 1, 2 hoặc 3 -->
            <button
              v-if="
                [1, 2, 3].includes(userInfo.role_id) ||
                userInfo.id_user === user.id
              "
              class="btn btn-warning m-1"
            >
              <router-link
                class="text-decoration-none"
                :to="'/users/edit/' + user.id"
                >Sửa</router-link
              >
            </button>

            <!-- Chỉ hiển thị nút Xóa nếu role_id của người dùng hiện tại là 1 hoặc người dùng là chính mình -->
            <button
              v-if="userInfo.role_id === 1 || userInfo.id_user === user.id"
              class="btn btn-danger m-1"
              @click="deleteUser(user.id)"
            >
              Xóa
            </button>

            <!-- Nút Chi tiết luôn hiển thị cho tất cả người dùng -->
            <button class="btn btn-info m-1">
              <router-link
                class="text-decoration-none text-light"
                :to="'/users/detail/' + user.id"
                >Chi tiết</router-link
              >
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-changed="fetchUsers"
    />

    <div v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</div>
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
      users: [],
      currentPage: 1,
      totalPages: 1,
      errorMessage: "",
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    async fetchUsers(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;

      try {
        const { data } = await axios.get(
          `http://127.0.0.1:8000/api/users?page=${this.currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${this.userInfo.token}`,
            },
          }
        );

        this.users = data.data.data;
        this.totalPages = data.data.last_page;
      } catch (error) {
        console.error("Error fetching users:", error);
        this.errorMessage = error.response
          ? error.response.data.message
          : "Có lỗi xảy ra.";
      }
    },
    async deleteUser(userId) {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn muốn xóa người dùng này không?",
        text: "Sau khi xóa, bạn sẽ không thể phục hồi lại!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Có, xóa!",
        cancelButtonText: "Hủy",
      });

      if (!result.isConfirmed) return;

      try {
        await axios.delete(`http://127.0.0.1:8000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${this.userInfo.token}` },
        });

        Swal.fire({ title: "Xóa thành công", icon: "success", timer: 1000 });
        this.fetchUsers();
      } catch (error) {
        Swal.fire({
          title: "Có lỗi xảy ra!",
          text: error.response?.data?.message || "Không thể xóa người dùng.",
          icon: "error",
        });
      }
    },
  },
  mounted() {
    if (this.userInfo.token) {
      this.fetchUsers(this.currentPage);
    } else {
      this.errorMessage = "Bạn cần đăng nhập trước khi truy cập trang này.";
    }
  },
};
</script>
