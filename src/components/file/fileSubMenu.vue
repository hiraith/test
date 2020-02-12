<template>
    <div class="subMenu">
        <ul class="nav nav-pills flex-column">
            <li class="list-group-item list-group-item-action active">
                자료실 목록
            </li>
            <router-link to="/file/all">
                <li class="list-group-item d-flex justify-content-between align-items-center libgclr">
                    전사 자료실
                </li>
            </router-link>
            <router-link to="/file/dep">
                <li class="list-group-item d-flex justify-content-between align-items-center libgclr">
                    부서 자료실
                </li>
            </router-link>
            <router-link to="/file/emp">
                <li class="list-group-item d-flex justify-content-between align-items-center libgclr">
                    개인 자료실
                </li>
            </router-link>
        </ul>
    </div>
</template>

<script>
    import http from "../../http-common";

    export default {
        name: "FileSubMenu",
        data() {
            return {
                empId: ''
            };
        },// End - data
        components: {},
        methods: {
            /* eslint-disable no-console */
            /* eslint-enable no-console */
        },// End - methods
        mounted() {
            // mounted 될 때 로그인이 되어있는 상태라면
            if (sessionStorage.length > 0) { // 현재 sessionStorage에 요소가 존재하는 상태일 때(로그인이 되어서 sessionStorage에 저장된 상태일 때)
                this.empId = sessionStorage.getItem("login_id");// sessionStorage에서 사번 가져오기
            }
        }// End - mounted()
    };// End - export default
</script>

<style>

</style>
