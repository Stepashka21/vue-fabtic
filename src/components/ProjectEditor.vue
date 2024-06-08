<template>
  <div class="alls">
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
          <button class="btnss" @click="addImg">
            <img class="imgIcons" :src="require('/src/assets/img.png')" />
          </button>
        </div>

        <div class="listBtn">
          <button class="btnss" @click="startSelection">
            <img
              class="imgIcons"
              :src="require('/src/assets/img.png')"
            />Выбрать область
          </button>
        </div>
        <div class="listBtn">
          <button class="btnss" @click="confirmSelection">
            <img
              class="imgIcons"
              :src="require('/src/assets/img.png')"
            />Подтвердить выбор
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
      </div>

      <div class="canav">
        <canvas
          ref="canvas"
          width="1280"
          height="720"
          @click="deselectAll"
          @dragover.prevent
          @drop="handleDrop"
        ></canvas>
      </div>
    </div>

    <div class="rightPanel">
      <button @click="viewDocs()"><p>!Документация</p></button>
      <div class="elementSeting">
        <div v-if="selectedLayer && selectedLayer.object">
          <div class="viewSetings">
            <p>Выбранный элемент: {{ selectedLayer.name }}</p>
            <p>Тип объекта: {{ selectedLayer.object.type }}</p>

            <label>Name:</label><br />
            <input type="text" v-model="layerName" id="name" /><br />

            <!-- Параметры для текста -->
            <label>Width:</label><br />
            <input
              v-model="layerWidth"
              type="number"
              @change="updateLayerProperty('width', layerWidth)"
            /><br />
            <label>Height:</label><br />
            <input
              v-model="layerHeight"
              type="number"
              @change="updateLayerProperty('height', layerHeight)"
            /><br />

            <!-- Параметры для объектов с цветом заливки -->
            <div v-if="selectedLayer.object.type !== 'image'">
              <label>Color:</label><br />
              <input type="color" v-model="layerColor" id="color" /><br />
              <label>Opacity:</label><br />
              <input
                type="range"
                v-model="layerOpacity"
                value="0"
                max="1"
                step="0.05"
                id="opacity"
              /><br />
            </div>

            <!-- Параметры для текста -->
            <div v-if="selectedLayer.object.type === 'textbox'">
              <label>Font:</label><br />
              <select v-model="layerFont" @change="applyFont">
                <option v-for="font in fonts" :value="font" :key="font">
                  {{ font }}
                </option></select
              ><br />
              <label>Font Size:</label><br />
              <input
                v-model="layerFontSize"
                type="number"
                @change="updateLayerProperty('fontSize', layerFontSize)"
              /><br />
              <div class="btnBlock">
                <button class="btns" @click="toggleBold">
                  <img
                    class="imgBtns"
                    :src="require('/src/assets/zhirnuy.png')"
                  />
                </button>
                <button class="btns" @click="toggleUnderline">
                  <img
                    class="imgBtns"
                    :src="require('/src/assets/podcherk.png')"
                  /></button
                ><br />
                <button class="btns" @click="toggleItalic">
                  <img
                    class="imgBtns"
                    :src="require('/src/assets/kursiv.png')"
                  />
                </button>
              </div>
              <div class="textAlignButtons">
                <label>Горизонтальное выравнивание:</label><br />
                <div>
                  <button :class="{'active': selectedTextAlign === 'left'}" @click="setTextAlign('left')">Слева</button>
                  <button :class="{'active': selectedTextAlign === 'center'}" @click="setTextAlign('center')">По центру</button>
                  <button :class="{'active': selectedTextAlign === 'right'}" @click="setTextAlign('right')">Справа</button>
                  <button :class="{'active': selectedTextAlign === 'justify'}" @click="setTextAlign('justify')">По ширине</button>
                </div>
              </div>

              <!-- Кнопки вертикального выравнивания -->
              <div class="textVerticalAlignButtons">
                <label>Вертикальное выравнивание:</label><br />
                <div>
                  <button :class="{'active': selectedVerticalAlign === 'top'}" @click="setVerticalAlign('top')">Сверху</button>
                  <button :class="{'active': selectedVerticalAlign === 'center'}" @click="setVerticalAlign('center')">По центру</button>
                  <button :class="{'active': selectedVerticalAlign === 'bottom'}" @click="setVerticalAlign('bottom')">Снизу</button>
                </div>
              </div>
            </div>

            <button class="btnsss" @click="saveSettings">
              <p style="color: #ffffff; padding: 0; margin: 0">
                Сохранить настройки
              </p>
            </button>
          </div>
        </div>
      </div>
      <button class="btnss" @click="saveProject">
        <p style="color: #ffffff; padding: 0; margin: 0">Сохранить проект</p>
      </button>

      <button class="btnss" @click="saveCanvasAsImage">
        <p style="color: #ffffff; padding: 0; margin: 0">
          Сохранить как картинку
        </p>
      </button>

      <button class="btnss" @click="deleteEl">
        <p style="color: #ffffff; padding: 0; margin: 0">Удалить элемент</p>
      </button>

      <button class="btnss" @click="clearCanvas">
        <p style="color: #ffffff; padding: 0; margin: 0">Очистить холст</p>
      </button>
    </div>

    <dialog ref="diaOptions" class="dialogNew">
      <div>
        <h1>Просто кнопка с диалоговым окном</h1>
      </div>
      <button class="closeDialog" @click="closeDialog()">Вернуться</button>
    </dialog>

    <dialog ref="diaDocs" class="dialogNew">
      <div>
        <h1>Информация</h1>
      </div>
      <button class="closeDialog" @click="closeDocs()">Вернуться</button>
    </dialog>

    <dialog
      ref="showDialog"
      :jsonData="jsonData"
      @receiveData="handleReceiveData"
    >
      <h1>Передаваемая область</h1>
      <button class="closeShowDialog" @click="closeShowDialog()">
        Вернуться
      </button>
    </dialog>
    <DialogComp v-if="showDialog" />
  </div>
