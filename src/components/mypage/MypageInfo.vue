<template>
    <div>
        <div>
            <table class="table table-hover mypageTable">
                <tr>
                    <td rowspan="6" width="25%">
                        <div class="img_div">
                            <img v-bind:src="emp_img_url"><br>
                        </div>
                    </td>
                    <th width="25%">사번</th>
                    <td width="50%">{{employee.emp_id}}</td>
                </tr>
                <tr>
                    <th>비밀번호</th>
                    <td><input class="form-control" type="password" placeholder="비밀번호" required v-model="employee.emp_pw"></td>
                </tr>
                <tr>
                    <th>비밀번호 확인</th>
                    <td><input class="form-control" type="password" placeholder="비밀번호 확인" required v-model="emp_pw_chk"></td>
                </tr>
                <tr>
                    <th>소속</th>
                    <td>{{dep_name}}</td>
                </tr>
                <tr>
                    <th>직책</th>
                    <td>{{employee.position}}</td>
                </tr>
                <tr>
                    <th>내선번호</th>
                    <td>{{employee.extension_number}}</td>
                </tr>
                <tr>
                    <th rowspan="3" style="text-align: center"><span style="font-size: large">{{employee.emp_name}}</span></th>
                    <th>입사일</th>
                    <td>{{employee.hire_date}}</td>
                </tr>
                <tr>
                    <th>이메일</th>
                    <td>{{employee.emp_email}}</td>
                </tr>
                <tr>
                    <th>휴대폰 번호</th>
                    <td><input class="form-control" type="text" placeholder="000-0000-0000" required v-model="employee.phone_number"></td>
                </tr>
            </table><br>
        </div>
        <button class="btn btn-primary btn-lg" @click="updateInfo(employee.emp_id)">수정하기</button>
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
            emp_pw: "",
            emp_name: "",
            emp_email: "",
            position: "",
            hire_date: "",
            extension_number: "",
            phone_number: "",
            dep_id: ""
          },
          dep_name : "", // 부서이름 담을 변수
          emp_pw_chk : "", // 비밀번호 확인값 담을 변수
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
        updateInfo(id) {
            let data = {
                emp_pw : this.employee.emp_pw,
                pw_chk : this.emp_pw_chk,
                phone_number : this.employee.phone_number
            }

            if (data.phone_number == "" | data.emp_pw == "" | data.pw_chk == ""){ // 휴대폰 번호, 비밀번호, 비밀번호 확인 칸 빈 칸 인지 확인하기
                alert("빈 칸을 확인해주세요!");
            } else if(data.emp_pw != data.pw_chk){  // 비밀번호, 비밀번호 확인란의 입력 값이 다른지 확인하기
                alert("비밀번호를 확인해주세요!");
            } else {
                http
                    .put("/mypage/update/phone/" + id, data) // UpfficeBack의 MyPageController로 매핑 된다.
                    .then(response => {
                        if (response.data == 1) { // 결과값이 1이라면 1개의 데이터가 수정됐다는 뜻, 즉 수정 성공!
                            alert("수정 완료!");

                            // 한 번만 새로고침 하기
                            for(let i=0; i<1; i++) {
                                location.reload();
                            }
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        } // End - updatePhone() : 사원 정보 수정하기(휴대폰 번호, 비밀번호)

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
    .mypageTable {
        width: 80%;
        margin: 20px auto auto;
        border: 1px solid #dddddd;
    }
    .form-control {
        width: 200px;
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .img_div {
        margin: 50px auto auto;
        width: 250px;
        height: 250px;
        border-radius: 70%;
        overflow: hidden;
    }
    th {
        vertical-align: middle;
        text-align: left;
    }
    td {
        text-align: left;
    }
</style>