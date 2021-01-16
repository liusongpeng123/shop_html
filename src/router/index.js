import Vue from 'vue'
import Router from 'vue-router'
import Test from '@/components/Test'
import  Home from '@/components/common/Home'
import axios from 'axios'
import qs from 'qs'
/*import Header from '@/components/common/Header'*/
Vue.use(Router);
Vue.prototype.$axios=axios;
Vue.prototype.$qs=qs;
export default new Router({
  routes: [
   {
      path: '/',
      redirect: '/test'
    },
    {
      path: '/',
      component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
      meta: { title: '自述文件' },
      children:[
        {
          path: '/test',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/Test.vue'),
          meta: { title: '系统首页' }
        },
        {
          path: '/type',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Type.vue'),
          meta: { title: '类型管理' }
        },
        {
          path: '/brand',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Brand.vue'),
          meta: { title: '品牌管理' }
        },
        {
          path: '/peoperty',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Peoperty.vue'),
          meta: { title: '属性管理' }
        }
      ]
    }
  ]
})
