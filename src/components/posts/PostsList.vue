<template>
    <div class="list row">
        <div>
            <subMenu></subMenu>
        </div>
        <div class="col-md-20">
            <br>
            <h4>전사 게시판</h4>
            <hr>
            <div>
            <form class="form-inline my-2 my-lg-0 searchbar">
                <input class="form-control mr-sm-2" type="text" v-on:keyup="searchPost" id="SearchSubject" placeholder="Search"
                       required v-model="SearchSubject" name="SearchSubject">
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
                <tr id="text-over" v-for="(post, index) in currentPosts" :key="index" >
                    <td>{{post.post_id}}</td>
                    <td>{{post.post_writer}}</td>
                    <td class="maljul"><router-link :to="{
                            name: 'post-details',
                            params: { post: post, post_id: post.post_id }
                        }">

                        <span v-on:click="updateView(post.post_id)">{{post.post_subject}}</span>
                    </router-link></td>
                    <td>{{post.created}}</td>
                    <td>{{post.post_views }}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="col-md-6">
            <router-view @refreshData="refreshList"></router-view>
        </div>

        <button v-if="empID==10002"class="btn btn-primary" type="button" @click="write">글쓰기</button>

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

</template>

<script>
    import http from "../../http-common";
    import PostSubmenu from "./PostSubmenu";


    export default {
        name: "post-list",
        data() {
            return {
                posts: [],//모든 게시물을 저장하는 변수
                currentPosts: [],//[ ] 현재 게시물을 보여주는 페이지
                empID: "",
                count: 0, //게시물 총 개수
                countList:10, // 한 페이지에 나올 게시글 개수
                totalPage:1, // 페이지 번호 묶음 (5 개씩 묶음)
                page:1, // 현재 페이지 번호
                countPage:5,//한 화면에 보여줄 페이지 번호
                startPage:1,
                endPage:0,
                totalPages: [],// total Page의 for결과값을 넣어줌
                currentPages: [], // 현재 페이지 번호들 배열 5개 짜리

                SearchSubject:""//찾기


            };

        },
        components: {
            subMenu: PostSubmenu
        },
        methods: {
            /* eslint-disable no-console */

            //dep_pst 가 포함되어 있으면 0(부서게시판) 이상의 숫자, 없으면 -1(전사게시판)
            retrieveBoards() {
                http
                    .get("/pst/posts/"+0)
                    .then(response => {
                        this.posts = response.data; // JSON are parsed automatically.
                        this.setPagination();
                        this.setCurrentPosts();
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            //현재 페이지 번호에 따른 게시물들을 구하는 메서드
            setCurrentPosts() {
                this.currentPosts = [];
                let j = (this.page-1) * this.countList;
                for(let i=0; i<this.countList && j < this.posts.length; i++) {
                    this.currentPosts[i] = this.posts[j];
                    j++;
                }

            },
            setPagination() {
                //컨트롤러에서 요청받은 게시물들의 길이(int)를 넣어준다
                this.count = this.posts.length;

                //게시물 총 개수와 한 페이지에 나올 게시글 개수를 나눠
                //페이지 번호가 몇개로 나눠져야 하는지 계산
                this.totalPage = this.count / this.countList; // 총 페이지 개수

                //만약 나머지가 있으면 totalpage를 하나 더 추가한다
                if(this.count % this.countList > 0){
                    this.totalPage = Math.ceil(this.totalPage); // 나머지가 있으면 totalPage 하나 더 추가 (올림)
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
            searchPost(){
                http
                    .get("/pst/pst/SearchSubject/"+this.SearchSubject)
                    .then(response =>{
                        this.currentPosts = response.data;

                    })
            },
            refreshList() {
                this.retrieveBoards();
            },
            /* eslint-enable no-console */
            write(){
                this.$router.push({
                    path:'/pst/add'
                })
            },
            updateView(p_id){

                http
                    .put("/pst/view/"+p_id)
                    .then(response =>{
                        // eslint-disable-next-line no-console
                        this.$emit("refreshData");
                        this.$router.push('/pst/PostsList/'+p_id);
                    })
                    .catch(e =>{
                        // eslint-disable-next-line no-console
                        console.log(e);
                    });
            },

            //몇 번 페이지 번호를 눌렀는지
            //번호를 누를때마다 setCurrentPosts가 실행된다.
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
                this.retrieveBoards();
                this.empID = sessionStorage.getItem("login_id"); // 이 컴포넌트에 선언된 empID 변수에 현재 로그인한 사번 넣기
                // this.paging();
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
    .AllPost{
        width: 120%;
    }

    table{
        table-layout: fixed;
    }

</style>