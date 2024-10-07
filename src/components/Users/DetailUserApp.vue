<template>
  <div
    class="container shadow-lg p-4 mb-5 bg-light rounded"
    style="width: 500px; position: absolute; top: 80px; right: 30%"
  >
    <h2 class="text-center mb-4 text-primary">Thông tin người dùng</h2>
    
    <div class="mb-3">
      <label class="form-label"><strong>Họ và tên:</strong></label>
      <div class="form-control">{{ `${firstName} ${lastName}` }}</div>
    </div>
    
    <div class="mb-3">
      <label class="form-label"><strong>Tên người dùng:</strong></label>
      <div class="form-control">{{ username }}</div>
    </div>
    
    <div class="mb-3">
      <label class="form-label"><strong>Email:</strong></label>
      <div class="form-control">{{ email }}</div>
    </div>
    
    <div class="mb-3">
      <label class="form-label"><strong>Quyền hạn:</strong></label>
      <div class="form-control">{{ isAdmin ? 'Admin' : 'Member' }}</div>
    </div>
    
    <div class="mb-3">
      <label class="form-label"><strong>Ngày tạo:</strong></label>
      <div class="form-control">{{ createdAt }}</div>
    </div>
    
    <div class="mb-3">
      <label class="form-label"><strong>Ngày cập nhật:</strong></label>
      <div class="form-control">{{ updatedAt }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      isAdmin: false,
      createdAt: "",
      updatedAt: "",
      idUser: this.$route.params.id,
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    async fetchUserData() {
      try {
        const result = await axios.get(
          `http://127.0.0.1:8000/api/users/${this.idUser}`,
          { headers: { Authorization: `Bearer ${this.userInfo.token}` } }
        );
        if (result.status === 200) {
          const userData = result.data.data;
          this.firstName = userData.first_name;
          this.lastName = userData.last_name;
          this.username = userData.username;
          this.email = userData.email;
          this.isAdmin = userData.is_admin === 1;
          this.createdAt = new Date(userData.created_at).toLocaleString();
          this.updatedAt = new Date(userData.updated_at).toLocaleString();
        }
      } catch (error) {
        this.errorMessage = "Lỗi khi lấy thông tin người dùng.";
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    },
  },
  mounted() {
    this.fetchUserData();
  },
};
</script>

