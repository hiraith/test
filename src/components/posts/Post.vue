<template>
    <div class="root2">
    <div v-if="this.post">
        <div>
            <subMenu></subMenu>
        </div>
            <h4 style="margin: 20px; font-weight: bold">-{{this.post.board_name}} 게시판-</h4>
        <hr style="margin: 10px">
        <!--여기부터-->
        <div v-if="flex">
            <div class="subjectbox" style="font-weight: bold">
                <label >작성일 : </label> &nbsp;&nbsp;&nbsp;&nbsp;{{this.post.created}}
            </div>
            <div class="subjectbox" style="font-weight: bold">
                <label >작성자 : </label> &nbsp;&nbsp;&nbsp;&nbsp;{{this.post.post_writer}}
            </div>

            <div class="subjectbox" style="font-weight: bold">
                <label >제&nbsp;&nbsp;&nbsp;&nbsp;목 :</label> &nbsp;&nbsp;&nbsp;&nbsp;{{this.post.post_subject}}
            </div>

            <div class="card border-dark mb-5" style="max-width: 40rem;">
                <div class="card-body">
                    <h4 class="card-title"></h4>
                    <p class="card-text" >{{this.post.post_content}}</p>
                </div>
             </div>
              <div v-if="chkWriter()">
            <button class="btn btn-danger" type="button" @click="deletePost">게시물 삭제</button>
            <button class="btn btn-success" type="button" @click="modify">게시물 수정</button>

             </div>
        </div>
        <!--여기까지 div로 묶고 검사-->

        <div v-else class>
         <label>제목</label>
            <input type="text" class="form-control" id="subject"
                   required v-model="post.post_subject" name="subject">
            <label>내용</label>
            <textarea class="form-control textArea" rows="15" required v-model="post.post_content">{{post.post_content}}</textarea><br>

            <button class="btn btn-success" type="button" @click="updatePost">수정하기</button>
        </div>
        <div class="returnbtnbox">
            <button class="btn btn-primary" type="button" @click="goBack">돌아가기</button>
        </div>
        <br>

    </div>

    <div v-else>
        <br/>
        <p>Please click on a Board...</p>
    </div>
    </div>
</template>

<script>

    import http from "../../http-common";
    import PostSubmenu from "./PostSubmenu";

    export default {
        name: "post",
        data() {
            return{
                 flex: true, // 나중에 조건 검사하면 글 작성자==나 일때 false로 바꾸기
                 emp_id: "",
                 emp_name:""
            }
        },
        components: {
            subMenu: PostSubmenu
        },
        props: ["post"],
        methods: {
            goBack(){
                history.go(-1);
            },

            //게시된 게시글을 삭제하는 메서드
            deletePost() {
                http
                    .delete("/pst/delete/" + this.post.post_id)
                    .then(response => {
                        console.log(response.data);
                        this.$router.push('/pst');
                    })
                    alert("삭제되었습니다.")
                    .catch(e => {
                        console.log(e);
                    });
            },
            chkWriter(){
                if(this.emp_name == this.post.post_writer){
                    return true;
                }else{
                    return false;
                }

            },


            modify() {
                this.flex=false
            },
            //게시글을 수정하는 메서드
            updatePost() {
                let postData = {
                    post_subject : this.post.post_subject,
                    post_content : this.post.post_content,
                };
                http
                    .put("/pst/update/"+this.post.post_id, postData)
                    .then(response => {
                        console.log("수정완료");
                        alert("수정되었습니다")
                        this.$router.push("/pst/posts")
                    })
                    .catch(e => {
                        console.log(e);
                    });

            },
            getEmpInfo(id) {    // 매개변수 id는 this.employee.emp_id 이다. : mounted()때 호출되는 메소드.
                http
                    .post("/mypage/" + id)
                    .then(response => {
                        // 응답 데이터를 employee 데이터에 대입하기.
                        this.emp_name = response.data.emp_name;
                    })
                    .catch(e => {
                        /* eslint-disable no-console */
                        console.log(e);
                    });
            }


        },
        mounted() {
            // mounted 될 때 로그인이 되어있는 상태라면
            if (sessionStorage.length > 0) { // 현재 sessionStorage에 요소가 존재하는 상태일 때(로그인이 되어서 sessionStorage에 저장된 상태일 때)
                this.emp_id = sessionStorage.getItem("login_id"); // 이 컴포넌트에 선언된 empID 변수에 현재 로그인한 사번 넣기
                this.getEmpInfo(this.emp_id);
            } else {
                this.$router.push("/");
            }
        },


    };
</script>
<style scoped>
    .sidelist {
        position: fixed;
        left: 0;
    }
    .card {
        position: center;
        text-align: left;
        left: 400px;
        height: 400px;
    }
    .form-control {
        width: 60%;
        margin : auto;
    }
    .root2{
        width: 800px;
        border: silver solid 0px;
        margin-left: 25%;
        padding: 20px 0 50px 0;
        position: static;
        background-color: rgba(239,239,239,0.2);
        left: 24%;
        float: left;
    }
    .card{
        margin: 40px auto;
        left: 0;
        width: 80%;
    }
    .subjectbox{
        margin: 10px auto;
        left: 0;
        width: 80%;
        border: silver solid 0px;
        text-align: left;
    }
    .returnbtnbox{
        position: absolute;
        bottom: -9.5%;
        left: 67%;
    }

</style>