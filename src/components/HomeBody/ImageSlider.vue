<template>
    <div class="slider">
      <div class="slider-inner" :style="{ transform: 'translateX(' + -index * 100 + '%)' }">
        <div class="slider-item" v-for="(photo, i) in photos" :key="i">
          <img :src="photo.photoUrl" alt="">
        </div>
      </div>
      <button class="slider-button slider-button-prev" @click="prevImage" :disabled="index === 0"> {{ '<' }} </button>
      <button class="slider-button slider-button-next" @click="nextImage" :disabled="index === photos.length - 1">></button>
      
    </div>
    
  </template>
  
  <script>
  export default {
    name: "ImageSlider",
    props: {
      photos: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        index: 0,
      };
    },
    methods: {
      prevImage() {
        if (this.index > 0) {
          this.index--;
        }
      },
      nextImage() {
        if (this.index < this.photos.length - 1) {
          this.index++;
        }
      },
    },
  };
  </script>
  
  <style>
  .slider {
  position: relative;
  overflow: hidden;
}

.slider-inner {
  display: flex;
  transition: transform 0.5s;
}

.slider-item {
  flex-shrink: 0;
  width: 100%;
  height: auto;
}

.slider-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.5rem;
  font-size: 1.5rem;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  cursor: pointer;
}

.slider-button-prev {
  left: 0;
}

.slider-button-next {
  right: 0;
}
.slider-counter {
  text-align: center;
}
  </style>
  