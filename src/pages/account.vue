<template>
  <div class="allHere">
    <div class="profile-img">
      <img :src="profilePicUrl">
    </div>
    <form @submit.prevent="submitForm">
      <button class="editpfp" @click="openFileUpload">Change</button>

      <div class="Afield">
        <label for="username">Username:</label>
        <input type="text" class="username" v-model="username" required>
      </div>
      <div class="Afield">
        <label for="password">Password:</label>
        <input type="password" class="password" v-model="password" required>
      </div>
      <input type="file" style="display: none;" @change="uploadProfilePic">
      <div>
        <button class="btn" type="submit" @click="setSubmitClicked">Save Changes</button>
      </div>
    </form>
  </div>
</template>

<script>
import { useUserStore } from '@/store/userStore';
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      profilePicFile: null,
      profilePicUrl: '',
      submitClicked: false,
    };
  },

  methods: {
    openFileUpload() {
      const fileUpload = document.querySelector('input[type="file"]');
      fileUpload.click();
    },

    uploadProfilePic(event) {
      this.profilePicFile = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.profilePicFile);
      reader.onload = () => {
        this.profilePicUrl = reader.result;
      };
    },

    setSubmitClicked() {
      this.submitClicked = true;
    },

    async submitForm() {
      const formData = new FormData();
      const userStore = useUserStore();
      formData.append('userId', userStore.user.userId);
      formData.append('userName', this.username);
      formData.append('password', this.password);
      formData.append('profile_Pic', null);
      if (this.profilePicFile) {
        formData.append('profile_Pic_File', this.profilePicFile);
      }
      await this.updateUser(formData);
    },

    async updateUser(formData) {
      try {
        const userStore = useUserStore();
        const response = await axios.put(`https://localhost:44384/api/User/${userStore.user.userId}`, formData);
        if (this.submitClicked) {
          alert("Updated Successfully");
        }
        console.log(response.data);
      } catch (error) {
        console.log(error.response);
      } finally {
        this.submitClicked = false;
      }
    },
  },

  created() {
    const userStore = useUserStore();
    if (userStore.user) {
      this.username = userStore.user.userName;
      this.profilePicUrl = userStore.user.profile_Pic;
      this.password = userStore.user.password;
    }
  },
};
</script>



<style>
.allHere{
    width: 800px;
    height: 376px;
    margin: auto;
    margin-top: 85px;
    padding: 10px;
    background-color: #a9a4a4;
    display: flex;
    align-items: center;
    flex-direction: column;
}
.profile-img{
    height: 80px;
    width: 95px;
    padding: 5px;
    border-radius: 50px;
}
.profile-img img{
    height: 80px;
    width: 80px;
    border-radius: 50px;
    -o-object-fit: cover;
    object-fit: cover;
    background-color: #ffff;
}
.editpfp{
    width: 73px;
    height: 36px;
    padding: 3px;
    background-color: #EAA7B4;
    border: none;
    border-radius: 10px;
    cursor: pointer;
}
 .Afield{
    width: 500px;
    height: 80px;
    margin-top: 8px;
    padding-top: 5px;
    position: relative;
    border: 0.5px solid snow;
    border-radius: 18px;
}
 .Afield input{
    width: 320px;
    height: 25px;
    border-radius: 10px;
    position: absolute;
    right: 35px;
    top: 20px;
    border: none;
    padding: 6px;
}
.Afield label{
  font-size: 20px;
  font-weight: 600;
  position: absolute;
  left: 10px;
  top: 30px;
}
.btn{
    height: 45px;
    width: 114px;
    padding: 4px;
    background-color: #EAA7B4;
    border: none;
    border-radius: 18px;
    cursor: pointer;
    margin-top: 5px;
    margin-top: 8px;
}
</style>
