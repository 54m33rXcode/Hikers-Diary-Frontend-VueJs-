<template>
    <div>

        <div class="account-names" v-for="account in Accounts" :key="account.userId">
          <router-link :to="{ path: '/profile', query: { userId: account.userId } }">
          <div class="user-photo">
            <img :src="account.profile_Pic" alt="User Photo">
          </div>
        </router-link>
          <h2 class="Account-User">{{ account.userName }}</h2>
         
          <button class="follow-button">Follow</button>
        </div>
      </div>
</template>

<script>
import axios from 'axios';


    export default {
        data(){
            return{
                Accounts:[]
            }
        },
        created(){
          const username = this.$route.query.name;
          this.fetchUser(username);
        },
        methods:{
          async fetchUser(username){
            try{
              const response = await axios.get(`https://localhost:44384/api/User/search/${username}`)
              this.Accounts = response.data
            }
            catch(error){
              console.log(error)
            }
          }
        }
    }
</script>

<style>

</style>