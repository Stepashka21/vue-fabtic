import Vue from 'vue';
import Router from 'vue-router';
import ListProject from './components/ListProject.vue';
import ProjectEditor from './components/ProjectEditor.vue';
import Replace from './components/ReplaceDialog.vue';

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
    }, 
    {
      path: '/ReplaceDialog',
      name: 'ReplaceDialog',
      component: Replace,
    },
  ]
});
