<template>
    <div>
        <div><h3>외부 연락처 등록</h3></div>
        <div v-if="!added">
            <table>
                <tr>
                    <th for="out_id">외부 아이디</th>
                    <td><input type="text" id="out_id" required v-model="outaddress.out_id" ></td>
                </tr>

                <tr>
                    <th for="name">외부업체 성명</th>
                    <td><input type="text" id="name" required v-model="outaddress.outName"></td>
                </tr>

                <tr>
                    <th>외부업체 핸드폰 번호</th>
                    <td><input type="text" required v-model="outaddress.out_mobile"></td>
                </tr>

                <tr>
                    <th>외부 업체 이메일</th>
                    <td><input type="text" id="out_id_email" required v-model="outaddress.out_email"></td>
                </tr>
                <tr>
                    <th>외부 업체명</th>
                    <td><input type="text" id="out_company" required v-model="outaddress.outCompany"></td>
                </tr>
                <tr>
                    <th>외부업체 부서 번호</th>
                    <td><input type="text" id="out_dep_phone" required v-model="outaddress.out_dep_phone"></td>
                </tr>

            </table>

            <button v-on:click="addOut">등록</button>
        </div>

        <div v-else>
            <h5>{{this.outaddress.outCompany}}의 정보가 입력되었습니다.</h5>

            <button v-on:click="newOutAddress">다른 회사 연락처 추가</button>

        </div>
    </div>

</template>

<script>
    import http from "../../http-common";

    export default {
        name: "AddOutAddress",
        data() {
            return {
                outaddress: {
                    out_id: "",
                    outName: "",
                    out_mobile:"",
                    out_email: "",
                    outCompany:"",
                    out_dep_phone: ""

                },
                added: false
            }
        },
        methods: {
            addOut() {
                var data = {
                    out_id: this.outaddress.out_id,
                    outName: this.outaddress.outName,
                    out_mobile: this.outaddress.out_mobile,
                    out_email: this.outaddress.out_email,
                    outCompany: this.outaddress. outCompany,
                    out_dep_phone: this.outaddress.out_dep_phone
                };
                http
                    .post("/outaddress/outaddress/add", data)
                    .then(response => {
                        this.outaddress.out_id = response.data.out_id
                        console.log(response.data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
                this.added = true;
            },
            newOutAddress() {
                this.added = false;
                this.outaddress={};
            },

        }
    }
</script>

<style scoped>

</style>