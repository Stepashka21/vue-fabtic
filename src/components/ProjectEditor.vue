<template>
  <div>
    <h1>Редактор проекта "{{ projectName }}"</h1>
    <!-- <router-link :to="{ name: 'ReplaceDialog' }">Перейти на страницу Replace</router-link> -->
    <div style="display: flex;flex-direction: row;">
      <div class="lay">
        <h2>Layers</h2>
          <draggable v-model='layers' @end='above'>
            <div v-for='(layer, index) in layers' :key='index'>
              <span>{{layer.name}} / {{ layer.selected ? "selected" : "deselected" }}</span>
            </div>
          </draggable>
      </div>

      <div>
        <div class="buttunsGrid">
          <button class="btns" @click="addRectangle">Квадрат</button>
          <button class="btns" @click="addCircle">Кругг</button>
          <button class="btns" @click="addImg">Картинка</button>
          <button class="btns" @click="saveProject">Сохранить</button>
          <button class="btns" @click="saveCanvasAsImage">Сохранить как картинку</button>
          <button class="btns" @click="clearCanvas">Очистить холст</button>
        </div>

        <div class="canav">      
          <canvas ref="canvas" width="1000" height="600" @click="deselectAll"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fabric } from "fabric";
import draggable from 'vuedraggable'

export default {
  name: "ProjectEditor",
  
  components: {
    draggable,
  },

  data() {
    return {
      canvas: null,
      
      projectName: "",
      projectFilePath: "",
      projectData: null,
      
      layers: [],
      selectedLayer: null,
    };
  },

  mounted() {
    this.canvas = new fabric.Canvas(this.$refs.canvas, {
      isDrawingMode: false,
    });
    this.loadProject();
    this.canvas.on('object:selected', console.log)
  },

  methods: {
    // Подгрузка проекта
    loadProject() {
      // Получаем имя проекта из параметров маршрута
      this.projectName = this.$route.params.projectName;
      // Формируем путь к файлу проекта
      this.projectFilePath = `projects/${this.projectName}.json`;
      console.log(this.projectFilePath);

      // Загружаем файл проекта с помощью fetch
      fetch(this.projectFilePath)
        .then((response) => {
          if (!response.ok) {
            throw new Error("файл не найден");
          }
          return response.json();
        })
        .then((data) => {
          // Сохраняем данные проекта
          this.projectData = data;
          // Восстанавливаем состояние холста из данных проекта
          this.restoreCanvasState();
        })
        .catch((error) => {
          console.error("Ошибка загрузки проекта:", error);
        });
    },

    // Восстанавливаем состояние холста из данных проекта
    restoreCanvasState() {
      if (!this.projectData) return;
      // Восстанавливаем состояние холста из данных проекта
      this.canvas.loadFromJSON(this.projectData, () => {
        this.canvas.renderAll();
      });
    },

    above(ev) {
      this.layers[ev.newIndex].object.moveTo(this.layers.length - ev.newIndex - 1)
      console.log(ev)
      // let temp = this.layers[idx - 1]
      // this.layers.splice(idx - 1, 1, obj)
      // this.layers.splice(idx, 1, temp)

      // obj.object.moveTo(idx - 1)
    },
    addRectangle() {
      const rect = new fabric.Rect({
        width: 100,
        height: 100,
        fill: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
        left: 10,
        top: 10,
        selectable: true
      });
      this.canvas.add(rect);
      this.addLayer(rect);
    },
    addCircle() {
      const circle = new fabric.Circle({
        radius: 50,
        fill: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
        left: 50,
        top: 50,
        selectable: true
      });
      this.canvas.add(circle);
      this.addLayer(circle);
    },
    addImg() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const fabricImage = new fabric.Image(img);
            this.canvas.add(fabricImage);
            this.addLayer(fabricImage);
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      };
      input.click();
    },

    addListeners(layer) {
      layer.object.onSelect = () => {
        layer.selected = true
      }
      layer.object.onDeselect = () => {
        layer.selected = false
      }
    },
    addLayer(object) {
      const layer = { name: object.type, object, selected: false }
      this.layers.unshift(layer);
      this.addListeners(layer)
    },

    deselectAll() {
      this.canvas.discardActiveObject();
      this.selectedLayer = null;
      this.canvas.renderAll();
    },

    saveProject() {
      // Получаем JSON-представление состояния холста
      const jsonData = JSON.stringify(this.canvas.toJSON());

        // Создаем Blob из JSON-данных
        const blob = new Blob([jsonData], { type: "application/json" });

        // Создаем объект URL для Blob
        const url = URL.createObjectURL(blob);

        // Создаем ссылку для загрузки
        const link = document.createElement("a");
        link.href = url;
        link.download = this.projectName + ".json";

        // Добавляем ссылку в документ
        document.body.appendChild(link);

        // Эмулируем клик для загрузки файла
        link.click();

        // Удаляем ссылку из документа и освобождаем ресурсы
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    saveCanvasAsImage() {
      // Получаем данные изображения в формате URL
      const dataURL = this.canvas.toDataURL();

      // Создаем ссылку для загрузки
      const link = document.createElement("a");
      link.href = dataURL;

      // Устанавливаем атрибуты для загрузки файла
      link.download = "canvas_image.png";
      link.target = "_blank";

      // Добавляем ссылку в документ и эмулируем клик для загрузки файла
      document.body.appendChild(link);
      link.click();

      // Удаляем ссылку из документа
      document.body.removeChild(link);
    },

    clearCanvas() {
      this.canvas.clear(); 
      this.layers = []; 
    }
  },
};
</script>

<style>
body {
  display: flex;
  background-color: white;
}

.lay {
  margin-right: 40px;
}

canvas {
  border: 2px solid #000000;
}

.buttunsGrid {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  max-width: 50vw;
}

.btns {
  font-size: 16px;
  max-width: fit-content;
}
</style>
