<template>
    <div class="container">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">일정 수정 / 삭제</h5>
                </div>
                <!-- 일정 수정/삭제 기능 -->
                <div class="modal-body">
                    <label class="col-form-label col-form-label-sm">일정 카테고리</label>
                    <select class="form-control form-control-sm popupInput" v-model="schedule.calendar_id">
                        <option v-for="(calendar, index) in calendarList" :key="index" :value="calendar.calendar_id">
                            {{calendar.calendar_name}}
                        </option>
                    </select>

                    <label class="col-form-label col-form-label-sm">일정 이름</label>
                    <input class="form-control form-control-sm popupInput" type="text" placeholder="일정 이름 입력" required v-model="schedule.sche_name">

                    <label class="col-form-label col-form-label-sm" style="width: 100%">일정 시작</label>
                    <input class="form-control form-control-sm popupInput dateInput" type="date" required v-model="schedule.sche_start_date">
                    <input class="form-control form-control-sm popupInput timeInput" type="time" style="margin-left: 10px" required v-model="schedule.sche_start_time">

                    <label class="col-form-label col-form-label-sm" style="width: 100%">일정 마감</label>
                    <input class="form-control form-control-sm popupInput dateInput" type="date" required v-model="schedule.sche_end_date">
                    <input class="form-control form-control-sm popupInput timeInput" type="time" style="margin-left: 10px" required v-model="schedule.sche_end_time">

                    <label class="col-form-label col-form-label-sm">일정 장소</label>
                    <input class="form-control form-control-sm popupInput" type="text" placeholder="일정 장소 입력" v-model="schedule.sche_place">

                    <label class="col-form-label col-form-label-sm">일정 세부사항</label>
                    <textarea class="form-control form-control-sm popupInput detailInput" rows="3" placeholder="일정 세부사항 입력" v-model="schedule.sche_detail"/>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-primary" @click="updateSchedule">수정</button>
                    <button type="button" class="btn btn-outline-danger" @click="deleteSchedule">삭제</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="cancel">취소</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import http from "../../http-common";

    export default {
        props: ['schedule'],
        data() {
            return{
                emp_id: "",
                calendarList: [],
                calendar_id: "",
            }
        },
        methods : {
            updateSchedule(){
                let data = {
                    sche_id : this.schedule.sche_id,
                    sche_name: this.schedule.sche_name,
                    sche_start_date: this.schedule.sche_start_date,
                    sche_start_time: this.schedule.sche_start_time,
                    sche_end_date: this.schedule.sche_end_date,
                    sche_end_time: this.schedule.sche_end_time,
                    sche_place: this.schedule.sche_place,
                    sche_detail: this.schedule.sche_detail,
                    calendar_id : this.schedule.calendar_id
                };

                if(this.schedule.sche_name === "") {
                    alert("일정 이름을 확인해주세요!");
                } else if(this.schedule.sche_start_date === "" || this.schedule.sche_start_time === "" ||
                    this.schedule.sche_end_date === "" || this.schedule.sche_end_time === "") {
                    alert("일정 날짜또는 시간을 확인해주세요!");
                } else {
                    http
                        .put("/schedule/update/" + this.emp_id, data)
                        .then(response=> {
                            if(response.data == 1) {
                                this.$emit('close');
                                for(let i=0; i<1; i++) location.reload();
                            }
                        })
                        .catch(e => {
                            /* eslint-disable no-console */
                            console.log(e.response);
                        });
                } // End : if-else

            }, // End : register() : schedule 테이블에 Input 데이터 저장
            deleteSchedule() {
                let flag = confirm("정말로 삭제하시겠습니까?");

                if(flag == true) {
                    http
                        .delete("/schedule/list/" + this.emp_id + "?schedule_id=" + this.schedule.sche_id)
                        .then(response => {
                            /* eslint-disable no-console */
                            this.$emit('close');
                            for(let i=0; i<1; i++) location.reload();
                        })
                        .catch(e => {
                            /* eslint-disable no-console */
                            console.log(e);
                        });
                }
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
            cancel() {
                this.$emit('close');
                // for(let i=0; i<1; i++) location.reload();
            }
        },
        mounted() {
            this.emp_id = this.schedule.emp_id;
            this.getCalendarList();
        }
    }
</script>

<style scoped>
    .popupInput {
        width: 100%;
    }
    .dateInput {
        width: 45%;
        float: left;
    }
    .timeInput {
        width: 40%;
        float: left;
        margin-right: 20px;
    }
</style>