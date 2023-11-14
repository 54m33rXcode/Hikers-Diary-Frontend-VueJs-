<template>
  <div class="background-img">

    <img class="rlogin-img" src="../assets/HikersDiary.svg" alt="">
    <span class="rhikers">Hikers Diary</span>
    <div class="register-box">
         <h3>Register</h3>
         <form class="register-form" @submit="register">
            <label class="lebl" for="username">Username:</label><br/>
            <input type="text" id="username" v-model="username" required> <br/>

            <label class="lebl"  for="r-password">Password:</label><br/>
            <input type="password" id="r-password" v-model="password" required><br/>

            <label class="lebl"  for="re-password">Re-Password:</label><br/>
            <input type="password" id="re-password" v-model="rePassword" required><br/>

            <label class="lebl"  for="r-profile">Profile Picture:</label><br/>
            <input type="file" id="r-profile"  ref="profilePic"  @change="handleFileInputChange" required><br/>

            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

            <button class="rbtn" type="submit">Register</button>
          </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
  export default {
    data() {
  return {
    username: '',
    password: '',
    rePassword: '',
    profilePic: null,
    errorMessage: ''
  };
},
methods: {
  async register(event) {
    event.preventDefault();

  if (this.password !== this.rePassword) {
    this.errorMessage = 'Password and Re-Password must match';
    return;
  }

  if (this.password.length < 6) {
    this.errorMessage = 'Password must be at least 6 characters long';
    return;
  }

    const formData = new FormData();
    formData.append('UserName', this.username);
    formData.append('Password', this.password);
   
    if (this.profilePic) {
      formData.append('Profile_Pic_File', this.profilePic);
    }

    this.submitRegistration(formData);
  },
  
  async submitRegistration(formData){
    try {
      const response = await axios.post('https://localhost:44384/api/User/Add', formData);
      alert('Registration successful:', response.data);
      console.log('Registration successful:', response.data);
       this.clearForm(); 
       this.$router.push('/login');
       
    } catch (error) {
      this.errorMessage = 'Registration failed. Please try again.';
      console.log('Validation errors:', error.response.data.errors);
    }
  },
  handleFileInputChange(event) {
    this.profilePic = event.target.files[0];
  },

  clearForm() {
    this.username = '';
    this.password = '';
    this.rePassword = '';
    this.profilePic = null;
  },



  },

}

  
</script>

<style>
.error-message {
color: red;
font-size: 14px;
}

.background-img {
background-image: url("../assets/background.jpg");
background-repeat: no-repeat;
background-size: cover;
margin: 0px;
position: absolute;
top: 0px;
left: 0px;
right: 0px;
bottom: 0px;
filter: brightness(90%);
}

.rlogin-img{
      height: 90px;
      width: 120px;
      position: absolute;
      top: 50px;
  }

  .rhikers{
      font-size: 30px;
      position: absolute;
      top: 130px;
      color: black;
      left: 620px;
  }

  #username{
    height: 25px;
    width: 200px;
    margin-bottom: 15px;
  }

  #r-password{
    height: 25px;
    width: 200px;
    margin-bottom: 15px;
  }

  #re-password{
    height: 25px;
    width: 200px;
    margin-bottom: 15px;
  }

  .register-box{
      height: 400px;
      width: 300px;
      position: absolute;
      top: 210px;
      background-color: antiquewhite;
      opacity: 0.6;
      left: 550px;
  }

  .rbtn{
    margin-top: 20px;
      padding: 8px;
      background-color: aquamarine;
      border: none;
      margin-bottom: 10px;
  }

</style>