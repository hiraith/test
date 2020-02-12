<template>
    <div>
        <h4 style="margin: 20px; font-weight: bold">설문조사</h4>
    <div class="root3">
    <div v-if="this.survey">
        <div>

            <subMenu></subMenu>
        </div>


        <hr style="width: 80%; margin: 60px 60px 20px 75px;">
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

        <hr  style="width: 80%; margin-bottom: 50px;">
            <div class="qstbox">
                <label style="font-weight: bold; font-size: 30px;">  &nbsp;&nbsp;&nbsp;&nbsp;{{this.survey.survey_subject}}</label>
            </div>

        <div class="progressbox">
            1번 :   {{this.survey.answer1 }}({{Math.round(width1)}}%)
            <div class="progress">
                <div class="progress-bar bg-info" role="progressbar" :style="{width: width1+'%'}"></div>
            </div><br>

          2번 :  {{this.survey.answer2 }}({{Math.round(width2)}}%) &nbsp;

            <div class="progress">
                <div class="progress-bar bg-warning" role="progressbar" :style="{width: width2+'%'}"></div>
            </div><br>

           3번 :  {{this.survey.answer3 }}({{Math.round(width3)}}%)

            <div class="progress">
                <div class="progress-bar bg-danger" role="progressbar" :style="{width: width3+'%'}"></div>
            </div> <br>
            <small class="form-text text-muted" id="fileHelp">다중 선택 및 재투표는 불가능 합니다.</small>
            <small class="form-text text-muted" id="hihi">신중하게 선택하여 투표해 주시기 바랍니다.</small>

        </div>
<!--            총 참여자 수 : {{this.choice.length}} 명<br>-->
<!--&lt;!&ndash;            총 참여자 수 : {{this.emp_id}} 명<br>&ndash;&gt;-->
<!--            <li v-for="(choice, index) in choice" :key="index" class="page-item active" >-->
<!--                {{choice.emp_id}}-->
<!--            </li>-->
<!--        투표한 사람 {{this.emp_id}}-->
<!--        로그인 번호 {{this.empID}}<br>-->
            <button class="btn btn-success" type="button" @click="goBack">돌아가기</button>

            <button v-if="empID==10002"class="btn btn-primary" type="button" @click="deletePost">설문삭제</button>
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
            //원하는 시간 형식으로 바꿔서 출력해주는 메서드
            time(date){
                var moment=require("moment");

                return moment(date).format("YYYY년 MM월 DD일");
            },
            goBack(){
                  history.go(-1);
            },
            //2020-01-23 등록 메서드
            //저장된 설문들을 다 가져오는 메서드 해당 survey_id에 emp_id(투표한 사원) , selection(몇번을 선택했는지),
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
                })

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
        margin: 10px;
        padding: 20px 0 50px 0;
        position: absolute;
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
        margin: 0 auto;
        padding: 20px;
    }

    /*.qstbox {*/
    /*    position: absolute;*/
    /*    left: 10%;*/
    /*}*/

</style>