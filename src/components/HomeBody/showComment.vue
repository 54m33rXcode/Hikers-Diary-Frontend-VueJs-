<template>
     <div class="written-comments"  v-for="comment in filteredComments" :key="comment.commentId">
        <div class="picNcomments">
            <div class="commenter-photo"><img :src="comment.user.profile_Pic" alt="" ></div>
        
        <div class="Nam-Com">
            <div class="nam"><span >{{ comment.user.userName }}</span></div>
           <div class="com"><p >{{ comment.comment.content }}</p></div> 
        </div>
        </div>
        
        <div class="reply-txt">
            <span @click="replybox=true">Reply</span>
        </div>
        <div class="r-text" v-if="replybox">
            <replycomment :show-replybox="replybox" @close-replybox="replybox = false" :commentId="comment.comment.commentId" :postId="comment.comment.postId"/>
        </div>
        <replied :commentId="comment.comment.commentId"/>
    </div>
</template>

<script>
import axios from 'axios'
import replycomment from '@/components/HomeBody/replycomment.vue'
import replied from '@/components/HomeBody/replied.vue'
    export default {
        props: {
            postId: {
            type: Number,
            required: true,
            },
        },    
        data(){
            return{
                comments:[],
                replybox:false
            }
        },

        async mounted(){
                 try{
                    const response = await axios.get(`https://localhost:44384/api/CombinedPost/comments/${this.postId}`)
                    this.comments = response.data
                    console.log(this.comments)
                 }catch(error){
                    console.log(error)
                 }
        },
        computed: {
    filteredComments() {
      return this.comments.filter(comment => comment.comment.replyId === null);
    }
  },
        components:{
            replycomment,
            replied
        }
    }
</script>

<style>
.written-comments{
    width: 490px;
    height: fit-content;
    margin-top: 2px;
    margin-left: 5px;
    background-color: rgb(207, 179, 16);
    padding-top: 1px; 
    border-radius: 6px; 
    padding-bottom: 4px;
    position: relative;
    border: 0.5px solid black;
}
.picNcomments{
    width: 490px;
    height: fit-content;
    display: flex;
    flex-direction: row;
}
.commenter-photo{
  height: 40px;
  width: 40px;
  background-color: blue;
  border-radius: 50px;
  margin-top: 2px;
  margin-left: 2px;
}
.commenter-photo img{
  height: 40px;
  width: 40px;
  background-color: rgb(0, 255, 21);
  border-radius: 50px;
  object-fit: cover;
}
.Nam-Com{
  height: auto;
  width: 440px;
  margin-top: 2px;
  margin-left: 3px;
  margin-bottom: 3px;
  display: flex;
  flex-direction: column;   
}
.nam{
    height: 18px;
    width: fit-content;
    padding: 2px;
}
.com{
    height: auto;
    padding: 3px;
    background-color: aliceblue;
    border-radius: 9px;
    align-items: flex-start;
}
.com p{
    
    margin: 0;
}
.reply-txt{
    height: 15px;
    width: fit-content;
    
    position: inherit;
    right:-440px;
    margin-top: 3px;
    bottom: 2px;
    cursor: pointer;
    
}


</style>