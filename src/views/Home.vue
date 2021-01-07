<template>
  <div id="app" class="small-container">
    <h1>Serverless Release Dashboard</h1>
    <div id="description" class="small-container" style="text-align:left">
      <b>Clicking deploy will trigger the following actions:</b>
      <li style="text-align:left">
        Create a pull request of the specified "head" branch into the "base"
        branch, and merge the pull request
      </li>
      <li style="text-align:left">
        Create a release using the specified version and release notes on
        Github.com
      </li>
      <li style="text-align:left">
        Send a slack message containing the release notes.
      </li>
    </div>
    <repo-table
      :repositories="repositories"
      @create:release="createRelease($event)"
    />
  </div>
</template>

<script>
import Repos from "../../repos.json";
import RepoTable from "@/components/RepoTable.vue";

var reposComputed = Repos.map(v => ({
  ...v,
  version: undefined,
  releaseNotes: undefined,
  submitting: false,
  error: false,
  success: false
}));

export default {
  name: "Home",
  components: {
    RepoTable
  },
  data() {
    return {
      repositories: reposComputed
    };
  },
  methods: {
    async createRelease(releaseEvent) {
      try {
        const response = await fetch(
          process.env.VUE_APP_API_GATEWAY_ENDPOINT + "/release",
          {
            method: "POST",
            body: JSON.stringify(releaseEvent),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          }
        );
        const data = await response.json();
        console.log(response);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style>
button {
  background: #009435;
  border: 1px solid #009435;
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
  color: #42b983;
}
</style>
