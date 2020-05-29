import Vue from 'vue'
import VueRouter from 'vue-router'

const login = () => import("components/login")
const home = () => import("components/home")
Vue.use(VueRouter)

  const routes = [
      {
        path:"/login",
        component:login
      },
      {
        path:"/home",
        component:home
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
