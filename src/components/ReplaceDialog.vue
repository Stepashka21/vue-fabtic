<template>
  <div>
    <h2>Layers</h2>
    
    <draggable v-model='layers' @end='above'>
      <div v-for='(layer, index) in layers' :key='index'>
        <span>{{layer.name}} / {{ layer.selected ? "selected" : "deselected" }}</span>
      </div>
    </draggable>

    <canvas ref="canvas" width="800" height="600" @click="deselectAll"></canvas>
    <div>
      <button @click="addRectangle">Добавить квадрат</button>
      <button @click="addCircle">Добавить круг</button>
    </div>

    <button @click="goToListProject">Вернуться к списку проектов</button>
    <div class="settings">
      <input type="color" id="colorDestination" value="#23278a" @change="changeColor">
    </div>
  </div>
</template>

<script>
import { fabric } from 'fabric';
import draggable from 'vuedraggable'
export default {

  components: {
    draggable,
  },

  data() {
    return {
      canvas: null,
      layers: [],
      selectedLayer: null, 
    };
  },
  mounted() {
    // this.canvas = new fabric.Canvas(this.$refs.canvas);
    // this.canvas.on('object:selected', console.log)
    this.canvas = new fabric.Canvas(this.$refs.canvas);
    this.canvas.on('object:selected', (e) => {
      this.selectedLayer = this.layers.find(layer => layer.object === e.target);
    });
    this.canvas.on('selection:cleared', () => {
      this.selectedLayer = null;
    });
  },
  methods: {
    changeColor(event) {
      console.log("Selected Layer:", this.selectedLayer);
      const color = event.target.value;
    if (this.selectedLayer && this.selectedLayer.object) {
      this.selectedLayer.object.set('fill', color);
      this.canvas.renderAll();
      }
    },

    goToListProject() {
      this.$router.push({ name: 'ListProject' });
    },

    above(ev) {
      this.layers[ev.newIndex].object.moveTo(this.layers.length - ev.newIndex - 1)
      console.log(ev)
    },
    addRectangle() {
      var iD = "rect" + Math.random().toString(16).slice(2)
      const rect = new fabric.Rect({
        id: iD, 
        name: "rect",
        width: 100,
        height: 100,
        fill: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
        left: 10,
        top: 10,
        selectable: true
      });
      console.log(rect.id);
      console.log(rect.name);
      this.canvas.add(rect);
      this.addLayer(rect);
    },
    addCircle() {
      var iD = "circle" + Math.random().toString(16).slice(2)
      const circle = new fabric.Circle({
        id: iD,
        name: "circle",  
        radius: 50,
        fill: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
        left: 50,
        top: 50,
        selectable: true, 
      });
      console.log(circle.id);
      console.log(circle.name);
      this.canvas.add(circle);
      this.addLayer(circle);
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
    // selectObject(object) {
    //   this.deselectAll();
    //   if (object && object.isType('object')) {
    //     object.set('active', true);
    //     this.selectedLayer = this.layers.find(layer => layer.object === object);
    //     this.canvas.renderAll();
    //   }
    // },
    deselectAll() {
      this.canvas.discardActiveObject();
      this.selectedLayer = null;
      this.canvas.renderAll();
    },
    // selectLayer(layer) {
    //   this.deselectAll();
    //   if (layer.object) {
    //     layer.object.set('active', true);
    //     this.canvas.setActiveObject(layer.object);
    //     this.canvas.renderAll();
    //   }
    // }
  }
};
</script>


<style>
body {
  background-color: #ffffff;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  cursor: pointer;
  margin-bottom: 10px;
}
canvas {
  border: 1px solid #000;
}
button {
  margin-top: 10px;
}
</style>
