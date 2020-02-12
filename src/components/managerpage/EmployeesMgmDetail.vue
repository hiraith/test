<template>
    <div class="submitform">
        <table class="table table-hover">

            <tr>
                <th>사번</th>
                <td>{{employee.emp_id}}</td>
            </tr>
            <tr>
                <th>성명</th>
                <td><input type="text" placeholder="성명 수정" required v-model="employee.name"></td>
            </tr>
            <tr>
                <th>소속</th>
                <td><input type="text" placeholder="소속 수정" required v-model="employee.dep_id"></td>
            </tr>
            <tr>
                <th>직책</th>
                <td><input type="text" placeholder="직책 수정" required v-model="employee.position"></td>
            </tr>
            <tr>
                <th>내선번호</th>
                <td><input type="text" placeholder="내선번호 수정" required v-model="employee.extension_number"></td>
            </tr>
            <tr>
                <th>입사일</th>
                <td><input type="text" placeholder="입사일 수정" required v-model="employee.hire_date"></td>
            </tr>
            <tr>
                <th>이메일</th>
                <td><input type="text" placeholder="이메일 수정" required v-model="employee.emp_email"></td>
            </tr>
            <tr>
                <th>휴대폰번호</th>
                <td><input type="text" placeholder="휴대폰번호 수정" required v-model="employee.phone_number"></td>
            </tr>
        </table>
        <button class="btn btn-primary btn-lg" @click="updateEmployees(employee.emp_id)">수정하기</button>
        <button class="btn btn-primary btn-lg" @click="deleteEmployees()">삭제하기</button>
    </div>

</template>

<script>
    import http from "../../http-common";
    export default {

        name: "EmployeesMgmDetail",
        props: ["employee"],
        data() {
            return {
                employee: {
                    emp_id: "",
                    emp_pw: "",
                    emp_name: "",
                    emp_email: "",
                    position: "",
                    hire_date: "",
                    extension_number: "",
                    phone_number: "",
                    dep_id: ""
                },
                dep_name: "", // 부서이름 담을 변수
                emp_img_url: "" // 사원 사진 경로
            };
        },
        created() { //뷰 생성시 데이터 불러오기
            this.getEmpInfo()
        },
        watch:{'$route':'getEmpInfo'},  //라우터 변경되면 메소드 다시 호출
        methods:{

            getDep_Name(dep_id) {
                http
                    .post("/dep/" + dep_id)
                    .then(response => {
                        this.dep_name = response.data;
                        console.log(this.dep_name+"부서이름가져오나");
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }, // 부서 정보 가져오기
            updateEmployees(id) {
                let data = {
                    name: this.employee.name,
                    dep_id: this.employee.dep_id,
                    position:this.employee.position,
                    extension_number: this.employee.extension_number,
                    hire_date: this.employee.hire_date,
                    emp_email: this.employee.emp_email,
                    phone_number : this.employee.phone_number
                }

                if (data.name==""|data.dep_id==""|data.position==""|data.extension_number==""|
                    data.hire_date==""|data.emp_email==""|data.phone_number == ""){ // 빈 칸 인지 확인하기
                    alert("빈 칸을 확인해주세요!");
                } else {
                    http
                        .put("/employees/update/" + id, data) // UpfficeBack의 MyPageController로 매핑 된다.
                        .then(response => {
                            if (response.data == 1) { // 결과값이 1이라면 1개의 데이터가 수정됐다는 뜻, 즉 수정 성공!
                                alert("수정 완료!");

                               this.$router.push("/manager")
                            }
                        })
                        .catch(e => {
                            console.log(e);
                        });
                }
            }, // End - updatePhone() : 사원 정보 수정하기(휴대폰 번호, 비밀번호)
            deleteEmployees(){
                http
                .delete("/employees/employees/"+ this.employee.emp_id)
                .then(response=>{
                  console.log(response.data);
                  this.$emit("refreshData");
                  this.$router.push('/manager/employees');
                })
                .catch(e=>{
                   console.log(e);
                });

            }, //END- delete
        },
        mounted() {
            // mounted 될 때 로그인이 되어있는 상태라면
            if (sessionStorage.length > 0) { // 현재 sessionStorage에 요소가 존재하는 상태일 때(로그인이 되어서 sessionStorage에 저장된 상태일 때)
                this.id = this.employee.emp_id;
                console.log(this.id);
                this.getEmpInfo(this.employees.emp_id); // 사원 정보 가져오기
                this.getDep_Name(this.employee.dep_id);
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