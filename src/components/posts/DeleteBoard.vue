<template>
    <div>
        <div>
            <h4>부서 게시판 삭제</h4>
            <subMenu></subMenu>
        </div>
        <div>
        <ul>
        <div>
        <button type="button" class="btn btn-primary btn-lg" @click="getBoard">부서 게시판 가져오기</button>
        </div>

            <p class="smalltext" style="color: red; font-size: smaller" >*클릭하여 게시판명을 가져오세요.</p>
            <br><br>
            <div>
            <select class="custom-select" v-model="selectBoard">
                <option disabled value="">삭제할 게시판을 선택하세요</option>
                <option v-for="(board,index) in boards" :key="index">
                    {{board.board_name}}
                </option>
            </select>
            </div>
            <br>
            <span>{{selectBoard}}</span>
                <br>
             <br>
            <div>
            <button class="btn btn-success" type="button" @click="deleteBoard">삭제하기</button>
            <button class="btn btn-success" type="button" @click="backlist">돌아가기</button>
            </div>
        </ul>
        </div>

    </div>
</template>

<script>
    import http from "../../http-common";
    import PostSubmenu from "./PostSubmenu";

    export default {
        name: "Delete-Board",
        data () {
            return{
                boards:[], //가져온 게시판을 배열로 저장.
                dep_id: "", //부서번호에 해당하는 게시판만 가져오기 위해서
                selectBoard:"",
                board_name:""
            };
        },
        components: {
            subMenu: PostSubmenu
        },
        methods:{
            /* eslint-disable no-console */
            //저장된 게시판 명을 가져오는 메서드
            deleteBoard(){
                    let result= confirm("게시판을 삭제하면 해당하는 게시글은 모두 삭제됩니다.\n정말로 게시판을 삭제하시겠습니까?")
                    if(result){
                     http
                        .delete("/board/deleteBoard/" + this.selectBoard)
                        alert("게시판을 삭제하였씁니다.")
                        history.go(0);
                    }else{
                        // history.go(0);
                    }
                    console.log(this.selectBoard+"<<<<<<<삭제할 게시물")

            },
            getBoard(){
                http
                    .get("/board/getBoard/" + this.dep_id)
                    .then(response =>{
                        this.boards=response.data;
                        alert("게시판을 가져왔습니다!\n삭제할 게시판을 선택하세요 !")
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

    }
</script>

<style scoped>
    .custom-select{
        width: 30%;
    }

</style>