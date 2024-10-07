import { createRouter, createWebHistory } from 'vue-router';

import LoginView from '@/views/LoginView.vue';
import ListUserApp from '@/components/Users/ListUserApp.vue';
import AddUserApp from '@/components/Users/AddUserApp.vue';
import EditUserApp from '@/components/Users/EditUserApp.vue';
import DetailUserApp from '@/components/Users/DetailUserApp.vue';
import ListProduct from '@/components/Products/ListProduct.vue';
import AddProduct from '@/components/Products/AddProduct.vue';
import EditProduct from '@/components/Products/EditProduct.vue';
import HomeView from '@/components/HomeView.vue';
import ListOrderUser from '@/components/Orders/ListOrderUser.vue';
import shoppingCart from '@/components/Orders/shoppingCart.vue';
import productsSold from '@/components/Products/productsSold.vue';
import DetailProduct from '@/components/Products/DetailProduct.vue';
import Oderstatistics from '@/components/Orders/Oderstatistics.vue';
import ProductStatistics from '@/components/Products/ProductStatistics.vue';
import ListOrder from '@/components/Orders/ListOrder.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/home',
      name: 'HomeView',
      component: HomeView,
    },
    {
      path: '/user',
      name: 'ListUserApp',
      component: ListUserApp,
    },
    {
      path: '/register',
      name: 'register',
      component: AddUserApp,
    },
    {
      path: '/users/edit/:id',
      name: 'EditUser',
      component: EditUserApp,
      props: true,
    },
    {
      path: '/users/delete/:id',
      name: 'DeleteUser',
      component: ListUserApp,
      props: true,
    }, {
      path: '/users/detail/:id',
      name: 'DetailUserApp',
      component: DetailUserApp,
      props: true,
    }, {
      path: '/product',
      name: 'ListProduct',
      component: ListProduct,
    },
    {
      path: '/add-product',
      name: 'AddProduct',
      component: AddProduct,
    }, {
      path: '/products/edit/:id',
      name: 'EditProduct',
      component: EditProduct,

    }, {
      path: '/products/edit/:id',
      name: 'EditProduct',
      component: EditProduct,

    }, {
      path: '/products/detail/:id',
      name: 'DetailProduct',
      component:  DetailProduct,

    }, {
      path: '/cart',
      name: 'shoppingCart',
      component: shoppingCart,

    },
    {
      path: '/product-sold',
      name: 'productsSold',
      component: productsSold,

    },{
      path: '/list-order-user',
      name: 'ListOrderUser',
      component: ListOrderUser,

    },{
      path: '/list-order',
      name: 'ListOrder',
      component: ListOrder,

    },{
      path: '/oders-tatistics',
      name: 'Oderstatistics',
      component: Oderstatistics,

    },
    {
      path: '/product-statistics',
      name: 'ProductStatistics',
      component: ProductStatistics,

    },
  ],
});

export default router;
