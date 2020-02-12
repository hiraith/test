<template>

    <div class="container">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">결재선 지정</h5>
                    <button type="button" class="close" aria-label="Close" style="font-size: 40px; color: black;"
                            @click="$emit('close')">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <fieldset>
                        <div>검색</div>
                        <input type="text" v-on:input="searchMatching($event.target.value)"
                               @keyup.enter="extractSelected(keyNum)"
                               @keydown.up="selectAbove"
                               @keydown.left="selectAbove"
                               @keydown.down="selectBelow"
                               @keydown.right="selectBelow"
                               @keydown.tab="removeAutoComplete"
                               class="form-control col-md-12 " placeholder="부서나 이름을 입력해주세요"
                               v-bind:class="{'is-valid':isValid()}"
                               style="width: 400px; float: left; border:2px #95a5a6 solid">
                        <input type="button" class="btn btn-primary" value="추가" style="float: right" @click="extractSelected(keyNum)" v-on:click="selectBelow">
                    </fieldset>

                    <div class="searchResult" v-if="showArr.length>0"
                         style="background-color: aliceblue; width: 400px; border: #95a5a6 1.5px solid; border-top: 0px; border-radius: 3px">
                        <div id="empList" v-for="(emp,index) in showArr" :key="index" style="text-align: -webkit-left;">
                            <div v-bind:class="{'selected':isSelected(index)}"><!--v-if="emp.selected=false"-->
                                <router-link to="" style="margin-left: 10px" @click.native="extractSelected(index)">
                                    <b>{{emp.dep_name}}</b>&nbsp;&nbsp;&nbsp;<b>{{emp.emp_name}}</b>&nbsp;&nbsp;&nbsp;<b>{{emp.emp_email}}</b>
                                </router-link>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <div style="float: left">
                        <button v-if="sign1 != ''" type="button" class="btn btn-outline-success btn-sm" @click="sign1=''"><b>결재 1 :</b>{{sign1}}</button>
                        <button v-if="sign2 != ''" type="button" class="btn btn-outline-success btn-sm"  @click="sign2=''"><b>결재 2 :</b>{{sign2}}</button>
                        <button v-if="sign3 != ''" type="button" class="btn btn-outline-success btn-sm"  @click="sign3=''"><b>결재 3 :</b>{{sign3}}</button>
                    </div>
                    <input class="btn btn-primary" @click="submit_signer" type="button" value="등록">
                    <input class="btn btn-secondary" @click="$emit('close')" type="button" value="취소">
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import http from "../../http-common"
    import * as Hangul from 'hangul-js';

    export default {
        name: "SearchSigner",
        data: function () {
            return {
                show : true,
                keyNum: 0,
                sign1: "",
                sign2: "",
                sign3: "",
                sign1id:"",
                sign2id:"",
                sign3id:"",
                del_password: '',
                selected: false,
                showArr: [],
                depArr: [],
                empArr: [],
            }
        }, props: [
            /*2.props에서 내려보낸 함수 등록해줌*/
            'valueUpdated'
        ], methods: {

            submit_signer() {
                /*3.닫기전 submit등에 연결된 메서드에 props등록한 함수로 데이터 넘겨줌*/
                this.valueUpdated(this.sign1,this.sign2,this.sign3,this.sign1id,this.sign2id,this.sign3id);
                this.$emit('close');
            },
            searchMatching: function (lang) {
                if (this.showArr.length > 6) {//결과값 6이상이면 함수종료//유효하지않은듯
                    return
                } else {//결과값 6개 미만
                    /*새변수 = .filter() [새로운 배열로 반환]*/
                    this.showArr = this.empArr.filter(function (emp) {
                        /*return [이름,부서] 문자열검색 || 초성검색*/

                        return emp.emp_name.includes(lang) || emp.dis_emp_name.includes(Hangul.disassemble(lang).join(""))
                            || emp.dep_name.includes(lang) || emp.dis_dep_name.includes(Hangul.disassemble(lang).join(""));
                    })
                }
            },
            idToName: function () {
                /*emp,dep table dep_id비교해서 emp에 dep_name bind*/
                for (let i = 0; i < this.empArr.length; i++) {
                    for (let j = 0; j < this.depArr.length; j++) {
                        if (this.empArr[i].dep_id === this.depArr[j].dep_id) {
                            this.empArr[i].dep_name = this.depArr[j].dep_name;
                        }
                    }
                }
            },
            addCho: function () {
                this.empArr.forEach(function (emp) {
                    /*empArr에 초성필드 추가{emp_name:"김범준", disassembled:"ㄱㅂㅈ"}*/
                    let dis = Hangul.disassemble(emp.emp_name, true)
                    let dis2 = Hangul.disassemble(emp.dep_name, true)
                    let cho = dis.reduce(function (prev, elem) {
                        elem = elem[0] ? elem[0] : elem;
                        return prev + elem;
                    }, "");
                    let cho2 = dis2.reduce(function (prev, elem) {
                        elem = elem[0] ? elem[0] : elem;
                        return prev + elem;
                    }, "");
                    emp.dis_emp_name = cho;
                    emp.dis_dep_name = cho2;
                    emp.selected = false;//선택 property 추가
                });
            },
            saveInfo: function () {
                /*연관검색 데이터 가져오는 메서드(SELECT ALL)*/
                http
                    .post("/app/search/dep")
                    .then(response => {
                        this.depArr = response.data;
                        this.idToName();
                        this.addCho();
                    })
                    .catch(e => {
                        /* eslint-disable no-console */
                        console.log(e)
                        /* eslint-disable no-console */

                    });

                http
                    .post("/app/search/emp")
                    .then(response => {
                        this.empArr = response.data;
                        for(let i=0; i<this.empArr.length; i++){
                            if(this.empArr[i].emp_id == sessionStorage.getItem("login_id")){
                                this.empArr.splice(i,1);
                            }
                        }
                        this.idToName();
                        this.addCho();
                    })
                    .catch(e => {
                        /* eslint-disable no-console */
                        console.log(e);
                        /* eslint-disable no-console */
                    });
            },

            selectAbove() {
                /*input 에서 위,왼쪽 눌렀을때 선택된곳 */

                // if(this.showArr[this.keyNum].selected == null)
                //     return

                if(this.showArr.length == 0){ //from jy..
                    return
                }

                if (this.keyNum == 0) {//맨위
                    this.showArr[this.keyNum].selected = true;
                    this.showArr[this.keyNum + 1].selected = false;

                } else if (this.keyNum == this.showArr.length) {//맨아래
                    this.showArr[this.keyNum - 1].selected = true;
                    this.keyNum--
                } else {
                    this.showArr[this.keyNum - 1].selected = true;
                    this.showArr[this.keyNum].selected = false;
                    this.keyNum--
                }
            },
            selectBelow() {
                /*input 에서 아래,오른쪽 눌렀을때 선택된곳*/

                // if(this.showArr[this.keyNum].selected == null)
                //     return//수정해야됨***

                if(this.showArr.length == 0){ //from jy..
                    return
                }

                if (this.keyNum == 0) {//맨위
                    this.showArr[this.keyNum].selected = true;
                    this.keyNum++
                } else if (this.keyNum + 1 == this.showArr.length) {//맨아래
                    this.showArr[this.keyNum - 1].selected = true;
                } else {
                    this.showArr[this.keyNum].selected = true;
                    this.showArr[this.keyNum - 1].selected = false;
                    this.keyNum++
                }

            }, isSelected(index) {
                /* 선택된 class 바인딩 위해 return 반환하는 메서드*/
                if (index == this.keyNum) {
                    return true
                } else {
                    return false
                }
            }, isValid(){
                if(this.showArr.length>0){
                    return true
                } else {
                    return false
                }
            },
            extractSelected(index){
                /*변수에 선택한 결제재 정보 넘겨주는 메서드*/
                if(index != null){
                    this.keyNum = index
                }
                if(this.sign1 == ''){
                this.sign1 = this.showArr[this.keyNum].emp_name
                this.sign1id = this.showArr[this.keyNum].emp_id
                }else if(this.sign1 != '' && this.sign1 == this.showArr[this.keyNum].emp_name){
                    alert("이미 지정한 결제자입니다!")
                }else if(this.sign1 != '' && this.sign2 == '' && this.sign1 != this.showArr[this.keyNum].emp_name){
                  this.sign2 = this.showArr[this.keyNum].emp_name
                  this.sign2id = this.showArr[this.keyNum].emp_id
                }else if(this.sign1 != '' && this.sign2 != '' && (this.sign1 == this.showArr[this.keyNum].emp_name || this.sign2 == this.showArr[this.keyNum].emp_name)){
                    alert("이미 지정한 결제자입니다!")
                }else if(this.sign1 !='' && this.sign2 !='' && this.sign1 != this.showArr[this.keyNum].emp_name && this.sign2 != this.showArr[this.keyNum].emp_name) {
                    this.sign3 = this.showArr[this.keyNum].emp_name
                    this.sign3id = this.showArr[this.keyNum].emp_id
                }
            },
            removeAutoComplete(){
                this.showArr.length = 0;
            }


        },//End of method :{}
        mounted() {
            /*db가져와서 info에 넣어주는 로직*/
            this.saveInfo();
        },//End of mounted(){}

    }//End of export default
</script>

<style scoped>
    .selected {
        background-color: #ECF0F1;
    }

    .searchResult {
        max-height: 215px;
        overflow: scroll;
        text-overflow: ellipsis; /*말 줄임표 위한 설정*/
        white-space: nowrap; /*말 줄임표 위한 설정*/
        overflow-x: hidden; /*가로 스크롤바 없애기*/
        -ms-overflow-style: none; /*IE에서 스크롤바 투명하게 하기*/
    }
    .searchResult::-webkit-scrollbar { /*IE 제외한 브라우저에서 스크롤바 투명하게 하기*/
        width: 1px;
        background: transparent;
    }
</style>