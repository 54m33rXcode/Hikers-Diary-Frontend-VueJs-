import { reactive, provide, inject } from 'vue';


const hashtagStore = reactive({
  selectedHashtag: '',
});

const provideHashtagStore = () => {
  provide('hashtagStore', hashtagStore);
};


const useHashtagStore = () => {
  const store = inject('hashtagStore');
  if (!store) {
    throw new Error('useHashtagStore must be used within a component with provideHashtagStore');
  }
  return store;
};

export { provideHashtagStore, useHashtagStore };