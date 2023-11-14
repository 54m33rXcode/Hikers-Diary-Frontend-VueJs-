<template>
     <div class="category">
      <h3>Categories</h3>
      <div class="buttons">
        <button style="background-color: purple;"  @click="selectCategory('All')">All</button>
        <button  @click="selectCategory('Ask')">Ask</button>
        <button @click="selectCategory('Adventure')">Adventure</button>
        <button @click="selectCategory('Culture')">Culture</button>
        <button @click="selectCategory('Event')">Event</button>
        <button @click="selectCategory('Invitation')">Invitation</button>
        <button @click="selectCategory('Photography')">Photography</button>
        <button @click="selectCategory('Recommendation')">Recommendation</button>
        <button @click="selectCategory('Story')">Story</button>
        <button @click="selectCategory('Tour Packages')">Tour Packages</button>
      </div>
     </div>
</template>

<script>
import { useCategoryStore } from '@/store/categoryStore';
    export default {
      data() {
        return {
          categoryName: 'All'
        };
      },
      methods: {
        selectCategory(category) {
        const categoryStore = useCategoryStore();
        categoryStore.setSelectedCategory(category);
      },
      }
    }
</script>

<style>
.category{
  height: 316px;
  width: 298px;
  margin-right: 2px;
  margin-left: 3px;
}

.buttons{
  width: 291px;
    height: 220px;
}
.buttons button{
  height: 35px;
  width: auto;
  padding: 15px;
  border-radius: 10px;
  margin: 10px;
  text-align: center;
  align-content: center;
  line-height: 0px;
  cursor: pointer;
}
</style>