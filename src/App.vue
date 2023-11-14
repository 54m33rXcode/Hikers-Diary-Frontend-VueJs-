<template>
 
  <navigation v-if="ShowNavigation"/>
  <router-view></router-view>

</template>
<script>
import navigation from './components/navigationNavi.vue'



export default {
  name: 'App',
  components: {
  navigation
  },
  computed:{
    ShowNavigation(){
      return this.$route.path !== '/login' && this.$route.path !== '/register';
    }
  }
}
</script>

<style>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  background-color: #baa8c8;
}
</style>
