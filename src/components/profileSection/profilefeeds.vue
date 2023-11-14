<template>
  <div>
    <div class="post-card" v-for="post in posts" :key="post.post.postId">
      <div class="card-head">
        <div class="pic">
          <img :src="post.user.profile_Pic" alt="">
        </div>
        <div class="name-time">
          <span class="naam">{{ post.user.userName }}</span>
          <span class="time">{{ post.post.datePosted }}</span>
        </div>
        <div class="post_category">
          <span v-for="category in post.categories" :key="category.categoryId" class="Cat_gory">{{ category.categoryName }}</span>
        </div>

          <span class="postOption" v-if="isCurrentUser(post.user.userId)"  @click="post.showOptions = !post.showOptions">. . .</span>
          <div class="options" v-if="post.showOptions" >
          <span class="optSpan"  @click="showUpdateForm(post)">Update</span>
          <span class="optSpan" @click="DeletePost(post.post.postId)">Delete</span>
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
          <img src="@/assets/heart.svg" alt="" />
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
        <div class="chead">
          <span class="cancel" @click="post.showComment = false">X</span>
          <span class="naming">Comments</span>
        </div>
        <showComment :postId="post.post.postId"/>
        <submitComment :postId="post.post.postId" :currentUserId="userStore.user.userId"/>
      </div>
      <postUpdate
      v-if="post.showUpdateForm"
      :postId="post.post.postId"
      :initialData="post"
      @cancel="cancelUpdateForm(post)"
      @update="handleUpdatePost"
    />
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/store/userStore';
import axios from 'axios';
import showComment from '@/components/HomeBody/showComment.vue';
import submitComment from '@/components/HomeBody/submitComment.vue';
import ImageSlider from "@/components/HomeBody/ImageSlider.vue";
import postUpdate from "@/components/profileSection/updatePost.vue"

export default {
  props: {
            userId: {
            type: Number,
            required: true,
            },
        },
  data() {
    return {
      posts: [],
      showFullContent: false,
      userStore: useUserStore(),
    };
  },
  async mounted() {
    this.fetchPosts(this.userId);
  },
  watch: {
    userId: function (newUserId) {
      this.fetchPosts(newUserId);
    },
  },
  methods: {
    async fetchPosts(userId){
      try {
    
    const response = await axios.get(`https://localhost:44384/api/CombinedPost/${userId}`);
    console.log(response.data);
    this.posts = await Promise.all(response.data.map(async (post) => {

      const isLikedResponse = await axios.get(`https://localhost:44384/api/Like/${post.post.postId}/likedBy/${this.userStore.user.userId}`)
      post.isLikedByCurrentUser = isLikedResponse.data; 

      const likesResponse = await axios.get(`https://localhost:44384/api/Like/post/${post.post.postId}`);
      post.totalLikes = likesResponse.data.length; 
      console.log(likesResponse.data)
      post.showOptions = false;
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


    isCurrentUser(userId) {
      return userId === this.userStore.user.userId;
    },
    showUpdateForm(post) {
      post.showUpdateForm = true;
    },
    cancelUpdateForm(post) {
      post.showUpdateForm = false;
    },
    async handleUpdatePost(postId, updatedData) {
      try {
      
        const updatedPostIndex = this.posts.findIndex((post) => post.post.postId === postId);
        if (updatedPostIndex !== -1) {
          this.posts[updatedPostIndex].post = { ...updatedData };
          this.posts[updatedPostIndex].showUpdateForm = false;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async DeletePost(postId){
      try{
      await axios.delete(`https://localhost:44384/api/CombinedPost/${postId}`)
      alert("deleted Post")
      }catch(error){
        console.log(error)
      }
    }
  },
  components: {
    showComment,
    submitComment,
    ImageSlider,
    postUpdate,
  },
};
</script>

<style>
.like.liked {
  background-color: red;
}
.postOption{
  font-size: 22px;
  font-weight: bolder;
  position: absolute;
  right: 5px;
  cursor: pointer;
}
.options{
  width: 68px;
  height: 52px;
  background-color: #ffff;    display: flex;
  flex-direction: column;
  padding: 2.5px;
  position: absolute;
  right: 5px;
  top: 37px;
}
.optSpan{
  width: 65px;
  height: 24px;
  margin-bottom: 3px;
  text-align: center;
  cursor: pointer;
}

.optSpan:hover{
  background-color: #dbd5d5
}
</style>