<template>
  <div>
    <b-navbar type="dark" variant="dark" style="margin-bottom: 50px">
      <b-navbar-nav>
        <b-nav-item href="" v-if="this.$router.currentRoute.path != '/'">
          <router-link
            v-if="this.$router.currentRoute.path != '/'"
            to="/repositories"
            ><div class="text-no-link">Repositories</div></router-link
          ></b-nav-item
        >
        <b-nav-item href="" v-if="this.$router.currentRoute.path != '/'">
          <router-link v-if="this.$router.currentRoute.path != '/'" to="/users">
            <div class="text-no-link">Users</div></router-link
          ></b-nav-item
        >
      </b-navbar-nav>
    </b-navbar>
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
.text-no-link {
  color: white;
}

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
