<template>
    <div>
        <h2>파일 다운로드</h2>
        <div>
          <table>
              <thead>
              <tr><th>파일 이름</th><th>다운로드</th></tr>
              </thead>
              <tbody>
              <tr>
                <td>  <a href="../../assets/m_file/file01.txt" download="">file01</a></td><td></td>
              </tr>
              </tbody>

          </table>
        </div>

    </div>


</template>

<script>


    export default {
        name: "formManagement",

        data() {
            return {

            }
        },
        methods: {

        }
    }
</script>

<style scoped>

</style>