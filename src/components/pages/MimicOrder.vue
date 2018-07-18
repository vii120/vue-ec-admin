<template>
  <div>
    <loading :active.sync="isLoading"></loading>
		<!-- product table -->
    <div class="row justify-content-between mt-4">
      <h3>訂單模擬系統 Mimic Order Management</h3>
    </div>
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <div style="height: 180px; background-size: cover; background-position: center"
            :style="{backgroundImage: `url(${item.imageUrl})`}">
          </div>
          <div class="card-body">
            <span class="badge badge-secondary">{{ item.category }}</span>
            <h6 class="card-title mt-2">
              <a href="#" class="text-dark font-weight-bold">{{ item.title }}</a>
            </h6>
            <p class="card-text">{{ item.content }}</p>
            <div class="d-flex justify-content-between align-items-baseline">
            	<!-- 沒有特價時，僅顯示原價 -->
              <div v-if="!item.price">{{ item.origin_price | currency}} 元</div>
              <!-- 有特價時，顯示原價+特價 -->
              <del v-if="item.price">原價 {{ item.origin_price | currency}} 元</del>
              <div class="h6" v-if="item.price">現在只要 {{ item.price | currency}} 元！</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="getProduct(item.id)">
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem==item.id"></i>
              查看更多
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addtoCart(item.id)">
              <i class="fas fa-spinner fa-spin" v-if="status.addingItem==item.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- pagination -->
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <!-- prev page icon -->
        <li class="page-item" :class="{'disabled': !pagination.has_pre}" v-if="!allPage">
          <a class="page-link" href="#" aria-label="Previous" @click.prevent="getProducts(pagination.current_page-1)">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>
        <!-- all pages icon -->
        <li class="page-item" v-for="page in pagination.total_pages" :key="page" v-if="!allPage"
        :class="{'active': page==pagination.current_page}">
          <a class="page-link" href="#" @click.prevent="getProducts(page)">{{page}}</a>
        </li>
        <!-- next page icon -->
        <li class="page-item" :class="{'disabled': !pagination.has_next}" v-if="!allPage">
          <a class="page-link" href="#" aria-label="Next" @click.prevent="getProducts(pagination.current_page+1)">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
        <!-- see all -->
        <li class="page-item">
          <a class="page-link" href="#" @click.prevent="getProducts('all')" v-if="!allPage">See All</a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#" @click.prevent="getProducts(1)" v-if="allPage">Back to pages</a>
        </li>
      </ul>
    </nav>
		<!-- modal -->
		<div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<img :src="product.imageUrl" class="img-fluid" alt="">
						<blockquote class="blockquote mt-3">
							<p class="mb-0">{{ product.content }}</p>
							<footer class="blockquote-footer text-right">{{ product.description }}</footer>
						</blockquote>
						<div class="d-flex justify-content-between align-items-baseline">
							<div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
							<del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
							<div class="h4" v-if="product.price">現在只要 {{ product.price }} 元</div>
						</div>
						<select name="" class="form-control mt-3" v-model="product.num">
							<option value="0" selected disabled>請選擇商品數量</option>
							<option :value="num" v-for="num in 10" :key="num">選購 {{num}} {{product.unit}}</option>
						</select>
					</div>
					<div class="modal-footer">
						<div class="text-muted text-nowrap mr-3">小計 <strong>{{ product.num * product.price }}</strong> 元</div>
						<button type="button" class="btn btn-primary" @click="addtoCart(product.id, product.num)">
              <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
               加到購物車
            </button>
					</div>
				</div>
			</div>
		</div>
		<hr>
		<!-- cart detail -->
		<div class="row mt-4 mb-4 justify-content-center" v-if="cart.carts.length!==0">
			<div class="col-md-8">
				<h3 class="text-center"><b>購物車明細</b></h3>
				<table class="table mt-4">
				  <thead>
				    <th></th>
				    <th>商品</th>
				    <th>數量</th>
				    <th v-if="cart.final_total!==cart.total">折扣價</th>
				    <th v-else>售價</th>
				  </thead>
				  <tbody>
				    <tr v-for="item in cart.carts">
				      <td class="align-middle">
				        <button type="button" class="btn btn-outline-danger btn-sm" @click="removeCart(item.id)">
				          <i class="far fa-trash-alt"></i>
				        </button>
				      </td>
				      <td class="align-middle">
				        {{ item.product.title }}
				        <div class="text-success" v-if="item.coupon">
				          已套用優惠券
				        </div>
				      </td>
				      <td class="align-middle">{{ item.qty }}{{ item.product.unit }}</td>
				      <td class="align-middle text-right">{{ item.final_total | currency }}</td>
				    </tr>
				  </tbody>
				  <tfoot>
				    <tr>
				      <td colspan="3" class="text-right">總計價格</td>
				      <td class="text-right">{{ cart.total }}</td>
				    </tr>
				    <tr v-if="cart.final_total!==cart.total">
				      <td colspan="3" class="text-right text-success">折扣後價格</td>
				      <td class="text-right text-success">{{ cart.final_total }}</td>
				    </tr>
				  </tfoot>
				</table>
				<div class="input-group mb-3 input-group-sm">
				  <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code">
				  <div class="input-group-append">
				    <button class="btn btn-outline-secondary" type="button" @click="addCoupon">套用優惠碼</button>
				  </div>
				</div>
			</div>
		</div>
		<!-- order form -->
		<div class="mb-4 row justify-content-center" v-if="cart.carts.length!==0">
		  <form class="col-md-6" @submit.prevent="createOrder">
		    <div class="form-group">
		      <label for="useremail">Email</label>
		      <input type="email" class="form-control" name="email" id="useremail" v-validate="'required|email'"
		      :class="{'is-invalid': errors.has('email')}"
		      v-model="form.user.email" placeholder="請輸入 Email">
		      <span class="text-danger" v-if="errors.has('email')">{{ errors.first('email') }}</span>
		    </div>
		    <div class="form-group">
		      <label for="username">收件人姓名</label>
		      <input type="text" class="form-control" name="name" id="username" v-validate="'required'"
		      :class="{'is-invalid': errors.has('name')}"
		      v-model="form.user.name" placeholder="輸入姓名">
		      <span class="text-danger" v-if="errors.has('name')">姓名欄位不可空白</span>
		    </div>
		  
		    <div class="form-group">
		      <label for="usertel">收件人電話</label>
		      <input type="tel" class="form-control" id="usertel" v-model="form.user.tel" placeholder="請輸入電話">
		    </div>
		  
		    <div class="form-group">
		      <label for="useraddress">收件人地址</label>
		      <input type="address" class="form-control" name="address" id="useraddress" v-validate="'required'"
		      :class="{'is-invalid': errors.has('address')}"
		      v-model="form.user.address" placeholder="請輸入地址">
		      <span class="text-danger" v-if="errors.has('address')">地址欄位不可空白</span>
		    </div>
		  
		    <div class="form-group">
		      <label for="useraddress">留言</label>
		      <textarea name="" id="" class="form-control" cols="30" rows="10" v-model="form.msg"></textarea>
		    </div>

		    <div class="text-right">
		      <button class="btn btn-danger">送出訂單</button>
		    </div>
		  </form>
		</div>

  </div>
