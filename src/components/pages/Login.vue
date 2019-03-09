<template>
  <div class="text-center">
    <form class="form-signin" @submit.prevent="signin">
      <div class="store-name">Weird Store</div>
      <h3 class="mb-3">後台管理系統</h3>
      <h1 class="h4 mb-3 font-weight-normal">Please sign in</h1>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input id="inputEmail" class="form-control" v-model="user.username" placeholder="Email address" required="" autofocus="" type="email">
      <label for="inputPassword" class="sr-only">Password</label>
      <input id="inputPassword" class="form-control" v-model="user.password" placeholder="Password" required="" type="password">
      <div class="checkbox mb-3">
        <label>
          <input value="remember-me" type="checkbox"> Remember me
        </label>
      </div>
      <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
      <p class="mt-5 mb-3 text-muted">©2018</p>
    </form>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      user: {
      username: '',
      password: ''
      }
    }
  },
  methods: {
    signin(){
      const api = `${process.env.API_PATH}/admin/signin`;
      const vm = this;
      this.$http.post(api, vm.user).then((response) => { //用戶資料用post傳入
        console.log(response.data);
        if (response.data.success){
          vm.$router.push('/admin/products');  //成功登入後跳到admin
        }
      })
    }
  }
}
</script>

<style scoped>
*{
  box-sizing: border-box;
}
html, body {
  height: 100%;
}
body {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 360px;
  padding: 15px;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.store-name{
  font-family: 'Knewave', cursive;
  font-size: 56px;
  margin:16px 0;
  padding: 5px 10px;
  background: -webkit-linear-gradient(45deg, #3A1C71, #D76D77, #FFAF7B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

</style>
