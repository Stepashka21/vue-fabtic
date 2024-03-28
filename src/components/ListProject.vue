<template>
  <div>
    <h1>List of Projects</h1>
    <div v-for="project in projects" :key="project.id">
      <button @click="navigateToProject(project)">{{ project.name }}</button>
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
      
      const files = require.context('../projects/', false, /.json$/);
      const projects = files.keys().map(filePath => {
        
        const parts = filePath.split('/');
        const fileName = parts[parts.length - 1];
        
        return fileName.replace('.json', '');
      });

      console.log(projects); 

      this.projects = projects.map(name => ({ name }));
    },
    navigateToProject(project) {
      
      this.$router.push({ name: 'project', params: { projectName: project.name }});
    }
  }
};
</script>
