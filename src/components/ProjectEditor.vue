<template>
  <div style="display: flex; flex-direction: row; padding: 5px">
    <div class="leftPanel">
      <div class="nameProj">
        <h2 class="headNameProj">{{ projectName }}</h2>
      </div>
<<<<<<< HEAD
      <!-- <router-link :to="{ name: 'ReplaceDialog' }">Перейти на страницу Replace</router-link> -->
      <div class="divLayer">
        <div class="lay">
          <h2 style="margin-top: 3px;">Слои</h2>
          <draggable v-model="layers" @end="above" style="display: flex; flex-direction: column; align-items: flex-start; width: 11vw;">
            <div v-for="(layer, index) in layers" :key="index" style="margin-bottom: 10px;">
              <span @click="selectLayer(layer)" class="layer"
                >{{ layer.name }} </span>
                <!-- /{{ layer.selected ? "selected" : "deselected" }} -->
            </div>
          </draggable>
=======

      <div>
        <div class="buttunsGrid">
          <button class="btnss" @click="addRectangle"> mdi-vector-square
          </button>
          <button class="btnss" @click="addCircle">Кругг</button>
          <button class="btnss" @click="addImg">Картинка</button>
          <button class="btnss" @click="addText">Текст</button>
          <select v-model="selectedFont" @change="applyFont">
            <option v-for="font in fonts" :key="font" :value="font">
              {{ font }}
            </option>
          </select>

          <button class="btnss" @click="saveProject">Сохранить</button>
          <button class="btnss" @click="saveCanvasAsImage">
            Сохранить как картинку
          </button>
          <button class="btnss" @click="deleteEl">Удалить элемент</button>
          <button class="btnss" @click="clearCanvas">Очистить холст</button>
>>>>>>> e205ff2e59eb4c2f67008c8b74277f9f2400e44c
        </div>
      </div>
      <div class="settingsElement">

      </div>
    </div>
<<<<<<< HEAD

    <div class="canvasPanel">
      <div class="buttunsGrid">
        <button class="btns" @click="addRectangle">Квадрат</button>
        <button class="btns" @click="addCircle">Кругг</button>
        <button class="btns" @click="addImg">Картинка</button>
        <button class="btns" @click="addText">Текст</button>
        <!-- <select v-model="selectedFont" @change="applyFont">
          <option v-for="font in fonts" :key="font" :value="font">
            {{ font }}
          </option>
        </select> -->

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
          width="1280"
          height="720"
          @click="deselectAll"
        ></canvas>
      </div>

      <div class="">
        <div class="">
          <div class="querySelectionPanel">
            <div class="request" @click="requestWindow()">
              <h3 class="queryPanel">Запрос на генерацию изображения</h3>
            </div>
            <div class="negativeRequest" @click="negativeRequestWindow()">
              <h3 class="queryPanel">Негативный запрос</h3>
            </div>
          </div>
          <div class="textareaQuery">
            <textarea name="" id="" cols="30" rows="10">Введите текст...</textarea>
          </div>
        </div>

      </div>

      <div class="">

      </div>

=======
    <div class="context-menu" v-show="contextMenuVisible" :style="{ top: contextMenuPosition.top + 'px', left: contextMenuPosition.left + 'px' }">
      <ul>
        <li @click="handleMenuItemClick('edit')">Редактировать</li>
        <li @click="handleMenuItemClick('delete')">Удалить</li>
        <!-- другие пункты меню -->
      </ul>
