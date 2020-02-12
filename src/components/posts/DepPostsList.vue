<template>
    <div class="list row">

        <div>
            <subMenu></subMenu>
        </div>
        <div class="col-md-20">
           <br>
            <h4>부서 게시판</h4>
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

                        <span v-on:click="updateView(post.post_id)">{{post.post_subject}}</span>
                    </router-link></td>
                    <td>{{post.created}}</td>
                    <td>{{post.post_views }}</td>

                </tr>

                </tbody>
                <br>
                <button class="btn btn-primary" type="button" style="position: absolute; left: 80%;" @click="write">글쓰기</button>
            </table>
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
        <div class="col-md-6">
            <router-view @refreshData="refreshList"></router-view>
        </div>

    </div>

</template>

<script>
    import http from "../../http-common";
    import PostSubmenu from "./PostSubmenu";


    export default {
        name: "post-list",
        data() {
            return {
                posts: [],
                empID: "",
                dep_id: "",
                currentPosts: [],
                count: 0,
                countList:10,
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
            /* eslint-disable no-console */
            //dep_id(부서) 에 해당하는 모든 정보들을 가져오는 메서드
            retrieveBoards() {
                http
                    .get("/pst/posts/"+this.dep_id)
                    .then(response => {
                        this.posts = response.data; // JSON are parsed automatically.
                        this.setCurrentPosts();
                        this.setPagination();
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            setCurrentPosts() {
                this.currentPosts = [];
                let j = (this.page-1) * this.countList;
                for(let i=0; i<this.countList && j < this.posts.length; i++) {
                    this.currentPosts[i] = this.posts[j];
                    j++;
                }

            },
            setPagination() {
                this.count = this.posts.length;
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

            refreshList() {
                this.retrieveBoards(this.dep_id);
            },
            /* eslint-enable no-console */

            //게시판 글쓰기로 이동하는 메서드
            write(){
                this.$router.push({
                    path:'/dep_pst/add'
                })
            },

            //게시글을 수정하는 메서드
            updateView(p_id){

                http
                    .put("/pst/view/"+p_id)
                    .then(response =>{
                        // eslint-disable-next-line no-console
                        this.$emit("refreshData");
                        this.$router.push('/dep_pst/PostsList/'+p_id);
                    })
                    .catch(e =>{
                        // eslint-disable-next-line no-console
                        console.log(e);
                    });
            },
            getEmpInfo(id) {    // 매개변수 id는 this.employee.emp_id 이다. : mounted()때 호출되는 메소드.
                http
                    .post("/mypage/" + id)
                    .then(response => {
                        // 응답 데이터를 employee 데이터에 대입하기.
                        this.dep_id = response.data.dep_id;
                        this.retrieveBoards();
                        //console.log(this.dep_id);
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
                this.getEmpInfo(this.empID);

            } else {
                this.$router.push("/");
            }
        },



    };

</script>

<style>
    .list {

        text-align: left;
        max-width: 800px;
        margin: auto;
    }
    .sidelist{
        position: fixed;
        left: 0;
    }
    .maljul{
        text-overflow: ellipsis; overflow: hidden;
        width: 500px;
        white-space: nowrap;

    }
    .pagebox{
        position: relative;
        margin-top: 5%;
        margin-left: 40%;
    }
    .searchbar{
        position: absolute;
        right: 13%;
        top: 15%;
    }
    table{
        table-layout: fixed;

    }
    .AllPost{
        width: 120%;
    }
</style>