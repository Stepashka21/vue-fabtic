<template>
  <div>
    <h1>Редактор проекта "{{ projectName }}"</h1>
    <!-- <router-link :to="{ name: 'ReplaceDialog' }">Перейти на страницу Replace</router-link> -->
    <div style="display: flex; flex-direction: row">
      <div class="lay">
        <h2>Layers</h2>
        <draggable v-model="layers" @end="above">
          <div v-for="(layer, index) in layers" :key="index">
            <span @click="selectLayer(layer)" class="layer"
              >{{ layer.name }} /
              {{ layer.selected ? "selected" : "deselected" }}</span
            >
          </div>
        </draggable>
      </div>

      <div>
        <div class="buttunsGrid">
          <button class="btns" @click="addRectangle">Квадрат</button>
          <button class="btns" @click="addCircle">Кругг</button>
          <button class="btns" @click="addImg">Картинка</button>
          <button class="btns" @click="addText">Текст</button>
          <select v-model="selectedFont" @change="applyFont">
            <option v-for="font in fonts" :key="font" :value="font">
              {{ font }}
            </option>
          </select>

          <button class="btns" @click="saveProject">Сохранить</button>
          <button class="btns" @click="saveCanvasAsImage">
            Сохранить как картинку
          </button>
          <button class="btns" @click="deleteEl">Удалить элемент</button>
          <button class="btns" @click="clearCanvas">Очистить холст</button>
        </div>

        <div class="canav">
          <canvas
            ref="canvas"
            width="1000"
            height="600"
            @click="deselectAll"
          ></canvas>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/4.6.0/fabric.min.js"></script>
  
<script>
import { fabric } from "fabric";
import draggable from "vuedraggable";

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

      fonts: [
        "Times New Roman",
        "Pacifico",
        "VT323",
        "Quicksand",
        "Inconsolata",
      ],
      selectedFont: "Times New Roman",
    };
  },

  mounted() {
    this.canvas = new fabric.Canvas(this.$refs.canvas, {
      isDrawingMode: false,
    });
    this.loadProject();
    // this.initializeCanvas();
    this.canvas.on("selection:created", (e) => {
      const activeObject = e.target;
      const selectedLayer = this.layers.find(
        (layer) => layer.object === activeObject
      );
      if (selectedLayer) {
        selectedLayer.selected = true;
      }
    });
  },

  methods: {
    // Подгрузка проекта
    loadProject() {
      // Получаем имя проекта из параметров маршрута
      this.projectName = this.$route.params.projectName;
      // Формируем путь к файлу проекта
      this.projectFilePath = `projects/${this.projectName}.json`;

      // Загружаем файл проекта с помощью fetch
      fetch(this.projectFilePath)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Файл не найден");
          }
          return response.json();
        })
        .then((data) => {
          // Сохраняем данные проекта
          console.log(data);
          this.projectData = data;
          // Восстанавливаем состояние холста и слои из данных проекта
          this.restoreCanvasState();
        })
        .catch((error) => {
          console.error("Ошибка загрузки проекта:", error);
        });
    },

    // Восстанавливаем состояние холста из данных проекта
    restoreCanvasState() {
      if (!this.projectData) return;

      this.canvas.loadFromJSON(this.projectData.canvas, () => {
        this.canvas.renderAll();
      });
      // Восстановление слоев
      setTimeout(() => {
        if (this.projectData.layers && Array.isArray(this.projectData.layers)) {
          this.projectData.layers.forEach((layerData) => {
            console.log(layerData);
            // Создаем объект слоя на основе данных из файла JSON
            const object = this.canvas.item(layerData.index);
            object.type = layerData.name;
            object.selected = false;
            if (object) {
              // Добавляем объект на холст и в список слоев
              this.addLayer(object);
            }
          });
        }
      }, 0);
      // Восстанавливаем состояние холста
    },

    above(ev) {
      this.layers[ev.newIndex].object.moveTo(
        this.layers.length - ev.newIndex - 1
      );
      // console.log(ev)
    },
    addRectangle() {
      const rect = new fabric.Rect({
        width: 100,
        height: 100,
        fill: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)})`,
        left: 10,
        top: 10,
        selectable: true,
      });
      this.canvas.add(rect);
      this.addLayer(rect);
    },
    addCircle() {
      const circle = new fabric.Circle({
        radius: 50,
        fill: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)})`,
        left: 50,
        top: 50,
        selectable: true,
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
        layer.selected = true;
      };
      layer.object.onDeselect = () => {
        layer.selected = false;
      };
    },
    addLayer(object) {
      const layer = { name: object.type, object, selected: false };
      this.layers.unshift(layer);
      this.addListeners(layer);
    },

    deselectAll() {
      this.canvas.discardActiveObject();
      this.selectedLayer = null;
      this.canvas.renderAll();
    },
    selectLayer(layer) {
      if (layer.object) {
        layer.selected = true;
        // this.canvas.on('object:selected', console.log)
        this.canvas.setActiveObject(layer.object);
        this.canvas.renderAll();
      }
    },

    saveProject() {
      // Получаем JSON-представление состояния холста
      const canvasData = this.canvas.toJSON();

      // Получаем информацию о слоях
      const layersData = this.layers.map((layer) => ({
        name: layer.name,
        index: this.canvas.getObjects().indexOf(layer.object),
      }));

      // Создаем объект с информацией о слоях и состоянии холста
      const projectData = {
        canvas: canvasData,
        layers: layersData,
      };

      // Преобразуем данные в JSON
      const jsonData = JSON.stringify(projectData);

      // Создаем Blob из JSON-данных
      const blob = new Blob([jsonData], { type: "application/json" });

      // Создаем ссылку для загрузки
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = this.projectName + ".json";

      // Эмулируем клик для загрузки файла
      link.click();

      // Освобождаем ресурсы
      URL.revokeObjectURL(link.href);
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

    deleteEl() {
      const activeObject = this.canvas.getActiveObject();
      this.layers = this.layers.filter(
        (layer) => layer.object !== activeObject
      );
      this.canvas.remove(activeObject);
    },

    clearCanvas() {
      this.canvas.clear();
      this.layers = [];
    },

    addText() {
      const text = new fabric.Textbox("Lorum ipsum dolor sit amet", {
        left: 50,
        top: 50,
        width: 150,
        fill: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)})`,
        fontSize: 20,
        fontFamily: this.selectedFont, // применяем выбранный шрифт
      });
      this.canvas.add(text);
      this.addLayer(text);
    },

    applyFont() {
      if (this.selectedFont !== "Times New Roman") {
        this.loadAndUse(this.selectedFont);
      } else {
        this.canvas.getActiveObject().set("fontFamily", this.selectedFont);
        this.canvas.requestRenderAll();
      }
    },
  },
};
</script>

<style>
body {
  display: flex;
  background-color: white;
}
.layer {
  cursor: pointer;
  margin: 10px;
  background-color: #b1b1b1;
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
  justify-content: space-between;
  max-width: 71vw;
  height: 50px;
}

.btns {
  font-size: 16px;
  max-width: fit-content;
}
select {
  max-height: 20px;
  margin-top: 22px;
}
</style>
