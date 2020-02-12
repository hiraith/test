<template>                                                                  <!--외부주소록 메인-->
    <div class="list row">
        <AddressSubMenu></AddressSubMenu>
        <div >
            <h4>외부 주소록</h4>
            <hr>
            <div class="form-inline my-2 my-lg-0" style="margin-bottom: 2px; float: right">
                <!--성명,회사명으로 검색-->
                <fieldset>
                    <input type="text" class="form-control mr-sm-2" v-on:keypress="searchOutAddress"
                           placeholder="성명, 회사명 입력" id="nameAndCompany"
                           required v-model="nameAndCompany" name="nameAndCompany"/>

                    <button class="btn btn-secondary my-2 my-sm-0" v-on:click="searchOutAddress">검색</button>
                    <button class="btn btn-secondary my-2 my-sm-0" v-on:click="refreshList">취소</button>
                </fieldset>
            </div>


            <table boder="2" class="table table-hover" style="margin-top: 70px">
                <!--출력-->
                <thead class="table-primary">
                <td>이름</td>
                <td>휴대폰</td>
                <td>이메일</td>
                <td>회사</td>
                <td>부서 전화번호</td>

                </thead>
                <tr v-for="(outAddress,index) in currentPosts" :key="index">
                    <td>

                        {{outAddress.outName}}

                    </td>
                    <td>{{outAddress.out_mobile}}</td>
                    <td>{{outAddress.out_email}}</td>
                    <td>{{outAddress.outCompany}}</td>
                    <td>{{outAddress.out_dep_phone}}</td>
                </tr>
            </table>

            <div>
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

    </div>
</template>


<script>
    import http from "../../../http-common";
    import AddressSubMenu from "../AddressSubMenu";

    export default {
        name: "outAddressMain",
        data() {
            return {
                nameAndCompany: "",
                outaddress: [],
                currentPosts: [],
                count: 0,   //총 길이
                countList: 5, // 한 페이지에 나올 게시글 개수
                totalPage: 1, // 페이지 번호 묶음 (5 개씩 묶음)
                page: 1,
                countPage: 5,
                startPage: 1,
                endPage: 0,
                totalPages: [],
                currentPages: [], // 현재 페이지 번호들 배열 5개 짜리

            }
        },
        methods: {
            setPagination() {
                this.count = this.outaddress.length;
                console.log(this.outaddress.length + "길이 찍어보기")
                this.totalPage = this.count / this.countList; // 총 페이지 개수
                if (this.count % this.countList > 0) {
                    this.totalPage = Math.ceil(this.totalPage);
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
                    console.log("curr " + i + "번째 " + this.currentPages[i]);
                    console.log("startPage : " + this.startPage)
                    console.log("endPage : " + this.endPage)
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
                let j = (this.page - 1) * this.countList;
                for (let i = 0; i < this.countList && j < this.outaddress.length; i++) {
                    this.currentPosts[i] = this.outaddress[j];
                    j++;
                }

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
                        this.currentPosts = response.data, // JSON are parsed automatically.
                            console.log(response.data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            changePage(pageNum) {
                this.page = pageNum;
                this.setCurrentPosts();
                console.log(this.page)
            },
            isSelected(index) { //<< >>버튼 메서드, 눌렀을때 색깔 바뀌는거
                /* 선택된 class 바인딩 위해 return 반환하는 메서드*/
                if (index == (this.page - 1) % this.countPage) {
                    return true
                } else {
                    return false
                }
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
                        console.log("curr " + i + "번째 " + this.currentPages[i]);
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
                        console.log("curr " + i + "번째 " + this.currentPages[i]);
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
                let pack = Math.ceil(this.totalPage / this.countPage)//몇덩이인지(페이지묶음수)
                for (let i = 0; i < pack; i++)
                    this.next()
                this.changePage(this.totalPage);
            }

        },
        mounted() {
            // mounted 될 때 로그인이 되어있는 상태라면
            if (sessionStorage.length > 0) { // 현재 sessionStorage에 요소가 존재하는 상태일 때(로그인이 되어서 sessionStorage에 저장된 상태일 때)
                this.retrieveOutAddress();
            } else {
                this.$router.push("/");
            }

        },
        components: {
            AddressSubMenu

        },

    }
</script>

<style scoped>
    .list {
        text-align: center;
        max-width: 90%;
        /*  margin: auto;*/
        margin-left: 15%;
    }


    .table {
        width: 80%;
        margin: auto;
        text-align: center;
    }

</style>