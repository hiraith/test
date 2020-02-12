<template>
    <div class="subMenu">
         <ul class="nav nav-pills flex-column">
             <router-link to="/app">  <li class="list-group-item d-flex justify-content-between align-items-center libgclr">
                 <b>전자결재 메인</b>
             </li></router-link>

            <router-link to="/app/doc">  <li class="list-group-item d-flex justify-content-between align-items-center libgclr">
                <b>기안</b>
              </li></router-link>
              <router-link to="/app/doc/write"><li class="list-group-item d-flex justify-content-between align-items-center libgclr">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;기안문작성
              </li></router-link>
              <router-link to="/app/doc/temp"><li class="list-group-item d-flex justify-content-between align-items-center libgclr">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;임시저장함
              </li></router-link>

             <router-link to="/app/sign">  <li class="list-group-item d-flex justify-content-between align-items-center libgclr">
                 <b>결재</b>
             </li></router-link>
             <router-link to="/app/sign/wait"><li class="list-group-item d-flex justify-content-between align-items-center libgclr">
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;결재 대기함
             </li></router-link>
             <router-link to="/app/sign/ing"><li class="list-group-item d-flex justify-content-between align-items-center libgclr">
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;결재 진행함
             </li></router-link>
             <router-link to="/app/sign/complete"><li class="list-group-item d-flex justify-content-between align-items-center libgclr">
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;완료 문서함
             </li></router-link>
             <router-link to="/app/sign/reject"><li class="list-group-item d-flex justify-content-between align-items-center libgclr">
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;반려 문서함
             </li></router-link>
             <router-link to="/app/sign/hold"><li class="list-group-item d-flex justify-content-between align-items-center libgclr">
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;보류 문서함
             </li></router-link>
             <router-link to="/app/ref">  <li class="list-group-item d-flex justify-content-between align-items-center libgclr">
                 <b>참조/열람</b>
             </li></router-link>
             <router-link to="/app/ref/ref"><li class="list-group-item d-flex justify-content-between align-items-center libgclr">
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;참조/열람문서함
             </li></router-link>

             <router-link to="/app/rcv">  <li class="list-group-item d-flex justify-content-between align-items-center libgclr">
                 <b>수신</b>
             </li></router-link>
             <router-link to="/app/rcv/rcv"><li class="list-group-item d-flex justify-content-between align-items-center libgclr">
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;부서 수신함
             </li></router-link>


         </ul>
    </div>
</template>

<script>

export default {
};
</script>

<style>
    /*.subMenu {*/
    /*    background: #EBF0F0;*/
    /*    width: 15%;*/
    /*    height: 100%;*/
    /*    left: 15px;*/
    /*    top: 70px;*/
    /*    position: fixed;*/
    /*    !*position: absolute;*!*/
    /*}*/

    .shtable > tbody > tr > td:nth-child(1),
    .shtable > thead > tr > th:nth-child(1){
        width:8%;
    }


    .shtable > tbody > tr > td:nth-child(2),
    .shtable > thead > tr > th:nth-child(2),
    .shtable > tbody > tr > td:nth-child(3),
    .shtable > thead > tr > th:nth-child(3),
    .shtable > tbody > tr > td:nth-child(4),
    .shtable > thead > tr > th:nth-child(4),
    .shtable > tbody > tr > td:nth-child(6),
    .shtable > thead > tr > th:nth-child(6){
        width: 10%;
    }
    .shtable > tbody > tr > td:nth-child(7),
    .shtable > thead > tr > th:nth-child(7){
        width: 20%;
    }

    .shtable > tbody > tr > td{
        height: 50px;
    }

    .shtable td{
        vertical-align: middle !important;
        /*table-layout: fixed !important;*/
        /*width: auto;*/

    }
    .card-header{
        border: 1.5px black solid;
        border-radius: 4px;
        position: absolute;
        margin-left: 300px !important;
        max-width: 1100px;
    }
    div.card-header > table > tr> td{
        width: 400px;
    }

    .subMenu{
        height: 678px;
    }
</style>
