<template>
    <div class="subMenu">

        <ul class="nav nav-pills flex-column">
            <div style="font-weight: bold; margin: 8%; font-size: 20px; text-align: center">
                게시판
            </div>
            <router-link to="/pst">
                <li class="list-group-item d-flex justify-content-between align-items-center libgclr" style="font-weight: bold">
                    전사 게시판
                </li>
            </router-link>
            <router-link to="/dep_pst">
            <li class="list-group-item d-flex justify-content-between align-items-center libgclr" style="font-weight: bold">
                부서 게시판
            </li>
        </router-link>
            <button type="button" class="btn btn-primary btn-lg" @click="getBoard">우리 부서 게시판</button>

                <li class="list-group-item d-flex justify-content-between align-items-center libgclr"
                    v-for="(board, index) in boards" :key="index">
                    <router-link :to="{
                       name: 'DepPage',
                       params:{board:board, board_name:board.board_name}
                    }">
                        <span>{{board.board_name}}</span>
                    </router-link>
                </li>
        </ul>
        <router-link to="/dep_pst/newBoard">
            <button type="button" class="btn btn-success">게시판 등록</button>
        </router-link>
        <router-link to="/dep_pst/DeleteBoard">
            <button type="button" class="btn btn-danger">게시판 삭제</button>
        </router-link>
    </div>
</template>

<script>
    import http from "../../http-common";

    export default {
        name: "board",
        data() {
            return {

                submitted: false,
                empID: "",
                dep_id: "",
                board_name:"",
                boards:[]

            };
        },

        methods: {
            /* eslint-disable no-console */
            //저장된 게시판 명을 가져오는 메서드
            getBoard(){
                http
                .get("/board/getBoard/" + this.dep_id)
                .then(response =>{
                    this.boards=response.data;
                })

            },


            backlist(){
                history.go(-1);
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
            writeCheck() {
                let write_chk = location.href.indexOf("dep_pst");  // dep_pst 가 포함되어 있으면 0(부서게시판) 이상의 숫자, 없으면 -1(전사게시판)
                console.log(write_chk);
                if(write_chk==-1) {
                    // 현재 전사 게시판 선택 상태
                    this.post_dep_id = 0;   //  post_dep_id 에 0넣기
                } else {
                    this.getEmpInfo(this.empID);    // empID로 사원정보 가져오기 : dep_id만 사용함

                }
            }
        },
        mounted() {
            if (sessionStorage.length > 0) { // 현재 sessionStorage에 요소가 존재하는 상태일 때(로그인이 되어서 sessionStorage에 저장된 상태일 때)
                this.empID = sessionStorage.getItem("login_id"); // 이 컴포넌트에 선언된 empID 변수에 현재 로그인한 사번 넣기
                // this.getName(this.empID);   // empID로 사원명 가져오는 메소드 호출
                this.getEmpInfo(this.empID);

            } else {
                this.$router.push("/");
            }

        },
        updated() {

                this.writeCheck();
        }
    };
</script>

<style scoped>

</style>