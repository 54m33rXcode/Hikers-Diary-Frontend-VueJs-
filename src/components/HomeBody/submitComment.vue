<template>
    <div class="write-comment">
        <textarea type="text" class="write" v-model="comment" placeholder="Write comment"></textarea>
        
            <button class="submit" @click="submitComment">Comment</button>
            <button class="cross" @click="clear(event)">Cancel</button>
    
        
    </div>
</template>

<script>
import axios from 'axios';

    export default {
        props:{
            postId: {
            type: Number,
            required: true,
            },
            currentUserId:{
            type: Number,
            required: true,
            }
        },
        
        data(){
            return{
                comment:"",
            }
        },
        methods:{
            clear(){
                this.comment=''
            },
            async submitComment(event){
                event.preventDefault();
                try{
                const response = await axios.post(`https://localhost:44384/api/Comment`,{
                    commentId:0,
                    postId:this.postId,
                    commentorId: this.currentUserId,
                    replyId: null,
                    content:this.comment
                })
              alert("commented")
              this.clear()
            }catch(error){
                console.log(error)
            }
                
            }

        }
    }
</script>

<style>
.write-comment{
  width: 515px;
  height: 100px;
  position: sticky;
  margin-top: 4px;
  
  bottom: 0px;
  border-top: 1px solid rgb(38, 39, 35);
  background-color: wheat;
}
.write{
    width: 475px;
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