<template>
  <div>
    <div class="content">
      <button class="showDialog" @click="openDialog">
        Создать новый проект
      </button>
      <div class="list-group-project">
        <div v-for="project in projects" :key="project.id">
          <button class="list-item" @click="navigateToProject(project)">
            <router-link
              :to="{ name: 'edit', params: { projectName: project.name } }"
              >{{ project.name }}</router-link
            >
          </button>
        </div>
      </div>
    </div>

    <dialog ref="diaOptions" class="dialogNew" style="">
      <h1>Создание нового проекта</h1>
      <input
        class="inputs"
        type="text"
        v-model="newProjectName"
        placeholder="Введите название проекта"
      />
      <div class="btnss">
        <button class="closeDialog" @click="closeDialog()">Отмена</button>
        <button @click="createProject">Создать проект</button>
      </div>
    </dialog>
  </div>
</template>

<script>
export default {
  name: "ListProject",

  data() {
    return {
      projects: [],
      newProjectName: "",
    };
  },
  mounted() {
    // Загрузка списка проектов при загрузке компонента
    this.loadProjects();
  },

  methods: {
    openDialog() {
      this.$refs.diaOptions.style.visibility = "visible";
      this.$refs.diaOptions.showModal();
    },
    closeDialog() {
      this.$refs.diaOptions.style.visibility = "hidden";
      this.$refs.diaOptions.close();
    },

    async loadProjects() {
      const files = require.context("../../public/projects/", false, /.json$/);
      const projects = files.keys().map((filePath) => {
        const parts = filePath.split("/");
        const fileName = parts[parts.length - 1];

        return fileName.replace(".json", "");
      });

      console.log(projects);

      this.projects = projects.map((name) => ({ name }));
    },

    navigateToProject(project) {
      // Получаем имя целевого проекта из параметров маршрута
      const targetProjectName = project.name;
      // Получаем текущий маршрут
      const currentRouteName = this.$route.name;

      // Проверяем, если текущий маршрут не совпадает с целевым маршрутом
      if (
        currentRouteName !== "edit" ||
        this.$route.params.projectName !== targetProjectName
      ) {
        // Выполняем переход к целевому маршруту
        this.$router.push({
          name: "edit",
          params: { projectName: targetProjectName },
        });
      }
    },

    createProjectFile() {
      const projectName = this.newProjectName.trim();
      if (!projectName) {
        alert("Введите название проекта");
        return;
      }

      const projectData = { version: "5.3.0", objects: [] };
      const jsonData = JSON.stringify(projectData);

      const blob = new Blob([jsonData], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${projectName}.json`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    createProject() {
      // Проверка наличия имени нового проекта
      if (this.newProjectName.trim() === "") {
        alert("Введите название проекта");
        return;
      }

      // Создание нового проекта
      this.createProjectFile();

      // Выполнение перехода к редактированию нового проекта
      this.$router.push({
        name: "edit",
        params: { projectName: this.newProjectName },
      });
    },
  },
};
</script>

<style>
body {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 99vw;
  height: 98vh;
  background-color: black;
}

.content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 20px auto;
  padding: 10px;
  background-color: white;
  border-radius: 20px;
  max-width: 70vw;
  max-height: 70vh;
}

.list-group-project {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
}

.list-item {
  width: 300px;
  height: 116px;
  font-size: xx-large;
  margin: 20px 20px;
  padding: 10px;
  background-color: #898989b4;
  color: white;
  border-radius: 21px;
  list-style-type: none;
  border: none;
}
.showDialog {
  height: 8vh;
  border-radius: 12px;
  margin: 8px 0;
  padding: 0 59px;
  background-color: #2f00ffa8;
  color: #ffffff;
  border: none;
}
button:hover {
  cursor: pointer;
}
.dialogNew {
  border: none;
  display: flex;
  border-radius: 20px;
  flex-direction: column;
  align-items: center;
  visibility: hidden;
}
.inputs {
  width: 94%;
  height: 3vh;
}
.btnss {
  display: flex;
  flex-direction: row;
  width: 20vw;
  margin: 20px 5px 5px 5px !important;
  justify-content: space-between;
}

</style>