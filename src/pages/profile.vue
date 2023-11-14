<template>
    
    <div class="content-provider">
      <div class="visit-profile-photo">
         <div class="real-photo" v-if="user">
            <img :src="user.profile_Pic" alt="chibi.png" class="real-pic">
         </div>
         <div class="name-area" v-if="user">
            <span class="real-name">{{user.userName}}</span>
         </div>

         <button v-if="!isCurrentUser" class="hasfollowed"  @click="toggleFollow">{{ isFollowingCurrentUser ? 'Unfollow' : 'Follow' }}</button>
      </div>
      <div class="follow-follower">
        <div class="profile-follow" @click="showFollowList('following')">
            <span class="s1">Following:</span>
            <span class="s2">{{ followingNumber }}</span>
        </div>

        <div class="profile-follower" @click="showFollowList('follower')">
            <span class="s1">Follower:</span>
            <span class="s2">{{ followNumber }}</span>
        </div>

        <div class="num-post">
            <span class="s1">Total post:</span>
            <span class="s2"></span>
        </div>

      </div>
    </div>
    
    <div class="main-content">
      <profilefeeds v-if="user" :userId="user.userId"/>
    </div>
    <div class="Third_section">
    <followlist v-if="user" ref="followListComponent" :userId="user.userId" />
    </div>
</template>

<script>
import profilefeeds from '@/components/profileSection/profilefeeds.vue'
import followlist from '@/components/profileSection/followlist.vue'
import { useUserStore } from '@/store/userStore';
import axios from 'axios';
export default {
data(){
  return{
    user: null,
    followingNumber:'',
    followNumber:'',
    isFollowingCurrentUser: false,
    userStore: useUserStore(),
  }
},
created() {
    const userId = this.$route.query.userId;
    this.fetchUser(userId);
    this.fetchFollowCounts(userId);
  },
  watch: {
    '$route.query.userId': function (newUserId) {
      this.fetchUser(newUserId);
      this.fetchFollowCounts(newUserId);
    }
  },
  computed: {
    isCurrentUser() {
      
      return this.user && this.user.userId === this.userStore.user.userId;
    },
  },

methods:{
    async fetchUser(userId) {
        try {
        const response = await axios.get(`https://localhost:44384/api/User/user/${userId}`);
        this.user = response.data;
        
        if (this.userStore.user) {
        const followResponse = await axios.get(
          `https://localhost:44384/api/Follow/user/${this.userStore.user.userId}/isfollower/${userId}`);
        this.isFollowingCurrentUser = followResponse.data;
       }

      } catch (error) {
        console.error(error);
      }
    },
    
    async fetchFollowCounts(userId) {
      try {
        const followingResponse = await axios.get(`https://localhost:44384/api/Follow/user/${userId}/followings`);
        const followerResponse = await axios.get(`https://localhost:44384/api/Follow/user/${userId}/followers`);

        this.followingNumber = followingResponse.data.length;
        this.followNumber = followerResponse.data.length;
      } catch (error) {
        console.error(error);
      }
    },
    async showFollowList(type) {
      
      const userId = this.user.userId;
      console.log(userId)
      if (type === "following") {
        const response = await axios.get(`https://localhost:44384/api/Follow/user/${userId}/followings`);
        const followingList = await Promise.all(response.data.map(async (follower) => {
                const followResponse = await axios.get(`https://localhost:44384/api/Follow/user/${this.userStore.user.userId}/isfollower/${userId}`)
                
                follower.followed = followResponse.data
                return follower;
              }));
    
        this.$refs.followListComponent.setFollowingList(followingList);
        this.$refs.followListComponent.showFollow = false; 
      } else if (type === "follower") {
        const response = await axios.get(`https://localhost:44384/api/Follow/user/${userId}/followers`);
        const followerList = response.data;
    
        this.$refs.followListComponent.setFollowerList(followerList);
        this.$refs.followListComponent.showFollow = true; 
      }

    },

    async toggleFollow() {
    try {
      const userId = this.user.userId;
      if (this.isFollowingCurrentUser) {
        
        await axios.delete(`https://localhost:44384/api/Follow/user/${this.userStore.user.userId}/unfollow/${userId}?followId=${this.userStore.user.userId}`);
        this.isFollowingCurrentUser = false;
      } else {
        
        await axios.post(`https://localhost:44384/api/Follow/user/${this.userStore.user.userId}/follow/${userId}?followId=${this.userStore.user.userId}&Following_Id=${userId}`);
        this.isFollowingCurrentUser = true;
      }
    } catch (error) {
      console.error(error);
    }
  },

},
    components:{
        profilefeeds,followlist
       } 
}
</script>

<style>

.visit-profile-photo{
    height: 164px;
    width: 298px;
    border-bottom: solid 3px black;
    display: flex;
    justify-content: center;
    flex-direction: column;
    position: relative;
}
.real-photo{
height: 85px;
width: 85px;
margin-top: 8px;
border: solid;
border: solid 0.8px black;
border-radius: 50px;
position: absolute;
left: 108px;
top: 0px;
}

.real-pic{
  height: 85px;
  width: 85px;
  border-radius: 50px;
  object-fit: cover;
}
.name-area{
height: 30px;
width: auto;
position: relative;
bottom: -30px;
align-items: center;
margin: 2px;
}
.real-name{
font-size: 20px;
font-weight: bold;

}
.follow-follower{
height: 165px;
width: 298px;
margin-top: 10px;
position: relative;
}
.profile-follow{
height: 40px;
width: 200px;
position: absolute;
top: 10px;
left: 49px;
display: flex;
justify-content: center;
}
.s1,.s2{
font-size: 18px;
font-weight: bold;
}
.profile-follower{
height: 40px;
width: 200px;
position: absolute;
top: 60px;
left: 49px;
display: flex;
justify-content: center;
}
.num-post{
height: 40px;
width: 200px;
position: absolute;
top: 110px;
left: 49px;
display: flex;
justify-content: center;
}
.hasfollowed{
  height: 33px;
  width: 75px;
  position: absolute;
  bottom: 5px;
  border-radius: 20px;
  border: none;
  background-color: #EAA7B4;
  left: 109px;
  cursor: pointer;
}
</style>