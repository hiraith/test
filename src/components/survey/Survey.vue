<template>
    <div class="root3">
        <div>
            <subMenu></subMenu>
        </div>
    <div>
        <h4 style="margin: 20px; font-weight: bold">설문조사</h4>

    <div v-if="this.survey" class="rootbox">



        <hr style="width: 80%; margin: 20px 60px 20px 75px;">
        <!--여기부터-->

        <div class="subjectbox_survey" style="font-weight: bold">
            <label >작성자 : </label> &nbsp;&nbsp;&nbsp;&nbsp;{{this.survey.survey_writer}}
        </div>
        <div class="subjectbox_survey" style="font-weight: bold">
            <label >시작일 : </label> &nbsp;&nbsp;&nbsp;&nbsp;{{time(this.survey.start_date)}}
        </div>
        <div class="subjectbox_survey" style="font-weight: bold">
            <label >종료일 : </label> &nbsp;&nbsp;&nbsp;&nbsp;{{time(this.survey.end_date)}}
        </div>


        <hr  style="width: 80%; margin-bottom: 20px;">

            <div class="qstbox">
                <label style="font-weight: bold; font-size: 25px;">  &nbsp;&nbsp;&nbsp;&nbsp;{{this.survey.survey_question}}</label>
            </div>

        <div class="progressbox">
            1번 :   {{this.survey.answer1 }}({{width1}}%)&nbsp;&nbsp;<input v-if="!flag" type="radio" id="one" name="a" :value="1" v-model="survey.answer">
            <div class="progress">                                  <!--:style="{ color: activeColor, 'font-size': fontSize + 'px' }"-->
                <div class="progress-bar bg-info" role="progressbar" :style="{width: width1+'%'}"></div>
            </div><br>

          2번 :  {{this.survey.answer2 }}({{width2}}%) &nbsp;&nbsp; <input v-if="!flag" type="radio" id="two" name="a" :value="2" v-model="survey.answer"><br>

            <div class="progress">
                <div class="progress-bar bg-warning" role="progressbar" :style="{width: width2+'%'}"></div>
            </div><br>

           3번 :  {{this.survey.answer3 }}({{width3}}%)&nbsp;&nbsp; <input v-if="!flag" type="radio" id="three" name="a" :value="3" v-model="survey.answer"><br>

            <div class="progress">
                <div class="progress-bar bg-danger" role="progressbar" :style="{width: width3+'%'}"></div>
            </div> <br>
            <small class="form-text text-muted" id="fileHelp">다중 선택 및 재투표는 불가능 합니다.</small>
            <small class="form-text text-muted" id="hihi">신중하게 선택하여 투표해 주시기 바랍니다.</small>

        </div>
        <br>
        <span style="font-weight: bold">총 참여자 수 : {{this.choice.length}} 명</span><br>
            <br><br>
            <button v-if="!flag" class="btn btn-success" type="button" @click="savevote">투표하기</button>
            <button class="btn btn-primary" type="button" @click="goBack">돌아가기</button>


            <button v-if="empID==10002"class="btn btn-danger" type="button" @click="deletePost">설문삭제</button>
        </div>
        <!--여기까지 div로 묶고 검사-->
        <div v-else>
            <label>제목</label>
            <input type="text" class="form-control" id="subject"
                   required v-model="survey.survey_subject" name="subject">
            <label>내용</label>
            <textarea class="form-control textArea" rows="15" required v-model="survey.survey_detail">{{survey.survey_detail}},


            </textarea><br>

<!--            <button class="btn btn-success" type="button" @click="updatePost">수정하기</button>-->
        </div>

    </div>
    </div>
</template>

