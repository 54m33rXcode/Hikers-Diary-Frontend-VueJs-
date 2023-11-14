<template>
    <div class="background-img">
     <span class="welcome">Welcome Travellers</span>
     <span class="slogan">Thousands Of Travel Stories In One Platform</span>
     <img class="login-img" src="../assets/HikersDiary.svg" alt="">
     <span class="hikers">Hikers Diary</span>
     <div class="signup-box">
          <h3>Signup</h3>
          <form class="signup-form" @submit="login">
             <label class="lebl" for="username">Username:</label><br/><br/>
             <input type="text" id="username" v-model="username" required> <br/>

             <label class="lebl"  for="password">Password:</label><br/><br/>
             <input type="password" id="password" v-model="password" required><br/>

             <button type="submit">Sign Up</button>
           </form>
           <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
           <RouterLink to="/register">
               <span class="regist">Not Registered?click Here</span>
           </RouterLink>
       

     </div>
   </div>
</template>

<script>
import axios from 'axios';
   export default {
       data(){
           return{
               username:'',
               password:"",
               errorMessage: ''
           }
       },
       methods:{
           async login(event){
               event.preventDefault();
               const loginData = new FormData();
               loginData.append('UserName',this.username);
               loginData.append('Password',this.password);

               this.SubmitLogin(loginData);
           },
           async SubmitLogin(loginData){
               try{
               const response = await axios.post('https://localhost:44384/api/User/login',loginData);
               const token = response.data.token;
               localStorage.setItem('token',token);
               alert("Login Successful")
               console.log("Login Successful",response.data)
               this.$router.push('/')
               }catch(error){
                   this.errorMessage = "Login failed Invalid Username Or Password"
                   console.log(error)
               }
           }
       }
       
   }
</script>

<style>
   .welcome{
       font-size: 70px;
       color: antiquewhite;
       position: absolute;
       top: 40px;
       left: 400px;
   }
   .slogan{
       font-size: 40px;
       color: antiquewhite;
       position: absolute;
       top: 103px;
       left: 300px;
   }
   .login-img{
       height: 90px;
       width: 120px;
       position: absolute;
       top: 127px;
   }
   .hikers{
       font-size: 30px;
       position: absolute;
       top: 199px;
       color: black;
       left: 610px;
   }
   .signup-box{
       height: 400px;
       width: 300px;
       position: absolute;
       top: 240px;
       background-color: antiquewhite;
       opacity: 0.6;
       left: 550px;
   }
   .lebl{
        margin-top: 10px;
        margin-bottom: 10px;
        font-size: 18px;
   }
   .signup-form input{
       height: 25px;
       width: 200px;
   }

   .signup-form button{
       margin-top: 20px;
       padding: 8px;
       background-color: aquamarine;
       border: none;
       margin-bottom: 10px;
   }
   .regist{
       font-size: 18px;
       cursor: pointer;
       text-decoration: none;
       
   }

</style>