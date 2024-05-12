<template>
    <div>
      <input type="range" v-for="input in rangeInputs" :key="input.id" :id="input.id" :min="input.min" :max="input.max" @input="handleInputChange">
      <input type="number" v-model="numberInput" @input="handleInputChange">
    </div>
  </template>
  
  <script>
  export default {
    props: {
      rangeInputs: {
        type: Array,
        required: true,
      },
      numberInput: {
        type: Number,
        required: true
      },
      isRTL: {
        type: Boolean,
        required: true
      }
    },
    mounted() {
      const observer = new MutationObserver(this.callback);
      observer.observe(document.documentElement, { attributes: true });
    },
    methods: {
      handleInputChange(e) {
        let target = e.target;
        if (e.target.type !== 'range') {
          target = document.getElementById('range');
        }
        const min = target.min;
        const max = target.max;
        const val = target.value;
        let percentage = (val - min) * 100 / (max - min);
        if (this.isRTL) {
          percentage = (max - val);
        }
  
        target.style.backgroundSize = percentage + '% 100%';
      },
      callback(mutationList, observer) {
        mutationList.forEach(mutation => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'dir') {
            this.isRTL = mutation.target.dir === 'rtl';
          }
        });
      }
    }
  }
  </script>
  
  <style scoped>
  /* стили */
  </style>
  