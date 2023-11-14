<template>
     <div class="post-card" v-for="post in posts" :key="post.post.postId">
                <div class="card-head">
                    <div class="pic">
                      <img :src="post.user.profile_Pic" alt="..src/assets/chibi.png">
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
import axios from 'axios';
import showComment from '@/components/HomeBody/showComment.vue'
import submitComment from '@/components/HomeBody/submitComment.vue'
import ImageSlider from "@/components/HomeBody/ImageSlider.vue";


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
              const response = await axios.get(`https://localhost:44384/api/CombinedPost/following/${this.userStore.user.userId}`);
          
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

       methods:{
           followUser(index) {
            this.items[index].followed = !this.items[index].followed
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
       },
       components:{
         showComment,submitComment,ImageSlider
       }
   }
</script>

<style>
</style>