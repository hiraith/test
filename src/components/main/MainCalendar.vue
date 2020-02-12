<template>
    <div class="calendar">
        <span class="cal_nav">
            <button class="btn btn-link btn-lg changeBtn" v-on:click="onClickPrev(currentMonth)">◀</button>
            {{currentYear}}년 {{currentMonth}}월
            <button class="btn btn-link btn-lg changeBtn" v-on:click="onClickNext(currentMonth)">▶</button>
        </span>
        <!-- table 시작 -->
        <table class="table">
            <thead>
            <tr>
                <td v-for="(weekName, index) in weekNames" v-bind:key="index" class="weekName">
                    {{weekName}}
                </td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, index) in currentCalendarMatrix" :key="index">
                <td class="calendarCell" v-for="(day, index2) in row" :key="index2">
                 <div v-if="day!==''">
                    <span v-if="isToday(currentYear, currentMonth, day)" class="day rounded">
                      {{day}}
                    </span>

                    <span v-else class="day">
                      {{day}}
                    </span>
                 </div>
                <!--테이블 셀에 스크롤 달기 위한 div 태그 넣기 : 날짜가 있는 칸이면 내용 출력-->
                <div v-if="day!==''&& hasScheduleToday(currentYear,currentMonth,day)" class="scrollDiv">
                    <span v-if="sche[0] == getCurrDate(currentYear,currentMonth,day)" v-for="(sche, index) in schedule" :key="index">
                        <!-- 일정의 캘린더 별 색과 이름 넣기-->
                        <span class="colorDot" :style="{color: getCalColor(sche[1].calendar_id)}">●</span>
                    </span>
                </div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import http from "../../http-common";

    export default {
        name: 'Calendar',
        data () {
            return {
                weekNames: ["월", "화", "수","목", "금", "토", "일"],
                rootYear: 1904,
                rootDayOfWeekIndex: 4, // 2000년 1월 1일은 토요일
                currentYear: new Date().getFullYear(),
                currentMonth: new Date().getMonth()+1,
                currentDay: new Date().getDate(),
                currentMonthStartWeekIndex: null,
                currentCalendarMatrix: [],
                endOfDay: null,
                memoData: [],
                emp_id: "",
                scheduleList: [],    // 모든 schedule 리스트를 담을 배열
                sche_name: "",       // 가져온 일정의 이름
                sche_date: [],       // 일정 날짜? -- 안 쓰는 변수 정리하기
                schedule: [],        // 가져온 일정 담을 배열
                calendarList: [],    // 캘린더 목록
                calendar_id : 0,     // 캘린더 id
                cnt: 0
            }
        },
        methods: {
            init(){
                this.currentMonthStartWeekIndex = this.getStartWeek(this.currentYear, this.currentMonth);
                this.endOfDay = this.getEndOfDay(this.currentYear, this.currentMonth);
                this.initCalendar();
            },
            getCalColor(calendar_id) {
                for(let i=0; i<this.calendarList.length; i++) {
                    if(this.calendarList[i].calendar_id == calendar_id) {
                        return this.calendarList[i].calendar_color;
                    }
                }
            },
            getCurrDate(year, month, day) {
                if(month < 10)  month = "0" + month;    // 형식을 맞추기 위하여 달이 한 자리 수일 때 앞에 0을 추가 해준다.
                if(day < 10) day = "0" + day;           // 형식을 맞추기 위하여 일자가 한 자리 수일 때 앞에 0을 추가 해준다.
                let sche_date = year + "-" + month + "-" + day;

                return sche_date;
            },
            hasScheduleToday(year,month,day) {
                if(month < 10)  month = "0" + month;    // 형식을 맞추기 위하여 달이 한 자리 수일 때 앞에 0을 추가 해준다.
                if(day < 10) day = "0" + day;           // 형식을 맞추기 위하여 일자가 한 자리 수일 때 앞에 0을 추가 해준다.
                let sche_date = year + "-" + month + "-" + day;

                for(let k=0; k<this.schedule.length; k++) {
                    let a = [];
                    a[k] = this.schedule[k].toString().split(",");
                    if(a[k][0] == sche_date) return true;
                }
            },
            getAllSchedules() {
                this.sche_date = [];
                this.sche_name = [];
                this.schedule = [];

                let year = this.currentYear;
                let month = this.currentMonth;

                if(month < 10)  month = "0" + month;    // 형식을 맞추기 위하여 달이 한 자리 수일 때 앞에 0을 추가 해준다.

                for(let i=1; i<=this.endOfDay; i++) {
                    let date = i;
                    if(date < 10) date = "0" + date;
                    let sche_date = year + "-" + month + "-" + date;

                    if(this.calendar_id == 0) {
                        http
                            .get("/schedule/all/" + this.emp_id + "?sche_date=" + sche_date)
                            .then(response=> {
                                /* eslint-disable no-console */
                                this.scheduleList = response.data;
                                for(let j=0; j<this.scheduleList.length; j++) {
                                    this.schedule.push([ sche_date, this.scheduleList[j] ]);    //  배열에 해당 날짜와 일정 이름 넣기

                                }
                            })
                            .catch(e => {
                                /* eslint-disable no-console */
                                console.log(e);
                            });
                    }

                }
            },
            initCalendar(){
                this.currentCalendarMatrix = [];
                let day=1;
                for(let i=0; i<6; i++){
                    let calendarRow = [];
                    for(let j=0; j<7; j++){
                        if(i==0 && j<this.currentMonthStartWeekIndex){
                            calendarRow.push("");
                        }
                        else if(day<=this.endOfDay){
                            calendarRow.push(day);
                            day++;
                        }
                        else{
                            calendarRow.push("");
                        }
                    }
                    this.currentCalendarMatrix.push(calendarRow);
                }
                // currentCalendarMatrix 생성된 후
                this.getAllSchedules();
            },
            getEndOfDay(year, month){
                switch(month){
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                    case 8:
                    case 10:
                    case 12:
                        return 31;
                        break;
                    case 4:
                    case 6:
                    case 9:
                    case 11:
                        return 30;
                        break;
                    case 2:
                        if( (year%4 == 0) && (year%100 != 0) || (year%400 == 0) ){
                            return 29;
                        }
                        else{
                            return 28;
                        } // 윤달 체크 조건
                        break;
                    default:
                        console.log("unknown month " + month);
                        return 0;
                        break;
                }
            },
            getStartWeek(targetYear, targetMonth){
                let year = this.rootYear;
                let month = 1;
                let sumOfDay = this.rootDayOfWeekIndex;
                while(true){
                    if(targetYear > year){
                        for(let i=0; i<12; i++){
                            sumOfDay += this.getEndOfDay(year, month+i);
                        }
                        year++;
                    }
                    else if(targetYear == year){
                        if(targetMonth > month){
                            sumOfDay += this.getEndOfDay(year, month);
                            month++;
                        }
                        else if(targetMonth == month){
                            return (sumOfDay)%7;
                        }
                    }
                }
            },
            onClickPrev(month){
                month--;
                if(month<=0){
                    this.currentMonth = 12;
                    this.currentYear -= 1;
                }
                else{
                    this.currentMonth -= 1;
                }
                this.init();
            },
            onClickNext(month){
                month++;
                if(month>12){
                    this.currentMonth = 1;
                    this.currentYear += 1;
                }
                else{
                    this.currentMonth += 1;
                }
                this.init();
            },
            isToday(year, month, day){
                let date = new Date();
                return year == date.getFullYear() && month == date.getMonth()+1 && day == date.getDate();
            },
            getCalendarList() {
                http
                    .get("/calendar/list/" + this.emp_id)
                    .then(response=> {
                        /* eslint-disable no-console */
                        this.calendarList = response.data;
                    })
                    .catch(e => {
                        /* eslint-disable no-console */
                        console.log(e);
                    });
            },
        },
        mounted() {
            if (sessionStorage.length > 0) {
                this.emp_id = sessionStorage.getItem("login_id");
                this.init();
                this.getCalendarList();
            } else {
                this.$router.push("/");
            }
        }

    }
