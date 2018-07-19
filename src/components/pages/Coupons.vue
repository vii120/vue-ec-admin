<template>
	<div>
		<!-- loading plug-in -->
    <loading :active.sync="isLoading"></loading>
		<!-- coupon table -->
		<div class="d-flex justify-content-between mt-4">
			<h3>優惠券管理列表 Coupon Management</h3>
			<button class="btn btn-outline-primary" @click="openModal(true)">建立新優惠券</button>
		</div>
		<table class="table mt-4">
			<thead>
				<tr>
					<th>優惠券</th>
					<th max-width="80">折扣</th>
					<th max-width="120">到期日</th>
					<th max-width="80">啟用</th>
					<th max-width="150">編輯</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(item) in coupons" :key="item.id">
					<td>{{item.title}}</td>
					<td>{{item.percent}}%</td>
					<td>{{item.due_date}}</td>
					<td>
						<span class="text-success" v-if="item.is_enabled">啟用</span>
						<span v-else>未啟用</span>
					</td>
					<td>
						<button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">編輯</button>
						<button class="btn btn-outline-danger btn-sm" @click="removeCoupon(item)">刪除</button>
					</td>
				</tr>
			</tbody>
		</table>

		<!-- pagination -->
		<nav aria-label="Page navigation example">
		  <ul class="pagination justify-content-center">
		  	<!-- prev page icon -->
		    <li class="page-item" :class="{'disabled': !pagination.has_pre}">
		      <a class="page-link" href="#" aria-label="Previous" @click.prevent="getCoupons(pagination.current_page-1)">
		        <span aria-hidden="true">&laquo;</span>
		        <span class="sr-only">Previous</span>
		      </a>
		    </li>
		  	<!-- all pages icon -->
		    <li class="page-item" v-for="page in pagination.total_pages" :key="page"
		    :class="{'active': page==pagination.current_page}">
		    	<a class="page-link" href="#" @click.prevent="getCoupons(page)">{{page}}</a>
		    </li>
		  	<!-- next page icon -->
		    <li class="page-item" :class="{'disabled': !pagination.has_next}">
		      <a class="page-link" href="#" aria-label="Next" @click.prevent="getCoupons(pagination.current_page+1)">
		        <span aria-hidden="true">&raquo;</span>
		        <span class="sr-only">Next</span>
		      </a>
		    </li>	
		  </ul>
		</nav>

		<!-- modal -->
		<div class="modal fade" id="couponModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-md" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel"><span>新增優惠券</span></h5>
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		          <span aria-hidden="true">&times;</span>
		        </button>
		      </div>
		      <div class="modal-body">
            <div class="row">
              <div class="col-sm-12">
                <div class="form-group">
                  <label for="title">優惠券名稱</label>
                  <input type="text" class="form-control" id="title" v-model="tempCoupon.title" placeholder="請輸入標題">
                </div>
                <div class="form-group">
                  <label for="code">優惠代碼</label>
                  <input type="text" class="form-control" id="code" v-model="tempCoupon.code" placeholder="請輸入優惠碼">
                </div>
                <div class="form-group">
                  <label for="due_date">到期日</label>
                  <input type="date" class="form-control" id="due_date" v-model="tempCoupon.due_date" placeholder="請輸入到期日">
                </div>
                <div class="form-group">
                  <label for="percent">折扣百分比</label>
                  <input type="percent" class="form-control" id="percent" v-model.number="tempCoupon.percent" placeholder="請輸入折扣百分比" min="0" max="100">
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="is_enabled" 
                    v-model="tempCoupon.is_enabled" :true-value="1" :false-value="0">
                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>

		      </div>
		      <div class="modal-footer">
		        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button>
		        <button type="button" class="btn btn-primary" @click="updateCoupon">Save changes</button>
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
			coupons: [],
			pagination: {},
			tempCoupon: {},
			isNew: false,
			isLoading: false,
		}
	},
	methods: {
		getCoupons(page = 1) {  //加入預設值
			const vm = this;
			let api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/coupons?page=${page}`;
			vm.isLoading = true;
	    this.$http.get(api).then((response) => {
	      console.log(response.data)
	      vm.coupons = response.data.coupons;
	    	vm.isLoading = false;
	    	vm.pagination = response.data.pagination;
	    })
		},
		openModal(isNew, item) {
      if (isNew) {
        this.tempCoupon = {};
        this.isNew = true;
      } else {
        this.tempCoupon = Object.assign({}, item); 
        this.isNew = false;
      }
			$('#couponModal').modal('show');
		},
		updateCoupon() {
      let api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/coupon`;
      let httpMethod = 'post'; //新增時時方法用post
      const vm = this;
      if (!vm.isNew) {
        api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/coupon/${vm.tempCoupon.id}`;
        httpMethod = 'put'; //修改時方法用put
      }
      this.$http[httpMethod](api, { data: vm.tempCoupon }).then((response) => { //加入vm.tempCoupon
        console.log(response.data);
        if (response.data.success) {
          $('#couponModal').modal('hide');
          vm.getCoupons(vm.pagination.current_page);
        } else {
          $('#couponModal').modal('hide');
          vm.getCoupons(vm.pagination.current_page);
          console.log('新增失敗');
        }
      });
    },
    removeCoupon(item) {
      const vm = this;
			let api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/coupon/${item.id}`;
			this.$http.delete(api, { data: item }).then((response) => {
				console.log(response.data)
				if (response.data.success) {
					vm.getCoupons(vm.pagination.current_page);
				}
			});
    },
	},
	created(){
		this.getCoupons();
	}
}
</script>