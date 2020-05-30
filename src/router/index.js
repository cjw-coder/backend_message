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
        children:[{path:"/welcome",component:welcome},{path:"/users",component:users}]
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
