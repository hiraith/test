<template>

    <div class="container">
        <!--        <h2 style="float: left; margin-left: 200px">메인화면</h2>-->

        <div class="list row">
            <subMenu></subMenu>
        </div>

        <div v-if="this.login_id != ''">
            <br>
            <div class="wait">
                <wait></wait>
            </div>
            <br>
            <div class="ing">
                <ing></ing>
            </div>
        </div>
    </div>


</template>

<script>
    import http from "../../http-common";
    import ApprovalSubMenu from "./ApprovalSubMenu";
    import SignWait from "./SignWait";
    import SignIng from "./SignIng";
    // import {EventBus} from "../../event-bus";

    export default {
        name: "approval",
        data: function () {
            return {
                login_id: "",
                approvals: [],
                a: 0
            };
        },
        components: {
            subMenu: ApprovalSubMenu,
            wait: SignWait,
            ing: SignIng
        },
        methods: {

            getApprovals(id) {
                http
                    .get("/app/" + id)
                    .then(response => {
                        this.approvals = response.data;
                    })
                    .catch(e => {
                        /* eslint-disable no-console */
                        console.log(e);
                        /* eslint-disable no-console */
                    });
            }
        },
        mounted() {
            /*페이지 로딩전 id에서 session으로 접근, 데이터 가져오는 로직*/

            if (sessionStorage.length > 0) {
                this.login_id = sessionStorage.getItem("login_id");
                this.getApprovals(this.login_id);
            } else {
                alert("로그인을 해주세요!");
                this.$router.push('/');
            }
        }
    }
</script>

<style scoped>

    .list {
        text-align: left;
        max-width: 450px;
        margin: auto;
    }

    .table {

        margin: auto auto auto 150px;
        width: 1000px;

    }

</style>