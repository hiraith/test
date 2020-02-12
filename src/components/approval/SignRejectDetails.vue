<template>


    <div class=" border-primary mb-3" style="max-width: 1100px;">
        <subMenu></subMenu>

        <div class="card-header">
            <div class="top" style="font-size: 30px">
                <span class="title"><b>기안문 확인</b></span>
                <span class="button-group" style="float: right; margin-right: 35px">
                    <button type="button" class="btn btn-secondary disabled buttons"
                            @click="listDoc">목록</button>

                </span>
            </div>
            <div class="row">
                <modals-container/>
            </div>
            <!--------------------------------------------결제선 테이블 시작------------------------------------------------------->
            <div class="sign-line" style="float: right; padding-right: 65px; padding-bottom: 40px;">
                <table class="sign-table" style="border: black 2px solid;">
                    <thead>
                    <tr>
                        <th class="sign-th table-light" rowspan="2" style="width:45px !important;"></th>
                        <th class="table-light" style="border: black 2px solid; width:70px">기안</th>
                        <th v-if="approval.signId1!=''" class="table-light" style="border: black 2px solid; width:70px !important;">결재</th>
                        <th v-if="approval.signId2!=''" class="table-light" style="border: black 2px solid; width:70px !important;">결재</th>
                        <th v-if="approval.signId3!=''" class="table-light" style="border: black 2px solid; width:70px !important;">결재</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td class="table-light" style="vertical-align: middle; line-height: 20px; width:45px !important;">결<br><br>재</td>
                        <td style="border: black 2px solid; width:70px !important; padding-top: 5px; padding-bottom: 5px;"><b>{{approval.writerName}}</b>
                            <img v-bind:src="sign_url_1">
                            {{approval.date.substring(5,10)}}
                        </td>
                        <td v-if="approval.signId1!=''" style="border: black 2px solid; width:70px !important;  padding-top: 5px; padding-bottom: 5px;"><b>{{signName1}}</b>
                            <img v-if="approval.status1!=''" v-bind:src="sign_url_2">
                            <div v-else style="height: 80px;">
                            </div>
                            {{approval.signDate1.substring(5,10)}}
                        </td>
                        <td v-if="approval.signId2!=''" style="border: black 2px solid; width:70px !important;  padding-top: 5px; padding-bottom: 5px;"><b>{{signName2}}</b>
                            <img v-if="approval.status2!=''" v-bind:src="sign_url_3">
                            <div v-else style="height: 80px;">
                            </div>
                            {{approval.signDate2.substring(5,10)}}
                        </td>
                        <td v-if="approval.signId3!=''" style="border: black 2px solid;  padding-top: 5px; padding-bottom: 5px;"><b>{{signName3}}</b>
                            <img v-if="approval.status3!=''" v-bind:src="sign_url_4">
                            <div v-else style="height: 80px;">
                            </div>
                            {{approval.signDate3.substring(5,10)}}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <!--------------------------------------------결재선 테이블 끝--------------------------------------------------------->


            <!--------------------------------------------form테이블 시작---------------------------------------------------------->
            <table class="table tb-bd table-responsive">
                <th scope="row" style="border: aliceblue; font-size: 18px">
                    <div>문서유형</div>

                </th>
                <td scope="row" style="border: aliceblue;">

                    <select id="type" name="type" required v-model="approval.type"
                            style="width: 80px; height: 25px; float: left;">
                        <option v-for="(type,index) in types" :key="index" disabled>{{type}}</option>

                    </select>
                </td>

                <tr>
                    <th scope="row" class="table-light"><label for="docNum">문서번호</label></th>
                    <td><input type="text" class="form-control" id="docNum" required v-model="approval.docNum"
                               name="docNum" readonly style="background-color: aliceblue"></td>
                    <th scope="row" class="table-light"><label for="date">기안일자</label></th>
                    <td><input type="text" class="form-control" id="date" required v-model="approval.date" name="type"
                               style="background-color: aliceblue" :placeholder="cTime" readonly>
                    </td>
                </tr>
                <tr>
                    <th scope="row" class="table-light"><label for="writerName">기안자</label></th>
                    <td><input type="text" class="form-control" id="writerName" required v-model="approval.writerName"
                               name="writerName" readonly
                               style="background-color: aliceblue"></td>
                    <th scope="row" class="table-light"><label for="writerDepName">기안부서</label></th>
                    <td><input type="text" class="form-control" id="writerDepName" required
                               v-model="approval.writerDepName" name="writerDepName" readonly
                               style="background-color: aliceblue"></td>
                </tr>
                <tr>
                    <th scope="row" class="table-light"><label for="writerPosition">직위/직책</label></th>
                    <td><input type="text" class="form-control" id="writerPosition" required
                               v-model="approval.writerPosition" name="writerPosition" readonly
                               style="background-color: aliceblue"></td>
                    <th scope="row" class="table-light"><label for="refId">참조자</label></th><!--수정-->
                    <td><input type="text" class="form-control" id="refId" :value="refName1+' '+refName2 +' ' +refName3"
                               name="refId" placeholder="참조자를 선택해주세요." style="background-color: aliceblue" readonly>
                    </td>
                </tr>
                <tr>
                    <th scope="row" class="table-light"><label for="comment">의견</label></th>
                    <td colspan="3"><input type="text" class="form-control" id="comment" required
                                           q v-model="approval.comment" name="comment" readonly
                                           placeholder="간단한 의견을 적어주세요.(100byte 이내)" style="background-color: aliceblue">
                    </td>
                </tr>
                <tr>
                    <th scope="row" class="table-light"><label for="title">문서제목</label></th>
                    <td colspan="3"><input type="text" class="form-control" id="title" required v-model="approval.title"
                                           name="title" placeholder="기안문의 제목을 적어주세요.(100byte 이내)" readonly
                                           style="background-color: aliceblue">
                    </td>
                </tr>
                <tr>
                    <th scope="row" class="table-light"><label for="refFile">참조</label></th><!--수정-->
                    <td colspan="3">
                        <input type="text" class="form-control" id="refFile" required
                               v-model="approval.refFile" name="refFile" placeholder="참조사항을 적어주세요."
                               style="width: 500px;float: left; background-color: aliceblue;" readonly>
                        <div class="container">
                            <div class="large-12 medium-12 small-12 cell" style="float: left; margin: 0px 20px;"
                                 readonly>
                                <router-link to="#" v-for="(file, key) in downLoadNames" class="file-listing" key="key"
                                             @click.native="getDown(approval.docNum,file)">
                                    <div>{{ file }}</div>
                                </router-link>
                            </div>
                            <div class="large-12 medium-12 small-12 cell" style="float: left; margin: 0px 20px;">
                                <button @click="getDownAll">Download All</button>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" rowspan="10" style="height: 500px">
                        <textarea class="form-control" id="appContent" required v-model="approval.content"
                                  placeholder="양식을 입력해주세요." style="background-color: aliceblue" readonly/>
                    </td>
                </tr>
            </table>
        </div>
        <!--------------------------------------------form테이블 끝---------------------------------------------------------->
    </div>


