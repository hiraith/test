<template>                                                                  <!--상세페이지 출력부분-->
    <div class="list row">
        <div v-if="this.employee">
            <br><br><br><br><br><br><br><br>

            <div class="card border-primary mb-3" style="width: 25rem;">
                <div class="card-header" align="center">&#60;상세정보&#62;</div>               <!--이름 눌렀을때 나오는 부분-->
                <div class="card-body">
                    <div class="img_div">
                        {{this.getImg(this.employee.emp_id)}}
                        <img v-bind:src="emp_img_url"><br>
                    </div>
                    <h4 class="card-title" align="center">{{this.employee.name}}</h4>


                    <div v-if="employee.position=='대표'" class="progress">
                        <div class="progress-bar" role="progressbar" style="width: 100%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div v-else-if="employee.position=='부장'" class="progress">
                        <div class="progress-bar" role="progressbar" style="width: 80%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div v-else-if="employee.position=='과장'" class="progress">
                        <div class="progress-bar" role="progressbar" style="width: 60%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div v-else-if="employee.position=='대리'" class="progress">
                        <div class="progress-bar" role="progressbar" style="width: 40%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div v-else class="progress">
                        <div class="progress-bar" role="progressbar" style="width: 20%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>


                    <table boder="2" class="table table-hover" align="center">
                        <tr>
                            <th>부서</th>
                            <td>{{this.dep_name, this.getDep_Name(this.employee.dep_id)}}</td>
                        </tr>
                        <tr>
                            <th>직책</th>
                            <td>{{this.employee.position}}</td>
                        </tr>
                        <tr>
                            <th>휴대폰</th>
                            <td>{{this.employee.phone_number}}</td>
                        </tr>
                        <tr>
                            <th>email</th>
                            <td>{{this.employee.emp_email}}</td>
                        </tr>
                        <tr>
                            <th>내선번호</th>
                            <td> {{this.employee.extension_number}}</td>
                        </tr>
                        <tr>
                            <td colspan="2" align="center">
                                <router-link class="btn btn-outline-primary" to="/mainEmployAddress">취소</router-link>
                            </td>
                        </tr>
                    </table>

                </div>
            </div>

        </div>
        <div v-else>
            <br/>
            <br><br><br><br><br><br><br><br>
            <p>Please click on a Board...</p>
        </div>
    </div>

</template>

<script>
    import http from "../../../http-common";

    export default {
        name: "employees-details",
        props: ["employee"],
        data() {
            return{
                dep_name: "",
                emp_img_url : "" // 사원 사진 경로
            }
        },
        methods: {
            getDep_Name(dep_id) {
                http
                    .post("/dep/" + dep_id)
                    .then(response => {
                        this.dep_name = response.data;
                    })
                    .catch(e => {
                        /* eslint-disable no-console */
                        console.log(e);
                    });
            },
            getImg(emp_id) {
                this.emp_img_url = require('../../../assets/emp_img/'+ emp_id + '.jpg');
            }
        }
    }
</script>

<style scoped>
    .list {
        text-align: left;
        max-width: 450px;
        margin: auto;
        position: fixed;
    }
    td {
        width: 70%;
        margin: auto;
        text-align: center;
    }
    th {
        margin: auto;
        text-align: center;
    }
    .img_div {
        width: 50px;
        height: 50px;
        border-radius: 70%;
        overflow: hidden;
        margin-right: 10px;
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

</style>