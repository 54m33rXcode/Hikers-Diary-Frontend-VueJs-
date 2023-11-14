<template>
        
    <div class="post-card" v-for="post in posts" :key="post.post.postId">
                <div class="card-head">
                    <div class="pic">
                      <img :src="post.user.profile_Pic" alt="">
                    </div>
                    <div class="name-time">
                      <span class="naam">{{ post.user.userName }}</span>
                      <span class="time">{{ post.post.datePosted }}</span>
                    </div>
                    <button class="card-follow" @click="followUser(post)"> {{ post.followed ? 'Unfollow' : 'Follow' }}</button>
                   <div class="post_category">
                    <span v-for="category in post.categories" :key="category.categoryId" class="Cat_gory">{{ category.categoryName }}</span>
                   </div>  
                </div>
              <div class="card-write" v-if="post.post.postContent">
              <p v-if="showFullContent">{{ post.post.postContent }}</p>
              <p v-else>{{ truncatedContent(post.post.postId) }} <span v-if="post.post.postContent.length > 190" @click="showFullContent = true">See more</span></p>
              <p v-if="showFullContent"><span @click="showFullContent = false">See less</span></p>
    
            </div>
            <div class="images-place" v-if="post.photos.length > 0">
              <ImageSlider :photos="post.photos" />
            </div>
             <div class="card-footer">
              <div
                  class="like"
                  :class="{ liked: post.isLikedByCurrentUser }"
                  @click="likePost(post)"
                >
                  <img src="@/assets/heart.svg" alt="">
                  <span>{{ post.totalLikes }}</span>
                </div>

                <div class="comment">
                  <img src="@/assets/comment.svg" alt="" @click="post.showComment = true">
                  <span>{{ post.commentCount }}</span>
                </div>

                <div class="download"  v-if="post.post.mapUrl">
                  <img src="@/assets/maps-location.svg" alt="" @click="downloadMap(post.post.mapUrl)">
                  <span>Download map</span>
                </div> 
                
              </div>
              <div class="comment-box" v-if="post.showComment">
                <div class="c-chead">
                  <span class="c-cancel" @click="post.showComment = false">X</span>
                  <span class="c-naming">Comments</span>
                </div>
                <showComment :postId="post.post.postId"/>
                <submitComment :postId="post.post.postId" :currentUserId="userStore.user.userId"/>
              </div>

            </div>
</template>

