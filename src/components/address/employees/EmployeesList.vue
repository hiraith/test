<template>
    <div class="list row">
        <div class="col-md-6">

            <div><button v-on:click="helloWorld">부서1</button></div>

            <!--<table boder="2" class="table table-hover">
                <thead class="table-primary">부서1</thead>
                <tr v-for="(employees, index) in employees" :key="index">
                    <td>
                        <router-link :to="{
                    name : 'employees-details',
                    params: { employees: employees, emp_id: employees.emp_id,
                            emp_name:employees.name, emp_email:employees.emp_email,
                            position:employees.position,extension_number:employees.extension_number,
                            dep_id:employees.dep_id,phone_number:employees.phone_number}
                        }">
                            {{employees.name}}
                        </router-link>
                    </td>

                    <td>{{employees.position}}</td>

                </tr>
            </table>
-->








        </div>
        <div class="col-md-6">
            <router-view @refreshData="refreshList"></router-view>
        </div>
    </div>
</template>

<script>
    import http from "../../../http-common";
    import Employees from "./Employees";


    export default {
        name: "EmployeesList",

        data() {
            return {
                employees: [],
            };

        },
        methods: {
            helloWorld(){
                this.$emit('employees-list', this.employees)
            },
            /* eslint-disable no-console */
            retrieveEmployees() {
                http
                    .get("/employees/employees")
                    .then(response => {
                        this.employees = response.data; // JSON are parsed automatically.
                        console.log(response.data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            refreshList() {
                this.retrieveEmployees();
            },
            /* eslint-enable no-console */
        },
        mounted() {
            this.retrieveEmployees();
        },
        components: {
            Employees
        },




    }
    // demo data

</script>

<style>
    .list {

        text-align: left;
        max-width: 450px;
        margin: auto;
    }

</style>
