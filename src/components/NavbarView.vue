<template>
  <div>
    <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
      <div class="container-fluid" style="margin-left: 50px">
        <div class="collapse navbar-collapse" id="collapsibleNavbar">
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                >Sản phẩm</a
              >
              <ul class="dropdown-menu">
                <li class="nav-item">
                  <RouterLink class="nav-link text-dark" to="/product"
                    >Sản phẩm</RouterLink
                  >
                </li>
                <li class="nav-item">
                  <RouterLink class="nav-link text-dark" to="/add-product"
                    >Thêm sản phẩm</RouterLink
                  >
                </li>
              </ul>
            </li>

            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                >Người dùng</a
              >
              <ul class="dropdown-menu">
                <li class="nav-item">
                  <RouterLink class="nav-link text-dark" to="/user"
                    >Danh sách</RouterLink
                  >
                </li>
                <li class="nav-item">
                  <RouterLink class="nav-link text-dark" to="/register"
                    >Thêm người dùng</RouterLink
                  >
                </li>
              </ul>
            </li>

            <li class="nav-item">
              <RouterLink class="nav-link" to="/product"
                ><i class="bi bi-bag-fill"></i
              ></RouterLink>
            </li>
            <li
              class="nav-item dropdown"
              style="position: absolute; right: 5px"
            >
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                Hi ! {{ userInfo.username }}</a
              >
              <ul class="dropdown-menu" style="position: absolute; left: -25px">
                <li class="nav-item">
                  <RouterLink class="nav-link text-dark" to="/list-order"
                    >Đơn hàng của tôi</RouterLink
                  >
                </li>
                <li>
                  <RouterLink class="nav-link text-dark" to="/register"
                    >Thêm người dùng</RouterLink
                  >
                </li>
                <li><LogoutView></LogoutView></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
  <RouterView />
</template>
  
<script>
import { mapGetters } from "vuex";
import LogoutView from "@/views/LogoutView.vue";

export default {
  components: {
    LogoutView,
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
};
</script>
