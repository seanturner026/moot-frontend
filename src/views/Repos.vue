<template>
  <div id="app" class="small-container">
    <h1>Serverless Release Dashboard</h1>
    <repo-table
      :repositories="repositories"
      :key="repoTableComponentKey"
      @create:release="createRelease($event)"
      @create:repository="createRepository($event)"
      @delete:repository="deleteRepositories($event)"
      @trigger:forceRerender="forceRerender()"
    />
  </div>
</template>

<script>
import RepoTable from "@/components/RepoTable.vue";

export default {
  name: "Home",
  components: {
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

    createRepositoryNotification(createRepositoryEvent) {
      console.log(createRepositoryEvent);
      this.$bvToast.toast(
        `Added repository ${createRepositoryEvent.repo_name}`,
        {
          title: "Success!",
          variant: "info",
          autoHideDelay: 3000
        }
      );
    },

    async createRepository(createRepositoryEvent) {
      try {
        const response = await fetch(
          process.env.VUE_APP_API_GATEWAY_ENDPOINT + "/repositories/create",
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
        this.createRepositoryNotification(createRepositoryEvent);
      } catch (error) {
        console.error(error);
      }
    },

    async createRelease(releaseEvent) {
      try {
        console.log(releaseEvent);
        const response = await fetch(
          process.env.VUE_APP_API_GATEWAY_ENDPOINT + "/releases/create",
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
    },

    async deleteRepositories(deleteRepositoriesEvent) {
      try {
        const response = await fetch(
          process.env.VUE_APP_API_GATEWAY_ENDPOINT + "/repositories/delete",
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
        console.log("before", this.repositories);
        for (let i = 0; i < deleteRepositoriesEvent.repositories.length; i++) {
          console.log(i, deleteRepositoriesEvent.repositories[i]);
          this.repositories.splice(
            0,
            this.repositories.length,
            ...this.repositories.filter(
              item =>
                item.repo_name !=
                deleteRepositoriesEvent.repositories[i].repo_name
            )
          );
        }
        this.forceRerender();
        console.log("after", this.repositories);
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>
