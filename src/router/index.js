import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import DepartmentPage from '@/views/DepartmentPage.vue';
import EmployeePage from '@/views/EmployeePage.vue';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/departments',
    name: 'DepartmentPage',
    component: DepartmentPage
  },
  {
    path: '/employees',
    name: 'EmployeePage',
    component: EmployeePage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
