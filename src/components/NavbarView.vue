<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow p-3 mb-5 bg-body" style="position: fixed; width: 100%; z-index: 999; top:0px;  height: 70px;">
            <div class="container px-4 px-lg-5">
              <RouterLink to="home">
              <img src="https://i.imgur.com/1MP695I.jpeg" alt="" style="width: 90px;">
             </RouterLink>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                      <li class="nav-item dropdown" v-if="userInfo.role_id == 1">
              <a class="nav-link dropdown-toggle" href="#" role="button"
                data-bs-toggle="dropdown">Quản lý đơn hàng</a>
              <ul class="dropdown-menu">
                <li class="nav-item">
                  <RouterLink class="nav-link text-dark" to="/list-order"
                    >Đơn hàng</RouterLink
                  >
                </li>
                <li class="nav-item">
                  <RouterLink class="nav-link text-dark" to="/oders-tatistics"
                    >Thống kê đơn hàng</RouterLink
                  >
                </li>
                <li class="nav-item">
                  <RouterLink
                    class="nav-link text-dark"
                    to="/product-statistics"
                    >Thống kê sản phẩm</RouterLink
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
                <li class="nav-item" v-if="userInfo.role_id == 1">
                  <RouterLink class="nav-link text-dark" to="/register"
                    >Thêm người dùng</RouterLink
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
                >Sản phẩm</a
              >
              <ul class="dropdown-menu">
                <li class="nav-item">
                  <RouterLink class="nav-link text-dark" to="/product"
                    >Sản phẩm</RouterLink
                  >
                </li>
                <li class="nav-item" v-if="userInfo.role_id == 1">
                  <RouterLink class="nav-link text-dark" to="/add-product"
                    >Thêm sản phẩm</RouterLink
                  >
                </li>
              </ul>
            </li>
                    </ul>
                    <form class="d-flex">
                        <button class="btn btn-outline-dark  mr-3" type="submit">
                          <RouterLink to="/cart">
                            <i class="bi-cart-fill text-dark h5"></i>
                          </RouterLink>
                        </button>
                    </form>
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4" style="position: absolute; right: 20px;">
                        <li class="nav-item dropdown" >
                            <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Hi, {{ userInfo.username }}!</a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown" style="position: absolute; top: 52px;">
                              <li class="nav-item">
                  <RouterLink class="nav-link text-dark" to="/list-order-user"
                    >Đơn hàng của tôi</RouterLink
                  >
                </li>

                <li><LogoutView></LogoutView></li>
                            </ul>
                        </li>
                    </ul> 
                </div>
            </div>

        </nav>
      
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
