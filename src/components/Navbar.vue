	
<template>
	<nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
	  <a class="navbar-brand col-4 col-md-2 mr-0 text-center" href="#">Weird Store</a>
	  <!-- <input class="form-control form-control-dark w-100" placeholder="Search" aria-label="Search" type="text"> -->
	  <ul class="navbar-nav px-3">
	    <li class="nav-item text-nowrap">
	      <a class="nav-link text-white" href="#" @click.prevent="signout" v-if="isLogin"><b>Sign out</b></a>
	      <router-link class="nav-link text-warning" to="/login" v-else><b>Sign in</b></router-link>
	    </li>
	  </ul>
	</nav>
</template>

<script>
export default {
	data(){
		return {
			isLogin: false,
		}
	},
	methods: {
		signout() {
      const api = `${process.env.API_PATH}/logout`;
      const vm = this;
      this.$http.post(api).then((response) => { 
        console.log(response.data);
        if (response.data.success){
          vm.$router.push('/login');
        }
      })
    },
    userCheck() {
    	const api = `${process.env.API_PATH}/api/user/check`;
			this.$http.post(api).then((response) => {  
				// console.log(response.data);
				if (response.data.success){
					this.isLogin = true;
				} else {
					this.isLogin = false;
					alert("您還沒有登入哦！");
				}
			})
    }
	},
	created() {
		this.userCheck();
	}
}
</script>