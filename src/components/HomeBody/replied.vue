<template>
    <div class="r-written-comments" v-for="reply in replies" :key="reply.comment.replyId">
    <div class="r-picNcomments">
           <div class="commenter-photo"><img :src="reply.user.profile_Pic" alt="" ></div>
       
       <div class="r-Nam-Com">
           <div class="r-nam"><span >{{ reply.user.userName }}</span></div>
          <div class="r-com"><p >{{ reply.comment.content }}</p></div> 
       </div>
    </div>
</div>

</template>

<script>
import axios from 'axios';

   export default {
      props:{
         commentId: {
            type: Number,
            required: true,
            },
      },
       data(){
           return{
               replies:[],
           }
       },
       async mounted(){
         try{
            const response = await axios.get(`https://localhost:44384/api/CombinedPost/reply/${this.commentId}`)
            this.replies = response.data
            console.log(this.replies)
         }
         catch(error){
            console.log(error)
         }

       }

   }
</script>

<style>
.r-written-comments{
   width: 390px;
   height: fit-content;
   margin-top: 2px;
   margin-left: 5px;
   background-color: rgb(207, 16, 32);
   padding-top: 1px; 
   border-radius: 6px; 
   padding-bottom: 4px;
   position: relative;
   left: 86px;
   border: 0.5px solid black;
}
.r-picNcomments{
   width: 390px;
   height: fit-content;
   display: flex;
   flex-direction: row;
}
.r-commenter-photo{
 height: 40px;
 width: 40px;
 background-color: blue;
 border-radius: 50px;
 margin-top: 2px;
 margin-left: 2px;
}
.r-commenter-photo img{
 height: 40px;
 width: 40px;
 border-radius: 50px;
 object-fit: cover;
}
.r-Nam-Com{
 height: auto;
 width: 340px;
 margin-top: 2px;
 margin-left: 3px;
 margin-bottom: 3px;
 display: flex;
 flex-direction: column;   
}
.r-nam{
   height: 18px;
   width: fit-content;
   padding: 2px;
}
.r-com{
   height: auto;
   padding: 3px;
   background-color: aliceblue;
   text-align: start;
   border-radius: 9px;
   align-items: flex-start;
}
.r-com p{
   margin: 0;
}
</style>