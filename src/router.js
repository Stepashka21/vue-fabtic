import Vue from 'vue';
import VueRouter from 'vue-router';
import ListProject from './components/ListProject.vue';
import ProjectEditor from './components/ProjectEditor.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: ListProject },
  { path: '/project/:projectName', component: ProjectEditor, props: true }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
