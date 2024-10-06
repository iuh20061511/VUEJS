<template>
  <div
    class="container shadow-lg p-3 mb-5 bg-body rounded"
    style="width: 500px; position: absolute; top: 80px; right: 30%"
  >
    <h4 class="text-center">Thêm Người Dùng</h4>
    <div v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</div>

    <h6 v-if="successMessage" class="alert alert-success text-center">
      {{ successMessage }}
    </h6>
    <h6 v-if="errorMessage" class="text-danger mt-2" role="alert">
      {{ errorMessage }}
    </h6>
    <form @submit.prevent="addUser">
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
      <div class="form-group">
        <label for="password">Mật khẩu:</label>
        <input
          type="password"
          v-model="password"
          class="form-control"
          id="password"
        />
        <div v-if="errors.password" class="text-danger mt-1">
          <span v-for="(error, index) in errors.password" :key="index">{{
            error
          }}</span>
        </div>
      </div>
      <button type="submit" class="btn btn-primary mt-3">
        Thêm Người Dùng
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner.vue";

export default {
  components: { LoadingSpinner },
  data() {
    return {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      errorMessage: "",
      successMessage: "",
      errors: {},
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    async addUser() {
      try {
        const { data } = await axios.post(
          "http://127.0.0.1:8000/api/register",
          {
            first_name: this.firstName,
            last_name: this.lastName,
            username: this.username,
            email: this.email,
            password: this.password,
          },
          { headers: { Authorization: `Bearer ${this.userInfo.token}` } }
        );

        // Kiểm tra phản hồi từ server
        if (data.success) {
          this.successMessage = data.message || "Thêm người dùng thành công!";
          this.resetForm(); // Reset form
        } else {
          this.errorMessage = data.message; // Thông báo lỗi nếu không thành công
        }
      } catch (error) {
        const { response } = error;
        if (response && response.status === 422) {
          this.errors = response.data.errors || {};
          this.errorMessage = response.data.message;
        } else {
          this.errorMessage = "Có lỗi xảy ra. Vui lòng thử lại.";
        }
      }
    },
    resetForm() {
      this.firstName = "";
      this.lastName = "";
      this.username = "";
      this.email = "";
      this.password = "";
      this.errorMessage = "";
      this.errors = {};
    },
  },
};
</script>
