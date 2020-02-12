<template>
    <div>
        <h3 style="margin: 20px; font-weight: bold">게시판 등록</h3>
    <div class="root">
    <div>
        <div>
            <subMenu></subMenu>
        </div>

        <div v-if="!submitted"  class="ppo">
<!--        사용자 정보 입력란-->
            <div class="selectbox" style="margin-bottom:10px;">
            <label class="labelfont">게시판 선택 &nbsp;&nbsp;&nbsp;&nbsp; </label>
            <select class="custom-select" v-model="post.board_name">
                <option disabled value="">게시판명을 선택하세요</option>
                <option v-for="(board, index) in boards" :key="index">{{board.board_name}}</option>
            </select>
            </div>
            <hr>
            <br>
            <div class="form-group form-inline form-group-JH" >
                <label for="writer" class="labelfont">작성자&nbsp;&nbsp;&nbsp;</label>
                <input type="email" class="form-control col-sm-9" id="writer"required v-model="post.post_writer" name="writer" readonly>
            </div>
            <div class="form-group form-inline form-group-JH">
                <label for="writer" class="labelfont">제 &nbsp;&nbsp;&nbsp;&nbsp;목&nbsp;&nbsp;&nbsp;</label>
                <input type="email" class="form-control col-sm-9" id="subject"required v-model="post.post_subject" name="subject" aria-describedby="emailHelp" placeholder="게시글 제목">
            </div>
            <div class="form-group form-inline form-group-JH">
                <label for="writer" class="labelfont">작 성 란&nbsp;&nbsp;&nbsp;</label>
                <textarea  class="form-control col-sm-9" id="exampleTextarea" rows="10" required v-model="post.post_content" name="content" placeholder="1000자 내로 입력하세요"></textarea>
            </div>
            <br>
            <div class="form-group form-inline form-group-JH">
                <label for="exampleInputFile" class="labelfont">사진 업로드</label>
                <input class="form-control-file" id="exampleInputFile" aria-describedby="fileHelp" type="file">
                <small class="form-text text-muted" id="fileHelp">사진은 .jpg .png 만 지원합니다</small>
            </div>

        <button v-on:click="savePost" class="btn btn-success">게시물 등록</button> &nbsp;&nbsp;&nbsp;&nbsp;
            <button v-on:click="cnlth" class="btn btn-success">취소하기</button>
    </div>

    </div>
    </div>
    </div>
</template>

<script>
    import http from "../../http-common";
    import PostSubmenu from "./PostSubmenu";
    export default {
        name: "add-post",
        data() {
            return {
                post: {
                    post_id: "",
                    board_name: "",
                    post_writer: "",
                    post_subject: "",
                    post_content: "",
                    post_created: "",
                    post_view: ""
                },
                submitted: false,
                empID: "",
                post_dep_id: "",
                boards:[]
            };
        },
        components: {
            subMenu: PostSubmenu
        },
        methods: {

            /* eslint-disable no-console */
            //입력한 데이터 저장하는 메서드
            savePost() {
                var data = {
                    post_id: this.post.post_id,
                    board_name: this.post.board_name,
                    post_dep_id: this.post_dep_id,
                    post_writer: this.post.post_writer,
                    post_subject: this.post.post_subject,
                    post_content: this.post.post_content,
                    post_created: this.post.post_created,
                    post_view: this.post.post_view,
                    emp_id:this.emp_id
                };
                    if(data.post_subject==null || data.post_subject==""){
                        alert("게시글 제목을 입력하세요");
                    }else if(data.post_content==null || data.post_content=="") {
                        alert("내용을 입력하세요");
                    }else if(data.board_name==null || data.board_name==""){
                        alert("게시판을 선택하세요 !");
                    }else{
                        //입력한 데이터들을 컨트롤러에 보내주는 메서드
                        http
                            .post("/pst/post", data)
                            .then(response => {
                                this.post.post_id = response.data.post_id;
                                console.log(response.data);
                            })
                            .catch(e => {
                                console.log(e);
                            });
                        this.submitted = true;
                        alert("게시글을 성공적으로 등록하였습니다 !");
                        this.$router.push({
                            path: '/dep_pst'
                        });
                    }
            },
            //페이지 되돌리기
            backlist(){
                history.go(-1);
            },
            getName(login_id) {
                /* 사원번호에 해당하는 사원명 가져오는 메소드 */
                http
                    .post("/login/name/" + login_id)
                    .then(response => {
                        this.post.post_writer = response.data; // survey_writer 에 현재 로그인한 사원명이 들어감.
                    })
            }, // End - getName()
            getEmpInfo(id) {    // 매개변수 id는 this.employee.emp_id 이다. : mounted()때 호출되는 메소드.
                http
                    .post("/mypage/" + id)
                    .then(response => {
                        // 응답 데이터를 employee 데이터에 대입하기.
                        this.post_dep_id = response.data.dep_id;
                        this.getBoard();
                    })
                    .catch(e => {
                        /* eslint-disable no-console */
                        console.log(e);
                    });
            },
            writeCheck() {
                let write_chk = location.href.indexOf("dep_pst");  // dep_pst 가 포함되어 있으면 0(부서게시판) 이상의 숫자, 없으면 -1(전사게시판)
                console.log(write_chk);
                if(write_chk==-1) {
                    // 현재 전사 게시판 선택 상태
                    this.post_dep_id = 0;   //  post_dep_id 에 0넣기
                } else {
                    this.getEmpInfo(this.empID);    // empID로 사원정보 가져오기 : dep_id만 사용함
                }
            },
            //저장된 부서 board_name 을 불러오는 메서드
            getBoard(){
                http
                    .get("/board/getBoard/" + this.post_dep_id)
                    .then(response =>{
                        this.boards=response.data;
                    })

            },
            //입력을 취소하고 리스트로 돌아가는 메서드
            cnlth(){
                this.$router.push({
                    path:'/dep_pst/'
                })
            },
        },
        mounted() {
            // mounted 될 때 로그인이 되어있는 상태라면
            if (sessionStorage.length > 0) { // 현재 sessionStorage에 요소가 존재하는 상태일 때(로그인이 되어서 sessionStorage에 저장된 상태일 때)
                this.empID = sessionStorage.getItem("login_id"); // 이 컴포넌트에 선언된 empID 변수에 현재 로그인한 사번 넣기
                this.getName(this.empID);   // empID로 사원명 가져오는 메소드 호출
                this.writeCheck();
            } else {
                this.$router.push("/");
            }
        },
        // updated() {
        //     this.writeCheck();
        // }
    };
</script>

<style scoped>
    .ppo{
        text-align: center;
        max-width: 650px;
        width: 100%;
        margin: 0 auto;

    }
    .form-group-JH{
        width: 700px !important;
    }
    .root{
        width: 800px;
        border: silver solid 1px;
        margin-left: 25%;
        padding: 20px 0 50px 0;
        position: static;
        left: 24%;

    }
    .btn btn-success{
        display: none;
    }
    .selectbox{
        padding: 10px 0 0px 0;

    }
    .labelfont{
        font-weight: bold;
    }
</style>