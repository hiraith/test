<template>
    <div class="container">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">일정 검색 결과</h5>
                </div>
                <!-- 일정 수정/삭제 기능 -->
                <div class="modal-body searchResult">
                    <table class="table table-hover searchResultTable">
                        <thead>
                            <tr class="table-active">
                                <th>일정 이름</th>
                                <th>일정 시작일</th>
                                <th>일정 마감일</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(schedule, index) in searchResult" :key="index" @click="showDetail(schedule)">
                                <td>{{schedule.sche_name}}</td>
                                <td>{{schedule.sche_start_date}}</td>
                                <td>{{schedule.sche_end_date}}</td>
                            </tr>
                        </tbody>

                    </table>
                </div>

                <div class="modal-footer">
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
        props: ['searchResult'],
        data() {
            return{
            }
        },
        methods : {
            showDetail(schedule) { // 일정 수정, 삭제할 디테일 modal 띄우는 메소드
                this.$modal.show(ScheduleDetailModal, {
                        name: 'ScheduleDetailModal',
                        schedule: schedule,
                        modal: this.$modal,
                    },
                    {
                        width: '400px',
                        height: '600px',
                        draggable: true,
                    });
            },
            cancel() {
                this.$emit('close');
                for(let i=0; i<1; i++) location.reload();
            }
        }
    }
</script>

<style scoped>
    .searchResult {
        height: 215px;
        overflow: scroll;
        text-overflow: ellipsis; /*말 줄임표 위한 설정*/
        white-space: nowrap; /*말 줄임표 위한 설정*/
        overflow-x: hidden; /*가로 스크롤바 없애기*/
        -ms-overflow-style: none; /*IE에서 스크롤바 투명하게 하기*/
    }
    .searchResult::-webkit-scrollbar { /*IE 제외한 브라우저에서 스크롤바 투명하게 하기*/
        width: 1px;
        background: transparent;
    }
</style>