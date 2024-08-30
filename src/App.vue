<template>
  <div id="app">
    <nav style="border:solid; padding: 2em; margin-bottom: 2.5em; background-color: green;">
      <div style="color: white;">
      <router-link to="/" style="color: white;">Company</router-link>&nbsp;&nbsp;|&nbsp;&nbsp;
      <router-link to="/departments" style="color: white;">Department</router-link> &nbsp;&nbsp;|&nbsp;&nbsp;
      <router-link to="/employees" style="color: white;">Employee</router-link>
    </div>
    </nav>
    <router-view></router-view>
  </div>
</template>


<script>


export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