<script>
    import http from "../../http-common";
    import SurveySubmenu from "./SurveySubmenu";
    import VueApexCharts from 'vue-apexcharts';
    export default {
        name: "survey",

        data() {

            return {
                flex: "",// 나중에 조건 검사하면 글 작성자==나 일때 false로 바꾸기
                flag:"",
                empID: "", //현재 로그인 된 empID를 가져온다.
                //2020-01-23 지역 변수 설정
                // selection: [],
                emp_id:[],
                choice:[],
                width1 : 0, // 설문 1번 대답에 대한 %
                width2 : 0, // 설문 2번 대답에 대한 %
                width3 : 0, // 설문 3번 대답에 대한 % - width1 ~ width3 까지 더하면 총 100%
                s1:0,
                s2:0,
                s3:0,
                // select: 0

            }

        },
        components: {
            subMenu: SurveySubmenu
        },
        props: ["survey"],
        methods: {
            checkwidth(){
              if(this.width1==null || this.width1==""){
                  this.width1.toString(0);
              }
            },
            time(date){
                var moment=require("moment");

                return moment(date).format("YYYY년 MM월 DD일");
            },

            goBack(){
                  history.go(-1);
            },
            //사용자가 선택한 문항의 번호를 저장해주는 메서드 문항은 0,1,2 로 되어있다.
            savevote(){
                var vote ={
                    selection:this.survey.answer,
                    emp_id: this.empID,
                    survey_id: this.survey.survey_id
                };
                http
                .put("/survey/vote",vote)
                .then(response => {
                    // this.survey.answer =response.data.answer;
                    console.log("들어가는 값?"+response.data.selection);
                    console.log(vote+"selection")
                    // console.log(this.survey.answer)
                    alert("설문을 완료하셨습니다.")
                    this.$router.push('/survey');


                })

            },

            //2020-01-23 등록 메서드
            getvote(){
                console.log("설문 아이디 : " + this.survey.survey_id)
                http
                .get("/survey/getvote/"+this.survey.survey_id)
                .then(response => {
                    this.choice = response.data;
                    console.log("emp_id>>>>>>>>>>>>>>>"+this.choice.emp_id);
                    // choice 총 개수는 this.choice.length : 이 상황에서는 2개
                    // for 문 돌려서 총 choice 개수 만큼의 selection 갖고 오기 : 여기서는 2번만 2개니까 100%
                    // selection 이 1번인 총 개수를 width1에 넣고....width2, width3 도 마찬가지
                    // width1, width2, width3 의 각 퍼센트 구해서 위에 변수로 넣어주기
                    for(let i=0; i<this.choice.length;i++){
                        this.emp_id[i]=this.choice[i].emp_id;
                        console.log("넣어주는 emp>>>>>>>>>>>>>>"+this.emp_id);
                    }

                   this.checkVoter();

                    for(let i=0; i<this.choice.length;i++){
                        console.log(this.choice[i].selection + "selection");
                        if(this.choice[i].selection==1){

                            console.log(i + "for I " )
                            this.s1++;
                            console.log(this.s1 + "s1")
                        }else if(this.choice[i].selection===2){
                            this.s2++;
                        }else{
                            this.s3++;
                        }
                    }
                        this.width1=this.s1/this.choice.length * 100;
                        this.width2=this.s2/this.choice.length * 100;
                        this.width3=this.s3/this.choice.length * 100;

                });

            },
            checkVoter(){
                for(let i=0; i<this.emp_id.length; i++) {
                    if(this.empID == this.emp_id[i]) {
                        this.flag = true;// 투표한 사람과 현재 로그인 한 사람의 사번이 일치하면 flag에 true 대입
                        alert("이미 투표하신 설문입니다 !")
                    }
                }
            },
            deletePost() {
                http
                    .delete("/survey/deletesurvey/" + this.survey.survey_id)
                    .then(response => {
                        console.log(response.data);
                        // this.$emit("refreshData");
                        this.$router.push('/survey');
                    })
                alert("설문이 삭제되었습니다.");
            },

        },
        mounted() {
            // mounted 될 때 로그인이 되어있는 상태라면
            if (sessionStorage.length > 0) { // 현재 sessionStorage에 요소가 존재하는 상태일 때(로그인이 되어서 sessionStorage에 저장된 상태일 때)
                this.empID = sessionStorage.getItem("login_id");
                this.getvote();

            } else {
                this.$router.push("/");
            }
        },
        updated() {

        }
    };
</script>
<style>
    /*.sidelist {*/
    /*    position: fixed;*/
    /*    left: 0;*/
    /*}*/
    .card {
        position: center;
        text-align: left;
        left: 400px;
        height: 400px;
    }
    .progress {
        width: 60%;
        margin-left: 20%;
        height: 40px;
    }
    .root3{
        width: 800px;
        border: silver solid 1px;
        margin-left: 20% !important;
        padding: 20px 0 50px 0;
        position: static !important;
        left: 24%;

    }
    .subjectbox_survey{
        margin: 10px auto;
        left: 0;
        width: 80%;
        border: silver solid 0px;
        text-align: left;
    }
    .progressbox{
        border: #dddddd solid 1px;
        width: 80%;
        padding: 20px;
        margin-left: 25%;
    }

    /*.qstbox {*/
    /*    position: absolute;*/
    /*    left: 10%;*/
    /*}*/

</style>