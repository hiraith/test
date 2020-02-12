<template>
    <div>
        <div>
            <subMenu></subMenu>
        </div>
        <div class="sidelist">

        </div>
        <div class="col-md-20">
            <br>
            <h4>진행중인 설문</h4>
            <hr>
            <form class="form-inline my-2 my-lg-0 searchbar">
                <input class="form-control mr-sm-2" type="text" v-on:keyup="SurveySearch" id="SearchSurvey" placeholder="Search"
                       required v-model="SearchSurvey" name="SearchSurvey">
                <button class="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
            </form>
            <table class="table table-hover Allsurvey">
                <thead>
                <tr class="table-primary">
                    <td width="10%">번호</td>
                    <td width="15%">작성자</td>
                    <td>제목</td>
                    <td width="15%" >시작일</td>
                    <td width="15%">종료일</td>
                </tr>
                </thead>
                <tbody>
                <tr id="text-over" v-for="(survey, index) in currentPosts" :key="index">
                    <td>{{survey.survey_id}}</td>
                    <td>{{survey.survey_writer}}</td>
                    <td class="maljul"><router-link :to="{
                            name: 'survey-details',
                            params: { survey: survey, survey_id: survey.survey_id}
                        }">

                        {{survey.survey_subject}}
                    </router-link></td>
                    <td>{{time(survey.start_date)}}</td>
                    <td>{{time(survey.end_date) }}</td>
                </tr>
                </tbody>
            </table>
        </div>
            <div class="pagebox_ser">
                <ul class="pagination">
                    <li class="page-item">
                        <button class="page-link" @click="gotoStart()">&laquo;</button>
                    </li>
                    <li class="page-item">
                        <button class="page-link" @click="prev()"><</button>
                    </li>
                    <li v-for="(pageNum, index) in currentPages" :key="index" class="page-item" :class="{'active':isSelected(index)}" >
                        <button class="page-link"  @click="changePage(pageNum)">{{pageNum}}</button>
                    </li>
                    <li class="page-item">
                        <button class="page-link" @click="next()">></button>
                    </li>
                    <li class="page-item">
                        <button class="page-link" @click="gotoEnd()">&raquo;</button>
                    </li>
                </ul>
            </div>
    </div>
</template>

