<template>
    <div class="mainForm">
        <!--로그인이 된 경우 보일 <div> 태그 부분-->
        <div v-if="!loginInfo.loginStatus && !isManager">
            <div class="form-group">
                <label class="col-form-label col-form-label-lg inputLbl" for="emp_id">사원번호</label>
                <input class="form-control form-control-lg" type="text" id="emp_id" v-on:keyup.enter="login" required
                       v-model="input.emp_id" placeholder="사원번호를 입력해주세요">
            </div>

            <div class="form-group">
                <label class="col-form-label col-form-label-lg inputLbl" for="emp_pw">비밀번호</label>
                <input class="form-control form-control-lg" type="password" v-on:keyup.enter="login" id="emp_pw"
                       required v-model="input.emp_pw" placeholder="비밀번호를 입력해주세요">
            </div>
            <br>

            <button v-on:click="login()" class="btn btn-primary btn-lg loginBtn">Login</button>
        </div>

        <div v-else-if="!isManager">
            <myInfo></myInfo>
            <working></working>
            <sign></sign>
            <calendar></calendar>
            <today></today>
            <!--ex) {{this.$router.push("/mypage")}}-->
            <!--요약 메인 페이지를 하나 만들고 위처럼 주소 push 해서 넘기면 된다.(로그인 성공 시)-->
        </div>

        <div v-else-if="isManager">
            <h4>You logIned successfully!</h4>
            매니저 로그인 되었을 때 메인
            ex) {{this.$router.push("/manager/employees")}}
            <!--요약 메인 페이지를 하나 만들고 위처럼 주소 push 해서 넘기면 된다.(로그인 성공 시)-->
        </div>
    </div>
</template>

<script>
    import http from "../http-common";
    import working from "./main/Working";
    import calendar from "./main/MainCalendar";
    import myInfo from "./main/MyInfo";
    import sign from "./main/SignSummary";
    import today from "./main/TodaySchedule";

    export default {
        name: "employee-login",
        data() {
            return {
                input: {
                    emp_id: "",    // 사원번호 입력 값 검사를 위한 변수
                    emp_pw: "",     // 비밀번호 입력 값 검사를 위한 변수
                    manager_id: "",
                    manager_pw: ""
                },
                loginInfo: {
                    loginStatus: "", //로그인 상태 담을 변수
                    loginId: ""      // 로그인 아이디
                },
                isManager : ""   // 매니저 로그인 판별할 변수
            };
        },
        components: {
            myInfo:myInfo,
            working:working,
            sign:sign,
            calendar:calendar,
            today:today
        },
        methods: {
            login() {
                if (this.input.emp_id != "" && this.input.emp_pw != "") { // 사원번호, 비밀번호 input 빈 칸 확인
                    var data = {
                        emp_id: this.input.emp_id,
                        emp_pw: this.input.emp_pw,

                    };

                    if((this.input.emp_id === "10000") && (this.input.emp_pw==="0000")){
                        this.isManager = true;
                        sessionStorage.setItem("isManager", this.isManager);
                        sessionStorage.setItem("login_id", this.loginInfo.loginId);           // sessionStorage 에 로그인 아이디(사번) 저장하기
                        for (let i = 0; i < 1; i++) {
                            location.reload();// 로그인 시 한 번만 새로고침
                        }

                        // sessionStorage.setItem("login_status", this.loginInfo.loginStatus);   // sessionStorage 에 로그인 상태 저장하기
                    } else{

                    // UpfficeBack 의 LoginController 로 매핑
                    http
                        .post("/login", data)
                        .then(response => {

                            if (response.data != 0) {  // 결과 값이 0이 아니면 DB에 사번(아이디), 비밀번호가 존재한다는 뜻
                                this.loginInfo.loginId = response.data;   // loginId에 응답 데이터를 넣는다.(응답 데이터는 사원번호)
                                this.loginInfo.loginStatus = true;        // loginStatus 에 현재 로그인 상태 true로 바꾸기

                                sessionStorage.setItem("login_id", this.loginInfo.loginId);           // sessionStorage 에 로그인 아이디(사번) 저장하기
                                sessionStorage.setItem("login_status", this.loginInfo.loginStatus);   // sessionStorage 에 로그인 상태 저장하기


                                for (let i = 0; i < 1; i++) {
                                    location.reload();// 로그인 시 한 번만 새로고침
                                }

                            } else {
                                alert("사원 번호 또는 비밀번호가 일치하지 않습니다!");
                            }

                        })
                        .catch(e => {
                            /* eslint-disable no-console */
                            console.log(e);
                        });
                    }

                } else { // 사원번호, 비밀번호 input 빈 칸인 경우
                    alert("빈 칸을 확인해주세요!");
                } // End : if-else
            } // End - login()

        }, // End - methods
        mounted() {
            if (sessionStorage.length > 0) {
                // 로그인 상태를 <div> 태그에서 판별하기 위해 this.loginInfo.loginStatus 로 대입한다.
                this.loginInfo.loginStatus = sessionStorage.getItem("login_status");
                this.isManager = sessionStorage.getItem("isManager");
            }
        }
    };
</script>

<style>
    .mainForm {
        max-width: 300px;
        margin: 100px auto auto;
    }

    .inputLbl {
        margin-right: 220px;
        font-weight: bold;
    }

    .loginBtn {
        width: 300px;
    }
</style>
