<template>
    <div class="container">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">캘린더 수정</h5>
                </div>
                <!-- 일정 수정/삭제 기능 -->
                <div class="modal-body modifySchedule">
                    <table class="table table-hover modifyScheduleTable">
                        <thead>
                            <tr class="table-primary">
                                <td>캘린더 색</td>
                                <td>캘린더 이름</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(calendar, index) in calendarList" :key="index">
                                <td>
                                    <input type="color" v-model="calendar.calendar_color"/>
                                </td>
                                <td style="width: 70%">
                                    <input type="text" class="form-control form-control-sm inputModiCalendar" :placeholder="calendar.calendar_name"
                                    v-model="modi_cal_input[index]">
                                </td>
                            </tr>
                        </tbody>

                    </table>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="modify">확인</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="cancel">취소</button>
                </div>
            </div>
            <modals-container/>
        </div>
    </div>
</template>

<script>
    import http from "../../http-common";
    import ScheduleDetailModal from "./ScheduleDetailModal";

    export default {
        props: ['checkedCalendars'],
        data() {
            return{
                emp_id: "",
                calendarList: [],
                modi_cal_input: [],
            }
        },
        methods : {
            getCheckedCalendars() {
                http
                    .get("/calendar/checkedList/" + this.emp_id + "?calendar_id=" + this.checkedCalendars) // UpfficeBack의 MyPageController로 매핑 된다.
                    .then(response => {
                        this.calendarList = response.data;
                    })
                    .catch(e => {
                        console.log(e.response);
                    });
            },
            changeColor(cal_id, color) {
                let index;
                console.log(cal_id + " 번째 수정함")
                for(let i=0; i<this.calendarList.length; i++) {
                    if(this.calendarList[i].calendar_id === cal_id) {
                        index = i;
                    }
                }

                this.modi_cal_color[index] = color; // index 에 해당하는 캘린더 색 변경
                console.log(index + " 번 째 : " + this.modi_cal_color[index]);

            },
            modify() {
                for(let i=0; i<this.calendarList.length; i++) {
                    let data = {
                        calendar_id : this.calendarList[i].calendar_id,
                        calendar_name: this.modi_cal_input[i],
                        calendar_color: this.calendarList[i].calendar_color
                    };

                    if(data.calendar_name == undefined) {   // 제목 수정 안 하는 경우
                        data.calendar_name = this.calendarList[i].calendar_name;
                    }

                    http
                        .put("/calendar/update/" + this.emp_id, data) // UpfficeBack의 MyPageController로 매핑 된다.
                        .then(response => {
                            this.$emit('close');
                            for(let i=0; i<1; i++) location.reload();
                        })
                        .catch(e => {
                            console.log(e);
                        });
                }
            },
            cancel() {
                this.$emit('close');
                for(let i=0; i<1; i++) location.reload();
            }
        },
        mounted() {
            this.emp_id = sessionStorage.getItem("login_id");
            this.getCheckedCalendars();
        }
    }
</script>

<style scoped>
    .modifySchedule {
        height: 215px;
        overflow: scroll;
        text-overflow: ellipsis; /*말 줄임표 위한 설정*/
        white-space: nowrap; /*말 줄임표 위한 설정*/
        overflow-x: hidden; /*가로 스크롤바 없애기*/
        -ms-overflow-style: none; /*IE에서 스크롤바 투명하게 하기*/
    }
    .modifySchedule::-webkit-scrollbar { /*IE 제외한 브라우저에서 스크롤바 투명하게 하기*/
        width: 1px;
        background: transparent;
    }
    .modifyScheduleTable {
        text-align: center;
        width: 95%;
        margin: auto;
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
    .inputModiCalendar {
        width: 80%;
        margin: auto;
    }
</style>