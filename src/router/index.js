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
        process.env.VUE_APP_API_GATEWAY_ENDPOINT + "/list/repos",
        {
          method: "POST",
          body: '{"repo_owner": "seanturner026"}',
          headers: {
            Authorization: Vue.$cookies.get("Authorization")
          }
        }
      );
      const repositories = await response.json();
      if (repositories.message != "Unauthorized") {
        isAuthenticated = true;
        to.params.repositories = repositories;
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
        process.env.VUE_APP_API_GATEWAY_ENDPOINT + "/list/users",
        {
          method: "GET",
          headers: {
            Authorization: Vue.$cookies.get("Authorization")
          }
        }
      );
      const users = await response.json();
      if (users.message != "Unauthorized") {
        isAuthenticated = true;
        to.params.users = users;
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
    path: "/repos",
    name: "Repos",
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
