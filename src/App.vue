<template>
  <div id="app" class="small-container">
    <h1>Serverless Release Dashboard</h1>
    <div id="description" class="small-container">
      Clicking deploy will trigger the following actions:
      <li>
        Create a pull request of the specified "head" branch into the "base"
        branch, and merge the pull request
      </li>
      <li>
        Create a release using the specified version and release notes on
        Github.com
      </li>
      <li>
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
import Repos from "../repos.json";
import RepoTable from "@/components/RepoTable.vue";

var reposComputed = Repos.map(v => ({
  ...v,
  version: undefined,
  releaseNotes: undefined
}));

export default {
  name: "app",
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
          "https://jsonplaceholder.typicode.com/users",
          {
            method: "POST",
            body: JSON.stringify(releaseEvent),
            headers: { "Content-type": "application/json; charset=UTF-8" }
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
</style>
