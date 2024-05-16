<template>
  <div style="display: flex; flex-direction: row; padding: 5px">
    <div class="leftPanel">
      <div class="nameProj">
        <h2 class="headNameProj">{{ projectName }}</h2>
      </div>
      <!-- <router-link :to="{ name: 'ReplaceDialog' }">Перейти на страницу Replace</router-link> -->
      <div class="divLayer">
        <div class="lay">
          <h2 style="margin-top: 3px">Слои</h2>
          <draggable
            v-model="layers"
            @end="above"
            style="
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              width: 11vw;
            "
          >
            <div
              v-for="(layer, index) in layers"
              :key="index"
              style="margin-bottom: 10px"
            >
              <span @click="selectLayer(layer)" class="layer"
                >{{ layer.name }}
              </span>
              <!-- /{{ layer.selected ? "selected" : "deselected" }} -->
            </div>
          </draggable>
        </div>
      </div>
    </div>

    <div class="canvasPanel">
      <div class="buttunsGrid">
        <div class="listBtn">
          <button class="btnss" @click="viewFigure">
            <img class="imgIcons" :src="require('/src/assets/kursor.png')" />
          </button>
        </div>

        <div class="listBtn">
          <button class="btnss" @click="viewFigure">
            <img class="imgIcons" :src="require('/src/assets/layers.png')" />
          </button>
        </div>

        <div class="listBtn">
          <button class="btnss" @click="addText">
            <img class="imgIcons" :src="require('/src/assets/text.png')" />
            <!--Text-->
          </button>
        </div>

        <div class="listBtn">
          <button class="btnss" @click="viewFigure">
            <img class="imgIcons" :src="require('/src/assets/geometry.png')" />
          </button>
        </div>

        <div class="listBtn">
          <button class="btnss" @click="viewFigure">
            <img class="imgIcons" :src="require('/src/assets/pen.png')" />
          </button>
        </div>

        <div class="listBtn">
          <button class="btnss" @click="viewFigure">
            <img class="imgIcons" :src="require('/src/assets/img.png')" />
          </button>
        </div>

        <div v-if="showFigureMenu" class="additionalMenu">
          <button class="btnss" @click="addRectangle">
            <img class="imgIcons" :src="require('/src/assets/rect.png')" />
            <span style="color: #ffffff">Квадрат</span>
            <!--квадрат/прямоугольник-->
          </button>
          <button class="btnss" @click="addCircle">
            <img class="imgIcons" :src="require('/src/assets/circle.png')" />
            <span style="color: #ffffff">Круг</span>
            <!--круг-->
          </button>
        </div>

        <button class="btnss" @click="addImg">
          <img class="btnIcon" src="" />
          <!--добавить картинку-->
        </button>


        <!-- <select v-model="selectedFont" @change="applyFont">
          <option v-for="font in fonts" :key="font" :value="font">
            {{ font }}
          </option>
        </select> -->
        <!--нужно добавить ластик-->
      </div>

      <div class="canav">
        <canvas
          ref="canvas"
          width="1280"
          height="720"
          @click="deselectAll"
        ></canvas>
      </div>

      <div class="" style="display: flex; flex-direction: row">
        <div class="" style="margin-right: 20px">
          <div class="querySelectionPanel">
            <div class="request" @click="requestWindow()">
              <h3 class="queryPanel">Запрос на генерацию изображения</h3>
            </div>
            <div class="negativeRequest" @click="negativeRequestWindow()">
              <h3 class="queryPanel">Негативный запрос</h3>
            </div>
          </div>
          <div class="textareaQuery">
            <textarea class="textAr" id="" cols="30" rows="10">Введите текст...</textarea>
          </div>
        </div>
        <div class="rigthSettingAndPhoto" style="">
          <button class="btnsSetting" @click="openDialog">
            <h3>Дополнительно</h3>
          </button>
          <div class="rigthPhoto"></div>
        </div>
      </div>

      <div class=""></div>

      <!-- <div class="context-menu" v-show="contextMenuVisible"      >
        <ul>
          <li @click="handleMenuItemClick('edit')">Редактировать</li>
          <li @click="handleMenuItemClick('delete')">Удалить</li>
         
        </ul>
      </div> -->
    </div>

    <div class="rightPanel">
      <div class="elementSeting">
        <h2>Настройки элемента</h2>
        <p>Выбранный элемент:</p>
        <template v-if="layer">
          <div>
            <p>Выбранный элемент: {{ layer }}</p>
            <!-- Здесь можете добавить другие настройки для выбранного элемента -->
          </div>
        </template>

      </div>
        <button class="btnss" @click="saveProject"><p style="color: #ffffff; padding: 0; margin: 0">Сохранить</p></button>
          <!-- <span style="color: #ffffff">Сохранить</span> -->
        
        <button class="btnss" @click="saveCanvasAsImage"><p style="color: #ffffff; padding: 0; margin: 0">Сохранить как картинку</p></button>
          <!-- <span style="color: #ffffff">Сохранить как картинку</span> -->
        <button class="btnss" @click="deleteEl"><p style="color: #ffffff; padding: 0; margin: 0">Удалить элемент</p></button>
          <!-- <span style="color: #ffffff">Удалить элемент</span> -->
        <button class="btnss" @click="clearCanvas"><p style="color: #ffffff; padding: 0; margin: 0">Сохранить</p></button>
          <!-- <span style="color: #ffffff">Очистить холст</span> -->
        <!-- </button> -->
      </div>

    <dialog ref="diaOptions" class="dialogNew" >
      <h1>Дополнительные настройки</h1>
      <button class="closeDialog" @click="closeDialog()">Вернуться</button>
    </dialog>
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
      dataValue: "",
      projectName: "",
      projectFilePath: "",
      projectData: null,

      layers: [],
      selectedLayer: null,
      selectLay: null,
      showFigureMenu: false,

      fonts: [
        "Times New Roman",
        "Pacifico",
        "VT323",
        "Quicksand",
        "Inconsolata",
      ],
      selectedFont: "Times New Roman",

      contextMenuVisible: false,
      contextMenuPosition: { top: 0, left: 0 },

      // rangeInputs: [
      //   { id: "range1", min: 0, max: 100 },
      //   { id: "range2", min: 0, max: 100 },
      // ],
      // numberInput: 0,
      // isRTL: document.documentElement.dir === "rtl",
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
      this.selectedLayer = this.layers.find(
        (layer) => layer.object === activeObject
      );
      if (this.selectedLayer) {
        this.selectedLayer.selected = true;
      }
    });
  },

  // computed: {
  //   selectedLayer() {
  //     return this.layers.find(layer => layer.selected);
  //   }
  // },

  methods: {
    // Подгрузка проекта
    loadProject() {
      // Получаем имя проекта из параметров маршрута
      this.projectName = this.$route.params.projectName;
      // Формируем путь к файлу проекта
      this.projectFilePath = `C:/Users/Stoypik/Downloads/${this.projectName}.json`;

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
          console.log("fetch");
          this.projectData = data;
          // Восстанавливаем состояние холста и слои из данных проекта
          this.restoreCanvasState();
        })
        .catch((error) => {
          console.error("Ошибка загрузки проекта:", error);
        });
    },

    viewFigure() {
      this.showFigureMenu = !this.showFigureMenu;
      console.log("viewFigure");
    },

    openDialog() {
      this.$refs.diaOptions.style.visibility = "visible";
      this.$refs.diaOptions.showModal();
    },
    closeDialog() {
      this.$refs.diaOptions.style.visibility = "hidden";
      this.$refs.diaOptions.close();
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
            // object.type = layerData.name;
            // object.selected = false;
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
      console.log(rect.type);
      this.canvas.add(rect);
      this.addLayer(rect);
      this.viewFigure();
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
      console.log(circle.type);
      this.canvas.add(circle);
      this.addLayer(circle);
      this.viewFigure();
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
              // type: "img",
            });
            console.log(fabricImage.type);
            this.canvas.add(fabricImage);
            this.addLayer(fabricImage);
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      };
      input.click();
      this.viewFigure();
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
        console.log(layer.object.type);
        this.canvas.setActiveObject(layer.object);
        this.canvas.renderAll();
        event.preventDefault(); // Убираем отображение стандартного контекстного меню браузера
        this.contextMenuPosition = { top: event.clientY, left: event.clientX };
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
      const text = new fabric.Textbox("", {
        left: 50,
        top: 50,
        width: 150,
        fill: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)})`,
        fontSize: 20,
        fontFamily: this.selectedFont, // применяем выбранный шрифт
      });
      console.log(text.type);
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
      if (action == "edit") this.editNameLayer();
      if (action == "delete") this.deleteEl();
      console.log("Выполнено действие:", action);
      this.hideContextMenu();
    },

    editNameLayer() {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        const text = prompt("Введите новое имя:", activeObject.text);
        if (text) {
          activeObject.set("text", text);
          this.canvas.requestRenderAll();
        }
      }
    },
  },
};
</script>

<style scoped>
body {
  display: flex;
  background-color: #a7a7a7;
}
.leftPanel {
  margin: 8px 25px 8px 8px;
  height: 96vh;
  width: 12vw;
}
.nameProj {
  background-color: #bcbcbc;
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
  background-color: #2c2c2c;
  margin-top: 29px;
  border-radius: 12px;
  height: 89vh;
}
.layer {
  cursor: pointer;
  background-color: #8f8f8f;
  padding: 2px 5px 2px 5px;
  color: #ffffff;
  border-radius: 10px;
  width: 10vw;
  display: flex;
  flex-direction: row;
}
.lay {
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.settingsElement {
  height: 29vh;
  margin-top: 15px;
  background-color: #2c2c2c;
  border-radius: 12px;
}
.canav {
  width: 1280px;
  height: 720px;
  background-color: #ffffff;
}
canvas {
  border: 2px solid #000000;
}

.buttunsGrid {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 1280px;
  height: 34px;  
  margin-top: 0px;
  background-color: #2c2c2c;
  border-radius: 8px 8px 0 0;
}
.btnss {
  font-size: 16px;
  margin: 5px;
  justify-content: space-between;
  height: 25px;
  border-radius: 10px;
  border: none;
  border-inline: none;
  background-color: #2c2c2c;
}
.btnss:hover {
  cursor: pointer;
  background-color:#0c8ce9;
}


/* .listBtn {
  background-color: #0c8ce9;
} */
/* select {
  max-height: 20px;
  margin-top: 6px;
} */

.querySelectionPanel {
  width: 40vw;
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
  color: #ffffff;
  border-radius: 12px;
}
.queryPanel {
  padding: 0;
  margin: 5px 16px;
}
.textareaQuery {
  width: 39vw;
  background-color: #ffffff;
  border-radius: 12px;
}
.textAr {
  padding-left: 7px;
  border: none;
  border-inline: none;
  border-radius: 12px;
  resize: none;
  width: -webkit-fill-available;
  margin: 3px;
}
textarea:active {
  border: none;
  border-inline: none;
}
.rigthSettingAndPhoto {
  /* width: 46vw; */
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.btnsSetting {
  margin-top: 8px;
  width: 200px;
  height: 35px;
  background-color: #ffffff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rigthPhoto {
  width: 26vw;
  background-color: #ffffff;
  border-radius: 12px;
  height: 16vh;
  margin-top: 10px;
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

.dialogNew {
  border: none;
  display: flex;
  border-radius: 20px;
  flex-direction: column;
  align-items: center;
  visibility: hidden;
}

.additionalMenu {
  display: flex;
  position: absolute;
  background-color: #2c2c2c;
  border-radius: 10px;
  margin: 33px 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  flex-direction: column;
  align-items: flex-start;
}

.imgIcons {
  width: 20px;
}

.rightPanel {
  width: auto;
  height: auto;
}

.elementSeting {
  background-color: #bbb;
}

</style>

