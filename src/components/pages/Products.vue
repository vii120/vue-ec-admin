<template>
	<div>
		<!-- loading plug-in -->
    <loading :active.sync="isLoading"></loading>
		<!-- product table -->
		<div class="row justify-content-between mt-4">
			<h3>商品上架管理列表 Product Management</h3>
			<button class="btn btn-outline-primary" @click="openModal(true)">建立新商品</button>
		</div>
		<table class="table mt-4">
			<thead>
				<tr>
					<th max-width="120">分類</th>
					<th width="100">縮圖</th>
					<th>商品</th>
					<th max-width="100">原價</th>
					<th max-width="100">售價</th>
					<th max-width="80">啟用</th>
					<th max-width="150">編輯</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(item) in products" :key="item.id">
					<td>{{item.category}}</td>
					<td class="p-0"><img class="img-fluid" style="width:80px" :src="item.imageUrl" alt="商品圖"></td>
					<td>{{item.title}}</td>
					<td class="text-right">{{item.origin_price | currency}}</td>
					<td class="text-right">{{item.price | currency}}</td>
					<td>
						<span class="text-success" v-if="item.is_enabled">啟用</span>
						<span v-else>未啟用</span>
					</td>
					<td>
						<button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">編輯</button>
						<button class="btn btn-outline-danger btn-sm" @click="removeProduct(item)">刪除</button>
					</td>
				</tr>
			</tbody>
		</table>

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
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel"><span>新增商品</span></h5>
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		          <span aria-hidden="true">&times;</span>
		        </button>
		      </div>
		      <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input type="text" class="form-control" id="image" v-model="tempProduct.imageUrl" placeholder="請輸入圖片連結">
                </div>
                <div class="form-group">
                  <label for="customFile">或 上傳圖片
                    <i class="fas fa-spinner fa-spin" v-if="status.fileUpload"></i>
                  </label>
                  <input type="file" id="customFile" class="form-control" ref="files" @change="uploadFile">
                </div>
                <img class="img-fluid" :src="tempProduct.imageUrl" alt="">
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input type="text" class="form-control" id="title" v-model="tempProduct.title" placeholder="請輸入標題">
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input type="text" class="form-control" id="category" v-model="tempProduct.category" placeholder="請輸入分類">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input type="unit" class="form-control" id="unit" v-model="tempProduct.unit" placeholder="請輸入單位">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                  <label for="origin_price">原價</label>
                    <input type="number" class="form-control" id="origin_price" v-model="tempProduct.origin_price" placeholder="請輸入原價">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input type="number" class="form-control" id="price" v-model="tempProduct.price" placeholder="請輸入售價">
                  </div>
                </div>
                <hr>

                <div class="form-group">
                  <label for="description">商品描述</label>
                  <textarea type="text" class="form-control" id="description" v-model="tempProduct.description" placeholder="請輸入產品描述"></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea type="text" class="form-control" id="content" v-model="tempProduct.content" placeholder="請輸入產品說明內容"></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="is_enabled" 
                    v-model="tempProduct.is_enabled" :true-value="1" :false-value="0">
                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>

		      </div>
		      <div class="modal-footer">
		        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button>
		        <button type="button" class="btn btn-primary" @click="updateProduct">Save changes</button>
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
			products: [],
			pagination: {},
			allPage: false,
			tempProduct: {},
			isNew: false,
			isLoading: false,
			status: {
				fileUpload: false,
			},
		}
	},
	methods: {
		getProducts(page = 1) {
      const vm = this;
      let api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/products`;
      if (page == 'all') {
				api += `/all`;
				vm.allPage = true;
			} else {
				api += `?page=${page}`;
				vm.allPage = false;
			}
			vm.isLoading = true;
      this.$http.get(api).then((response) => {
        vm.products = response.data.products;
        console.log(vm.products);
        vm.isLoading = false;
        // console.log(response.data);
        if (page !== 'all') { 
        	vm.pagination = response.data.pagination
        } else {
        	// 因為all products中的product為物件{}，需轉成陣列後才能reverse
        	vm.products = [];
					for (var item in response.data.products) {
						vm.products.push(response.data.products[item]);
					}
        	vm.products = vm.products.reverse()
        }
      });
    },
		openModal(isNew, item) {
      if (isNew) {
        this.tempProduct = {};
        this.isNew = true;
      } else {
        this.tempProduct = Object.assign({}, item); //因為物件傳參考的特性
        this.isNew = false;
      }
			$('#productModal').modal('show');
		},
		updateProduct() {
      let api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/product`;
      let httpMethod = 'post'; //新增時時方法用post
      const vm = this;
      if (!vm.isNew) {
        api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/product/${vm.tempProduct.id}`;
        httpMethod = 'put'; //修改時方法用put
      }
      // console.log(process.env.API_PATH, process.env.CUSTOM_PATH);
      this.$http[httpMethod](api, { data: vm.tempProduct }).then((response) => { //加入vm.tempProduct
        console.log(response.data);
        if (response.data.success) {
          $('#productModal').modal('hide');
          vm.allPage ? vm.getProducts('all') : vm.getProducts(vm.pagination.current_page); //修改後回到當前頁面
        } else {
          $('#productModal').modal('hide');
          vm.allPage ? vm.getProducts('all') : vm.getProducts(vm.pagination.current_page);
          console.log('新增失敗');
        }
        console.log(this.$refs);
        // vm.products = response.data.products;
      });
      this.$refs.files.value = ''; 
      // console.log(this.$refs.files);
    },
    removeProduct(item) {
      const vm = this;
			let api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/product/${item.id}`;
			this.$http.delete(api, { data: item }).then((response) => {
				console.log(response.data)
				if (response.data.success) {
					vm.allPage ? vm.getProducts('all') : vm.getProducts(vm.pagination.current_page);
				}
			});
    },
    uploadFile(){
    	// console.log(this);
    	const uploadedFile = this.$refs.files.files[0];
    	const vm = this;
    	const formData = new FormData(); //上傳檔案用，模擬傳統表單送出的形式
    	formData.append('file-to-upload', uploadedFile); //將欄位新增到file-to-upload欄位
    	const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/upload`;
    	vm.status.fileUpload = true;
    	this.$http.post(url, formData, { headers: {'Content-Type': 'multipart/form-data' }})
    	.then((response) => { 
    		console.log(response.data);
    		vm.status.fileUpload = false;
    		if (response.data.success) {
					// vm.tempProduct.imageUrl = response.data.imageUrl; //無法雙向綁定
					vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl);
				} else{
					this.$bus.$emit('messsage:push',response.data.message , 'danger');
					//(自定義觸發function名稱 / 回傳內容 / css樣式)
				}
    	})
    }
	},
	created(){
		this.getProducts();
		// this.$bus.$emit('messsage:push','I am a message!', 'success');
	}
}
</script>