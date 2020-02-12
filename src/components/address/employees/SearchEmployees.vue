<template>
    <div class="searchform">
        <h6>이름으로 찾기</h6>
        <div class="form-group">
            <input type="text" v-on:keyup.enter="searchEmployees" class="form-control" id="name" required v-model="name" name="name">

        </div>

        <div class="btn-group">
            <button v-on:click="searchEmployees" class="btn btn-success">Search</button>
            <!--<button v-on:click="/mainEmployAddress">취소</button>
            <router-link to="/mainEmployAddress">취소</router-link>-->
        </div>

        <ul class="search-result">
            <li v-for="(employees, index) in employees" :key="index">
                <h6>({{employees.name}}){{employees.name}} </h6>
            </li>
        </ul>
    </div>
</template>

<script>
    import http from "../../../http-common";
    export default {
        name: "searchEmployees",
        data() {
            return {
                name: "",
                employees: []
            };
        },
        methods: {
            /* eslint-disable no-console */
            searchEmployees() {
                http
                    .get("/employees/employees/emp_id/" + this.emp_id)
                    .then(response => {
                        this.employees = response.data; // JSON are parsed automatically.
                        console.log(response.data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
            /* eslint-enable no-console */
        }
    }
</script>

<style>
    .searchform {
        margin-top: 30px;
        max-width: 300px;
        /* margin: auto;*/
    }
    .search-result {
        margin-top: 20px;
        text-align: left;
    }

    .btn-group{
        float: right;
    }
</style>