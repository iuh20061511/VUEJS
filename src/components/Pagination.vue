<template>
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
        </li>
    
        <li v-for="page in paginatedPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
    
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
        </li>
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    props: {
      currentPage: {
        type: Number,
        required: true
      },
      totalPages: {
        type: Number,
        required: true
      }
    },
    computed: {
      paginatedPages() {
        const pages = [];
        const maxVisiblePages = 5; // Số trang hiển thị
        const startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
  
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
        return pages;
      }
    },
    methods: {
      changePage(page) {
        // Thay đổi trang bằng cách phát ra sự kiện cho component cha
        this.$emit('page-changed', page);
      }
    }
  };
  </script>
  
  <style>
  /* Thêm các kiểu tùy chỉnh ở đây nếu cần */
  </style>
  