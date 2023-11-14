<template>
    <div class="content-provider">
    
        <div class="indicators">
              <router-link to="/" class="nav-link">
                <div :class="{ 'active': activeItem === '/' }">
                    <img src="@/assets/diary.svg" alt="">
                    <span class="diary">Diary</span>
                </div>
              </router-link>
              <router-link to="/following" class="nav-link">
                <div :class="{ 'active': activeItem === '/following' }">
                    <img src="@/assets/follow.svg" alt="">
                    <span class="following">Following</span>
                </div>
              </router-link>

                <router-link to="/upload" class="nav-link">
                  <div :class="{ 'active': activeItem === '/upload' }">
                    <img src="@/assets/upload.svg" alt="">
                    <span class="upload">Upload</span>
                </div>
              </router-link>

            </div>
            <!-- ----------------------end of endicator--------------------- -->
            <div class="suggested">
                <span>Suggested Accounts</span>
            <suggestac/>
            </div>
        </div>
        <div>
            <uploadField/>
        </div>
</template>

<script>
    import suggestac from '@/components/HomeBody/SuggestedAcc.vue'
    import uploadField from '@/components/uploadField.vue'
    export default {
        components:{
            suggestac,uploadField
        },
        created() {
     this.activeItem = this.$route.path;
},
// watch: {
//   '$route' (to, from) {
//     this.activeItem = to.path;
//   }
// }
    }
</script>

<style>
.active {
  background-color: #cddfd6;
}

</style>