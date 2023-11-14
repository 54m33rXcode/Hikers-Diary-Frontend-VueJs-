import { defineStore } from 'pinia';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    selectedCategory: 'All',
  }),
  actions: {
    setSelectedCategory(category) {
      this.selectedCategory = category;
    },
  },
});
