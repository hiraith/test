<template>
    <div class="employeesMgm">
        <div>
            <h2>직원 관리</h2>
            <hr>

            <button v-on:click="addEmployees">직원 추가</button>


            <div class="form-inline my-2 my-lg-0" style="margin-bottom: 2px; float: right">
                <fieldset>
                    <input type="text" v-on:keypress="searchNameAndPosition" placeholder="검색(이름, 직책 입력)"
                           class="form-control mr-sm-2" id="nameAndPosition"
                           style="margin-right: 0px !important;  margin-top: 10px;"
                           required v-model="nameAndPosition" name="nameAndPosition"/>


                    <button class="btn btn-secondary my-2 my-sm-0" type="submit"
                            style="margin-left: 0px;  margin-top: 10px !important; " v-on:click="searchNameAndPosition">
                        검색
                    </button>
                    <button class="btn btn-secondary my-2 my-sm-0" type="submit"
                            style="margin-left: 0px;  margin-top: 10px !important; " v-on:click="refreshList">취소
                    </button>
                </fieldset>
            </div>

            {{$route.params}}
            <table id="go-to-detail" class="table table-hover" style="margin-top: 20px">
                <!--출력부분-->
                <thead class="table-secondary">
                <tr>
                    <th>아이디</th>
                    <th>성명</th>
                    <th>이메일</th>
                    <th>직책</th>
                    <th>입사일</th>
                    <th>내선번호</th>
                    <th>휴대폰번호</th>
                    <th>부서</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(employee, index) in employees" :key="index" v-on:click="emp_modi_del(employee,emp_id)">
                    <td>
                        <!-- <router-link :to="{
                             name: 'EmployeesMgmDetail',
                             params: { employee: employee, emp_id: employee.emp_id }
                         }">-->
                        {{employee.emp_id}}
                        <!-- </router-link>-->
                    </td>
                    <td>{{employee.name}}</td>
                    <td>{{employee.emp_email}}</td>
                    <td>{{employee.position}}</td>
                    <td>{{employee.hire_date}}</td>
                    <td>{{employee.extension_number}}</td>
                    <td>{{employee.phone_number}}</td>
                    <td>{{employee.dep_id}}</td>
                </tr>

                </tbody>
            </table>

        </div>
        <div class="col-md-6">
            <router-view @refreshData="refreshList"></router-view>
        </div>
        <!--modal 컴포넌트 포함 시키기 위한 div-->
        <modals-container/>
    </div>
</template>

<script>
    import http from "../../http-common";
    import employeesPopup from "./employeesPopup";

    export default {
        name: "employeesManagement",
        data() {
            return {
                employees: [],
                emp_id: "",
                nameAndPosition: ""
            };


        },/*END-OF-data*/

        methods: {
            retrieveEmployees() {
                http
                    .get("/employees/employees")
                    .then(response => {
                        this.employees = response.data; // JSON are parsed automatically.
                        console.log(response.data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            refreshList() {
                this.retrieveEmployees();
                this.nameAndPosition = "";
            },
           /* goToDetail(emp, emp_id) {
                // window.open("/manager/employees/" + emp_id);
                console.log("디테일로 갑니까?");
                this.$router.push({
                    name: 'EmployeesMgmDetail',
                    params: {employee: emp, id: emp_id}
                })
                console.log(emp_id)
            },*/

            addEmployees() {
                this.$router.push('/manager/add-employees')
            },
            searchNameAndPosition() {
                http
                    .get("/employees/employees/nameAndPosition/" + this.nameAndPosition)
                    .then(response => {
                        this.employees = response.data;
                        console.log(response.data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            emp_modi_del(emp,emp_id) { // 일정 등록 modal 띄우는 메소드

                this.$modal.show(employeesPopup, {
                    modal_employees: 'data',
                        modal: this.$modal,
                        employees:{ employee: emp,
                            id: emp_id,}

                    },
                    {
                        name: 'dynamic-modal',
                        width: '500px',
                        height: '700px',
                        draggable: true,
                    });
                console.log(emp_id);

            },



           /* emp_modi_del() { // 일정 등록 modal 띄우는 메소드

                this.$modal.show(employeesPopup, {
                        registerData: 'data',
                        modal: this.$modal, valueUpdated: (emp_id, emp_pw, emp_name, emp_email, position,
                                                           hire_date, extension_number, phone_number, dep_id) => {
                            this.employees.emp_id = emp_id;
                            this.employees.emp_pw = emp_pw;
                            this.employees.name = emp_name;
                            this.employees.emp_email = emp_email;
                            this.employees.position = position;
                            this.employees.hire_date = hire_date;
                            this.employees.extension_number = extension_number;
                            this.employees.phone_number = phone_number;
                            this.employees.dep_id = dep_id;
                        }
                    },
                    {
                        name: 'dynamic-modal',
                        width: '500px',
                        height: '700px',
                        draggable: true,
                    });
                console.log(this.employees.emp_id);
            },*/
        },/*END-OF-methods*/
        mounted() {
            if (sessionStorage.length > 0) { // 현재 sessionStorage에 요소가 존재하는 상태일 때(로그인이 되어서 sessionStorage에 저장된 상태일 때)
                this.retrieveEmployees();
            } else {
                this.$router.push("/");
            }

        },

    }
</script>

<style scoped>
    #nameAndPosition {
        width: 200px;
    }

    .form-group, btn-group {
        float: right;
    }

</style>