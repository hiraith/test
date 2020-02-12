<template>

    <div class="container">

        <h2 style="float: left; margin-left: 200px">참조/열람</h2>

        <form class="form-inline my-2 my-lg-0" style="margin-bottom: 2px;">
            <fieldset>
                <select class="custom-select" style="width: 70px; margin-right: 10px;  margin-top: 10px;" required
                        v-model="select">
                    <!--<option :value="selected">제목</option>
                    <option :value="selected">내용</option>-->
                    <option v-for="(type,index) in selected" :key="index">{{type}}</option>

                </select>

                <input class="form-control mr-sm-2" type="text" placeholder="Search"
                       style="margin-right: 0px !important;  margin-top: 10px;" v-model="query">
                <button class="btn btn-secondary my-2 my-sm-0" type="button"
                        style="margin-left: 0px;  margin-top: 10px !important;" @click="sendQuery">Search
                </button>
            </fieldset>
        </form>

        <div class="list row">
            <subMenu></subMenu>
        </div>

        <table class="table table-hover shtable">
            <thead>
            <tr class="table-primary">
                <th scope="col">No</th>
                <th scope="col">부서</th>
                <th scope="col">문서번호</th>
                <th scope="col">유형</th>
                <th scope="col">문서제목</th>
                <th scope="col">기안자</th>
                <th scope="col">기안일</th>
            </tr>
            </thead>
            <tbody>

            <!--로그인 정보에서 받아올 부분-->
            <tr class="table-light" v-for="(app, index) in currentPosts" :key="index">
                <td>{{currentPosts.length-index}}</td>
                <td>{{app.app_writer_depname}}</td>
                <td>{{app.app_doc_num}}</td>
                <td>{{app.app_type}}</td>
                <td>
                    <router-link :to="{
                        name : 'ref-details',
                        params:{appProps : app, id : app.app_doc_num}
                    }">
                        {{app.app_doc_title}}
                    </router-link>
                </td>
                <td>{{app.app_writer_name}}</td>
                <td>{{app.app_date}}</td>

            </tr>
            </tbody>
        </table>
        <div class="paging">
            <ul class="pagination">
                <li class="page-item">
                    <button class="page-link" @click="gotoStart()">&laquo;</button>
                </li>
                <li class="page-item">
                    <button class="page-link" @click="prev()"><</button>
                </li>
                <li v-for="(pageNum, index) in currentPages" :key="index" class="page-item"
                    :class="{'active':isSelected(index)}">
                    <button class="page-link" @click="changePage(pageNum)">{{pageNum}}</button>
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
    import ApprovalSubMenu from "./ApprovalSubMenu";
    // import {EventBus} from "../../event-bus";

    export default {
        name: "reference",
        data: function () {
            return {
                login_id: "",
                approvals: [],
                a: 0,
                approvalFilter: [],
                selected: ["제목", "내용"],
                select: "제목",
                query: "",

                posts: [],//모든 게시물을 저장하는 변수
                currentPosts: [],//[ ] 현재 게시물을 보여주는 페이지
                empID: "",//empID 변수에 현재 로그인한 사번
                count: 0,//게시물 총 개수
                countList: 10, // 한 페이지에 나올 게시글 개수
                totalPage: 1, // 페이지 번호 묶음 ex) < 1 2 3 4 5 >
                page: 1, // 현재 페이지 번호
                countPage: 5,//한 화면에 보여줄 페이지 번호
                startPage: 1,//시작 페이지
                endPage: 0,// 끝 페이지
                totalPages: [],// total Page의 for결과값을 넣어줌
                currentPages: []  //현재 페이지 번호
            };
        },
        components: {
            subMenu: ApprovalSubMenu
        },
        methods: {

            getApprovals(id) {
                http
                    .get("/app/all")
                    .then(response => {
                        this.approvals = response.data;
                        this.re(this.approvals);
                        this.setPagination();
                        this.setCurrentPosts();

                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            sendQuery() {
                this.approvals = [];
                let q = this.query;
                let r = [];
                if (this.select == "제목") {
                    http
                        .get("/app/writer/title/" + q)
                        .then(Response => {
                            r = Response.data;
                            console.log("r");
                            console.log(r);
                            this.re(r)
                            console.log('this.posts')
                            console.log(this.posts)
                            if(this.posts.length == 0) {
                                alert("검색결과가 없습니다!");
                                location.reload();
                            }else{
                                this.currentPosts = [];
                                this.setPagination();
                                this.setCurrentPosts();
                            }
                        })
                } else if (this.select == "내용") {
                    http
                        .get("/app/writer/content/" + q)
                        .then(Response => {
                            r = Response.data;
                            this.re(r)
                            console.log('this.posts')
                            console.log(this.posts)
                            if(this.posts.length == 0) {
                                alert("검색결과가 없습니다!");
                                location.reload();
                            }else{
                                this.setPagination();
                                this.setCurrentPosts();
                            }
                        })
                }
            },
            isSelected(index) {
                /* 선택된 class 바인딩 위해 return 반환하는 메서드*/
                if (index == (this.page - 1) % this.countPage) {
                    return true
                } else {
                    return false
                }
            },
            re(app) {
                let idx = 0;
                this.approvalFilter = [];
                this.posts = [];
                for (var i = 0; i < app.length; i++) {

                    if ((app[i].app_status_check == 'ing' || app[i].app_status_check == 'complete')
                        && (app[i].app_ref_id1 == this.login_id || app[i].app_ref_id2 == this.login_id ||app[i].app_ref_id3 == this.login_id)) {
                        this.approvalFilter[idx++] = app[i];
                    }
                }
                this.posts = this.approvalFilter;
            },
            setPagination() {
                this.count = this.posts.length;
                this.totalPage = this.count / this.countList; // 총 페이지 개수

                if (this.count % this.countList > 0) {
                    this.totalPage = parseInt(this.totalPage);
                    this.totalPage++; // 나머지가 있으면 totalPage 하나 더 추가

                }
                if (this.totalPage < this.page) {
                    this.page = this.totalPage;
                }

                for (let i = 0; i < this.totalPage; i++) {
                    this.totalPages[i] = i + 1;
                }

                this.startPage = ((this.page - 1) / this.countPage) * this.countPage + 1; // 시작 페이지

                if (this.totalPage < 5) {
                    this.endPage = this.totalPage;  // endPage 가 totalPage 와 같다
                } else {
                    this.endPage = this.startPage + this.countPage - 1; // 마지막 페이지
                }

                this.currentPages = [];
                let j = this.startPage - 1;
                for (let i = 0; i <= (this.endPage - this.startPage) && j <
                this.totalPage; i++) {
                    this.currentPages[i] = this.totalPages[j];
                    j++;
                }
            },
            setCurrentPosts() {
                this.currentPosts = [];
                let j = (this.page - 1) * this.countList;
                for (let i = 0; i < this.countList && j < this.posts.length; i++) {
                    this.currentPosts[i] = this.posts[j];
                    j++;
                }
            },

            changePage(pageNum) {
                this.page = pageNum;
                this.setCurrentPosts();
            },
            prev() {
                if (this.startPage != 1) {
                    this.startPage = this.startPage - 5;
                    this.page = this.startPage;
                    if (this.totalPage < 5) {
                        this.endPage = this.totalPage;  // endPage 가 totalPage 와 같다
                    } else {
                        this.endPage = this.startPage + this.countPage - 1; // 마지막 페이지
                    }

                    this.currentPages = [];
                    let j = this.startPage - 1;
                    for (let i = 0; i <= (this.endPage - this.startPage) && j < this.totalPage; i++) {
                        this.currentPages[i] = this.totalPages[j];
                        j++;
                    }
                    this.setCurrentPosts();
                }
            },
            next() {
                if (this.endPage < this.totalPage) {
                    this.startPage = this.endPage + 1;
                    this.page = this.startPage;
                    if (this.totalPage < 5) {
                        this.endPage = this.totalPage;  // endPage 가 totalPage 와 같다
                    } else {
                        this.endPage = this.startPage + this.countPage - 1; // 마지막 페이지
                    }

                    this.currentPages = [];
                    let j = this.startPage - 1;
                    for (let i = 0; i <= (this.endPage - this.startPage) && j < this.totalPage; i++) {
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
                let pack = Math.ceil(this.totalPage / this.countPage)//몇덩이인지(페이지묶음수)
                for (let i = 0; i < pack; i++)
                    this.next()
                this.changePage(this.totalPage);
            }
        },
        mounted() {
            /*페이지 로딩전 id에서 session으로 접근, 데이터 가져오는 로직*/

            if (sessionStorage.length > 0) {
                this.login_id = sessionStorage.getItem("login_id");
                this.getApprovals(this.login_id);
            } else {
                alert("로그인을 해주세요!");
                this.$router.push('/');
            }

        }
    }
</script>

<style scoped>

    .list {
        text-align: left;
        max-width: 450px;
        margin: auto;
    }
    .table{

        margin: auto auto auto 150px;
        width: 1000px;

    }
    .form-inline {
        margin-top: 200px;
        /*margin-left: 47%;*/
        float: right;
        margin-right: 0px;
    }

    .paging {
        margin-top: 40px;
        margin-left: 50%;

    }
</style>