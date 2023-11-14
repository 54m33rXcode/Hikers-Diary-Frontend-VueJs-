<template>
    <div class="account-names" v-for="suggestion in displayedSuggestions" :key="suggestion.userId">
        <router-link :to="{ path: '/profile', query: { userId: suggestion.userId } }">
                    <div class="user-photo">
                        <img :src="suggestion.profile_Pic" alt="no pic">
                      </div>
        </router-link>              
                      <h2 class="Account-User">{{suggestion.userName }}</h2>
                      <button class="follow-button" @click="toggleFollow(suggestion)">{{ suggestion.isFollowing ? 'Unfollow' : 'Follow' }}</button>
                </div>

                <div class="show-More" @click="moreSuggestion">
              <span >{{showAll ? 'See Less' : 'See More'}}</span>
            </div>

</template>

<script>
import { useUserStore } from '@/store/userStore';
import axios from 'axios';
    export default {
        name:"SuggestedAcc",
        data(){
        return{
          suggestions:[],
          showAll: false,
          userStore: useUserStore(),
        }
      },
      computed: {
      displayedSuggestions() {
      return this.showAll ? this.suggestions : this.suggestions.slice(0,6)
    }
  },
  created() {
  const storedUserData = localStorage.getItem('userStore');
  if (storedUserData) {
    this.userStore.user = JSON.parse(storedUserData);
  }
},
  mounted() {
  this.fetchRandomUsers();
  },
      methods:{
        moreSuggestion(){
          this.showAll = !this.showAll
          },

          async fetchRandomUsers() {
            try {
              const response = await axios.get(`https://localhost:44384/api/User/random?currentUserId=${this.userStore.user.userId}`);
              this.suggestions = response.data;

              this.suggestions = response.data.map((suggestion) => ({
              ...suggestion,
              isFollowing: false, 
            }));
              
              localStorage.setItem('userStore', JSON.stringify(this.userStore.user));
            } catch (error) {
              console.error('Error fetching random users:', error);
            }
          },
      
          async toggleFollow(suggestion) {
            try {
              
              if (suggestion.isFollowing) {
                
                await axios.delete(`https://localhost:44384/api/Follow/user/${this.userStore.user.userId}/unfollow/${suggestion.userId}?followId=${this.userStore.user.userId}`);
              } else {
              
                await axios.post(`https://localhost:44384/api/Follow/user/${this.userStore.user.userId}/follow/${suggestion.userId}?followId=${this.userStore.user.userId}&Following_Id=${suggestion.userId}`);
              }
              
              suggestion.isFollowing = !suggestion.isFollowing;
            } catch (error) {
              console.error('Error toggling follow status:', error);
            }
          },
        }
      }
</script>

<style>
.account-names{
  height: 40px;
  width: 281px;
  padding:3px;
  margin: 5px;
  margin-top: 10px;
  border: solid #a1a1ef 0.1px;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
}
.user-photo {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  overflow: hidden;
  border: solid;
  border-color: #1183d6;
  border-width: 1px;
}
.user-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.follow-button{
  height: 32px;
  width: fit-content;
  background-color: #7cb397;
  border: none;
  border-radius: 10px;
  position: absolute;
  right: 10px;
  cursor: pointer;
}
.account-names:hover{
  background-color: #cddfd6;
  transition: 0.9s;
}
.Account-User{
  font-size: 15px;
  margin-left: 4px;
}

.show-More{
  height: 35px;
  width: 281px;
  padding:3px;
  margin-left: 5px;
  border: solid;
  border-color: #1183d6;
  border-width: 1px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.show-More:hover{
  background-color: #cddfd6;
  transition: 0.9s;
}
</style>