<template>
  <div class="bodyList">
    <div class="content">
      <button class="showDialog" @click="openDialog">
        Создать проект
      </button>
      <div class="list-group-project">
        <div v-for="project in projects" :key="project.id">
          <button class="list-item" >
            <router-link
              :to="{ name: 'edit', params: { projectName: project.name } }" 
              style=" text-decoration: none; color: #ffffff;"
              >{{ project.name }}</router-link
            >
          </button>
        </div>
      </div>
    </div>
    <button class="goToReplase" @click="goToRe">
      <span>***</span>
    </button>
    <dialog ref="diaOptions" class="dialogNew" style="">
      <h3 style="color: #ffffff;">Введите название проекта</h3>
      <input
        class="inputs"
        type="text"
        v-model="newProjectName"
        placeholder="Название..."
        
      />
      <div class="btnsDialog">
        <button class="closeDialog" @click="closeDialog()">
          <h4 style="margin: 0; padding: 0;">Отмена</h4>
        </button>
        <button class="saveProj" @click="createProject">
          <h4 style="margin: 0; padding: 0;">Создать</h4>
        </button>
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
    goToRe() {
      this.$router.push({ name: 'ReplaceDialog' });
    },
    
    openDialog() {
      this.$refs.diaOptions.style.visibility = "visible";
      this.$refs.diaOptions.showModal();
    },
    closeDialog() {
      this.$refs.diaOptions.style.visibility = "hidden";
      this.$refs.diaOptions.close();
    },

    async loadProjects() {
      const files = require.context("C:/Users/Stoypik/Downloads/", false, /.json$/);
      const projects = files.keys().map((filePath) => {
        const parts = filePath.split("/");
        const fileName = parts[parts.length - 1];

        return fileName.replace(".json", "");
      });

      console.log(projects);

      this.projects = projects.map((name) => ({ name }));
    },

    // navigateToProject(project) {
    //   // Получаем имя целевого проекта из параметров маршрута
    //   const targetProjectName = project.name;
    //   // Получаем текущий маршрут
    //   const currentRouteName = this.$route.name;

    //   // Проверяем, если текущий маршрут не совпадает с целевым маршрутом
    //   if (
    //     currentRouteName !== "edit" ||
    //     this.$route.params.projectName !== targetProjectName
    //   ) {
    //     // Выполняем переход к целевому маршруту
    //     this.$router.push({
    //       name: "edit",
    //       params: { projectName: targetProjectName },
    //     });
    //   }
    // },

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
.bodyList {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 95vw;
  height: 90vh;
  background-color: #A7A7A7;
}

.content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 20px auto;
  padding: 10px;
  background-color: #A7A7A7;
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
.list-item:hover {
  background-color: #464646b4;
  cursor: pointer;
}

.showDialog {
  height: 8vh;
  border-radius: 12px;
  margin: 8px 0;
  padding: 0 59px;
  background-color: #006ae3d3;
  color: #ffffff;
  border: none;
}
.showDialog:hover {
  cursor: pointer;  
  background-color: #005eca;
}
.dialogNew {
  border: none;
  display: flex;
  border-radius: 20px;
  flex-direction: column;
  align-items: center;
  visibility: hidden;
  background-color: #646464;
  height: 240px;
  width: 400px;
}
.inputs {
  width: 304px;
  height: 40px;
  margin-top: 40px;
  margin-bottom: 27px;
  border-radius: 12px;
  border: none;
  outline: none;
}
.btnsDialog {
  display: flex;
  flex-direction: row;
  width: 386px;
  margin: 20px 5px 5px 5px !important;
  justify-content: space-between;
}
.closeDialog {
  background-color: #F04444;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  height: 34px;
  width: 172px;
}
.saveProj {
  background-color: #39B400;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  height: 34px;
  width: 172px;
}

</style>