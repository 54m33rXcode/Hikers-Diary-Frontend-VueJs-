<template>
  <div class="fields">
    <textarea class="status" v-model="content" placeholder="Write what's on your mind"></textarea>
    <div class="u-iclass">
      <label for="file-upload" class="custom-file-upload">
        <i class="fa fa-cloud-upload"></i> Choose Photo
      </label>
      <input type="file" id="file-upload" multiple accept="image/png, image/jpeg"
        @change="handleFileUpload($event, 'image')">
    </div>
    <div class="u-iclass">
      <label for="map-upload" class="custom-file-upload">
        <i class="fa fa-cloud-upload"></i> Upload Map
      </label>
      <input type="file" id="map-upload" accept="application/gpx+xml" ref="selectedMapFile"
        @change="handleFileUpload($event, 'map')">
    </div>
    <fieldset class="checkbox_class">
      <legend class="custom-file-upload">Select Category</legend>
      <div class="checkbox-container">
        <div>
          <input type="checkbox" id="category-ask" name="category" value="Ask" v-model="categories">
          <label for="category-ask">Ask</label>
        </div>
        <div>
          <input type="checkbox" id="category-recommendations" name="category" value="Recommendations"
            v-model="categories">
          <label for="category-recommendations">Recommendations</label>
        </div>
        <div>
          <input type="checkbox" id="category-story" name="category" value="Story" v-model="categories">
          <label for="category-story">Story</label>
        </div>
        <div>
          <input type="checkbox" id="category-adventure" name="category" value="Adventure" v-model="categories">
          <label for="category-adventure">Adventure</label>
        </div>

        <div>
          <input type="checkbox" id="category-culture" name="category" value="Culture" v-model="categories">
          <label for="category-culture">culture</label>
        </div>

        <div>
          <input type="checkbox" id="category-photography" name="category" value="Photography" v-model="categories">
          <label for="category-photography">Photography</label>
        </div>
        <div>
          <input type="checkbox" id="category-invitation" name="category" value="Invitation" v-model="categories">
          <label for="category-invitation">Invitation</label>
        </div>
        <div>
          <input type="checkbox" id="category-events" name="category" value="Events" v-model="categories">
          <label for="category-events">Events</label>
        </div>
        <div>
          <input type="checkbox" id="category-tour-packages" name="category" value="Tour Packages" v-model="categories">
          <label for="category-tour-packages">Tour Packages</label>
        </div>
      </div>
    </fieldset>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <button class="upload-btn" @click="uploadPost">Upload</button>

  </div>
</template>
  
<script>
import axios from 'axios';
import { useUserStore } from '../store/userStore';

export default {
  data() {
    return {
      content: "",
      categories: [],
      selectedImageFiles: [],
      selectedMapFile: null,
      errorMessage: ''
    };
  },
  methods: {
    handleFileUpload(event, type) {
      const files = Array.from(event.target.files);

      if (type === 'image') {
        this.selectedImageFiles = files;
      } else if (type === 'map') {
        this.selectedMapFile = files[0];
        this.extractMapBase64(this.selectedMapFile);
      }
    },
    async uploadPost(event) {
      event.preventDefault();

      if (this.content === "" && this.selectedImageFiles.length === 0 && this.selectedMapFile === null) {
        this.errorMessage = "You cannot leave all fields empty";
        return;
      }

      if (this.categories.length === 0) {
        this.errorMessage = "You must specify the category";
        return;
      }

      const userStore = useUserStore();
      const user = userStore.user;
      console.log(user)
      if (!user || !user.userId) {
        this.errorMessage = "User data is missing or invalid";
        return;
      }

      const postData = {
        Post: {
          PostContent: this.content,
          PosterId: user.userId,
          Map: null
        },
        Photos: [],
        Categories: this.categories.map(category => ({ CategoryName: category }))
      };

      if (this.selectedMapFile) {
        postData.Post.Map = this.selectedMapBase64;;
      }
      
      for (let i = 0; i < this.selectedImageFiles.length; i++) {
        const imageBase64 = await this.extractBase64(this.selectedImageFiles[i]);
        postData.Photos.push({ PhotoUrl: imageBase64 });
      }

      this.confirmUpload(postData);
    },

    async extractBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64Data = reader.result.split(',')[1];
            resolve(base64Data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      },

    async extractMapBase64(file) {
      if (!file) return;

      try {
        const mapBase64 = await this.extractBase64(file);
        this.selectedMapBase64 = mapBase64;
      } catch (error) {
        console.error("Error extracting map as base64:", error);
      }
    },  

    async confirmUpload(postData) {
      try {
        const response = await axios.post('https://localhost:44384/api/Post/createPost', postData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        alert("Post Created Successfully");
        console.log("Post created successfully:");
        this.$router.push('/upload')
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style>
.fields {
    width: 800px;
    height: 700px;
    margin: auto;
    padding: 10px;
    background-color: #a9a4a4;
    display: flex;
    align-items: center;
    flex-direction: column;
    position: relative;
    left: 151px;
    top: 20px;
}

.status {
    height: 170px;
    width: 741px;
    resize: none;
    line-height: 16px;
    vertical-align: bottom;
    padding: 10px;
    margin: 3px;
    border-radius: 18px;
    background-color: #ffff;
}

.u-iclass {
  width: 500px;
    height: 80px;
    margin-top: 8px;
    padding-top: 5px;
    position: relative;
    border: 0.5px solid #ffff;
    border-radius: 18px;
}

.u-iclass input {

  position: absolute;
  right: 35px;
  top: 32px;
}

.u-iclass label {
  font-size: 20px;
  font-weight: 600;
  position: absolute;
  left: 10px;
  top: 30px;
}

.checkbox_class {
    width: 300px;
    height: 230px;
    margin-top: 10px;
    padding-top: 10px;
    position: relative;
    border: 0.5px solid snow;
    border-radius: 18px;
}

.checkbox-container {
  display: flex;
  flex-direction: column;
}

.checkbox-container>div {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.upload-btn{
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