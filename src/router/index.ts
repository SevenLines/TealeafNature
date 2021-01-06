import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Dashboard from "../views/Dashboard.vue";
import DisciplinePage from "../views/DisciplinePage.vue";
import LabPage from "../views/LabPage.vue";
import ArticleEditor from "../views/ArticleEditor.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: '/discipline/:disciplineId/article/:article',
        name: 'ArticleEditor',
        component: ArticleEditor
    },
    {
        path: '/discipline/:disciplineId',
        name: 'DisciplinePage',
        component: DisciplinePage
    },
    {
        path: '/lab/:labId',
        name: 'LabPage',
        component: LabPage
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
