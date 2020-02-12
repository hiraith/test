
<template>

    <div class="list row">

        <div>
            <subMenu></subMenu>
        </div>
        <div class="col-md-20">
            <br>
            <h4>{{this.board_name}} 게시판</h4>
            <hr>
            <div>
                <form class="form-inline my-2 my-lg-0 searchbar">
                    <input class="form-control mr-sm-2" type="text" placeholder="Search">
                    <button class="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
                </form>
            </div>
            <table class="table table-hover AllPost">
                <thead>
                <tr class="table-primary">
                    <td width="10%">번호</td>
                    <td width="15%">작성자</td>
                    <td>제목</td>
                    <td width="20%">작성일</td>
                    <td width="10%">조회수</td>
                </tr>
                </thead>
                <tbody>
                <tr id="text-over" v-for="(post, index) in currentPosts" :key="index">
                    <td>{{post.post_id}}</td>
                    <td>{{post.post_writer}}</td>
                    <td class="maljul"><router-link :to="{
                            name: 'dep_post-details',
                            params: { post: post, post_id: post.post_id }
                        }">

                        <span >{{post.post_subject}}</span>
                    </router-link></td>
                    <td>{{post.created}}</td>
                    <td>{{post.post_views }}</td>

                </tr>

                </tbody>
            </table>
            <button class="btn btn-primary" type="button" style="position: absolute; left: 80%;" @click="write">글쓰기</button>
            <div class="pagebox">
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

    </div>
</template>
<script>
    import http from "../../http-common";
    import PostSubmenu from "./PostSubmenu";

    export default {
        name: "DepPage",
        data(){
            return{
                dep_board :[],
                board_name : "",
                dep_id : "",
                currentPosts: [],
                count: 0,
                countList:5,
                totalPage:1,
                page:1,
                countPage:5,
                startPage:1,
                endPage:0,
                totalPages: [],
                currentPages: [],
            };

        },
        components: {
            subMenu: PostSubmenu
        },

        methods: {

            //PostSubmenu 에서 보내준 param 값을 억지로 집어 넣어주는 메서드
            //원래 parameter로 넘어가야하는데 갑자기 값이 안들어감 그래서 억지로 넣어준것임.
            write(){
                this.$router.push({
                    path:'/dep_pst/add'
                })
            },
            setBoard(){
                this.board = this.$route.params;
                this.board_name = this.$route.params.board_name;
                this.BoardAll();

            },

            //부서별로 출력하기 위하여 부서 name 에 해당하는 모든 정보들을 가져오는 메서드
            BoardAll(){
                http
                .get("/pst/dep_posts/"+this.board_name)
                .then(response =>{
                    this.dep_board=response.data;
                    this.setCurrentPosts();
                    this.setPagination();
                })

            },
            getEmpInfo(id) {    // 매개변수 id는 this.employee.emp_id 이다. : mounted()때 호출되는 메소드.
                http
                    .post("/mypage/" + id)
                    .then(response => {
                        // 응답 데이터를 employee 데이터에 대입하기.
                        this.dep_id = response.data.dep_id;
                    })
                    .catch(e => {
                        /* eslint-disable no-console */
                        console.log(e);
                    });
            },
            changePage(pageNum) {
                this.page = pageNum;
                this.setCurrentPosts();
            },
            setCurrentPosts() {
                this.currentPosts = [];
                let j = (this.page-1) * this.countList;
                for(let i=0; i<this.countList && j < this.dep_board.length; i++) {
                    this.currentPosts[i] = this.dep_board[j];
                    j++;
                }

            },
            setPagination() {
                this.count = this.dep_board.length;
                this.totalPage = this.count / this.countList; // 총 페이지 개수
                if(this.count % this.countList > 0){
                    this.totalPage = Math.ceil(this.totalPage); // 나머지가 있으면 totalPage 하나 더 추가 (올림)
                }

                if(this.totalPage < this.page){
                    this.page=this.totalPage;
                }
                for(let i=0; i<this.totalPage; i++) {
                    this.totalPages[i] = i+1;
                }
                this.startPage = ((this.page -1)/this.countPage) * this.countPage +1; // 시작 페이지
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
            }


        },
        mounted() {
            // mounted 될 때 로그인이 되어있는 상태라면
            if (sessionStorage.length > 0) { // 현재 sessionStorage에 요소가 존재하는 상태일 때(로그인이 되어서 sessionStorage에 저장된 상태일 때)
                this.empID = sessionStorage.getItem("login_id"); // 이 컴포넌트에 선언된 empID 변수에 현재 로그인한 사번 넣기
                this.getEmpInfo(this.empID);    // 로그인 한 사원의 부서 번호를 가져오기 위한 메소드
                this.setBoard();

            } else {
                this.$router.push("/");
            }
        },
        // router에 주소값이 변경이 되지만 parameter로 넘겨준 값은 한번만 적용이된다 .
        // 그래서 parameter 로 넘겨준 다른 값을 하나의 컴포넌트에서 전환이 필요하면 이 메서드를 사용하여 값을 변경시켜줘야한다.
        beforeRouteUpdate (to, from, next) {
            this.board = to.params;
            this.board_name = to.params.board_name;
            this.BoardAll();
            next();
        },


    };
</script>

<style>
    .AllPost{
        width: 120%;
    }
    .searchbar{
        position: absolute;
        right: 13%;
        top: 15%;
    }

</style>