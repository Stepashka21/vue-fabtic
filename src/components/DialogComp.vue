<template>
  <div>
    <canvas class="canvasInpaint" width="700" height="500"></canvas>
   
    <button @click="sendDataBack">Отправить данные обратно</button>
  </div>
</template>

<script>
export default {
  name: "ProjectEditor",
  props: {
    jsonData: {
      type: String,
      required: true
    }
  },
  
  methods: {
    sendDataBack() {
      // Здесь можно добавить логику для обработки данных перед отправкой обратно
      this.$emit('receiveData', this.jsonData);
    }
  }

}
</script>

<style scoped>

</style>