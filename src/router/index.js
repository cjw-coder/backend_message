import Vue from 'vue'
import VueRouter from 'vue-router'

//重写路由push方法
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}



const login = () => import("components/login")
const home = () => import("components/home")
const welcome = () => import('components/welcome')
const users = () => import('components/user/users')
const rights = () => import('components/power/rights')
const roles = () => import('components/power/roles')
const cate = () => import('components/goods/cate')
const params = () => import('components/goods/params')
const goodslist = () => import('components/goods/list')
const add = () => import('components/goods/add')

Vue.use(VueRouter)

  const routes = [
      {
        path:"/login",
        component:login
      },
      {
        path:"/home",
        component:home,
        redirect:'/welcome',
        children:[
          {path:"/welcome",component:welcome},
          {path:"/users",component:users},
          {path:"/rights",component:rights},
          {path:"/roles",component:roles},
          {path:"/categories",component:cate},
          {path:"/params",component:params},
          {path:"/goods",component:goodslist},
          {path:"/goods/add",component:add}
        ]
      }
  ]

const router = new VueRouter({
  routes
})

router.beforeEach((to,form,next) => {
  if(to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})


export default router
