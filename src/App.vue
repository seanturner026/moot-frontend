<template>
  <div id="nav" class="small-container">
    <router-link to="/">Home</router-link> |
    <router-link to="/users">Users</router-link>
    <router-view></router-view>
  </div>
</template>

<script></script>

<style>
.small-container {
  max-width: 980px;
  margin-bottom: 20px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
