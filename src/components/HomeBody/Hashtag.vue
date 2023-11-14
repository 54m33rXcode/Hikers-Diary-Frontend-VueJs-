<template>
    <div class="hashtag_container">
     <h3>Emerging Trends</h3>
     <div v-for="hashtag in hashtags" :key="hashtag" @click="loadPosts(hashtag)">
        {{ hashtag }}
      </div>
    </div>
</template>

<script>
import EventBus from '@/store/eventBus.js';
import axios from 'axios';
    export default {
        data() {
        return {
        hashtags: [], 
        };
     },
     methods: {
        async fetchHashtags() {
        try {
            const response =  await axios.get("https://localhost:44384/api/Hashtag/uniqueTags")
            this.hashtags =  response.data;
        } catch (error) {
            console.error("Error fetching hashtags:", error);
          }
        },
        loadPosts(hashtagName) {
        EventBus.emit('load-posts-by-hashtag', hashtagName);
        },
     },

       created() {
        this.fetchHashtags(); 
        
        },
    }
</script>

<style>
.hashtag_container{
    height: 260px;
    width: 295px;
    margin-left: 3px;
    margin-top: 3px;
    display: flex;
    border-top: 5px solid black;
    flex-direction: column;
}
.tags{
    font-size: 18px;
    font-weight: bold;
    margin: 10px;
    cursor: pointer;
}
</style>