</script>

<style scoped>
    .calendar {
        width: 30%;
        height: 60%;
        top: 70px;
        position: absolute;
        right: 15px;
        border: 1px solid gray;
    }
    .cal_nav {
        font-size: 20px;
        margin: auto;
    }
    .weekName {
        font-size: 12px;
        font-weight: bold;
    }
    .changeBtn {
        font-size: 20px;
    }
    .day {
        font-size: 11px;
        font-weight: bold;
    }
    .rounded {
        -moz-border-radius:20px 20px 20px 20px;
        border-radius:20px 20px 20px 20px;
        border:solid 1px #ffffff;
        background-color:#2b6bd1;
        padding:3px;
        color:#ffffff;
    }
    .calendarCell {
        height: 60px;
        padding: 0;
    }
    .scrollDiv {
        text-align: center;
        overflow: auto; /*말 줄임표 위한 설정 : 스크롤 안 보이게 하려면 hidden*/
        width: 70%;
        height: 60%;
        font-size: 10px;
        word-break: break-all;  /*width 넘어가면 다음 줄로 넘어가게 하기*/
        overflow-x: hidden; /*가로 스크롤바 없애기*/
        -ms-overflow-style: none; /*IE에서 스크롤바 투명하게 하기*/
        margin: 1px auto auto;
    }
    .scrollDiv::-webkit-scrollbar { /*IE 제외한 브라우저에서 스크롤바 투명하게 하기*/
        width: 1px;
        background: transparent;
    }
    .colorDot {
        font-size: 11px;
    }
</style>