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
            <!-- ----------------------end of indicator--------------------- -->
            <div class="suggested">
                <span>Suggested Accounts</span>
            <suggestac/>
            </div>
        </div>
        <div class="main-content">
          <feeds/>
        </div>
    <div class="Third_section">
        <categories/>
        <hashtag/>
     </div>
    
    
</template>

<script>
    import suggestac from '@/components/HomeBody/SuggestedAcc.vue'
    import feeds from '@/components/HomeBody/feeds.vue'
    import categories from'@/components/HomeBody/Category.vue'
    import hashtag from'@/components/HomeBody/Hashtag.vue'
    export default {
        name: "content",
        components:{
            suggestac,feeds,categories,hashtag
        },
        methods:{
          moreSuggestion(){

          }
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
  color: black;
}
.nav-link{
  text-decoration: none;
}
.content-provider{
  height: auto;
  width: 301px;
  margin-right: 15px;
  padding: 3px;
  position: fixed;
  overflow-y: auto;
  bottom: 0px;
  top: 75px;
  left: 8px;
  background-color: #ECECEC;
}

.indicators{
  height: 160px;
  width: 298px;
}
.indicators div{
  height: 40px;
  width: 284px;
  padding:3px;
  border: solid #a1a1ef 0.1px;
  display: flex;
  align-items: center;
  margin-left: 4px;
  cursor: pointer;
  margin-top: 4px;
}
.indicators div:hover{
  background-color: #cddfd6;
  transition: 0.9s;
}
.indicators img{
  height: 20px;
  width: 20px;
  margin: 6px;
}
.indicators span{
  font-size: 18px;
  font-weight: bolder;
  text-decoration: none;
}
 /* ----------------------end of endicator---------------------  */
 .suggested{
  height: auto;
  width: 298px;
  margin-top: 15px;
  margin-right: 5px;
}
.suggested span{
  font-size: 16px;
  font-weight: bolder;
  text-align: center;
  margin: 10px;
}
/* ------------------------------ */
.main-content{
    height: auto;
    width: 676px;
    position: fixed;
    overflow-y: auto;
    bottom: 0px;
    top: 75px;
    left: 344px;
    right: 5px;
    background-color: #F2F2F2;
}

.Third_section{
  height: auto;
  width: 301px;
  padding: 3px;
  position: fixed;
  overflow-y: auto;
  bottom: 0px;
  top: 75px;
  right: 8px;
  background-color: #ECECEC;
}


::-webkit-scrollbar {
  width: 6px; 
  height: 8px; 
  display: none;
}

::-webkit-scrollbar-thumb {
  background-color: #888; 
}

::-webkit-scrollbar-thumb:hover {
  background-color: #555; 
}


::-webkit-scrollbar-track {
  background-color: #f1f1f1 
}
</style>