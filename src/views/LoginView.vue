<template>
  <div
    class="container shadow-lg p-3 mb-5 bg-body rounded"
    style="width: 400px; position: absolute; top: 100px; left: 35%"
  >
    <h4 class="text-center">Đăng Nhập</h4>
    <div v-if="errorMessage" class="text-danger text-center mb-3">
      <b>{{ errorMessage }}</b>
    </div>
    <LoadingSpinner :visible="loading" />
    <div class="form-group m-1">
      <label for="username">Tên đăng nhập:</label>
      <input
        type="text"
        v-model="form.username"
        class="form-control"
        id="username"
      />
    </div>
    <div class="form-group m-1">
      <label for="password">Mật khẩu:</label>
      <input
        type="password"
        v-model="form.password"
        class="form-control"
        id="password"
      />
    </div>

    <button
      type="submit"
      class="btn btn-primary mt-3"
      @click="login"
      :disabled="loading"
    >
      Đăng Nhập
    </button>
  </div>
</template>

<script>
import { mapGetters } from "vuex"; // Thêm import này
import axios from "axios";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

export default {
  components: { LoadingSpinner },
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
    };
  },
  computed: {
    ...mapGetters(["errorMessage", "loading"]), // Kết nối với getters của Vuex
  },
  methods: {
    async login() {
      // Gọi action login từ Vuex
      this.$store
        .dispatch("login", this.form)
        .then(() => {
          // Sau khi đăng nhập thành công, bạn có thể chuyển hướng tới trang dashboard
          this.$router.push("/home");
        })
        .catch((error) => {
          // Xử lý lỗi nếu cần
          console.error("Login error:", error);
        });
    },
  },
};
</script>
