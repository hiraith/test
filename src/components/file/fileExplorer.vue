<template>
    <div class="container">
        <subMenu></subMenu>
        <!--        <div class="col-md-12">-->
        <h4>자료실</h4>
        <!--        </div>-->
        <div class="large-12 medium-12 small-12 cell">

        </div>
    </div>
    <!--    <div class="list row">-->
    <!--        -->
    <!--    </div>-->
</template>

<script>
    import http from "../../http-common";
    import FileSubMenu from "./fileSubMenu";

    export default {
        name: "file-explorer",
        data() {
            return {
                empId: '',
                files: ''
            };
        },// End - data
        components: {
            subMenu: FileSubMenu
        },// End - components
        methods: {
            /* eslint-disable no-console */
            /* eslint-enable no-console */
        },// End - methods
        mounted() {// mounted 될때 로그인이 되어있는 상태라면
            if (sessionStorage.length > 0) { // 현재 sessionStorage에 요소가 존재하는 상태일 때(로그인이 되어서 sessionStorage에 저장된 상태일 때)
                this.empId = sessionStorage.getItem("login_id");
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