<script>
import { useUserStore } from '@/store/userStore';
import { useCategoryStore } from '@/store/categoryStore';
import { watch } from 'vue';
import axios from 'axios';
import showComment from '@/components/HomeBody/showComment.vue'
import submitComment from '@/components/HomeBody/submitComment.vue'
import ImageSlider from "@/components/HomeBody/ImageSlider.vue";
import EventBus from '@/store/eventBus.js';

    export default {
        name: "feeds",
        data(){
            return{
              posts: [],
              showFullContent: false,
              userStore: useUserStore(),
            }
        },
        async mounted() {
          try {
                const categoryStore = useCategoryStore();

                
                watch(() => categoryStore.selectedCategory, async (newValue) => {
                  
                  await this.fetchPosts(newValue);
                });

              
                await this.fetchPosts(categoryStore.selectedCategory);
              } catch (error) {
                console.error(error);
              }
          },

          created() {
              EventBus.on('load-posts-by-hashtag', (hashtagName) => {
                this.loadPostsByHashtag(hashtagName);
              });
            },

     methods:{
      async fetchPosts(category) {
        try {
             
              let apiUrl = `https://localhost:44384/api/CombinedPost`
              if (category !== 'All') {
                apiUrl = `https://localhost:44384/api/CombinedPost/category/${category}`;
              }

               const response = await axios.get(apiUrl);
          
                this.posts = await Promise.all(response.data.map(async (post) => {
                const isLikedResponse = await axios.get(`https://localhost:44384/api/Like/${post.post.postId}/likedBy/${this.userStore.user.userId}`)
                post.isLikedByCurrentUser = isLikedResponse.data; 


                const likesResponse = await axios.get(`https://localhost:44384/api/Like/post/${post.post.postId}`);
                post.totalLikes = likesResponse.data.length; 
                console.log(likesResponse.data)

                const followResponse = await axios.get(`https://localhost:44384/api/Follow/user/${this.userStore.user.userId}/isfollower/${post.post.posterId}`)
                
                post.followed = followResponse.data
                return post;
              }));
            }
            catch (error) {
              console.error(error);
            }
    },
           
    truncatedContent(postId) {
      const post = this.posts.find(post => post.post.postId === postId);
      if (post && post.post.postContent.length > 190) {
        return post.post.postContent.substring(0, 190) + '...';
      } else {
        return post.post.postContent;
      }
    },
    async likePost(post) {
      try {
        if (post.isLikedByCurrentUser) {
        
          await axios.delete(`https://localhost:44384/api/Like/${post.post.postId}/${this.userStore.user.userId}`);
          post.isLikedByCurrentUser = false;
          post.totalLikes--;
        } else {
          
          await axios.post(`https://localhost:44384/api/Like`, {
            likeId:0,
            postId: post.post.postId,
            likerId: this.userStore.user.userId
          });
          post.isLikedByCurrentUser = true;
          post.totalLikes++;
        }
      
      } catch (error) {
        console.error(error);
      }
    },
    async followUser(post) {
      try {
        const followUrl =  `https://localhost:44384/api/Follow/user/${this.userStore.user.userId}/follow/${post.post.posterId}?followId=${this.userStore.user.userId}&Following_Id=${post.post.posterId}`
        const unfollowUrl = `https://localhost:44384/api/Follow/user/${this.userStore.user.userId}/unfollow/${post.post.posterId}?followId=${this.userStore.user.userId}`;

        if (post.followed) {
          await axios.delete(unfollowUrl);
          post.followed = false;
        } else {
          await axios.post(followUrl);
          post.followed = true;
        }
      } catch (error) {
        console.error(error);
      }
    },

    async downloadMap(mapurl) {
      try {
        const response = await axios.get(` https://localhost:44384/api/Post/download-map?uniqueFileName=${mapurl}`, {
          responseType: 'blob',
        });
        console.log(response.data)
        const blob = new Blob([response.data], { type: 'application/octet-stream' });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = mapurl;
        link.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading map:', error);
        
      }
    },


    async loadPostsByHashtag(hashtagName) {
      try {
        const response = await axios.get(`https://localhost:44384/api/CombinedPost/hashtag/${hashtagName}`);
        this.posts = response.data;
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    },
        },
        components:{
          showComment,submitComment,ImageSlider,
        }
    }
</script>

<style>
.post-card{
    height: auto;
    width: 623px;
    position: relative;
    margin-bottom: 10px;
    left: 21px;
    padding: 6px;
    padding-top: 0px;
    background-color: #E3E0E0;
}
.card-head{
    height: 90px;
    width: 605px;
    padding: 5px;
    margin-top: 2px;
    display: flex;
    flex-direction: row;
    padding-top: 8px;
    position: relative;
    left: 2px;
}
.pic{
    height: 42px;
    width: 42px;
    margin-right: 11px;
}
.pic img {
    height: 42px;
    width: 42px;
    border-radius: 50px;
    margin-right: 10px;
    cursor: pointer;
    object-fit: cover;
}
.name-time{
  height: 40px;
  width: auto;
  padding: 3px;
 
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.naam{
  font-size: 19px;
  font-weight: bolder;
  cursor: pointer;
}
.name-time{
  font-size: 13px;
}
.post_category{
  height: fit-content;
  width: auto; 
  /* border: solid 0.5px;
  border-color: black; */
  position: relative;
  top: 63px;
  left: -160px;
}
.Cat_gory{
  height: 5px;
  width: auto;
  padding: 8px;
  border-radius: 10px;
  border: solid 0.5px;
  border-color: black;
  text-align: center;
  align-content: center;
  line-height: 6px;
  margin-left: 3px;
}
.card-follow{
  height: 32px;
    width: auto;
    background-color: #EAA7B4;
    border: none;
    border-radius: 20px;
    position: absolute;
    right: 10px;
    cursor: pointer;
    padding: 10px;
}
.card-write{
    height: auto;
    width: 605px;
    padding: 5px;
    margin-top: 5px;
    margin-bottom: 6px;
    position: relative;
    text-align: start;
    background-color: #ffff;
}
.card-write p{
  padding: 0;
  margin: 0;
}
.images-place{
    height: 360px;
    width: 615.5px;
    position: relative;
    margin-top: 5px;
}
.images-place img{
  height: 360px;
  width: 615.5px;
  object-fit: cover;

}
.card-footer{
    height: 50px;
    width: 610px; 
    padding: 2px;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.5px;
    margin-bottom: 14px;
}
.like{
  height: 40px;
  width: 40px;
  border-radius: 50px;
  margin-right: 10px;
}
.comment{
  height: 40px;
  width: 40px;
  margin-right: 10px;
  align-items: center;
}

.comment img{
  height: 40px;
  width: 40px;
  align-items: center;
}
.download{
  height: 40px;
  width: 40px;
  align-items: center;
}
.download img{
  height: 40px;
  width: 40px;
  align-items: center;
}
.download span{
  display: block;
  font-size: 12px;
  position: relative;
  right: 8px;
  bottom: 7px;
}
.comment-box{
  width: 515px;
  height: auto;
  background-color: rgb(210, 226, 233);
  position: absolute;
  bottom: 5px;
  right: 55px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  top: 5px;
  z-index: 5;
}
.c-cancel{
  position: absolute;
  right: 24px;
  top: 6px;
  vertical-align: middle;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}
.c-naming{
  position: absolute;
  top: 6px;
  right: 196px;
  font-size: 18px;
  font-weight: bold;
}
.c-chead{
  width: 515px;
  height: 30px;
  position: sticky;
  top: 0;
  right: 0;
  left: 0;
  z-index: 100;
  
  border-bottom: 1px solid rgb(38, 39, 35);
  background-color: wheat;
}

</style>