</template>

<script>
    import ApprovalSubMenu from "./ApprovalSubMenu";
    import http from "../../http-common";
    import SearchSigner from "./SearchSigner";
    import SearchRef from "./SearchRef";
    import axios from "axios";


    export default {
        name: "reject-details",
        props: ["appProps", "id"],
        data: function () {
            return {
                files: [],
                // visible:false,
                login_id: "",
                selectedData: "approval",
                types: ["결재", "합의", "협조"],
                cTime: "",
                refIds: "",
                signName1: "",
                signName2: "",
                signName3: "",
                refName1: "",
                refName2: "",
                refName3: "",
                approval: {
                    docNum: "",
                    type: "결재",
                    title: "",
                    writerId: "",
                    date: "",
                    comment: "",
                    refId1: "",
                    refId2: "",
                    refId3: "",
                    refFile: "",
                    content: "",
                    signId1: "",
                    signId2: "",
                    signId3: "",
                    signDate1: "",
                    signDate2: "",
                    signDate3: "",
                    statusCheck: "",
                    status1: "",
                    status2: "",
                    status3: "",
                    writerName: "",
                    writerPosition: "",
                    writerDepId: "",
                    writerDepName: ""
                },
                sign_url_1: "",
                sign_url_2: "",
                sign_url_3: "",
                sign_url_4: "",
                downLoadNames: [],

            }
        },
        components: {
            subMenu: ApprovalSubMenu
        },
        methods: {
            saveDoc: function () {
                /*submit(상신)누르면 controller접근해서 데이터 받아오고 쏴주는 로직*/
                /*전역변수 지역변수(DB접근명)로 담아주는 변수*/

                this.approval.statusCheck = "save";

                var data = {
                    app_doc_num: this.approval.docNum,
                    app_type: this.approval.type,
                    app_doc_title: this.approval.title,
                    app_writer_id: this.approval.writerId,
                    app_date: this.approval.date,
                    app_comment: this.approval.comment,
                    app_ref_id1: this.approval.refId1,
                    app_ref_id2: this.approval.refId2,
                    app_ref_id3: this.approval.refId3,
                    app_ref_file: this.approval.refFile,
                    app_content: this.approval.content,
                    app_sign_id1: this.approval.signId1,
                    app_sign_id2: this.approval.signId2,
                    app_sign_id3: this.approval.signId3,
                    app_sign_date1: this.approval.signDate1,
                    app_sign_date2: this.approval.signDate2,
                    app_sign_date3: this.approval.signDate3,
                    app_status_check: this.approval.statusCheck,
                    app_status1: this.approval.status1,
                    app_status2: this.approval.status2,
                    app_status3: this.approval.status3,
                    app_writer_name: this.approval.writerName,
                    app_writer_position: this.approval.writerPosition,
                    app_writer_depid: this.approval.writerDepId,
                    app_writer_depname: this.approval.writerDepName
                };
                http
                    .post("/app/doc/write", data)/*put으로 바꾸기*/
                    .then(response => {
                        this.approval = response.data;
                        alert("DB에 저장되었습니다.");
                        this.$router.push('/app/sign/reject');

                    })
                    .catch(e => {
                        /* eslint-disable no-console */
                        console.log(e);
                        /* eslint-disable no-console */

                    });
            },
            search_signer() {
                /*결제자 누르면 검색창(modal)띄워주는 로직*/
                this.$modal.show(SearchSigner, {
                    modal: this.$modal,
                    /*initialValue: this.approval.signId1,*/
                    valueUpdated: (newValue1, newValue2, newValue3, newValue1id, newValue2id, newValue3id) => {
                        /*데이터 이벤트 트리거 역할을 하는 콜백함수*/
                        /*1.props로 function 내려보냄*/
                        /*4.받은 parameter들 전역변수와 동기화*/
                        this.signName1 = newValue1;
                        this.signName2 = newValue2;
                        this.signName3 = newValue3;
                        this.approval.signId1 = newValue1id;
                        this.approval.signId2 = newValue2id;
                        this.approval.signId3 = newValue3id;
                    }
                }, {
                    name: 'dynamic-modal',
                    width: '600px',
                    height: '600px',
                    draggable: true
                })
            },
            search_ref() {
                /*참조input 누르면 검색창(modal)띄워주는 로직*/
                this.$modal.show(SearchRef, {
                    modal: this.$modal,
                    /*initialValue: this.approval.signId1,*/
                    valueUpdated: (newValue1, newValue2, newValue3, newValue1id, newValue2id, newValue3id) => {
                        /*데이터 이벤트 트리거 역할을 하는 콜백함수*/
                        this.refName1 = newValue1;
                        this.refName2 = newValue2;
                        this.refName3 = newValue3;
                        this.approval.refId1 = newValue1id;
                        this.approval.refId2 = newValue2id;
                        this.approval.refId3 = newValue3id;
                    }
                }, {
                    name: 'dynamic-modal',
                    width: '600px',
                    height: '600px',
                    draggable: true
                })
            },
            tempsaveDoc() {
                /*임시저장, 임시저장함으로 보내고, 임시저장함으로 이동하는 로직*/

                this.approval.statusCheck = "temp";

                var data = {
                    app_doc_num: this.approval.docNum,
                    app_type: this.approval.type,
                    app_doc_title: this.approval.title,
                    app_writer_id: this.approval.writerId,
                    app_date: this.approval.date,
                    app_comment: this.approval.comment,
                    app_ref_id1: this.approval.refId1,
                    app_ref_id2: this.approval.refId2,
                    app_ref_id3: this.approval.refId3,
                    app_ref_file: this.approval.refFile,
                    app_content: this.approval.content,
                    app_sign_id1: this.approval.signId1,
                    app_sign_id2: this.approval.signId2,
                    app_sign_id3: this.approval.signId3,
                    app_sign_date1: this.approval.signDate1,
                    app_sign_date2: this.approval.signDate2,
                    app_sign_date3: this.approval.signDate3,
                    app_status_check: this.approval.statusCheck,
                    app_status1: this.approval.status1,
                    app_status2: this.approval.status2,
                    app_status3: this.approval.status3,
                    app_writer_name: this.approval.writerName,
                    app_writer_position: this.approval.writerPosition,
                    app_writer_depid: this.approval.writerDepId,
                    app_writer_depname: this.approval.writerDepName
                };
                http
                    .post("/app/doc/write", data)/*put으로 바꾸기*/
                    .then(response => {
                        this.approval = response.data;
                        alert("DB에 저장되었습니다.");
                        this.$router.push('/app/');
                    })
                    .catch(e => {
                        /* eslint-disable no-console */
                        console.log(e);
                        /* eslint-disable no-console */

                    });
            },
            cancelDoc() {
                /*취소경고, 문서작성취소, 문서함메인으로 돌려주는 로직*/
                /* eslint-disable no-console */
                console.log("cancelDoc_method");
                /* eslint-disable no-console */

                var result = confirm("입력을 취소하시겠습니까?");
                if (result) {
                    alert("입력이 취소되었습니다!");
                    this.$router.push('/app');
                }

            },
            getEmpInfo(id) {    // 매개변수 id는 this.employee.emp_id 이다. : mounted()때 호출되는 메소드.
                http
                    .post("/mypage/" + id)
                    .then(response => {
                        // 응답 데이터를 employee 데이터에 대입하기.
                        this.approval.writerName = response.data.emp_name;
                        this.approval.writerPosition = response.data.position;
                        this.approval.writerDepId = response.data.dep_id;

                        this.approval.writerId = id;

                        var d = new Date();
                        var currentDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
                        // var currentTime = " " + d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
                        this.cTime = currentDate;
                        this.getDep_Name(this.approval.writerDepId);     // 사원 정보 중 부서 이름 가져오기
                    })
                    .catch(e => {
                        /* eslint-disable no-console */
                        console.log(e);
                        /* eslint-disable no-console */
                    });
            }, // End - getEmpInfo : 사원 정보 가져오기, mounted()일 때 실행 됨.
            getDep_Name(dep_id) {
                http
                    .post("/dep/" + dep_id)
                    .then(response => {
                        this.approval.writerDepName = response.data;
                    })
                    .catch(e => {
                        /* eslint-disable no-console */
                        console.log(e);
                        /* eslint-disable no-console */

                    });
            },
            handleFilesUpload() {
                let uploadedFiles = this.$refs.files.files;

                for (var i = 0; i < uploadedFiles.length; i++) {
                    this.files.push(uploadedFiles[i]);
                }
            },
            removeFile(key) {
                this.files.splice(key, 1);
            },
            submitFiles() {

                let formData = new FormData();

                for (var i = 0; i < this.files.length; i++) {

                    let file = this.files[i];
                    formData.append('files[' + i + ']', file);
                }
                axios.post('/multiple-files',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(function () {
                    console.log('SUCCESS!!');
                }).catch(function () {
                    console.log('FAILURE!!');
                });

            },
            addFiles() {
                console.log("진입");
                console.log(this.$refs);
                this.$refs.files.click();

            },
            opening() {
                /*props로 받은 객체 옮겨닮는과정*/

                var data = {
                    app_doc_num: this.approval.docNum,
                    app_type: this.approval.type,
                    app_doc_title: this.approval.title,
                    app_writer_id: this.approval.writerId,
                    app_date: this.approval.date,
                    app_comment: this.approval.comment,
                    app_ref_id1: this.approval.refId1,
                    app_ref_id2: this.approval.refId2,
                    app_ref_id3: this.approval.refId3,
                    app_ref_file: this.approval.refFile,
                    app_content: this.approval.content,
                    app_sign_id1: this.approval.signId1,
                    app_sign_id2: this.approval.signId2,
                    app_sign_id3: this.approval.signId3,
                    app_sign_date1: this.approval.signDate1,
                    app_sign_date2: this.approval.signDate2,
                    app_sign_date3: this.approval.signDate3,
                    app_status_check: this.approval.statusCheck,
                    app_status1: this.approval.status1,
                    app_status2: this.approval.status2,
                    app_status3: this.approval.status3,
                    app_writer_name: this.approval.writerName,
                    app_writer_position: this.approval.writerPosition,
                    app_writer_depid: this.approval.writerDepId,
                    app_writer_depname: this.approval.writerDepName
                };


                http
                    .get("/app/sign/wait/" + this.id)
                    .then(response => {
                        data = response.data;
                        {
                            this.approval.docNum = data.app_doc_num;
                            this.approval.type = data.app_type;
                            this.approval.title = data.app_doc_title;
                            this.approval.writerId = data.app_writer_id;
                            this.approval.date = data.app_date;
                            this.approval.comment = data.app_comment;
                            this.approval.refId1 = data.app_ref_id1;
                            this.approval.refId2 = data.app_ref_id2;
                            this.approval.refId3 = data.app_ref_id3;
                            this.approval.refFile = data.app_ref_file;
                            this.approval.content = data.app_content;
                            this.approval.signId1 = data.app_sign_id1;
                            this.approval.signId2 = data.app_sign_id2;
                            this.approval.signId3 = data.app_sign_id3;
                            this.approval.signDate1 = data.app_sign_date1;
                            this.approval.signDate2 = data.app_sign_date2;
                            this.approval.signDate3 = data.app_sign_date3;
                            this.approval.statusCheck = data.app_status_check;
                            this.approval.status1 = data.app_status1;
                            this.approval.status2 = data.app_status2;
                            this.approval.status3 = data.app_status3;
                            this.approval.writerName = data.app_writer_name;
                            this.approval.writerPosition = data.app_writer_position;
                            this.approval.writerDepId = data.app_writer_depid;
                            this.approval.writerDepName = data.app_writer_depname;
                        }
                        this.signIdToNames(data.app_sign_id1);
                        this.signIdToNames(data.app_sign_id2);
                        this.signIdToNames(data.app_sign_id3);
                        this.refIdToNames(data.app_ref_id1);
                        this.refIdToNames(data.app_ref_id2);
                        this.refIdToNames(data.app_ref_id3);
                        this.signerCheck();
                        this.getDownloadLink(data.app_doc_num);


                    })
                    .catch(e => {
                        /* eslint-disable no-console */
                        console.log(e);
                        /* eslint-disable no-console */

                    });
            },
            signIdToNames(id){
                http
                    .post("/login/name/"+id)
                    .then(response => {
                        if(this.signName1 =='') {
                            this.signName1 = response.data;
                        }
                        else if(this.signName1 != '' && this.signName2 =='' ) {
                            this.signName2 = response.data;
                        }
                        else if(this.signName1 != '' && this.signName2 !='' && this.signName3 =='') {
                            this.signName3 = response.data;
                        }

                    });

            },
            refIdToNames(id){
                http
                    .post("/login/name/"+id)
                    .then(response => {
                        if(this.refName1 =='') {
                            this.refName1 = response.data;
                        }
                        else if(this.refName1 != '' && this.refName2 =='' ) {
                            this.refName2 = response.data;
                        }
                        else if(this.refName1 != '' && this.refName2 !='' && this.refName3 =='') {
                            this.refName3 = response.data;
                        }

                    });

            },

            listDoc(){
                this.$router.push('/app/sign/reject')
            },
            signerCheck() {

                if (require('../../assets/sign_img/' + this.approval.writerId + 'sign' + '.png') != undefined)
                    this.sign_url_1 = require('../../assets/sign_img/' + this.approval.writerId + 'sign' + '.png');

                else
                    this.sign_url_1 = require('../../assets/sign_img/' + 'tempo' + 'sign' + '.png');

                if (this.approval.signId1 != '' && this.approval.status1 == 'true') {
                    if (require('../../assets/sign_img/' + this.approval.signId1 + 'sign' + '.png') != undefined)
                        this.sign_url_2 = require('../../assets/sign_img/' + this.approval.signId1 + 'sign' + '.png');
                    else
                        this.sign_url_2 = require('../../assets/sign_img/' + 'tempo' + 'sign' + '.png');
                }else if(this.approval.signId1 != '' && this.approval.status1 == 'false'){
                    this.sign_url_2 = require('../../assets/sign_img/' + 'no'+ '.png');
                }else if(this.approval.signId1 != '' && this.approval.status1 == 'hold'){
                    this.sign_url_2 = require('../../assets/sign_img/' + 'hold'+ '.png');
                }

                if (this.approval.signId2 != '' && this.approval.status2 == 'true') {
                    if (require('../../assets/sign_img/' + this.approval.signId2 + 'sign' + '.png') != undefined)
                        this.sign_url_3 = require('../../assets/sign_img/' + this.approval.signId2 + 'sign' + '.png');
                    else
                        this.sign_url_3 = require('../../assets/sign_img/' + 'tempo' + 'sign' + '.png');
                }else if(this.approval.signId2 != '' && this.approval.status2 == 'false'){
                    this.sign_url_3 = require('../../assets/sign_img/' + 'no'+ '.png');

                }else if(this.approval.signId2 != '' && this.approval.status2 == 'hold'){
                    this.sign_url_3 = require('../../assets/sign_img/' + 'hold'+ '.png');
                }

                if (this.approval.signId3 != '' && this.approval.status3 == 'true') {
                    if (require('../../assets/sign_img/' + this.approval.signId3 + 'sign' + '.png') != undefined)
                        this.sign_url_4 = require('../../assets/sign_img/' + this.approval.signId3 + 'sign' + '.png');
                    else
                        this.sign_url_4 = require('../../assets/sign_img/' + 'tempo' + 'sign' + '.png');
                }else if(this.approval.signId3 != '' && this.approval.status3 == 'false'){
                    this.sign_url_4 = require('../../assets/sign_img/' + 'no'+ '.png');
                }else if(this.approval.signId3 != '' && this.approval.status3 == 'hold'){
                    this.sign_url_4 = require('../../assets/sign_img/' + 'hold'+ '.png');
                }
            },
            getDownloadLink(docnum) {
                /*1.'파일명' 다운로드링크받아오는 메서드*/
                /*mounted에 구현하는것 추천, docnum은 업로드 파일 폴더이름*/
                http
                    .get('/app/down/' + docnum)
                    .then(r => {
                        this.downLoadNames = r.data;
                        console.log(this.downLoadNames);
                    })
                    .catch(r=>{
                        this.downLoadNames = ["저장된 파일이 없습니다."]
                        console.log(r);
                    })
            },
            getDown(docnum, filename) {
                /*링크누르면 다운로드 되는 메서드*/
                /*axios post 저수준 api*/
                /**/
                http
                ({
                    url: '/app/multiple-files-download/' + docnum,
                    method: 'POST',
                    responseType: 'blob', // important
                    data: filename,
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                    .then(r => {
                        // var message = r.data
                        console.log("r.data");
                        console.log(r.data);
                        var fileURL = window.URL.createObjectURL(new Blob([r.data]));
                        var fileLink = document.createElement('a');

                        fileLink.href = fileURL;
                        fileLink.setAttribute('download', filename);
                        document.body.appendChild(fileLink);
                        fileLink.click();
                        console.log('SUCCESS!!');
                        // console.log(message)

                    }).catch(function () {
                    console.log('FAILURE!!');
                });
            },
            getDownAll() {
                /*전체 다운로드*/
                if (this.downLoadNames.length > 0) {
                    for (let i = 0; i < this.downLoadNames.length; i++) {
                        let filename = this.downLoadNames[i];
                        http
                        ({
                            url: '/app/multiple-files-download/' + this.approval.docNum,
                            method: 'POST',
                            responseType: 'blob', // important
                            data: filename,
                            headers: {
                                "Content-Type": "application/json"
                            },
                        })
                            .then(r => {
                                // var message = r.data
                                console.log("r.data");
                                console.log(r.data);
                                var fileURL = window.URL.createObjectURL(new Blob([r.data]));
                                var fileLink = document.createElement('a');

                                fileLink.href = fileURL;
                                fileLink.setAttribute('download', filename);
                                document.body.appendChild(fileLink);
                                fileLink.click();
                                console.log('SUCCESS!!');
                            }).catch(function () {
                            console.log('FAILURE!!');
                        });
                    }
                }
            },

        },
        mounted() {
            /*페이지 로딩전 id에서 session으로 접근, 데이터 가져오는 로직*/

            if (sessionStorage.length > 0) {
                this.login_id = sessionStorage.getItem("login_id");

                this.getEmpInfo(this.login_id);
            } else {
                alert("로그인을 해주세요!");
                this.$router.push('/');
            }

            // console.log("this.appProps.app_doc_num");
            // console.log(this.appProps.app_doc_num);
            this.opening();

            // console.log("this.approval");
            // console.log(this.approval);
        },
    }
</script>

<style scoped>

    .card {
        margin: auto auto auto 300px;
        border: 1.5px solid black;
        position: static;

    }

    .title {
        text-align: left;
        margin: 30px;
    }

    .table {
        width: 1100px;
        max-width: 1100px;
        /*border:1.5px solid black;*/
        /*border-collapse: collapse;*/
    }

    .card-header {
        margin: 0;
        padding: 0;
        background-color: aliceblue;

    }

    .top {
        text-align: left;
        margin: 30px
    }

    th {
        width: 150px;
    }

    .button-group {
        margin-top: 0px;
        margin-left: 500px;
    }

    .sign-line {

    }

    .sign-table {
        max-width: 300px;
        height: 150px;
    }

    .sign-th {

    }

    input {
        background-color: transparent;
        border: transparent;
        width: border-box;

    }

    textarea {
        height: 500px;
        width: 159%;
        background-color: transparent;
        border: transparent;
        float: left;

    }

    .tb-bd {
        /*border: black 2px solid;*/
    }

    .form-control {
        display: inline-block;
    }

    input[type="file"] {
        position: absolute;
        top: -500px;
    }

    div.file-listing {
        width: 200px;
    }

    span.remove-file {
        color: red;
        cursor: pointer;
        float: right;
    }

    img {
        width: 100%;
        height: 40%;
        object-fit: cover;
    }
</style>