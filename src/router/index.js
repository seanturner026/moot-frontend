import Vue from "vue";
import VueRouter from "vue-router";
import VueCookies from "vue-cookies";

Vue.use(VueRouter);
Vue.use(VueCookies);

async function isAuthenticated(to, from, next) {
  var isAuthenticated = false;
  console.log("testing isAuthenticated...");
  if (Vue.$cookies.get("Authorization")) {
    const response = await fetch(
      process.env.VUE_APP_API_GATEWAY_ENDPOINT + "/verify/auth",
      {
        method: "GET",
        headers: {
          Authorization: Vue.$cookies.get("Authorization")
        }
      }
    );
    const data = await response.json();
    if (data.message == "Authorized") {
      isAuthenticated = true;
    }
  }
  if (isAuthenticated) {
    next();
  } else {
    console.log("error not authenticated");
    to("/");
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
    beforeEnter: isAuthenticated,
    component: () => import("../views/Repos.vue")
  },
  {
    path: "/users",
    name: "Users",
    beforeEnter: isAuthenticated,
    component: () => import("../views/Users.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
