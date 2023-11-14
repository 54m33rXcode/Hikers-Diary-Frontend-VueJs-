<template>
    <div class="r-write-comment">
        <textarea type="text" class="r-write" v-model="reply" placeholder="Write comment"></textarea>
        
            <button class="submit" @click="submitReply">Comment</button>
            <button class="cross" @click="closeReplyBox">Cancel</button>
    
        
    </div>
</template>

<script>
import { useUserStore } from '@/store/userStore';
import axios from 'axios';
    export default {
        
        data(){
            return{
                reply:"",
                userStore: useUserStore(),
            }
        },

        props: {
              showReplyBox: {
              type: Boolean,
              required: true,
              },
              commentId:{
              type: Number,
              required: true,
              },
              postId: {
              type: Number,
              required: true,
              },
            },
        methods: {
           closeReplyBox() {
             this.$emit('close-replybox');
    },

    async submitReply(){
        try{
            const response = await axios.post(`https://localhost:44384/api/Comment/${this.commentId}/reply`,{
                commentId: this.commentId,
                postId: this.postId,
                commentorId: this.userStore.user.userId,
                replyId: 0,
                content: this.reply
            })
            alert("reply added")
            this.closeReplyBox()
        }
        catch(error){
            console.log(error)
        }
    }

  }
       
    }
</script>

<style>
.r-write-comment{
  width: 390px;
  height: 100px;
  margin-top: 4px;
  border-top: 1px solid rgb(38, 39, 35);
  position: relative;
  left: 90px;
  background-color: azure;
  margin-bottom: 3px;
}
.r-write{
    width: 375px;
    min-height: 55px;
    resize: none;
    line-height: 16px;
    vertical-align: bottom;
    padding-left: 5px;
    margin: 3px;
    border-radius: 3px;
}
.submit,.cross{
    width: fit-content;
    height: 30px;
    margin-left: 6px;
    border-radius: 9px;
}
</style>