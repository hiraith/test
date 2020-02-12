<template>
    <div class="myInfo">
        <div class="img_div">
            <img v-bind:src="emp_img_url"><br>
        </div>
        <div class="infoDiv">
            <div class="empName"><strong>{{employee.emp_name}} {{employee.position}}</strong></div>
            <div class="depName">{{dep_name}}</div>
        </div>
    </div>
</template>

<script>
    import http from "../../http-common";

export default {
    name: "employee-info",
    data() {
        return {
          employee: {
            emp_id: "",
            emp_name: "",
            position: "",
            dep_id: ""
          },
          dep_name : "", // 부서이름 담을 변수
          emp_img_url : "" // 사원 사진 경로
        };
    },
    methods: {
        getEmpInfo(id) {    // 매개변수 id는 this.employee.emp_id 이다. : mounted()때 호출되는 메소드.
            http
            .post("/mypage/" + id)
            .then(response => {
                // 응답 데이터를 employee 데이터에 대입하기.
                this.employee.emp_pw = response.data.emp_pw;
                this.employee.emp_name = response.data.emp_name;
                this.employee.emp_email = response.data.emp_email;
                this.employee.position = response.data.position;
                this.employee.hire_date = response.data.hire_date;
                this.employee.extension_number = response.data.extension_number;
                this.employee.phone_number = response.data.phone_number;
                this.employee.dep_id = response.data.dep_id;

                this.getDep_Name(this.employee.dep_id);     // 사원 정보 중 부서 이름 가져오기
                this.emp_img_url = 'http://localhost:8080/emp_img/'+ this.employee.emp_id + '.jpg';  // 사원 이미지 경로 설정
            })
            .catch(e => {
                /* eslint-disable no-console */
                console.log(e);
            });
        }, // End - getEmpInfo : 사원 정보 가져오기, mounted()일 때 실행 됨.
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
        }, // 부서 정보 가져오기

    },
    mounted() {
        // mounted 될 때 로그인이 되어있는 상태라면
        if (sessionStorage.length > 0) { // 현재 sessionStorage에 요소가 존재하는 상태일 때(로그인이 되어서 sessionStorage에 저장된 상태일 때)
            this.employee.emp_id = sessionStorage.getItem("login_id");
            this.getEmpInfo(this.employee.emp_id); // 사원 정보 가져오기
        }else {
            this.$router.push("/");
        }
    } // End - mounted()

}
</script>

<style scoped>
    .myInfo {
        width: 15%;
        height: 40%;
        left: 15px;
        top: 70px;
        position: absolute;
        border: 1px solid gray;
    }
    img {
        width: 100%;
        object-fit: cover;
    }
    .img_div {
        width: 100px;
        height: 100px;
        border-radius: 70%;
        overflow: hidden;
        margin: 15% auto auto;
    }
    .infoDiv {
        margin-top: 20px;
    }
    .empName {
        font-size: 18px;
    }
    .depName {
        color: gray;
    }
</style>