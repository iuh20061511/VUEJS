<template>
    <div
      class="container shadow-lg p-4 mb-5 bg-light rounded"
      style="width: 500px; position: absolute; top: 80px; right: 30%"
    >
      <h2 class="text-center mb-4 text-primary">Thông tin sản phẩm</h2>
      
      <div class="mb-3">
        <label class="form-label"><strong>Tên sản phẩm:</strong></label>
        <div class="form-control">{{ name }}</div>
      </div>
      
      <div class="mb-3">
        <label class="form-label"><strong>Giá:</strong></label>
        <div class="form-control">{{ price }}</div>
      </div>
      
      <div class="mb-3">
        <label class="form-label"><strong>Mô tả:</strong></label>
        <div class="form-control">{{ description }}</div>
      </div>
      
      <div class="mb-3">
        <label class="form-label"><strong>hình ảnh:</strong></label>
        <div class="form-control"> <img :src="image" alt="Image" style="width: 100px; height: auto"  /></div>
      </div>
      
      <div class="mb-3">
        <label class="form-label"><strong>Ngày tạo:</strong></label>
        <div class="form-control">{{ createdAt }}</div>
      </div>
      
    </div>
  </template>
  
  <script>
  import { mapGetters } from "vuex";
  import axios from "axios";
  
  export default {
    data() {
      return {
        name:"",
        price:"",
        description:"",
        image: "",
        createdAt: "",
        idProduct: this.$route.params.id,
      };
    },
    computed: {
      ...mapGetters(["userInfo"]),
    },
    methods: {
  
      async fetchUserData() {
        try {
          const result = await axios.get(
            `http://127.0.0.1:8000/api/products/${this.idProduct}`,
            { headers: { Authorization: `Bearer ${this.userInfo.token}` } }
          );
          if (result.status === 200) {
            const productData = result.data;
            this.name = productData.name;
            this.price = productData.price;
            this.description = productData.description;
            this.image  = "http://127.0.0.1:8000/storage/"+productData.image
            this.createdAt = new Date(productData.created_at).toLocaleString();

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
  
  