>>>>>>> e205ff2e59eb4c2f67008c8b74277f9f2400e44c
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

      contextMenuVisible: false,
      contextMenuPosition: { top: 0, left: 0 }
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
        id: this.generateId(), // Генерация уникального ID
        name: "Rectangle", // Указание имени
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
        id: this.generateId(),
        name: "Circle",
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
            const fabricImage = new fabric.Image(img, {
              id: this.generateId(),
              name: "Image",
            });
            this.canvas.add(fabricImage);
            this.addLayer(fabricImage);
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      };
      input.click();
    },

    generateId() {
      return Math.random().toString(36).substr(2, 9); // Генерация случайного ID
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
        console.log(layer);
        this.canvas.setActiveObject(layer.object);
        this.canvas.renderAll();
        event.preventDefault(); // Убираем отображение стандартного контекстного меню браузера
        this.contextMenuPosition = { top: event.clientY, left: event.clientX };
        this.contextMenuVisible = true;
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

    hideContextMenu() {
      this.contextMenuVisible = false;
    },
    handleMenuItemClick(action) {
      if (action == 'edit') editNameLayer();
      if (action == 'delete') deleteEl();
      console.log('Выполнено действие:', action);
      this.hideContextMenu();
    },

    editNameLayer() {
      const activeObject = this.canvas.getActiveObject();
      this.layers = this.layers.filter(
        (layer) => layer.object !== activeObject
      );
      console.log(this.activeObject);
    },

  },
};
</script>

<style>
body {
  display: flex;
<<<<<<< HEAD
  background-color: #464646;
  align-items: flex-start;
  justify-content: flex-start;
}
.leftPanel {
  margin: 8px 25px 8px 8px;
  height: 96vh;
  width: 12vw;
}
.nameProj {
  background-color: #BCBCBC;
  display: flex;
  justify-content: center;
  width: auto;
  max-width: 190px;
  height: 32px;
  border-radius: 12px;
  padding: 5px;
  align-items: center;
  
}
.headNameProj {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0;
  padding: 0;
}
.divLayer {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #2C2C2C;
  margin-top: 29px;
  border-radius: 12px;
  height: 60vh;
=======
  background-color: rgb(128, 128, 128);
}
svg{
  height: 30px;
  width: 30px;
>>>>>>> e205ff2e59eb4c2f67008c8b74277f9f2400e44c
}
.layer {
  cursor: pointer;
  background-color: #8F8F8F;
  padding: 2px 5px 2px 5px;
  color: #ffffff;
  border-radius: 10px;
  width: 10vw;
  display: flex;
  flex-direction: row;
}
.lay {
<<<<<<< HEAD
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.settingsElement {
  height: 29vh;
  margin-top: 15px;
  background-color: #2C2C2C;
  border-radius: 12px;
=======
  margin-right: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: white;
  border-radius: 14px;
>>>>>>> e205ff2e59eb4c2f67008c8b74277f9f2400e44c
}


.canav {  
  background-color: #ffffff;
}
canvas {
  border: 2px solid #000000;
}

.buttunsGrid {
  display: flex;
  flex-direction: row;
<<<<<<< HEAD
  justify-content: flex-start;
  width: 1280px;
  height: 32px;
  margin-top: 0px;
  background-color: #2C2C2C;
  border-radius: 8px 8px 0 0;
}

.btns {
  font-size: 16px;
  max-width: fit-content;
  margin: 5px;
=======
  justify-content: space-between;
  max-width: 71vw;
  height: 50px;
  background-color: black;
  border-radius: 10px 10px 0 0;
}

.btnss {
  display: flex;
  flex-direction: row;
  width: 20vw;
   /* margin: 20px 5px 5px 5px !important; */
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  height: 40px;
>>>>>>> e205ff2e59eb4c2f67008c8b74277f9f2400e44c
}
/* select {
  max-height: 20px;
  margin-top: 6px;
} */

.querySelectionPanel {
  width: 39vw;
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
}
.request {
  background-color: #ffffff;
  color: #000000;
  border-radius: 12px;
}
.negativeRequest {
  background-color: #000000;
  color:  #ffffff;
  border-radius: 12px;
}
.queryPanel {
  padding: 0;
  margin: 5px 16px;
}
.textareaQuery {
  width: 39vw;
}

.context-menu {
  position: fixed;
  background-color: white;
  border: 1px solid #ccc;
  padding: 5px 0;
  z-index: 1000; /* Убедитесь, что меню отображается поверх остального контента */
}

.context-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.context-menu li {
  padding: 5px 20px;
  cursor: pointer;
}

.context-menu li:hover {
  background-color: #f0f0f0;
}
</style>
