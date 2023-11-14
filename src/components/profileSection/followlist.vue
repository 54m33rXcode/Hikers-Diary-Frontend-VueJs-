<template>
    <div>
      <div v-if="showFollow">
        <h3>Followers</h3>
        <div class="account-names" v-for="follower in followerList" :key="follower.userId">
          <router-link :to="{ path: '/profile', query: { userId: follower.userId } }">
          <div class="user-photo">
            <img :src="follower.profile_Pic" alt="User Photo">
          </div>
        </router-link>
          <h2 class="Account-User">{{ follower.userName }}</h2>
         
          <button class="follow-button">Follow</button>
        </div>
      </div>
  
      <div v-else>
        <h3>Followings</h3>
        <div class="account-names" v-for="following in followingList" :key="following.userId">
          <div class="user-photo">
            <img :src="following.profile_Pic" alt="User Photo">
          </div>
          <h2 class="Account-User">{{ following.userName }}</h2>
          <button class="follow-button">Follow</button>
        </div>
      </div>
    </div>
  </template>
<script>
    export default {
        props: ['userId'],
  data() {
    return {
      followingList: [],
      followerList: [],
      showFollow: true,
    };
  },
  methods: {
    setFollowingList(list) {
      this.followingList = list;
    },
    setFollowerList(list) {
      this.followerList = list;
    },
  },
    }
</script>

<style>

</style>