</template>

<script>
import $ from 'jquery';

export default {
  data() {
    return {
      products: [],
      pagination: {},
      allPage: false,
      product: {}, //單一商品
      cart: {  //response.data.data
        carts: []
      },  
      isLoading: false,
      status: {
        loadingItem: '',
      	addingItem: '',
      },
      coupon_code: '',
      form: {
      	user: {
      		name: '',
      		email: '',
      		tel: '',
      		address: '',
      	},
      	msg: '',
      },
    };
  },
  methods: {
    getProducts(page = 1) {
      const vm = this;
      let url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/products`;
      if (page == 'all') {
        url += `/all`;
        vm.allPage = true;
      } else {
        url += `?page=${page}`;
        vm.allPage = false;
      }
      vm.isLoading = true;
      this.$http.get(url).then((response) => {
        console.log(response.data);
        vm.products = response.data.products.filter(function(item){
          return item.is_enabled == 1
        });
        vm.isLoading = false;
        if (page !== 'all') { 
          vm.pagination = response.data.pagination
        } else {
          vm.products = vm.products.reverse()
        }
      })
    },
    getProduct(id) {
    	const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/product/${id}`; 
      vm.status.loadingItem = id;
      this.$http.get(url).then((response) => {
        vm.product = response.data.product;
        $('#productModal').modal('show');
        console.log(response);
        vm.status.loadingItem = '';
      });
    },
    addtoCart(id, qty = 1){
    	const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/cart`; 
      vm.status.addingItem = id;
      const cart = {
      	product_id: id,
      	qty
      }
      this.$http.post(url, {data: cart}).then((response) => {
        console.log(response);
        vm.status.addingItem = '';
        vm.getCart();
        $('#productModal').modal('hide');
      });
    },
    getCart(){
    	const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/cart`; 
      this.$http.get(url).then((response) => {
      	vm.cart = response.data.data;  //return object, not array!
        console.log(response);
      });
    },
    removeCart(id) {
      const vm = this;
			let url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/cart/${id}`;
      vm.isLoading = true;
			this.$http.delete(url).then((response) => {
				vm.getCart();
				console.log(response);
        vm.isLoading = false;
			});
    },
    addCoupon(){
    	const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/coupon`;
      const coupon = { code: vm.coupon_code }
      vm.isLoading = true;
      this.$http.post(url, {data: coupon}).then((response) => {
        console.log(response);
        vm.getCart();
        vm.isLoading = false;
      });
    },
    createOrder() {
      const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/order`;
      const order = vm.form;
      // vm.isLoading = true;
      this.$validator.validate().then((result) => { //from VeeValidate: Disabling Events Validation
        if (result) {
          this.$http.post(url, { data: order }).then((response) => {
            console.log('訂單已建立', response);
            if (response.data.success){
            	vm.$router.push(`/oreder_confirm/${response.data.orderId}`);
            }
            // vm.isLoading = false;
          });
        } else {
          console.log('訂單欄位不完整');
        }
      });
    },
  },
  created() {
    this.getProducts();
    this.getCart();
  },
};
</script>