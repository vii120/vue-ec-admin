import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/pages/Login'
import Dashboard from '@/components/Dashboard'
import Products from '@/components/pages/Products'
import Orders from '@/components/pages/Orders'
import Coupons from '@/components/pages/Coupons'
import Simulation from '@/components/pages/MimicOrder'
import OrederConfirm from '@/components/pages/OrderConfirm'

Vue.use(Router)

export default new Router({
  routes: [
  	{
  		path: '*',
  		redirect: 'login'
  	},
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children: [
      	{
	      path: 'products',
	      name: 'Products',
	      component: Products,
	      meta: { requiresAuth: true }
	    	},
	    	{
	      path: 'orders',
	      name: 'Orders',
	      component: Orders,
	      meta: { requiresAuth: true }
	    	},
	    	{
	      path: 'coupons',
	      name: 'Coupons',
	      component: Coupons,
	      meta: { requiresAuth: true }
	    	}
      ],
    },
    {
      path: '/',
      name: 'Dashboard_public',
      component: Dashboard,
      children: [
        {
        path: 'simulation',  //不需admin
        name: 'Simulation',
        component: Simulation,
        },
        {
        path: 'oreder_confirm/:orderId', //動態頁面
        name: 'OrederConfirm',
        component: OrederConfirm,
        },
      ],
    }
  ]
})
