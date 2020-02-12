<template>
    <div class="subMenu">
        <div class="alignCenter">
            <Clock></Clock>
            출근시간:{{this.working.workingIn}}<br>
            퇴근시간:{{this.working.workingOut}}<br>
            근무시간:{{this.working.workingTime}}<br>
            <button v-if="!this.working.workingIn" v-on:click="saveWorkingIn()"
                    class="btn btn-outline-danger btn-working">출근
            </button>
            <button v-else class="btn btn-danger disabled">출근</button>

            <button v-if="!this.working.workingOut" v-on:click="saveWorkingOut()"
                    class="btn btn-outline-info btn-working">퇴근
            </button>
            <button v-else class="btn btn-info disabled">퇴근</button>
        </div>
        <br>
        <ul class="nav nav-pills flex-column">
            <li class="list-group-item list-group-item-action active">
                근태 관리
<!--                list-group-item-success-->
            </li>
            <router-link to="/working/status">
                <li class="list-group-item d-flex justify-content-between align-items-center libgclr">
                    내 근태 현황
                </li>
            </router-link>
            <router-link to="/working/annual">
                <li class="list-group-item d-flex justify-content-between align-items-center libgclr">
                    내 연차 내역
                </li>
            </router-link>
        </ul>
    </div>
</template>

<script>
    import http from "../../http-common";
    import Clock from "./Clock";

    export default {
        name: "WorkingSubMenu",
        data() {
            return {
                working: {
                    empId: "",
                    workingDate: "",
                    workingIn: "",
                    workingOut: "",
                    workingTime: "",
                }
            };
        },// End - data
        components: {
            Clock: Clock
        },
        methods: {
            /* eslint-disable no-console */
            readWorkingToday() {//당일에 출퇴근기록이 있으면 불러온다, mounted()때 호출되는 메소드.
                http
                    .get("/working/readToday/" + this.working.empId)
                    .then(response => {
                        this.working = response.data;
                        console.log("read" + response.data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },// End - readWorkingToday()
            saveWorkingIn() {// 출근시 출근 시간을 DB에 저장하기 위한 메소드
                http
                    .get("/working/saveIn/" + this.working.empId)
                    .then(response => {
                        this.working.workingIn = response.data;
                        console.log(response.data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },// End - saveWorkingIn()
            saveWorkingOut() {// 퇴근 시 퇴근 시간을 DB에 저장하기 위한 메소드
                http
                    .get("/working/saveOut/" + this.working.empId)
                    .then(response => {
                        this.working.workingOut = response.data;
                        console.log(response.data);
                        this.calcWorkingTime();
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },// End - saveWorkingOut()
            saveWorkingTime() {// 총 근무 시간을 DB에 저장하기 위한 메소드
                http
                    .get("/working/saveTime/" + this.working.empId + "?time=" + this.working.workingTime)
                    .then(response => {
                        this.working.workingTime = response.data;
                        console.log(response.data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },// End - saveWorkingTime()
            calcWorkingTime() {// 총 근무 시간을 계산하는 메소드
                let wit = new Date(Date.parse("0001-01-01 " + this.working.workingIn));// 출근시간을 Date형으로 형변환
                let wot = new Date(Date.parse("0001-01-01 " + this.working.workingOut));// 퇴근시간을 Date형으로 형변환

                wot.setHours(wot.getHours() - wit.getHours());// 시 부분끼리 연산
                wot.setMinutes(wot.getMinutes() - wit.getMinutes());// 분 부분끼리 연산
                wot.setSeconds(wot.getSeconds() - wit.getSeconds());// 초 부분끼리 연산

                this.working.workingTime = wot.toString().substr(16, 8); // 연산된 값중 시간에 관련된 부분을 잘라서 저장
                this.saveWorkingTime();// DB에 총 근무 시간 저장
            },// End - calcWorkingTime()
            /* eslint-enable no-console */
        },// End - methods
        mounted() {
            // mounted 될 때 로그인이 되어있는 상태라면
            if (sessionStorage.length > 0) { // 현재 sessionStorage에 요소가 존재하는 상태일 때(로그인이 되어서 sessionStorage에 저장된 상태일 때)
                this.working.empId = sessionStorage.getItem("login_id");// sessionStorage에서 사번 가져오기
                this.readWorkingToday();// 출퇴근 기록 가져오기
            }
        }// End - mounted()
    };// End - export default
</script>

<style>
    .alignCenter {
        text-align: center;
    }
</style>
