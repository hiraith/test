<template>
    <div class="subMenu">
        <ul class="nav nav-pills flex-column">
            <li class="nav-item"><h4>5.공용주소록</h4></li>
            <router-link to="/mainEmployAddress">
                <li class="list-group-item d-flex justify-content-between align-items-center libgclr">
                   내부주소록
                </li>
            </router-link>
            <router-link to="/mainOutAddress">
                <li class="list-group-item d-flex justify-content-between align-items-center libgclr">
                    외부주소록
                </li>
            </router-link>
        </ul>
    </div>
</template>

<script>
    export default {};
</script>

<style>
    .subMenu {
        position: absolute;
    }
</style>
