import {createRouter,createWebHistory} from 'vue-router'
import home from '@/pages/home.vue'
import account from '@/pages/account.vue'
import profile from '@/pages/profile.vue'
import upload from '@/pages/upload.vue'
import following from '@/pages/following.vue'
import login from '@/pages/Login.vue'
import register from '@/pages/Register.vue'
import searchUser from '@/components/searchUser.vue'

const routes=[
    {
        path:'/',
        component:home
    },
    {
        path:'/profile',
        component:profile
    },
    {
        path:'/account',
        component:account
    },
    {
        path:'/upload',
        component:upload
    },
    {
        path:'/following',
        component:following
    },
    {
        path:'/login',
        component:login
    },
    {
        path:'/register',
        component:register
    },
    {
        name: 'searchUser',
        path:'/searchUser',
        component:searchUser
    },
]

const router = createRouter({
    history:createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('token') !== null;
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login'); 
      } else {
        next(); 
      }
  });
export default router;