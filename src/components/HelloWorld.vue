<template>
  <div>
    <canvas ref="can" width="1200" height="700"></canvas>
    <button class="btns" @click="addRect">Квадрат</button>
    <button class="btns" @click="addCircle">Кругг</button>
    <button class="btns" @click="addImg">Картинка</button>
    <button class="btns" @click="saveProject">Сохранить</button>
    <button class="btns" @click="saveCanvasAsImage">Сохранить как картинку</button>
  </div>
</template>

<script>
import { fabric } from "fabric";

export default {
  name: "HelloWorld",

  mounted() {
    this.canvas = new fabric.Canvas(this.$refs.can, {
      isDrawingMode: false,
    });
  },

  methods: {
    //добавление квадрата(прямоугольника)
    addRect() {
      var rect = new fabric.Rect({
        left: 100,
        top: 50,
        fill: "#000000",
        width: 200,
        height: 100,
        objectCaching: false,
        stroke: "lightgreen",
        strokeWidth: 4,
      });

      this.canvas.add(rect);
      this.canvas.setActiveObject(rect);
    },

    //добавление круга
    addCircle() {
      var circle = new fabric.Circle({
        left: 100,
        top: 100,
        fill: "yellow",
        radius: 40,
      });

      this.canvas.add(circle);
      this.canvas.setActiveObject(circle);
    },

    //добавление картинки
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
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      };
      input.click();
      //  this.canvas.setActiveObject();
    },

    saveProject() {

      // Получаем JSON-представление состояния холста
      const jsonData = JSON.stringify(this.canvas.toJSON());

      // Создаем Blob из JSON-данных
      const blob = new Blob([jsonData], { type: 'application/json' });

      // Создаем объект URL для Blob
      const url = URL.createObjectURL(blob);

      // Создаем ссылку для загрузки
      const link = document.createElement('a');
      link.href = url;
      link.download = 'canvas_project.json';

      // Добавляем ссылку в документ
      document.body.appendChild(link);

      // Эмулируем клик для загрузки файла
      link.click();

      // Удаляем ссылку из документа и освобождаем ресурсы
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // const dataJson = JSON.stringify(this.canvas);
      console.log(jsonData);
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
  },
};
</script>

<style>
canvas {
  border: 2px solid #000000;
}

.btns {
  margin: 10px 10px 0 0;
  font-size: 16px;
}
</style>