<script>
    import http from "../../http-common";
    import SurveySubmenu from "./SurveySubmenu";
    export default {
        name: "SurveyList",
        data(){
            return{
                surveylist:[],
                keyword: "",
                currentPosts: [],//[ ] 현재 게시물을 보여주는 페이지
                empID: "",
                count: 0, //게시물 총 개수
                countList:5, // 한 페이지에 나올 게시글 개수
                totalPage:1, // 페이지 번호 묶음 (5 개씩 묶음)
                page:1, // 현재 페이지 번호
                countPage:5,//한 화면에 보여줄 페이지 번호
                startPage:1,
                endPage:0,
                totalPages: [],// total Page의 for결과값을 넣어줌
                currentPages: [], // 현재 페이지 번호들 배열 5개 짜리
                SearchSurvey:""
            };
        },
        components: {
            subMenu: SurveySubmenu
        },

        methods:{
            SurveySearch(){
                http
                    .get("/survey/survey/SearchSurvey/"+this.SearchSurvey)
                    .then(response =>{
                        this.currentPosts=response.data;
                    })
            },
            //저장된 설문들을 모두 요청하여 가져오는 메서드
            requestSurvey(){
                http
                .get("/survey/allsurvey")
                .then(response =>{
                    this.surveylist =response.data;
                    this.setPagination();
                    this.setCurrentPosts();
                })
                .catch(e =>{
                    console.log(e);
                })
            },
            setCurrentPosts() {
                this.currentPosts = [];
                let j = (this.page-1) * this.countList;
                for(let i=0; i<this.countList && j < this.surveylist.length; i++) {
                    this.currentPosts[i] = this.surveylist[j];
                    j++;
                }

            },
            setPagination() {
                //컨트롤러에서 요청받은 게시물들의 길이(int)를 넣어준다
                this.count = this.surveylist.length;

                //게시물 총 개수와 한 페이지에 나올 게시글 개수를 나눠
                //페이지 번호가 몇개로 나눠져야 하는지 계산
                this.totalPage = this.count / this.countList; // 총 페이지 개수

                //만약 나머지가 있으면 totalpage를 하나 더 추가한다
                if(this.count % this.countList > 0){
                    this.totalPage= Math.floor(this.totalPage);
                    this.totalPage++; // 나머지가 있으면 totalPage 하나 더 추가
                }
                //현재 페이지가 총 페이지보다 클 경우
                //총 페이지 번호 수를 현재 페이지에 대입한다.
                if(this.totalPage < this.page){
                    this.page=this.totalPage;
                }
                //totalPages 총 페이지수를 totalPage까지 넣는작업
                //0부터 넣어주기 때문에 i +1 을 통해 1부터 넣어준다.
                for(let i=0; i<this.totalPage; i++) {
                    this.totalPages[i] = i+1;
                }
                //시작 페이지를 구하는 작업
                this.startPage = ((this.page -1)/this.countPage) * this.countPage +1; // 시작 페이지
                //마지막 페이지를 구하는 작업
                if(this.totalPage < 5) {
                    this.endPage = this.totalPage;  // endPage 가 totalPage 와 같다
                } else {
                    this.endPage = this.startPage + this.countPage -1; // 마지막 페이지
                }
                //현재 페이지 번호를 구하는 작업
                this.currentPages = [];
                let j = this.startPage-1;
                for(let i=0; i<=(this.endPage-this.startPage) && j <
                this.totalPage; i++) {
                    this.currentPages[i] = this.totalPages[j];
                    j++;
                }


            },
            changePage(pageNum) {
                this.page = pageNum;
                this.setCurrentPosts();
            },
            prev() {
                if(this.startPage != 1) {
                    this.startPage = this.startPage -5;
                    this.page = this.startPage;
                    if(this.totalPage < 5) {
                        this.endPage = this.totalPage;  // endPage 가 totalPage 와 같다
                    } else {
                        this.endPage = this.startPage + this.countPage -1; // 마지막 페이지
                    }

                    this.currentPages = [];
                    let j = this.startPage-1;
                    for(let i=0; i<=(this.endPage-this.startPage) && j < this.totalPage; i++) {
                        this.currentPages[i] = this.totalPages[j];
                        j++;
                    }
                    this.setCurrentPosts();
                }
            },
            next() {
                if(this.endPage < this.totalPage) {
                    this.startPage = this.endPage +1;
                    this.page = this.startPage;
                    if(this.totalPage < 5) {
                        this.endPage = this.totalPage;  // endPage 가 totalPage 와 같다
                    } else {
                        this.endPage = this.startPage + this.countPage -1; // 마지막 페이지
                    }

                    this.currentPages = [];
                    let j = this.startPage-1;
                    for(let i=0; i<=(this.endPage-this.startPage) && j < this.totalPage; i++) {
                        this.currentPages[i] = this.totalPages[j];
                        j++;
                    }
                    this.setCurrentPosts();
                }

            },
            gotoStart() {
                this.changePage(1);
                this.setPagination()
            },
            gotoEnd() {
                let pack = Math.ceil(this.totalPage/this.countPage) // 몇덩이인지(페이지묶음수)
                for(let i=0; i<pack && pack>0; i++){
                    this.next()
                    this.changePage(this.totalPage);
                }
            },
            isSelected(index) {
                /* 선택된 class 바인딩 위해 return 반환하는 메서드*/
                if (index == (this.page-1)%this.countPage) {
                    return true
                } else {
                    return false
                }
            },


            time(date){
                var moment=require("moment");

                return moment(date).format("YYYY년 MM월 DD일");
            }

        },
        mounted() {
            // mounted 될 때 로그인이 되어있는 상태라면
            if (sessionStorage.length > 0) { // 현재 sessionStorage에 요소가 존재하는 상태일 때(로그인이 되어서 sessionStorage에 저장된 상태일 때)
                this.requestSurvey();
            } else {
                this.$router.push("/");
            }
        }

    };
</script>

<style scoped>
    .list {

        text-align: left;
        max-width: 800px;
        margin: auto;
    }
    .pagebox_ser{
        position: relative;
        margin-top: 5%;
        margin-left: 50%;
    }
    .sidelist{
        position: fixed;
        left: 0;
    }
    .searchbar{
        position: absolute;
        right: 13%;
        top: 15%;
    }
    .maljul{
        text-overflow: ellipsis; overflow: hidden;
        width: 500px;
        white-space: nowrap;

    }
    table{
        /*width: 80%;*/
        /*margin-left: 300px;*/
        table-layout: fixed;
    }
    .Allsurvey{
        width: 70%;
        margin-left: 23%;

    }
</style>