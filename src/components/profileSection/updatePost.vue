<template>
  <div class="post-update">
    <div class="post-card">
      <div class="card-write">
        <textarea class="updateStatus" v-model="postData.post.postContent" placeholder="Update your post..."></textarea>

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
          <input type="checkbox" id="category-recommendations" name="category" value="Recommendation" v-model="categories">
          <label for="category-recommendations">Recommendation</label>
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

        <div class="update-buttons">
          <button @click="cancelUpdate">Cancel</button>
          <button @click="updatePost">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  props: {
    postId: {
      type: Number,
      required: true,
    },
    initialData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      postData: { ...this.initialData },
      categories: [],
      selectedImageFiles: [], 
      errorMessage: "",
    };
  },
  methods: {
    cancelUpdate() {
      this.$emit("cancel");
    },
    submitUpdate() {
      this.$emit("update", this.postId, this.updatedContent);
    },

    handleFileUpload(event, type) {
      const files = Array.from(event.target.files);

      if (type === 'image') {
        this.selectedImageFiles = files;
      } else if (type === 'map') {
        this.selectedMapFile = files[0];
      }
    },

    async updatePost() {
  
      const UpdateData = {
        Post: {
          postId: this.postId,
          PostContent: this.postData.post.postContent,
          PosterId: this.postData.user.userId,
          Map: null
        },
        Photos: [],
        Categories: this.categories.map(category => ({ CategoryName: category }))
      };

      if (this.selectedMapFile) {
        UpdateData.Post.Map = this.selectedMapFile;
      }
      
      for (let i = 0; i < this.selectedImageFiles.length; i++) {
        const imageBase64 = await this.extractBase64(this.selectedImageFiles[i]);
        UpdateData.Photos.push({ PhotoUrl: imageBase64 });
      }

      this.confirmUpdate(UpdateData);
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

    async confirmUpdate(UpdateData) {
      try {
      
        await axios.put(`https://localhost:44384/api/CombinedPost/UpdatePost/${this.postId}`, UpdateData,{
          headers: {
            'Content-Type': 'application/json'
          }
        });
        this.$emit("update", this.postId, this.postData);
      } catch (error) {
        this.errorMessage = "Failed to update the post.";
        console.error(error);
      }
    },

    

  },
};
</script>
<style>
.updateStatus{
    height: 77px;
    width: 577px;
    resize: none;
    line-height: 16px;
    vertical-align: bottom;
    padding: 10px;
    margin: 3px;
    border-radius: 18px;
    background-color: #ffff;
}
</style>