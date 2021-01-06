import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Dashboard from "../views/Dashboard.vue";
import Labs from "../views/Labs.vue";
import Tasks from "../views/Tasks.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: '/discipline/:disciplineId',
        name: 'Labs',
        component: Labs
    },
    {
        path: '/lab/:labId',
        name: 'Tasks',
        component: Tasks
    },
    // {
    //   path: '/about',
    //   name: 'About',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    // }
]

const router = new VueRouter({
    routes
})

export default router
