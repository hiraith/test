<template>
    <div>
    <h3 style="margin: 20px; font-weight: bold">설문 등록하기</h3>
    <div class="root">
        <div class="submitform">
            <div>
                <subMenu></subMenu>
            </div>

            <div v-if="!submitted"  class="ppo">

                <div class="form-group form-inline " >
                    <label for="writer" class="labelfont">작성자</label>
                    <input type="text" class="form-control col-sm-9" id="writer" required v-model="survey.survey_writer" name="writer" placeholder="작성자" readonly>
                </div>

                <div class="form-group form-inline">
                    <label for="start_date" class="labelfont">시작일</label>
                    <input type="date" class="form-control col-sm-9" id="start_date" required v-model="survey.start_date" name="start_date" placeholder="설문 시작일">
                </div>
                <div class="form-group form-inline">
                    <label for="end_date" class="labelfont">종료일</label>
                    <input type="date" class="form-control col-sm-9" id="end_date" required v-model="survey.end_date" name="end_date" placeholder="설문 종료일">
                </div>

                <div class="form-group form-inline">
                    <label for="subject" class="labelfont">글제목</label>
                    <input type="text" class="form-control col-sm-9" id="subject" required v-model="survey.survey_subject" name="subject" placeholder="글 제목">
                </div>
                <div class="form-group form-inline">
                    <label for="question" class="labelfont">설&nbsp;&nbsp;&nbsp; 문</label>
                    <input type="text" class="form-control col-sm-9" id="question" required v-model="survey.survey_question" name="question" placeholder="설문 제목 ">
                </div>
                <div class="form-group form-inline">
                    <label for="answer1" class="labelfont">질문 1</label>
                    <input type="text" class="form-control col-sm-9" id="answer1" required v-model="survey.answer1" name="answer1" placeholder="설문 항목1">
                </div>

                <div class="form-group form-inline">
                    <label for="answer2" class="labelfont">질문 2</label>
                    <input type="text" class="form-control col-sm-9" id="answer2" required v-model="survey.answer2" name="answer2" placeholder="설문 항목2">
                </div>
                <div class="form-group form-inline">
                    <label for="answer3" class="labelfont">질문 3</label>
                    <input type="text" class="form-control col-sm-9" id="answer3" required v-model="survey.answer3" name="answer3" placeholder="설문 항목3">
                </div>

                <div class="form-group1 form-inline">
                    <label for="content" class="labelfont">설문 내용</label>
                    <textarea class="form-control col-sm-10" id="content" rows="10" required v-model="survey.survey_detail" name="content" placeholder="1000자 내로 입력하세요"></textarea>
                </div>
                <br>

                <button v-on:click="saveSurvey" class="btn btn-success" style="font-weight: bold;" >설문 등록</button>
                <button v-on:click="cnlth" class="btn btn-danger" style="font-weight: bold;" >취소하기</button>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
    import http from "../../http-common";
    import PostSubmenu from "../posts/PostSubmenu";
    import SurveySubmenu from "./SurveySubmenu";


    export default {
        name: "addsurvey",
        data() {
            return {
                survey: {
                    survey_id:"",
                    survey_writer:"",
                    survey_subject:"",
                    survey_detail:"",
                    survey_question:"",
                    answer1:"",
                    answer2:"",
                    answer3:"",
                    start_date:"",
                    end_date:""

                },
                submitted: false,
                empID: ""
            };
        },
        components: {
            subMenu: SurveySubmenu
        },

        methods: {
            //작성을 취소하고 리스트로 되돌아가는 메서드
            cnlth(){
                this.$router.push({
                    path:'/survey/'
                })
            },
            /* eslint-disable no-console */
            //입력 form에 작성한 녀석들을 변수 data 에 저장하여 controller 에 보내주는 메서드
            saveSurvey() {
                var data = {
                    survey_id: this.survey.survey_id,
                    survey_writer: this.survey.survey_writer,
                    survey_subject: this.survey.survey_subject,
                    survey_question: this.survey.survey_question,
                    survey_detail: this.survey.survey_detail,
                    start_date: this.survey.start_date,
                    end_date: this.survey.end_date,
                    answer1: this.survey.answer1,
                    answer2: this.survey.answer2,
                    answer3: this.survey.answer3
                };
                    if(data.survey_subject==null || data.survey_subject==""){
                        alert("게시글 제목을 입력하세요");
                    }else if(data.survey_question==null ||data.survey_question==""){
                        alert("설문 제목을 입력하세요");
                    }else if(data.survey_detail ==null || data.survey_detail==""){
                        alert("설문 내용을 입력하세요");
                    }else if(data.start_date ==null || data.start_date == ""){
                        alert("설문 시작일을 기재하세요");
                    }else if(data.end_date == null || data.end_date== ""){
                        alert("설문 종료일을 기재하세요");
                    }else if(data.answer1 ==null || data.answer1==""){
                        alert("질문 1 을 입력하세요");
                    }else if(data.answer2 ==null || data.answer2==""){
                        alert("질문 2 를 입력하세요");
                    }else if(data.answer3 == null || data.answer3==""){
                        alert("질문 3 을 입력하세요");
                    }else{
                http
                    .post("/survey/addsurvey", data)
                    .then(response => {
                        this.survey.survey_id = response.data.survey_id;
                        console.log(response.data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
                this.submitted = true;
                alert("설문을 성공적으로 등록하였습니다 !");
                this.$router.push({
                    path:'/survey'
                })
                    }

            },
            backlist(){
                this.$router.push({
                    path:'/survey'
                })
            },
            getName(login_id) {
                /* 사원번호에 해당하는 사원명 가져오는 메소드 */
                http
                    .post("/login/name/" + login_id)
                    .then(response => {
                        this.survey.survey_writer = response.data; // survey_writer 에 현재 로그인한 사원명이 들어감.
                    })
            } // End - getName()
        },
        mounted() {
            // mounted 될 때 로그인이 되어있는 상태라면
            if (sessionStorage.length > 0) { // 현재 sessionStorage에 요소가 존재하는 상태일 때(로그인이 되어서 sessionStorage에 저장된 상태일 때)
                this.empID = sessionStorage.getItem("login_id"); // 이 컴포넌트에 선언된 empID 변수에 현재 로그인한 사번 넣기
                this.getName(this.empID);   // empID로 사원명 가져오는 메소드 호출
            } else {
                this.$router.push("/");
            }
        }
    };
</script>

<style scoped>
    .submitform{
         max-width: 800px;
         margin: auto;
         border: solid lightgray 0px ;

     }
    .form-group{
        width: 700px !important;
    }
    .sidelist {
        width: 15%;
        left: 0;
    }
    .ppo{
        text-align: center;
        max-width: 650px;
        width: 100%;
        margin: 0 auto;

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
    .labelfont{
        font-weight: bold;
        margin-right: 10px;
    }

</style>