</template>
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js"></script>
  
<script>
import { fabric } from "fabric";
import FontFaceObserver from "fontfaceobserver";
import draggable from "vuedraggable";
import DialogComp from "./DialogComp.vue";
import ListProject from "./ListProject.vue";

export default {
  name: "ProjectEditor",

  components: {
    draggable,
    DialogComp,
    ListProject,
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
      showFigureMenu: false,
      showDialog: false,
      jsonData: null,
      selectionPosition: null,
      selectionRect: null, // определение selectionRect
      fonts: [
        "Times New Roman",
        "Pacifico",
        "VT323",
        "Quicksand",
        "Inconsolata",
      ],
      selectedFont: "Times New Roman",
      contextMenuPosition: { top: 0, left: 0 },
      layerName: "",
      layerColor: "",
      layerOpacity: "",
      layerWidth: "",
      layerHeight: "",
      layerFont: "",
      layerFontSize: "",
      selectedTextAlign: "left",
      selectedVerticalAlign: "top",
    };
  },

  mounted() {
    document.addEventListener("dragover", (e) => e.preventDefault(), false);
    document.addEventListener("drop", (e) => e.preventDefault(), false);

    this.canvas = new fabric.Canvas(this.$refs.canvas, {
      isDrawingMode: false,
    });
    this.loadProject();

    this.canvas.on("selection:created", this.handleSelection);
    this.canvas.on("selection:updated", this.handleSelection);
    this.canvas.on("selection:cleared", this.clearSelection);
  },
  methods: {
    handleDrop(event) {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            fabric.Image.fromURL(e.target.result, (img) => {
              img
                .set({
                  left: 100,
                  top: 100,
                })
                .scaleToWidth(200);
              this.canvas.add(img);
              this.addLayer(img);
            });
          };
          reader.readAsDataURL(file);
        }
      }
    },

    updateObject() {
      if (this.selectedLayer && this.selectedLayer.object) {
        const object = this.selectedLayer.object;
        object.setCoords();
        this.canvas.renderAll();
      }
    },

    loadProject() {
      this.projectName = this.$route.params.projectName;
      this.projectFilePath = `/projects/${this.projectName}.json`;

      fetch(this.projectFilePath)
        .then((response) => {
          if (!response.ok) throw new Error("Файл не найден");
          return response.json();
        })
        .then((data) => {
          this.projectData = data;
          this.restoreCanvasState();
        })
        .catch((error) => console.error("Ошибка загрузки проекта:", error));
    },
    addLayer(object) {
      const layer = { name: object.type, object, selected: false };
      this.layers.unshift(layer);
    },
    restoreCanvasState() {
      if (!this.projectData) return;
      this.canvas.loadFromJSON(this.projectData.canvas, () => {
        this.canvas.renderAll();
      });
      setTimeout(() => {
        if (this.projectData.layers && Array.isArray(this.projectData.layers)) {
          this.projectData.layers.forEach((layerData) => {
            const object = this.canvas.item(layerData.index);
            if (object) this.addLayer(object);
          });
        }
      }, 0);
    },
    viewFigure() {
      this.showFigureMenu = !this.showFigureMenu;
    },
    viewDocs() {
      this.$refs.diaDocs.style.visibility = "visible";
      this.$refs.diaDocs.showModal();
    },
    closeDocs() {
      this.$refs.diaDocs.style.visibility = "hidden";
      this.$refs.diaDocs.showModal();
    },
    openDialog() {
      this.$refs.diaOptions.style.visibility = "visible";
      this.$refs.diaOptions.showModal();
    },
    closeDialog() {
      this.$refs.diaOptions.style.visibility = "hidden";
      this.$refs.diaOptions.close();
    },
    openShowDialog() {
      this.$refs.showDialog.style.visibility = "visible";
      this.$refs.showDialog.showModal();
    },
    closeShowDialog() {
      this.$refs.showDialog.style.visibility = "hidden";
      this.$refs.showDialog.close();
    },
    above(ev) {
      this.layers[ev.newIndex].object.moveTo(
        this.layers.length - ev.newIndex - 1
      );
    },
    addRectangle() {
      const rect = new fabric.Rect({
        id: this.generateId(),
        name: "Rectangle",
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
            });
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
      return Math.random().toString(36).substr(2, 9);
    },
    addListeners(layer) {
      layer.object.onSelect = () => {
        this.selectedLayer = layer;
        layer.selected = true;
      };
      layer.object.onDeselect = () => {
        layer.selected = false;
        this.selectedLayer = null;
      };
    },
    deselectAll() {
      this.canvas.discardActiveObject();
      this.selectedLayer = null;
      this.canvas.renderAll();
    },
    selectLayer(layer) {
      if (layer.object) {
        console.log(layer.object);
        this.selectedLayer = layer;
        this.layerName = layer.name;
        this.layerWidth = layer.object.width * layer.object.scaleX;
        this.layerHeight = layer.object.height * layer.object.scaleY;
        this.layerColor = layer.object.fill;
        this.layerOpacity = layer.object.opacity;
        if (layer.object.type === "textbox") {
          this.layerFont = layer.object.fontFamily;
          this.layerFontSize = layer.object.fontSize;
        } else {
          this.layerFont = null;
          this.layerFontSize = null;
        }
        this.canvas.setActiveObject(layer.object);
        this.canvas.renderAll();
      }
    },
    saveProject() {
      const canvasData = this.canvas.toJSON();
      const layersData = this.layers.map((layer) => ({
        name: layer.name,
        index: this.canvas.getObjects().indexOf(layer.object),
      }));
      const projectData = {
        canvas: canvasData,
        layers: layersData,
      };
      const jsonData = JSON.stringify(projectData);
      const blob = new Blob([jsonData], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = this.projectName + ".json";
      link.click();
      URL.revokeObjectURL(link.href);
    },
    saveCanvasAsImage() {
      const dataURL = this.canvas.toDataURL();
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "canvas_image.png";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
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
        height: 100, 
        fill: "red",
        fontSize: 20,
        fontFamily: this.selectedFont,
        underline: false,
        fontWeight: "normal",
        fontStyle: "normal",
        textAlign: this.selectedTextAlign,
        originY: 'top' 
      });
      this.canvas.add(text);
      this.addLayer(text);
      this.setVerticalAlign(this.selectedVerticalAlign); 
    },
    applyFont() {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        activeObject.set("fontFamily", this.selectedFont);
        this.canvas.renderAll();
      }
    },
    // Метод для переключения подчеркивания текста
    toggleUnderline() {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        activeObject.set("underline", !activeObject.underline);
        this.canvas.renderAll();
      }
    },

    // Метод для переключения жирного шрифта
    toggleBold() {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        activeObject.set(
          "fontWeight",
          activeObject.fontWeight === "bold" ? "normal" : "bold"
        );
        this.canvas.renderAll();
      }
    },

    // Метод для переключения курсивного шрифта
    toggleItalic() {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        activeObject.set(
          "fontStyle",
          activeObject.fontStyle === "italic" ? "normal" : "italic"
        );
        this.canvas.renderAll();
      }
    },
    // Метод для применения горизонтального выравнивания
    setTextAlign(align) {
    this.selectedTextAlign = align;
    this.applyTextAlign();
  },
  // Метод для установки вертикального выравнивания
  setVerticalAlign(alignment) {
    this.selectedVerticalAlign = alignment;
    const activeObject = this.canvas.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
      let offsetY = 0;
      switch (alignment) {
        case 'top':
          offsetY = 0;
          break;
        case 'center':
          offsetY = (activeObject.height - activeObject.calcTextHeight()) / 2;
          break;
        case 'bottom':
          offsetY = activeObject.height - activeObject.calcTextHeight();
          break;
      }
      activeObject.set('top', activeObject.top + offsetY);
      this.canvas.renderAll();
    }
  },
  applyTextAlign() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
      activeObject.set('textAlign', this.selectedTextAlign);
      this.canvas.renderAll();
    }
  },

  // applyVerticalAlign() {
  //   const activeObject = this.canvas.getActiveObject();
  //   if (activeObject && activeObject.type === 'textbox') {
  //     activeObject.set('originY', this.selectedVerticalAlign);
  //     this.canvas.renderAll();
  //   }
  // },
    // loadAndUse(font) {
    //   const myfont = new FontFaceObserver(font);
    //   myfont.load().then(() => {
    //     const activeObject = this.canvas.getActiveObject();
    //     activeObject.set("fontFamily", font);
    //     this.canvas.requestRenderAll();
    //   }).catch(e => {
    //     console.error(`Font ${font} could not be loaded: ${e.message}`);
    //   });
    // },
    startSelection() {
      // Удаляем предыдущую область, если есть
      if (this.selectionRect) {
        this.canvas.remove(this.selectionRect);
      }

      // Создаем новую квадратную область
      this.selectionRect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: "rgba(0, 0, 0, 0.3)",
        width: 200,
        height: 200,
        hasBorders: true,
        hasControls: true,
        lockUniScaling: true,
        selectable: true,
        lockRotation: true,
      });

      // Добавляем область на холст
      this.canvas.add(this.selectionRect);
      this.canvas.setActiveObject(this.selectionRect);
      this.canvas.renderAll();
    },
    confirmSelection() {
      // Получаем положение и размер выбранной области
      const selection = this.selectionRect.getBoundingRect();
      this.selectionPosition = {
        left: selection.left,
        top: selection.top,
        width: selection.width,
        height: selection.height,
      };

      // Получаем данные холста в формате JSON
      const canvasData = this.canvas.toJSON();

      // Передаем данные в компонент DialogComp
      this.jsonData = JSON.stringify({
        canvasData,
        selection: this.selectionPosition,
      });
      this.showDialog = true;
    },
    requestWindow() {
      // Логика для окна запроса
    },
    negativeRequestWindow() {
      // Логика для негативного запроса
    },
    handleReceiveData(data) {
      // Получаем данные обратно и обновляем холст
      const { canvasData, selection } = JSON.parse(data);

      // Сохраняем положение области
      this.selectionPosition = selection;

      // Загружаем данные холста
      this.canvas.loadFromJSON(canvasData, () => {
        // Выделяем область на холсте
        this.selectionRect.set(selection);
        this.canvas.renderAll();
      });

      // Скрываем диалог
      this.showDialog = false;
    },

    handleSelection(e) {
      const activeObject = e.target;
      const selectedLayer = this.layers.find(
        (layer) => layer.object === activeObject
      );
      if (selectedLayer) {
        this.selectLayer(selectedLayer);
      }
    },

    clearSelection() {
      this.selectedLayer = null;
      this.layerName = "";
      this.layerWidth = "";
      this.layerHeight = "";
      this.layerColor = "";
      this.layerOpacity = "";
      this.layerFont = "";
      this.layerFontSize = "";
    },

    updateLayerProperty(property, value) {
      if (this.selectedLayer && this.selectedLayer.object) {
        const object = this.selectedLayer.object;
        if (property === "width" || property === "height") {
          object.set(property, parseFloat(value));
        } else {
          object.set(property, value);
        }
        this.canvas.renderAll();
      }
    },
    saveSettings() {
      if (this.selectedLayer) {
        const object = this.selectedLayer.object;
        this.selectedLayer.name = this.layerName;
        object.set({
          width: parseFloat(this.layerWidth),
          height: parseFloat(this.layerHeight),
          fill: this.layerColor,
          opacity: parseFloat(this.layerOpacity),
        });
        if (object.type === "textbox") {
          object.set({
            fontFamily: this.layerFont,
            fontSize: parseFloat(this.layerFontSize),
          });
        }
        this.canvas.renderAll();
      }
    },
  },
};
</script>

