import Vue from "vue";
import VueCookies from "vue-cookies";
import VueRouter from "vue-router";

Vue.use(VueCookies);
Vue.use(VueRouter);

async function listRepositories(to, from, next) {
  var isAuthenticated = false;
  console.log("testing listRepositories...");
  if (Vue.$cookies.get("Authorization")) {
    try {
      const response = await fetch(
        process.env.VUE_APP_API_GATEWAY_ENDPOINT + "/repositories/list",
        {
          method: "GET",
          headers: {
            Authorization: Vue.$cookies.get("Authorization")
          }
        }
      );
      const repositories = await response.json();
      console.log(repositories);
      if (repositories.message != "Unauthorized") {
        isAuthenticated = true;
        var repositoriesJSON = JSON.parse(repositories.message);
        const modifiedRespositories = repositoriesJSON.map(v => ({
          ...v,
          hotfix: false
        }));
        to.params.repositories = modifiedRespositories;
        next();
      }
    } catch (error) {
      console.error(error);
      next("/");
    }
  }
  if (!isAuthenticated) {
    console.log("error not authenticated");
    next("/");
  }
}

async function listUsers(to, from, next) {
  var isAuthenticated = false;
  console.log("testing listUser...");
  if (Vue.$cookies.get("Authorization")) {
    try {
      const response = await fetch(
        process.env.VUE_APP_API_GATEWAY_ENDPOINT + "/users/list",
        {
          method: "GET",
          headers: {
            Authorization: Vue.$cookies.get("Authorization")
          }
        }
      );
      const users = await response.json();
      console.log(users);
      if (users.message != "Unauthorized") {
        isAuthenticated = true;
        var usersJSON = JSON.parse(users.message);
        const modifiedUsers = usersJSON.map(v => ({
          ...v,
          manage: true
        }));
        to.params.users = modifiedUsers;
        next();
      }
    } catch (error) {
      console.error(error);
      next("/");
    }
  }
  if (!isAuthenticated) {
    console.log("error not authenticated");
    next("/");
  }
}

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import("../views/Login.vue")
  },
  {
    path: "/repositories",
    name: "Repositories",
    props: true,
    beforeEnter: listRepositories,
    component: () => import("../views/Repos.vue")
  },
  {
    path: "/users",
    name: "Users",
    props: true,
    beforeEnter: listUsers,
    component: () => import("../views/Users.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
