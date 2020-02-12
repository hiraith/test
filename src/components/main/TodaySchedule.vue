<template>
    <div class="todaySchedule">
        <table class="todayTable">
            <tr>
                <td class="todayTd">
                    <div class="todayInfo">
                        <span style="font-size: 20px; "><strong>{{today}}</strong></span><br>
                        {{day}}<br>일정
                    </div>
                </td>
                <td class="scheduleTd">
                    <div class="scheduleInfo">
                        <div v-if="scheduleList" v-for="(schedule,index) in scheduleList" :key="index" class="scheduleOutput">
                            <strong>{{schedule.sche_name}}</strong><br>
                            <span style="color: gray">
                                {{schedule.sche_start_time.substring(0,2)}} : {{schedule.sche_start_time.substring(3,5)}} ~
                                {{schedule.sche_end_time.substring(0,2)}} : {{schedule.sche_end_time.substring(3,5)}} <br>
                            </span>
                        </div>
                    </div>
                </td>
            </tr>
        </table>


    </div>
</template>

<script>
    import http from "../../http-common";

export default {
    name: "employee-info",
    data() {
        return {
            emp_id: "",
            today: "",  // 오늘 날짜
            day: "",     // 오늘 요일
            week: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
            scheduleList: []    // 오늘의 일정 들어갈 배열
        };
    },
    methods: {
        getToday() {
            let moment = require('moment');
            this.today = moment().format('DD');
            this.day = this.week[moment().day()];

            let today = moment().format('YYYY-MM-DD');
            this.getSchedule(today);
        },
        getSchedule(today) {

            http
                .get("/schedule/all/" + this.emp_id + "?sche_date=" + today)
                .then(response=> {
                    /* eslint-disable no-console */
                    this.scheduleList = response.data;
                })
                .catch(e => {
                    /* eslint-disable no-console */
                    console.log(e);
                });
        }


    },
    mounted() {
        // mounted 될 때 로그인이 되어있는 상태라면
        if (sessionStorage.length > 0) { // 현재 sessionStorage에 요소가 존재하는 상태일 때(로그인이 되어서 sessionStorage에 저장된 상태일 때)
            this.emp_id = sessionStorage.getItem("login_id");
            this.getToday();
        }else {
            this.$router.push("/");
        }
    } // End - mounted()

}
</script>

<style scoped>
    .todaySchedule {
        width: 30%;
        height: 30%;
        right: 15px;
        top: 70%;
        position: absolute;
        border: 1px solid gray;
    }
    .todayInfo {
        margin: auto;
    }
    .todayTable {
        margin: 10px auto auto;
        width: 100%;
        height: 80%;
        border: 2px solid #dddddd;
    }
    .todayTd {
        width: 20%;
        border-left: 3px solid #2CB99D;
        border-right: 2px solid #dddddd;
    }
    .scheduleTd {
        text-align: left;
        padding-left: 3%;
        padding-right: 3%;
        font-size: 13px;
    }
    .scheduleInfo {
        height: 90%;
        overflow: auto;
        -ms-overflow-style: none; /*IE에서 스크롤바 투명하게 하기*/
    }
    .scheduleInfo::-webkit-scrollbar { /*IE 제외한 브라우저에서 스크롤바 투명하게 하기*/
        width: 1px;
        background: transparent;
    }
    .scheduleOutput {
        margin-bottom: 5px;
    }
</style>