<template>                                                                  <!--외부주소록 메인-->
    <div class="list row">

        <div class="col-md-6">
            <h2>외부 주소록</h2>
            <hr>
            <!--전체, 회사별 정렬하기 위한 dropdown-->
            <form class="btn-group" role="group" style="margin-bottom: 10px; float: left">
                <select v-model="selected" @change="sort" type="button" class="btn btn-primary"
                        style="width: 90px; margin-right: 10px;  margin-top: 20px;" >
                    <option v-for="option in options" v-bind:value="option.value">
                        {{option.text}}
                    </option>
                </select>
            </form>


            <!--직원추가-->
            <div style="float: left">
                <button v-on:click="addOutAddress">직원 추가</button>
            </div>
            <div class="form-inline my-2 my-lg-0" style="margin-bottom: 2px; float: right">
                <!--성명,회사명으로 검색-->
                <fieldset>
                    <input type="text" class="form-control mr-sm-2" v-on:keypress="searchOutAddress"
                           placeholder="검색(성명, 회사명)" id="nameAndCompany"
                           required v-model="nameAndCompany" name="nameAndCompany">
                    <button class="btn btn-secondary my-2 my-sm-0" v-on:click="searchOutAddress">검색</button>
                    <button class="btn btn-secondary my-2 my-sm-0" v-on:click="refreshList">취소</button>
                </fieldset>
            </div>


            <table class="table table-hover" style="margin-top: 20px">                                 <!--출력-->
                <thead class="table-secondary">
                <td>이름</td>
                <td>휴대폰</td>
                <td>이메일</td>
                <td>회사</td>
                <td>회사번호</td>

                </thead>
                <tbody>
                <tr v-for="(outAddress,index) in currentPosts" :key="index">
                    <td>
                        <router-link :to="{
                            name: 'OutMgmDetail',
                            params: { outAddress: outAddress, out_id: outAddress.out_id }
                        }">
                            {{outAddress.outName}}
                        </router-link>
                    </td>
                    <td>{{outAddress.out_mobile}}</td>
                    <td>{{outAddress.out_email}}</td>
                    <td>{{outAddress.outCompany}}</td>
                    <td>{{outAddress.out_dep_phone}}</td>
                </tr>
                </tbody>
            </table>

            <div>
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

            <div class="col-md-6">
                <router-view @refreshData="refreshList"></router-view>
            </div>
        </div>
    </div>


</template>


<script>
    import http from "../../http-common";

    export default {
        name: "outManagement",

        data() {
            return {
                outaddress: [],
                nameAndCompany: "",
                out_id: "",
                selected: "0",
                options:[
                    {text:'정렬',     value: '0'},
                    {text:'전체',     value: '1'},
                    {text:'회사별',   value: '2'},
                    {text:'이름',     value: '3'}
                ],

                currentPosts:[],
                count: 0,   //총 길이
                countList:5, // 한 페이지에 나올 게시글 개수
                totalPage:1, // 페이지 번호 묶음 (5 개씩 묶음)
                page:1,
                countPage:5,
                startPage:1,
                endPage:0,
                totalPages: [],
                currentPages: [], // 현재 페이지 번호들 배열 5개 짜리
            };
        },

        methods: {
            setPagination() {
                this.count = this.outaddress.length;
                console.log(this.outaddress.length + "길이 찍어보기")
                this.totalPage = this.count / this.countList; // 총 페이지 개수
                if(this.count % this.countList > 0){
                    this.totalPage = Math.ceil(this.totalPage);
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

                this.currentPages = [];
                let j = this.startPage-1;
                for(let i=0; i<=(this.endPage-this.startPage) && j <
                this.totalPage; i++) {
                    this.currentPages[i] = this.totalPages[j];
                    j++;
                    console.log("curr "+ i + "번째 " + this.currentPages[i]);
                    console.log("startPage : "+this.startPage )
                    console.log("endPage : "+ this.endPage)
                    console.log("totalPage : " + this.totalPage)
                    console.log("totalPages : " + this.totalPages)

                }
            },
            retrieveOutAddress() {
                http
                    .get("/outaddress/outaddress")
                    .then(response => {
                        this.outaddress = response.data; // JSON are parsed automatically.
                        console.log(response.data);
                        this.setPagination();
                        this.setCurrentPosts();
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            setCurrentPosts() {
                this.currentPosts = [];
                let j = (this.page-1) * this.countList;
                for(let i=0; i<this.countList && j < this.outaddress.length; i++) {
                    this.currentPosts[i] = this.outaddress[j];
                    j++;
                }

            },
            SortOfOutCompany() {
                http
                    .get("/outaddress/outaddress/outCompany")
                    .then(response => {
                        this.outaddress = response.data;
                        console.log(response.data);
                        this.setPagination();
                        this.setCurrentPosts();
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            SortOfOutName(){
                http
                    .get("/outaddress/outaddress/outName")
                    .then(response => {
                        this.outaddress = response.data;
                        console.log("SortOfOutName "+response.data);
                        this.setPagination();
                        this.setCurrentPosts();
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },

            refreshList() {
                this.retrieveOutAddress();
                this.nameAndCompany = "";
            },

            searchOutAddress() {                                                         /*회사명, 성명으로 출력*/
                if (this.nameAndCompany == "") return;
                http
                    .get("/outaddress/outaddress/nameAndCompany/" + this.nameAndCompany)
                    .then(response => {
                        this.outaddress = response.data, // JSON are parsed automatically.
                            console.log(response.data);
                        this.setPagination();
                        this.setCurrentPosts();
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            addOutAddress() {
                this.$router.push('/manager/add-out-address')
            },
            sort() {
                console.log("selected"+this.selected);
                if (this.selected === '1') {
                    this.retrieveOutAddress();
                } else if (this.selected === '2') {
                    this.SortOfOutCompany();
                } else if(this.selected === '3'){
                    this.SortOfOutName();
                }
            },

            changePage(pageNum) {
                this.page = pageNum;
                this.setCurrentPosts();
                console.log(this.page)
            },
            isSelected(index) { //<< >>버튼 메서드, 눌렀을때 색깔 바뀌는거
                /* 선택된 class 바인딩 위해 return 반환하는 메서드*/
                if (index == (this.page-1)%this.countPage) {
                    return true
                } else {
                    return false
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
                        console.log("curr "+ i + "번째 " + this.currentPages[i]);
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
                        console.log("curr "+ i + "번째 " + this.currentPages[i]);
                    }
                    this.setCurrentPosts();
                }
            },
            gotoStart() {
                // location.reload();
                this.changePage(1);
                this.setPagination()
            },
            gotoEnd() {
                let pack = Math.ceil(this.totalPage/this.countPage)//몇덩이인지(페이지묶음수)
                for(let i=0; i<pack; i++)
                    this.next()
                this.changePage(this.totalPage);
            }

        },
        mounted() {
            if (sessionStorage.length > 0) { // 현재 sessionStorage에 요소가 존재하는 상태일 때(로그인이 되어서 sessionStorage에 저장된 상태일 때)
                this.retrieveOutAddress();
            } else {
                this.$router.push("/");
            }
        },
    }
</script>

<style scoped>
    .searchform {
        max-width: 300px;
        margin: auto;
    }


    .list {
        text-align: center;
        max-width: 90%;
        margin: auto;
    }

    #nameAndCompany {
        width: 200px;
    }

    .form-group, btn-group {
        float: right;
    }

</style>