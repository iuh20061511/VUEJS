<template>
  <div
    class="container shadow-lg p-3 mb-5 bg-body rounded"
    style="width: 500px; position: absolute; top: 80px; right: 30%"
  >
    <h4 class="text-center">Cập nhật Người Dùng</h4>

    <form @submit.prevent="editUser">
      <div class="form-group">
        <label for="firstName">Tên:</label>
        <input
          type="text"
          v-model="firstName"
          class="form-control"
          id="firstName"
        />
        <div v-if="errors.first_name" class="text-danger mt-1">
          <span v-for="(error, index) in errors.first_name" :key="index">{{
            error
          }}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="lastName">Họ:</label>
        <input
          type="text"
          v-model="lastName"
          class="form-control"
          id="lastName"
        />
        <div v-if="errors.last_name" class="text-danger mt-1">
          <span v-for="(error, index) in errors.last_name" :key="index">{{
            error
          }}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="username">Tên đăng nhập:</label>
        <input
          type="text"
          v-model="username"
          class="form-control"
          id="username"
        />
        <div v-if="errors.username" class="text-danger mt-1">
          <span v-for="(error, index) in errors.username" :key="index">{{
            error
          }}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" v-model="email" class="form-control" id="email" />
        <div v-if="errors.email" class="text-danger mt-1">
          <span v-for="(error, index) in errors.email" :key="index">{{
            error
          }}</span>
        </div>
      </div>

      <button type="submit" class="btn btn-primary mt-3">
        Cập nhật Người Dùng
      </button>
    </form>
  </div>
</template>
  
  <script>
import { mapGetters } from "vuex";
import axios from "axios";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      errorMessage: "",
      successMessage: "",
      errors: {},
      idUser: this.$route.params.id, // Lấy id người dùng từ route
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    async editUser() {
      try {
        const response = await axios.patch(
          `http://127.0.0.1:8000/api/users/${this.idUser}`,
          {
            first_name: this.firstName,
            last_name: this.lastName,
            username: this.username,
            email: this.email,
          },
          { headers: { Authorization: `Bearer ${this.userInfo.token}` } }
        );

        Swal.fire({
          title: "cập nhật thành công",
          icon: "success",
          timer: 2000,
        });
        this.errorMessage = "";
        this.errors = {};
      } catch (error) {
        this.errorMessage = error.response?.data.message || "Đã xảy ra lỗi.";
        this.errors = error.response?.data.errors || {};
      }
    },
    async fetchUserData() {
      try {
        const result = await axios.get(
          `http://127.0.0.1:8000/api/users/${this.idUser}`,
          { headers: { Authorization: `Bearer ${this.userInfo.token}` } }
        );
        if (result.status === 200) {
          this.firstName = result.data.data.first_name;
          this.lastName = result.data.data.last_name;
          this.username = result.data.data.username;
          this.email = result.data.data.email;
        }
      } catch (error) {
        this.errorMessage = "Lỗi khi lấy thông tin người dùng.";
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    },
  },
  created() {
    this.fetchUserData();
  },
};
</script>
  
  <style scoped>
</style>
  