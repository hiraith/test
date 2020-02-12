<template>
  <div class="wrapper">
    <h3 class="datetime title">{{time}}</h3>
  </div>
</template>
<script>
  export default {
    name: "clock",
    data() {
      return {
        date: new Date()
      }
    },
    methods: {
      onEverySecond: function () {
        this.date = new Date();
        setTimeout(this.onEverySecond, 200)
      }
    },
    mounted: function () {
      this.onEverySecond()
    },
    computed: {
      time() {
        return `${this.date.toLocaleTimeString()}`
      }
    }
  }
</script>
<style scoped>

</style>