<template>
    <div>
        <div><h3>직원 등록</h3></div>

        <form>
            <fieldset>
                <div class="form-group">
                    <input type="file" class="form-control-file" id="exampleInputFile" aria-describedby="fileHelp">
                </div>
            </fieldset>
        </form>


        <div v-if="!added">
            <table>
                <tr>
                    <td>


                    </td>
                    <td>

                    </td>
                </tr>
                <tr>
                    <th for="emp_id">사원 아이디</th>
                    <td><input type="text" id="emp_id" required v-model="employee.emp_id" value={this.emp_id}></td>
                </tr>
                <tr>
                    <th for="emp_pw">사원 비밀번호</th>
                    <td><input type="text" id="emp_pw" required v-model="employee.emp_pw" value={this.emp_pw}></td>
                </tr>
                <tr>
                    <th for="name">사원 성명</th>
                    <td><input type="text" id="name" required v-model="employee.name"></td>
                </tr>
                <tr>
                    <th>사원 이메일</th>
                    <td><input type="text" id="emp_email" required v-model="employee.emp_email"></td>
                </tr>
                <tr>
                    <th>사원 직책</th>
                    <td><input type="text" id="position" required v-model="employee.position"></td>
                </tr>
                <tr>
                    <th>사원 입사일</th>
                    <td><input type="text" required v-model="employee.hire_date"></td>
                </tr>
                <tr>
                    <th>내선번호</th>
                    <td><input type="text" required v-model="employee.extension_number"></td>
                </tr>
                <tr>
                    <th>핸드폰 번호</th>
                    <td><input type="text" required v-model="employee.phone_number"></td>
                </tr>
                <tr>
                    <th>부서 번호</th>
                    <td><input type="text" required v-model="employee.dep_id"></td>
                </tr>
            </table>

            <button v-on:click="addEmployees">등록</button>
        </div>

        <div v-else>
            <h5>{{this.employee.name}}님의 정보가 입력되었습니다.</h5>

            <button v-on:click="newEmployees">다른 직원 정보 추가</button>
            <button v-on:click="goBack">돌아가기</button>

        </div>
    </div>

</template>

<script>
    import http from "../../http-common";

    export default {
        name: "AddEmployees",
        data() {
            return {
                employee: {
                    emp_id: "",
                    emp_pw: "",
                    name: "",
                    emp_email: "",
                    position: "",
                    hire_date: "",
                    extension_number: "",
                    phone_number: "",
                    dep_id: ""

                },
                added: false
            }
        },
        methods: {
            addEmployees() {
                var data = {
                    emp_id: this.employee.emp_id,
                    emp_pw: this.employee.emp_pw,
                    name: this.employee.name,
                    emp_email: this.employee.emp_email,
                    position: this.employee.position,
                    hire_date: this.employee.hire_date,
                    extension_number: this.employee.extension_number,
                    phone_number: this.employee.phone_number,
                    dep_id: this.employee.dep_id
                };
                http
                    .post("/employees/employees/add", data)
                    .then(response => {
                        this.employee.emp_id = response.data.emp_id
                        console.log(response.data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
                this.added = true;
            },
            newEmployees() {
                this.added = false;
                this.employee = {};
            },
            goBack() {
                history.go(-1);
            }

        }
    }
</script>

<style scoped>

</style>