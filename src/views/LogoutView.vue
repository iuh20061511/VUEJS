<template>
  <div>
    <li>
      <span class="nav-link text-dark" @click="logout" style="cursor: pointer"
        >Đăng Xuất</span
      >
    </li>
  </div>
</template>
  
  <script>
export default {
  methods: {
    logout() {
      this.$store.dispatch("logout");

      // Thực hiện điều hướng về trang đăng nhập
      this.$router.push("/login");
    },
  },
};
</script>
  
  <style>
</style>
  