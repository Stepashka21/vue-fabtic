import Vue from 'vue';
import Router from 'vue-router';
import ListProject from './components/ListProject.vue';
import ProjectEditor from './components/ProjectEditor.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: ListProject
    },
    {
      path: '/edit/:projectName',
      name: 'edit',
      component: ProjectEditor,
      props: true
    }
  ]
});
