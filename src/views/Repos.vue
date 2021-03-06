<template>
  <div id="app" class="small-container">
    <h1 style="margin-bottom: 50px">Serverless Release Dashboard</h1>
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

    async createRepository(createRepositoryEvent) {
      if (
        createRepositoryEvent.branch_base == "" ||
        createRepositoryEvent.branch_head == "" ||
        createRepositoryEvent.repo_name == "" ||
        createRepositoryEvent.repo_owner == "" ||
        createRepositoryEvent.repo_provider == "" ||
        (createRepositoryEvent.repo_provider == "gitlab.com" &&
          createRepositoryEvent.gitlab_repo_id == "")
      ) {
        this.$bvToast.toast(
          `Unable to add repository, ensure all fields are populated.`,
          {
            title: "Error",
            variant: "danger",
            autoHideDelay: 4000
          }
        );
        return;
      }
      for (var i = 0; i < this.repositories.length; i++) {
        if (
          createRepositoryEvent.repo_name == this.repositories[i].repo_name &&
          createRepositoryEvent.repo_owner == this.repositories[i].repo_owner &&
          createRepositoryEvent.repo_provider ==
            this.repositories[i].repo_provider
        ) {
          this.$bvToast.toast(
            `Unable to add a repository which is already managed.`,
            {
              title: "Error",
              variant: "danger",
              autoHideDelay: 4000
            }
          );
          return;
        }
      }
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
        this.$bvToast.toast(
          `Added repository ${createRepositoryEvent.repo_name}`,
          {
            title: "Success!",
            variant: "info",
            autoHideDelay: 3000
          }
        );
      } catch (error) {
        console.error(error);
      }
    },

    async createRelease(releaseEvent) {
      try {
        console.log(releaseEvent);
        const provider_route = releaseEvent.repo_provider.split(".com")[0];
        const response = await fetch(
          process.env.VUE_APP_API_GATEWAY_ENDPOINT +
            "/releases/create/" +
            provider_route,
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
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>
