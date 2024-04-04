<template>
  <div class="layer-panel">
    <div v-for="(layer, index) in layers" :key="index" 
         class="layer-item" 
         :class="{ active: activeLayer === index }"
         @click="selectLayer(index)">
      {{ index + 1 }}. {{ layer.type }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'LayerPanel',
  props: {
    layers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeLayer: -1
    }
  },
  methods: {
    selectLayer(index) {
      this.activeLayer = index;
      this.$emit('select-layer', this.layers[index]);
    }
  }
}
</script>

<style>
.layer-panel {
  width: 200px;
  background-color: #f0f0f0;
  padding: 10px;
}

.layer-item {
  padding: 5px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}

.layer-item.active {
  background-color: #ddd;
}
</style>
