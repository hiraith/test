<template>
    <div class="list row">
        <subMenu></subMenu>
        <div class="col-md-12">
            <h4>근태</h4>
            <h2>
                <button class="btn btn-success" v-on:click="onClickPrev(currentMonth)">◀</button>
                {{currentYear}}.{{currentMonth}}
                <button class="btn btn-success" v-on:click="onClickNext(currentMonth)">▶</button>
            </h2>

            <div class="progress">
                <div class="progress-bar" role="progressbar" :style="{width: barWidth}" aria-valuenow="25" aria-valuemin="0"
                     aria-valuemax="100"></div>
            </div>
            필요 근무 시간:{{monthTime}}시간<br>
            실제 근무 시간:{{workingTime}}
            <button v-if="weeks.week1.show" class="btn btn-success btn-lg btn-block" v-on:click="weeks.week1.show = !weeks.week1.show">
                1주차 ▲
            </button>
            <button v-else="weeks.week1.show" class="btn btn-success btn-lg btn-block" v-on:click="weeks.week1.show = !weeks.week1.show">
                1주차 ▼
            </button>
            <table v-if="weeks.week1.show" class="table table-hover">
                <thead>
                <tr class="table-primary">
                    <td>날짜</td>
                    <td>출근시각</td>
                    <td>퇴근시각</td>
                    <td>근무시간</td>
                </tr>
                </thead>
                <tr v-for="(working, index) in weeks.week1.workings" :key="index">
                    <td>{{working.workingDate}}</td>
                    <td>{{working.workingIn}}</td>
                    <td>{{working.workingOut}}</td>
                    <td>{{working.workingTime}}</td>
                </tr>
            </table>
            <button v-if="weeks.week2.show" class="btn btn-success btn-lg btn-block" v-on:click="weeks.week2.show = !weeks.week2.show">
                2주차 ▲
            </button>
            <button v-else="weeks.week2.show" class="btn btn-success btn-lg btn-block" v-on:click="weeks.week2.show = !weeks.week2.show">
                2주차 ▼
            </button>
            <table v-if="weeks.week2.show" class="table table-hover">
                <thead>
                <tr class="table-primary">
                    <td>날짜</td>
                    <td>출근시각</td>
                    <td>퇴근시각</td>
                    <td>근무시간</td>
                </tr>
                </thead>
                <tr v-for="(working, index) in weeks.week2.workings" :key="index">
                    <td>{{working.workingDate}}</td>
                    <td>{{working.workingIn}}</td>
                    <td>{{working.workingOut}}</td>
                    <td>{{working.workingTime}}</td>
                </tr>
            </table>
            <button v-if="weeks.week3.show" class="btn btn-success btn-lg btn-block" v-on:click="weeks.week3.show = !weeks.week3.show">
                3주차 ▲
            </button>
            <button v-else="weeks.week3.show" class="btn btn-success btn-lg btn-block" v-on:click="weeks.week3.show = !weeks.week3.show">
                3주차 ▼
            </button>
            <table v-if="weeks.week3.show" class="table table-hover">
                <thead>
                <tr class="table-primary">
                    <td>날짜</td>
                    <td>출근시각</td>
                    <td>퇴근시각</td>
                    <td>근무시간</td>
                </tr>
                </thead>
                <tr v-for="(working, index) in weeks.week3.workings" :key="index">
                    <td>{{working.workingDate}}</td>
                    <td>{{working.workingIn}}</td>
                    <td>{{working.workingOut}}</td>
                    <td>{{working.workingTime}}</td>
                </tr>
            </table>
            <button v-if="weeks.week4.show" class="btn btn-success btn-lg btn-block" v-on:click="weeks.week4.show = !weeks.week4.show">
                4주차 ▲
            </button>
            <button v-else="weeks.week4.show" class="btn btn-success btn-lg btn-block" v-on:click="weeks.week4.show = !weeks.week4.show">
                4주차 ▼
            </button>
            <table v-if="weeks.week4.show" class="table table-hover">
                <thead>
                <tr class="table-primary">
                    <td>날짜</td>
                    <td>출근시각</td>
                    <td>퇴근시각</td>
                    <td>근무시간</td>
                </tr>
                </thead>
                <tr v-for="(working, index) in weeks.week4.workings" :key="index">
                    <td>{{working.workingDate}}</td>
                    <td>{{working.workingIn}}</td>
                    <td>{{working.workingOut}}</td>
                    <td>{{working.workingTime}}</td>
                </tr>
            </table>
            <button v-if="weeks.week5.show" class="btn btn-success btn-lg btn-block" v-on:click="weeks.week5.show = !weeks.week5.show">
                5주차 ▲
            </button>
            <button v-else="weeks.week5.show" class="btn btn-success btn-lg btn-block" v-on:click="weeks.week5.show = !weeks.week5.show">
                5주차 ▼
            </button>
            <table v-if="weeks.week5.show" class="table table-hover">
                <thead>
                <tr class="table-primary">
                    <td>날짜</td>
                    <td>출근시각</td>
                    <td>퇴근시각</td>
                    <td>근무시간</td>
                </tr>
                </thead>
                <tr v-for="(working, index) in weeks.week5.workings" :key="index">
                    <td>{{working.workingDate}}</td>
                    <td>{{working.workingIn}}</td>
                    <td>{{working.workingOut}}</td>
                    <td>{{working.workingTime}}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
    import http from "../../http-common";
    import WorkingSubMenu from "./WorkingSubMenu";

    export default {
        name: "working-status",
        data() {
            return {
                empId: '',
                currentYear: new Date().getFullYear(),
                currentMonth: new Date().getMonth() + 1,
                weeks: {
                    week1: {workings: [], show: false},
                    week2: {workings: [], show: false},
                    week3: {workings: [], show: false},
                    week4: {workings: [], show: false},
                    week5: {workings: [], show: false}
                },
                monthTime:'',
                workingTime:'',
                barWidth:'0%',
                show: false
            };
        },// End - data
        components: {
            subMenu: WorkingSubMenu
        },// End - components
        methods: {
            /* eslint-disable no-console */
            readWorkings(currentYear, currentMonth) {// 근태기록을 조회하는 메소드
                let workings = [];
                let moment = require('moment');
                let start = moment(currentYear + "-" + currentMonth).startOf('month').format('YYYY-MM-DD');
                let end = moment(currentYear + "-" + currentMonth).endOf('month').format('YYYY-MM-DD');

                this.calcMonthTime(moment(currentYear + "-" + currentMonth));

                http
                    .get("/working/workings/" + this.empId + "?start=" + start + "&end=" + end)
                    .then(response => {
                        // this.workings = response.data; // JSON are parsed automatically.
                        workings = response.data;
                        console.log(response.data);
                        this.divideWeekly(workings);
                        this.calcWorkingTime(workings);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },// End - readWorkings(currentYear,currentMonth)
            calcMonthTime(date){//조회 중인 달에 근무해야 할 시간을 계산
                let conut=0;
                let startDate = date.clone().startOf('month');
                let diff=startDate.diff(date.clone().endOf('month'),'day');
                for(; diff!==1; diff++){
                     if(startDate.day()!==0&&startDate.day()!==6) {
                         conut++;
                     }
                    startDate=startDate.add(1,'day');
                }
               this.monthTime=conut*8;
            },// End - calcMonthTime(date)
            calcWorkingTime(workings) {//현재 조희 중인 달의 근무시간의 총 합을 구하는 메소드
                let moment = require('moment');
                let totalHour = 0;
                let totalMin = 0;
                let totalSec = 0;

                for (let i = 0; i < workings.length; i++) {
                    let working = workings[i].workingDate + " " + workings[i].workingTime;
                    let hour = Number.isNaN(Number(moment(working).format('h'))) ? 0 : Number(moment(working).format('h'));
                    totalHour += (hour === 12)? 0 : hour;
                    totalMin += Number.isNaN(Number(moment(working).format('h'))) ? 0 : Number(moment(working).format('m'));
                    totalSec += Number.isNaN(Number(moment(working).format('h'))) ? 0 : Number(moment(working).format('s'));
                }

                totalHour += Math.floor(totalMin / 60);
                totalMin = totalMin % 60 + Math.floor(totalSec / 60);
                totalSec = totalSec % 60;

                this.workingTime=totalHour+"시간"+totalMin+"분";
                this.setBarWidth((totalHour*60+totalMin),(this.monthTime*60));
            },// End - calcWorkingTime(workings)
            setBarWidth(workingMin,monthMin){ // 조회하는 달 근무시간에 따라 막대바의 길이를 조절하는 메소드
                this.barWidth=Math.floor(workingMin/monthMin*100)+'%';
            },// End - setBarWidth(workingMin,monthMin)
            divideWeekly(workings) { // 근태기록을 주차별로 나누는 메소드

                //각 주차의 근태기록 초기화
                this.weeks.week1.workings = [];
                this.weeks.week2.workings = [];
                this.weeks.week3.workings = [];
                this.weeks.week4.workings = [];

                let moment = require('moment');
                let i = 0;
                for (let j = 0; i < workings.length && this.weekOfMonth(moment(workings[i].workingDate.toString())) === 1; j++) {
                    this.weeks.week1.workings[j] = workings[i];
                    i++;
                }
                for (let j = 0; i < workings.length && this.weekOfMonth(moment(workings[i].workingDate.toString())) === 2; j++) {
                    this.weeks.week2.workings[j] = workings[i];
                    i++;
                }
                for (let j = 0; i < workings.length && this.weekOfMonth(moment(workings[i].workingDate.toString())) === 3; j++) {
                    this.weeks.week3.workings[j] = workings[i];
                    i++;
                }
                for (let j = 0; i < workings.length && this.weekOfMonth(moment(workings[i].workingDate.toString())) === 4; j++) {
                    this.weeks.week4.workings[j] = workings[i];
                    i++;
                }
                for (let j = 0; i < workings.length; j++) {
                    this.weeks.week5.workings[j] = workings[i];
                    i++;
                }
            },// End -  divideWeekly(workings)
            weekOfMonth(date) {// 특정 날짜가 달의 몇 번째 주에 해당하는 지 반환 하는 메소드
                const firstDayOfMonth = date.clone().startOf('month');
                const firstDayOfWeek = firstDayOfMonth.clone().startOf('week');

                const offset = firstDayOfMonth.diff(firstDayOfWeek, 'days');

                return Math.ceil((date.date() + offset) / 7);
            },// End -  weekOfMonth(date)
            onClickPrev(month) {// 현재조회 중인 달의 이전 달을 조회
                month--;
                if (month <= 0) {
                    this.currentMonth = 12;
                    this.currentYear -= 1;
                } else {
                    this.currentMonth -= 1;
                }
                this.readWorkings(this.currentYear, this.currentMonth);
            },// End -  onClickPrev (month)
            onClickNext(month) {//현재조회 중인 달의 다음 달을 조회
                month++;
                if (month > 12) {
                    this.currentMonth = 1;
                    this.currentYear += 1;
                } else {
                    this.currentMonth += 1;
                }
                this.readWorkings(this.currentYear, this.currentMonth);
            }// End -  onClickNext (month)
            /* eslint-enable no-console */
        },// End - methods
        mounted() {// mounted 될때 로그인이 되어있는 상태라면
            if (sessionStorage.length > 0) { // 현재 sessionStorage에 요소가 존재하는 상태일 때(로그인이 되어서 sessionStorage에 저장된 상태일 때)
                this.empId = sessionStorage.getItem("login_id");
                this.readWorkings(this.currentYear, this.currentMonth);
            } else {
                this.$router.push("/");
            }
        } // End - mounted()
    };// End - export default
</script>

<style>
    .list {
        text-align: left;
        max-width: 450px;
        margin: auto;
    }
</style>
