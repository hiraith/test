<template>
    <div class="container">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">일정 등록</h5>
                </div>
                <!-- 일정 추가 기능 -->
                <div class="modal-body">
                        <label class="col-form-label col-form-label-sm">일정 카테고리</label>
                        <select class="form-control form-control-sm popupInput" v-model="sche_Input.calendar_id">
                            <option value=0 hidden>카테고리 선택</option>
                            <option v-for="(calendar, index) in calendarList" :key="index" :value="calendar.calendar_id">
                                {{calendar.calendar_name}}
                            </option>
                        </select>
                        <label class="col-form-label col-form-label-sm">일정 이름</label>
                        <input class="form-control form-control-sm popupInput" type="text" placeholder="일정 이름 입력" required v-model="sche_Input.sche_name">

                        <label class="col-form-label col-form-label-sm" style="width: 100%">일정 시작</label>
                        <input class="form-control form-control-sm popupInput dateInput" type="date" required v-model="sche_Input.sche_start_date">
                        <input class="form-control form-control-sm popupInput timeInput" type="time" style="margin-left: 10px" required v-model="sche_Input.sche_start_time">

                        <label class="col-form-label col-form-label-sm" style="width: 100%">일정 마감</label>
                        <input class="form-control form-control-sm popupInput dateInput" type="date" required v-model="sche_Input.sche_end_date">
                        <input class="form-control form-control-sm popupInput timeInput" type="time" style="margin-left: 10px" required v-model="sche_Input.sche_end_time">

                        <label class="col-form-label col-form-label-sm">일정 장소</label>
                        <input class="form-control form-control-sm popupInput" type="text" placeholder="일정 장소 입력" v-model="sche_Input.sche_place">

                        <label class="col-form-label col-form-label-sm">일정 세부사항</label>
                        <textarea class="form-control form-control-sm popupInput detailInput" rows="3" placeholder="일정 세부사항 입력" v-model="sche_Input.sche_detail"></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="register">확인</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="$emit('close')">취소</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import http from "../../http-common";

    export default {
        data(){
            return {
                emp_id: "",
                calendarList: [],
                sche_Input : {
                    calendar_id : 0,
                    sche_name: "",
                    sche_start_date: "",
                    sche_start_time: "",
                    sche_end_date: "",
                    sche_end_time: "",
                    sche_place: "",
                    sche_detail: "",
                }
            }
        },
        props : [
            'registerData'
        ],
        methods : {
            register(){
                let sche_data = {
                    calendar_id : this.sche_Input.calendar_id,
                    sche_name: this.sche_Input.sche_name,
                    sche_start_date: this.sche_Input.sche_start_date,
                    sche_start_time: this.sche_Input.sche_start_time,
                    sche_end_date: this.sche_Input.sche_end_date,
                    sche_end_time: this.sche_Input.sche_end_time,
                    sche_place: this.sche_Input.sche_place,
                    sche_detail: this.sche_Input.sche_detail
                }
                if(this.sche_Input.calendar_id == 0) {
                    alert("일정 카테고리를 확인해주세요!");
                } else if(this.sche_Input.sche_name === "") {
                    alert("일정 이름을 확인해주세요!");
                } else if(this.sche_Input.sche_start_date === "" || this.sche_Input.sche_start_time === "" ||
                          this.sche_Input.sche_end_date === "" || this.sche_Input.sche_end_time === "") {
                    alert("일정 날짜 또는 시간을 확인해주세요!");
                } else {
                    console.log(sche_data.sche_start_date + "|| "+sche_data.sche_start_time);
                    http
                        .post("/schedule/add/" + this.emp_id, sche_data)
                        .then(response=> {
                            console.log("등록 완료" + response.data);
                            this.$emit('close');
                            for(let i=0; i<1; i++) location.reload();
                        })
                        .catch(e => {
                            /* eslint-disable no-console */
                            console.log(e);
                        });
                } // End : if-else

            }, // End : register() : schedule 테이블에 Input 데이터 저장
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
