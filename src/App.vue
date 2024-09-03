<template>
  <v-app>
    <v-app-bar
      app
      color="#008000"
      dark
    >
      <v-app-bar-title>Client Mgt</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn text to="/" :style="{ color: 'white' }">
        Company
      </v-btn>

      <v-btn text to="/departments" :style="{ color: 'white' }">
        Department
      </v-btn>

      <v-btn text to="/employees" :style="{ color: 'white' }">
        Employee
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
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
button {
  border: 1px solid;
  padding: 4px;
  border-radius: 8px;
}
select {
  border: 1px solid;
  padding: 4px;
}
input {
  border: 0.5px solid;
  padding: 4px;
}
</style>

