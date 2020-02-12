<template>
    <div class="submitform">
        <table class="table table-hover">

            <tr>
                <th>ID</th>
                <td>{{outAddress.out_id}}</td>
            </tr>
            <tr>
                <th>성명</th>
                <td><input type="text" placeholder="성명 수정" required v-model="outAddress.outName"></td>
            </tr>
            <tr>
                <th>핸드폰 번호</th>
                <td><input type="text" placeholder="핸드폰 번호 수정" required v-model="outAddress.out_mobile"></td>
            </tr>
            <tr>
                <th>이메일</th>
                <td><input type="text" placeholder="이메일 수정" required v-model="outAddress.out_email"></td>
            </tr>
            <tr>
                <th>회사명</th>
                <td><input type="text" placeholder="회사명 수정" required v-model="outAddress.outCompany"></td>
            </tr>
            <tr>
                <th>회사 전화 번호</th>
                <td><input type="text" placeholder="회사 전화번호 수정" required v-model="outAddress.out_dep_phone"></td>
            </tr>

        </table>
        <button class="btn btn-primary btn-lg" @click="updateOut(outAddress.out_id)">수정하기</button>
        <button class="btn btn-primary btn-lg" @click="deleteOut()">삭제하기</button>
    </div>

</template>

<script>
    import http from "../../http-common";

    export default {
        name: "OutMgmDetail",
        props: ["outAddress"],
        data() {
            return {
                outAddress: {
                    out_id: "",
                    outName: "",
                    out_mobile: "",
                    out_email:"",
                    outCompany:"",
                    out_dep_phone:""
                },
                dep_name: "", // 부서이름 담을 변수
                emp_img_url: "" // 사원 사진 경로
            };
        },

        methods:{
            updateOut(id) {
                let data = {
                    outName: this.outAddress.outName,
                    out_mobile: this.outAddress.out_mobile,
                    out_email: this.outAddress.out_email,
                    outCompany: this.outAddress.outCompany,
                    out_dep_phone: this.outAddress.out_dep_phone

                }

                if (data.outName==""|data.out_mobile==""|data.out_email==""|
                    data.outCompany==""|data.out_dep_phone==""){ // 빈 칸 인지 확인하기
                    alert("빈 칸을 확인해주세요!");
                } else {
                    http
                        .put("/outaddress/update/" + id, data) // UpfficeBack의 MyPageController로 매핑 된다.
                        .then(response => {
                            if (response.data == 1) { // 결과값이 1이라면 1개의 데이터가 수정됐다는 뜻, 즉 수정 성공!
                                alert("수정 완료!");

                                this.$router.push("/manager/out-address")
                            }
                        })
                        .catch(e => {
                            console.log(e);
                        });
                }
            }, // End - updatePhone() : 사원 정보 수정하기(휴대폰 번호, 비밀번호)
            deleteOut(){
                http
                    .delete("/outaddress/outaddress/"+ this.outaddress.out_id)
                    .then(response=>{
                        console.log(response.data);
                        this.$emit("refreshData");
                        this.$router.push('/manager/outaddress');
                    })
                    .catch(e=>{
                        console.log(e);
                    });

            }, //END- delete
        },
        mounted() {
            // mounted 될 때 로그인이 되어있는 상태라면
            if (sessionStorage.length > 0) { // 현재 sessionStorage에 요소가 존재하는 상태일 때(로그인이 되어서 sessionStorage에 저장된 상태일 때)
                /*this.id = this.employee.emp_id;*/ //manager_id로...
                console.log(this.id);

            }else {
                this.$router.push("/manager");
            }
        } // End - mounted()
    }
</script>

<style scoped>
    .table {
        width: 100%;
        margin: auto;
        border: 1px solid #dddddd;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    th {
        vertical-align: middle;
        text-align: left;
    }
    td {
        text-align: left;
    }
</style>