<style scoped>
.alls {
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
.canvasPanel {
  margin-top: 9px;
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
  width: 1284px;
  height: 34px;
  margin-top: 0px;
  background-color: #2c2c2c;
  border-radius: 8px 8px 0 0;
}
.btnBlock {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.btns {
  background-color: #2c2c2c;
  border: none;
  border-inline: none;
  font-size: 28px;
}
.imgBtns {
  width: 28px;
}
.textAlignButtons div,
.textVerticalAlignButtons div {
  display: flex;
  gap: 10px;
}

.textAlignButtons button,
.textVerticalAlignButtons button {
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: #f5f5f5;
  cursor: pointer;
}

.textAlignButtons button.active,
.textVerticalAlignButtons button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
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
  background-color: #0c8ce9;
}
.btnsss {
  font-size: 16px;
  margin: 5px;
  justify-content: space-between;
  height: 25px;
  border-radius: 10px;
  border: none;
  border-inline: none;
  background-color: #000000;
}
.btnsss:hover {
  cursor: pointer;
  background-color: #0c8ce9;
}

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

.dialogNew {
  height: 660px;
  width: 1180px;
  border: none;
  display: flex;
  border-radius: 15px;
  flex-direction: column;
  align-items: center;
  visibility: hidden;
  background-color: #ffffff;
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
  margin-top: 5px;
}
.viewSetings {
  color: #ffffff;
  margin: 9px;
  padding: 5px;
  background-color: #2c2c2c;
  border-radius: 12px;
}
.generateee {
  font-family: "Times New Roman", Times, serif;
  font-size: medium;
  height: 43px;
  width: 143px;
  border-radius: 8px;
  border: none;
  color: rgba(0, 0, 0, 0.63);
}
</style>

