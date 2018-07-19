<template>
	<div>
		<!-- loading plug-in -->
    <loading :active.sync="isLoading"></loading>
		<!-- order table -->
		<div class="d-flex justify-content-between mt-4">
			<h3>訂單管理列表 Order Management</h3>
		</div>
		<table class="table mt-4">
			<thead>
				<tr>
					<th max-width=120>購買時間</th>
					<th max-width=150>收件人</th>
					<th>購買清單</th>
					<th max-width=100>應付金額</th>
					<th max-width=100>是否付款</th>
					<th max-width=100>詳細內容</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(item) in orders" :key="item.id">
					<td>{{item.create_at | date}}</td>
					<td>{{item.user.name}}</td>
					<td>
						<div v-for="subitem in item.products">
							{{subitem.product.title}}：共{{subitem.qty}}{{subitem.product.unit}}
						</div>
					</td>
					<td>{{item.total | currency}}</td>
					<td>
						<span class="text-success" v-if="item.is_paid">已付款</span>
						<span v-else>未付款</span>
					</td>
					<td>
						<button class="btn btn-outline-primary btn-sm" @click="openModal(item)">查看</button>
					</td>
				</tr>
			</tbody>
		</table>
		<!-- pagination -->
		<nav aria-label="Page navigation example">
		  <ul class="pagination justify-content-center">
		  	<!-- prev page icon -->
		    <li class="page-item" :class="{'disabled': !pagination.has_pre}">
		      <a class="page-link" href="#" aria-label="Previous" @click.prevent="getOrders(pagination.current_page-1)">
		        <span aria-hidden="true">&laquo;</span>
		        <span class="sr-only">Previous</span>
		      </a>
		    </li>
		  	<!-- all pages icon -->
		    <li class="page-item" v-for="page in pagination.total_pages" :key="page"
		    :class="{'active': page==pagination.current_page}">
		    	<a class="page-link" href="#" @click.prevent="getOrders(page)">{{page}}</a>
		    </li>
		  	<!-- next page icon -->
		    <li class="page-item" :class="{'disabled': !pagination.has_next}">
		      <a class="page-link" href="#" aria-label="Next" @click.prevent="getOrders(pagination.current_page+1)">
		        <span aria-hidden="true">&raquo;</span>
		        <span class="sr-only">Next</span>
		      </a>
		    </li>	
		  </ul>
		</nav>
		<!-- modal -->
		<div class="modal fade" id="orderModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-md" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel"><span>訂單詳情</span></h5>
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		          <span aria-hidden="true">&times;</span>
		        </button>
		      </div>
		      <div class="modal-body">
            <div class="row">
              <div class="col-sm-12">
              	<!-- order info -->
								<table class="table">
								  <thead class="thead-dark">
								    <tr>
								      <th scope="col" width=100>訂單資料</th>
								      <th scope="col">內容</th>
								    </tr>
								  </thead>
								  <tbody>
								  	<tr>
								      <th scope="row">代碼</th>
								      <td>{{tempOrder.id}}</td>
								    </tr>
								    <tr>
								      <th scope="row">日期</th>
								      <td>{{tempOrder.create_at | date}}</td>
								    </tr>
								    <tr>
								      <th scope="row">商品</th>
								      <td>
												<div v-for="item in tempOrder.products">
													{{item.product.title}}：共{{item.qty}}{{item.product.unit}}
												</div>
											</td>
								    </tr>
								    <tr>
								      <th scope="row">金額</th>
								      <td>{{tempOrder.total | currency}}</td>
								    </tr>
								    <tr>
								      <th scope="row">付款狀態</th>
								      <td>
								      	<span class="text-success" v-if="tempOrder.is_paid">已付款</span>
												<span v-else>未付款，
													<router-link :to="`/oreder_confirm/${tempOrder.id}`" target="_blank">查看付款頁面</router-link>
												</span>
								      </td>
								    </tr>
								    <tr>
								      <th scope="row">留言</th>
								      <td>{{tempOrder.message}}</td>
								    </tr>
								  </tbody>
								</table>
								<!-- customer into -->
								<table class="table">
								  <thead class="thead-dark">
								    <tr>
								      <th scope="col" width=100>收件資料</th>
								      <th scope="col">內容</th>
								    </tr>
								  </thead>
								  <tbody>
								    <tr>
								      <th scope="row">姓名</th>
								      <td>{{tempOrder.user.name}}</td>
								    </tr>
								    <tr>
								      <th scope="row">email</th>
								      <td>{{tempOrder.user.email}}</td>
								    </tr>
								    <tr>
								      <th scope="row">電話</th>
								      <td>{{tempOrder.user.tel}}</td>
								    </tr>
								    <tr>
								      <th scope="row">地址</th>
								      <td>{{tempOrder.user.address}}</td>
								    </tr>
								  </tbody>
								</table>
              </div>
            </div>
		      </div>
		      <div class="modal-footer">
		        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button>
		      </div>
		    </div>
		  </div>
		</div>

	</div>
</template>

<script>
import $ from 'jquery'; //匯入jQuery，否則$會出錯

export default {
	data() {
		return{
			orders: [],
			pagination: {},
			isLoading: false,
			tempOrder: {
				user: { name: '', }
			}
		}
	},
	methods: {
		getOrders(page = 1) { 
			const vm = this;
			let api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/orders?page=${page}`;
			vm.isLoading = true;
	    this.$http.get(api).then((response) => {
	      console.log(response.data)
	      vm.orders = response.data.orders;
	    	vm.isLoading = false;
	    	vm.pagination = response.data.pagination;
	    })
		},
		openModal(item) {
      this.tempOrder = item; 
			$('#orderModal').modal('show');
		},
	},
	created(){
		this.getOrders();
	}
}
</script>