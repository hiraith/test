<template>
    <div class="subMenu">
        <ul class="nav nav-pills flex-column">
            <li class="list-group-item addCalendarList libgclr">
                <button class="btn btn-lg btn-link" @click="addSchedule()">일정 등록</button>
            </li>
            <li class="list-group-item libgclr">
                <label class="col-form-label col-form-label calendarLabel" for="inputSmall">캘린더 추가</label><br>
                <div style="width: 100%">
                    <input type="color" class="inputColor" v-model="calendarInput.cal_color">
                    <input class="form-control form-control-sm addInput" type="text" placeholder="추가할 캘린더 입력" id="inputSmall" v-model="calendarInput.cal_name">

                    <button class="btn btn-lg btn-link addBtn" @click="addCalendar()">+</button>
                </div>
            </li>
            <li class="list-group-item libgclr">
                <div v-if="calendarList">
                    <label class="col-form-label col-form-label calendarLabel">캘린더 목록</label><br>
                    <label class="form-check-label category" v-for="(calendar, index) in calendarList" :key="index">
                        <input class="checkBox" type="checkbox" :value="calendar.calendar_id" v-model="checkedCalendars" checked="calendar_chk">

                            <span style="font-size: 15px" :style="{color: calendar.calendar_color}">●</span>&nbsp;
                            {{calendar.calendar_name}}
                    </label><br><br>

                    <button class="btn btn-info btn-sm pushCalBtn" @click="modifyCalendar()">수정</button>
                    <button class="btn btn-info btn-sm pushCalBtn" @click="deleteCalendarList()">삭제</button>
                </div>
            </li>

        </ul>
    </div>
</template>

<script>
    import http from "../../http-common";
    import RegisterPopup from "./RegisterPopupModal";
    import ScheduleModifyModal from "./ScheduleModifyModal";

export default {
    data() {
        return {
            emp_id: "",         // 사번
            calendarInput : {   // 추가할 캘린더 Input
              cal_name: "",
              cal_color: "#ffffff"
            },
            calendarList: [],         // 모든 캘린더 목록
            checkedCalendars : [],    // 체크된 캘린더 목록
            modi_flag : [],         // 캘린더 목록 수정 여부 검사할 flag
            modi_cal_input : [],
            modi_cal_color : []
        }
    },
    methods : {
        addSchedule() { // 일정 등록 modal 띄우는 메소드
            this.$modal.show(RegisterPopup, {
                registerData : 'data',
                modal : this.$modal,
            },
            {
                 name: 'dynamic-modal',
                 width:'400px',
                 height: '600px',
                 draggable: true
            });
        },
        addCalendar() { // 캘린더 추가하기
            let sche_data = {
                calendar_name : this.calendarInput.cal_name,
                calendar_color: this.calendarInput.cal_color
            }
            if(this.calendarInput.cal_name === "" || this.calendarInput.cal_color === "") {
                return;
            } else {
                http
                    .post("/calendar/add/" + this.emp_id, sche_data)
                    .then(response=> {
                        this.getCalendarList();
                    })
                    .catch(e => {
                        /* eslint-disable no-console */
                        console.log(e);
                    });
            }

        },
        getCalendarList() { // 캘린더 목록 가져오기
            http
                .get("/calendar/list/" + this.emp_id)
                .then(response=> {
                    /* eslint-disable no-console */
                    this.calendarList = response.data;
                    for(let i=0; i<this.calendarList.length; i++) {
                        this.modi_flag[i] = false;
                    }
                })
                .catch(e => {
                    /* eslint-disable no-console */
                    console.log(e);
                });
        },
        modifyCalendar() {  // 캘린더 수정 Modal 창 띄우기
            this.$modal.show(ScheduleModifyModal, {
                    checkedCalendars: this.checkedCalendars,    // 선택한 캘린더의 calendar_id 목록
                    modal: this.$modal,
                },
                {
                    width: '500px',
                    height: '400px',
                    draggable: true
                });

            this.checkedCalendars = []; // 체크한 캘린더 목록 초기화
            // this.getCalendarList(); // 캘린더 목록 다시 불러오기
        },
        deleteCalendarList() {  // 캘린더 목록 삭제 하는 메소드
            if(this.checkedCalendars.length !=0) {
                let flag = confirm("정말로 삭제하시겠습니까?");

                if(flag == true) {
                    if(this.checkedCalendars.length !=0) {
                        http
                            .delete("/calendar/list/" + this.emp_id +"?calendar_id=" + this.checkedCalendars)
                            .then(response=> {
                                /* eslint-disable no-console */
                                this.checkedCalendars = []; // 체크한 캘린더 목록 초기화
                            })
                            .catch(e => {
                                /* eslint-disable no-console */
                                console.log(e);
                            });
                    }
                }
            }

        }
    },
    mounted() {
        // mounted 될 때 로그인이 되어있는 상태라면
        if (sessionStorage.length > 0) { // 현재 sessionStorage에 요소가 존재하는 상태일 때(로그인이 되어서 sessionStorage에 저장된 상태일 때)
            this.emp_id = sessionStorage.getItem("login_id");
            this.getCalendarList();
        }else {
            this.$router.push("/");
        }
    }
};
</script>

<style scoped>
    .subMenu {
        min-width: 200px;
    }
    button{
        width:100%;
    }
    .category{
        width: 90%;
        text-align: left;
        font-size: 13px;
        margin: auto 20px;
        padding-right: 10px;
    }
    .calendarLabel {
        padding-top: 0;
        padding-bottom: 10px;
    }
    .inputColor {
        margin-top: 5px;
        float: left;
    }
    .addInput {
        width: 75%;
        float: left;
        margin-left: 5px;
        margin-right: 2px;
    }
    .addBtn {
        width: 5%;
        float: left;
        padding: 0;
    }
    .checkBox {
        margin-top: 5px;
        margin-right: 5px;
    }
    .pushCalBtn {
        width: 50px;
    }
    /* input color 동그랗게 만들기 */
    input[type="color"] {
        cursor: pointer;    /* 클릭 하는 마우스 커서 모양 */
        -webkit-appearance: none;
        width: 18px;
        height: 17px;
        border-radius: 50%;
    }
    input[type="color"]::-webkit-color-swatch-wrapper {
        padding: 0;
    }
    input[type="color"]::-webkit-color-swatch {
        box-sizing: border-box;
        border-radius: 50%;
    }
    .addCalendarList {
        height: 60px;
        vertical-align: middle;
        padding-top: 8px;
    }
</style>
