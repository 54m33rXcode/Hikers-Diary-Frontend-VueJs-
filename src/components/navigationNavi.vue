<template>
  <div class="nav">
      <div class="logo">
        <router-link  to="/">
          <img src="../assets/HikersDiary.svg" alt="" class="app-logo">
        </router-link>
          <span class="app-name">Hikers Diary</span>
      </div>
      
      <div class="search-icon">
          <input type="search" class="search-friend" placeholder="Find Friend"  ref="searchInput" @keyup.enter="searchName"/>
      </div>

      <div class="lastpart">
          <div class="notify" @click="toggleNotification">
              <img src="../assets/notification.svg" alt="" class="notification">
                  <div class="notification-box" v-if="showNotification">
                      <div class="notify-detail"  >
                        <ul>
                          <li v-for="(message, index) in notification" :key="index">
                            {{ message }}
                          </li>
                        </ul>
                      </div>
                 </div>
          </div>

          <div class="profile" v-if="userStore.user">
            <router-link :to="{ path: '/profile', query: { userId: userStore.user.userId } }">
              <div >
                <img :src="userStore.user.profile_Pic" alt="no pic" class="profile-pic">
              </div>
            </router-link>
              <span class="user-name">{{userStore.user.userName}}</span>
          </div>
          <div class="dropdown">
              <button class="dropbtn">. . .
                <i class="fa fa-caret-down"></i>
              </button>
              <div class="dropdown-content">
                <router-link to="/account">Account Setting</router-link> 
                <a @click="logout">Logout</a>
              </div>
            </div>
      </div>
     
  </div>
</template>

<script>
import { useUserStore } from '@/store/userStore';
import axios from 'axios';
export default {
  data() {
    return {
      userStore: useUserStore(),
      showNotification: false,
      notification: [],
      connection: null,
    };
  },
  created() {
    
    const authToken = localStorage.getItem('token');
    if (authToken) {
      this.fetchUserData(authToken);
      this.fetchNotifications();
      this.startPolling(); 
    } else {
      alert('Expired');
      this.$router.push('/login');
    }
  },
  
  methods: {
    async fetchUserData(authToken) {
      try {
        const response = await axios.get('https://localhost:44384/api/User', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const user = response.data;
        console.log(user);
        this.userStore.setUser(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    
    async fetchNotifications() {
      try {
        const response = await axios.get(`https://localhost:44384/api/Notification?receiverId=${this.userStore.user.userId}`);
        console.log(response.data)
        this.notification = response.data;
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    },

    startPolling() {
      this.pollingInterval = setInterval(() => {
        this.fetchNotifications();
      }, 500000);
    },

    toggleNotification() {
      this.showNotification = !this.showNotification;
    },

    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },

    searchName() {
      const enteredName = this.$refs.searchInput.value;
      this.$router.push({ 
        name: 'searchUser', 
        query: { name: enteredName } 
      });
    },

  },
};
</script>

<style>
.nav{
  display: flex;
  max-width: 1361px;
  height: 70px;
  position: fixed;
  left:0;
  right:0;
  top: 0px;
  padding: 2px;
  z-index: 100;
  background-color: #CCCCCC;
  justify-content: space-between;
}

.logo{
  width: 102px;
  height: 71px;
  position: relative;
  left: 30px;
}
.app-logo{
  width:120px;
  height:52px;
  position: absolute;
  top: 0px;
  left: -9px;
}
.app-logo,.home-icon,.notification,.profile-pic:hover{
cursor: pointer;
}
.app-name{
  width: fit-content;
  font-size: 15px;
  font-weight: bolder;
  position: absolute;
  bottom: 10px;
  left: 5px;
}

.search-icon{
  width:350px;
  height:70px;
  display: flex;
  justify-content: center;
  align-items: center;
}
input.search-friend {
  width: 350px;
  height: 42px;
  border-radius: 20px;
  border: 1px solid #555;
  display: block;
  padding: 9px 4px 9px 40px;
  background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' class='bi bi-search' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'%3E%3C/path%3E%3C/svg%3E") no-repeat 15px center;
}
input[type="search"]:focus {
  box-shadow: 0 0 3px 0 #1183d6;
  border-color: #1183d6;
  outline: none;
}

.home-section{
  width: 90px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.home-icon{
  width: 70px;
  height: 40px;
  border: solid;
  border-radius: 10px;
  padding: 5px;
  border-width: 1px;
}
.lastpart{
  width: 450px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding-left: 4px;
  padding-right: 4px;
}
.notify{
  height:40px;
  width:40px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #d4e4db;
}
.notification{
  height: 30px;
  width: 30px;
  
}
.profile{
  height: 70px;
  width: 230px;
  display: flex;
  align-items: center;
  padding-left: 2px;

}
.profile-pic{
  width: 40px;
  height: 40px;
  border-radius: 50px;
  object-fit: cover;
  }
.for-profile{
  width: 40px;
  height: 40px;
  border-radius: 50px; 
  
}
.user-name{
  font-size: 17px;
  font-weight: bolder;
  margin-left: 10px;
}
.dropdown {
  float: left;
  overflow: hidden;
  transition: 2s;
}
.dropdown .dropbtn {
  font-size: 18px;
  border: none;
  outline: none;
  color: black;
  font-weight: bolder;
  padding: 14px 16px;
  background-color: inherit;
  transition: 0.2s;
}  
.dropdown:hover .dropbtn {
  border-bottom: solid;
  border-width: 5px;
  border-color: #9D91FF;
}
.dropdown-content {
   display: none; 
  position: absolute;
  background-color: #f9f9f9;
  min-width: 130px;
  right: 10px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}
.dropdown-content a {
  float: none;
  color: black;
  padding: 9px 9px;
  text-decoration: none;
  display: block;
  text-align: left;
  transition: 0.5s;
}
.dropdown-content a:hover {
  background-color: #ddd;

}
.dropdown:hover .dropdown-content {
  display: block;
  transition: 3s;
  transition-delay: 7s;
  
}
.notification-box{
  width: 300px;
  height: 200px;
  position: absolute;
  top: 52px;
  background-color: darkcyan;
  padding:0;
}
.notify-detail{
  width: 290px;
  height: 40px;
  background-color: blueviolet;
  margin: 0;
}
</style>