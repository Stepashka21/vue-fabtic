<template>
  <div>
    <h1>Все проекты</h1>
    <div v-for="project in projects" :key="project.id">
      <button @click="navigateToProject(project)"></button>
      <!-- Используйте новый маршрут для редактора проекта -->
      <router-link :to="{ name: 'edit', params: { projectName: project.name } }">{{ project.name }}</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListProject",
  data() {
    return {
      projects: []
    };
  },
  mounted() {
    // Загрузка списка проектов при загрузке компонента
    this.loadProjects();
  },
  methods: {
    async loadProjects() {
      
      const files = require.context('../../public/projects/', false, /.json$/);
      const projects = files.keys().map(filePath => {
        
        const parts = filePath.split('/');
        const fileName = parts[parts.length - 1];
        
        return fileName.replace('.json', '');
      });

      console.log(projects); 

      this.projects = projects.map(name => ({ name }));
    },
    navigateToProject(project) {
      // Получаем имя целевого проекта из параметров маршрута
      const targetProjectName = project.name;
      // Получаем текущий маршрут
      const currentRouteName = this.$route.name;

      // Проверяем, если текущий маршрут не совпадает с целевым маршрутом
      if (currentRouteName !== 'edit' || this.$route.params.projectName !== targetProjectName) {
        // Выполняем переход к целевому маршруту
        this.$router.push({ name: 'edit', params: { projectName: targetProjectName }});
      
      }
    },
  }
};
</script>
