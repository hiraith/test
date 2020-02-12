<template>
    <div class="newBoard"><h4 style="font-weight: bold">새 게시판 만들기</h4><br>
        <div>
            <div>
                <subMenu></subMenu>
            </div>

            <div v-if="!submitted">
                <!--        사용자 정보 입력란-->
                <div class="newcontent">
                    <div class="form-group " >
                        <label style="font-weight: bold; margin-left: 30%;">작성자</label>
                        <input type="text" class="form-control " style="width: 150%;" id="writer" required v-model="post.post_writer" name="writer" placeholder="작성자" readonly>


                    </div>  <br>
                    <div class="form-group ">
                        <label style="font-weight: bold; margin-left: 30%;">게시판 명</label>
                        <input type="text" class="form-control" style="width: 150%;" id="subject" required v-model="board_name" name="subject" placeholder="게시판 명">
                    </div>

                    <br>
                </div>
                <div class="boardbutton">
                <button v-on:click="saveBoard" class="btn btn-success">등록하기</button>
                <button class="btn btn-danger" @click="backlist">취소하기</button>
                </div>
            </div>

            <div v-else>
                <h4>게시물이 등록 되었습니다 !!</h4>
                <button class="btn btn-success" @click="backlist">돌아가기</button>
            </div>
        </div>
    </div>

</template>

<script>
    import PostSubmenu from "./PostSubmenu";
    import http from "../../http-common";
    import router from "../../router";

    export default {
        name: "board",
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
                dep_id: "",
                board_name:""



            };
        },
        components: {
            subMenu: PostSubmenu
        },
        methods: {

            /* eslint-disable no-console */
            //입력한 데이터 저장하는 메서드
            testbutton() {
                console.log(this.dep_id)
            },
            //새로운 게시판을 만들어 저장하는 메서드
            saveBoard(){
                var Board ={
                    board_name:this.board_name,
                    dep_id:this.dep_id
                };
                http
                    .post("/board/saveBoard",Board)
                    .then(response =>{
                    })
                alert("새 게시판이 등록되었습니다!!");
                this.$router.push("/dep_pst");
            },
            //이전 페이지로 돌아가는 메서드
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
                        this.dep_id = response.data.dep_id;
                        console.log(this.dep_id+" 받아 온 depID?")
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
            }
        },
        mounted() {
            // mounted 될 때 로그인이 되어있는 상태라면
            if (sessionStorage.length > 0) { // 현재 sessionStorage에 요소가 존재하는 상태일 때(로그인이 되어서 sessionStorage에 저장된 상태일 때)
                this.empID = sessionStorage.getItem("login_id"); // 이 컴포넌트에 선언된 empID 변수에 현재 로그인한 사번 넣기
                this.getName(this.empID);   // empID로 사원명 가져오는 메소드 호출
            } else {
                this.$router.push("/");
            }
        },
        updated() {
            this.writeCheck();
        }
    };
</script>

<style scoped>

    .newBoard_cont{
        border: 1px solid #dddddd;
        border-radius: 10px;
        width: 40%;
        margin: 10px auto;
    }
    .newBoard_cont_form {
        width: 100%;

    }


    .btn btn-success{
        display: none;
    }
    .newBoard{

    }
    .newcontent{
        position: absolute;
        left: 42%;
    }
    .boardbutton{
        position: absolute;
        left: 45%;
        top: 50%;
    }
</style>