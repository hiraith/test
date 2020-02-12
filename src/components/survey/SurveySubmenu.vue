<template>
    <div class="subMenu">

        <ul class="nav nav-pills flex-column">
                <div style="font-weight: bold; margin: 8%; font-size: 20px">
                    설문 조사
                </div>
            <router-link to="/survey">
                <li class="list-group-item d-flex justify-content-between align-items-center libgclr" style="font-weight: bold;">
                    진행 중인 설문
                </li>
            </router-link>
            <router-link to="/endsurvey">
                <li class="list-group-item d-flex justify-content-between align-items-center libgclr" style="font-weight: bold;">
                    마감된 설문
                </li>
            </router-link>
            <router-link to="/addsurvey">
                <li class="btn btn-success" style="width: 100%; margin-top: 40%; font-weight: bold;font-size: 20px">
                    설문 등록하기
                </li>
            </router-link>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "PostSubmenu"
    }
</script>

<style scoped>

</style>