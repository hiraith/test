<template>
    <div id="app" class="container-fluid">
        <TopMenu></TopMenu>
        <router-view></router-view>
    </div>
</template>

<script>
    import TopMenu from "./components/TopMenu.vue";

    export default {
        name: "app",
        components: {
            TopMenu: TopMenu
        }
    };
    /* eslint-disable no-console */
</script>

<style>
    .container-fluid {
        text-align: center;
    }
    .libgclr {
        background: #EBF0F0;
    }

    .subMenu {
        background: #EBF0F0;
        width: 15%;
        height: 100%;
        left: 15px;
        top: 70px;
        position: absolute;
    }
    .subMenu2 {
        background: #EBF0F0;
        width: 15%;
        height: 100%;
        left: 15px;
        top: 70px;
        position: absolute;
    }
</style>
