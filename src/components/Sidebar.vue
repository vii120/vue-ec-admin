<template>
  <nav class="col-md-2 d-none d-md-block bg-light sidebar" id="menu-toggle">
    <div class="sidebar-sticky">
      <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
        <span>Admin</span>
      </h6>
      <ul class="nav flex-column">
        <li class="nav-item" @click="currentPage='Products'">
          <router-link class="nav-link" to="/admin/products" :class="{'active': currentPage=='Products'}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-shopping-cart"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            Products
          </router-link>
        </li>
        <li class="nav-item" @click="currentPage='Orders'">
          <router-link class="nav-link" to="/admin/orders" :class="{'active': currentPage=='Orders'}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
            Orders
          </router-link>
        </li>
        <li class="nav-item" @click="currentPage='Coupons'">
          <router-link class="nav-link" to="/admin/coupons" :class="{'active': currentPage=='Coupons'}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
            Coupons
          </router-link>
        </li>
      </ul>

      <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
        <span>Simulation</span>
      </h6>
      <ul class="nav flex-column">
        <li class="nav-item" @click="currentPage='Simulation'">
          <router-link class="nav-link" to="/simulation" :class="{'active': currentPage=='Simulation'}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Order
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  data(){
    return{
      currentPage: 'Products',
    }
  },
  methods: {
    nowPage(){
      this.currentPage = this.$router.history.current.name;
      // console.log(this.currentPage);
    }
  },
  created(){
    this.nowPage();
  }
}
</script>
