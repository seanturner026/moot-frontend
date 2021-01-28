<template>
  <div id="app" class="small-container">
    <h1>Serverless Release Dashboard</h1>
    <create-repo @create:repository="createRepository($event)" />
    <repo-table
      :repositories="repositories"
      :key="repoTableComponentKey"
      @delete:repository="deleteRepositories($event)"
      @create:release="createRelease($event)"
    />
  </div>
</template>

<script>
import CreateRepo from "@/components/CreateRepo.vue";
import RepoTable from "@/components/RepoTable.vue";

export default {
  name: "Home",
  components: {
    CreateRepo,
    RepoTable
  },
  data() {
    return {
      repoTableComponentKey: 0
    };
  },
  props: {
    repositories: {
      type: Array
    }
  },
  methods: {
    forceRerender() {
      this.repoTableComponentKey += 1;
    },

    async deleteRepositories(deleteRepositoriesEvent) {
      try {
        const response = await fetch(
          process.env.VUE_APP_API_GATEWAY_ENDPOINT + "/delete/repo",
          {
            method: "POST",
            body: JSON.stringify(deleteRepositoriesEvent),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              Authorization: this.$cookies.get("Authorization")
            }
          }
        );
        const data = await response.json();
        console.log(data);
        for (let i = 0; i < deleteRepositoriesEvent.repositories.length; i++) {
          console.log(i, deleteRepositoriesEvent.repositories[i]);
          this.repositories.splice(
            0,
            this.repositories.length,
            ...this.repositories.filter(
              item => item.repo_name != deleteRepositoriesEvent.repositories[i]
            )
          );
        }
        this.forceRerender();
      } catch (error) {
        console.error(error);
      }
    },

    async createRepository(createRepositoryEvent) {
      try {
        const response = await fetch(
          process.env.VUE_APP_API_GATEWAY_ENDPOINT + "/create/repo",
          {
            method: "POST",
            body: JSON.stringify(createRepositoryEvent),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              Authorization: this.$cookies.get("Authorization")
            }
          }
        );
        const data = await response.json();
        console.log(data);
        this.repositories.push(createRepositoryEvent);
        this.forceRerender();
      } catch (error) {
        console.error(error);
      }
    },

    async createRelease(releaseEvent) {
      try {
        console.log(releaseEvent);
        const response = await fetch(
          process.env.VUE_APP_API_GATEWAY_ENDPOINT + "/release",
          {
            method: "POST",
            body: JSON.stringify(releaseEvent),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              Authorization: this.$cookies.get("Authorization")
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
