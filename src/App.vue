<template>
  <div id="nav" class="small-container">
    <router-link v-if="this.$router.currentRoute.path != '/'" to="/repos"
      >Repos</router-link
    >
    <a v-if="this.$router.currentRoute.path != '/'"> | </a>
    <router-link v-if="this.$router.currentRoute.path != '/'" to="/users"
      >Users</router-link
    >
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      authenticated: true
    };
  }
};
</script>

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
  color: #007d9c;
}
</style>
