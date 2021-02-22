<template>
  <div id="repository-table">
    <b-container fluid="false">
      <b-input-group class="mt-3">
        <b-button v-b-toggle.repo-add-sidebar md="1" variant="info"
          >Add Repository</b-button
        >
        <b-form-input
          md="3"
          v-model="searchQuery"
          class="form-control"
          type="text"
          placeholder="Search"
        ></b-form-input>
        <b-input-group-append>
          <b-button
            @click="deleteRepositories()"
            :disabled="disableButton"
            variant="danger"
            >Delete Repository(ies)</b-button
          >
        </b-input-group-append>
      </b-input-group>
    </b-container>
    <b-sidebar
      id="repo-add-sidebar"
      title="Add Repository"
      backdrop
      shadow
      v-on:hidden="triggerForceRerender"
    >
      <b-container fluid>
        <h6 style="text-align:left">Provider:</h6>
        <b-form-input
          v-model="createRepoProvider"
          placeholder="github.com"
          size="11"
          style="text-align:left"
        />
        <h6 style="text-align:left">Organization:</h6>
        <b-form-input
          v-model="createRepoOrganization"
          placeholder="seanturner026"
          size="11"
          style="text-align:left"
        />
        <h6 style="text-align:left">Repository:</h6>
        <b-form-input
          v-model="createRepoName"
          placeholder="serverless-release-dashboard"
          size="24"
          style="text-align:left"
        />
        <h6 style="text-align:left">Base Branch:</h6>
        <b-form-input
          v-model="createRepoBranchBase"
          placeholder="main"
          size="11"
          style="text-align:left"
        />
        <h6 style="text-align:left">Head Branch:</h6>
        <b-form-input
          v-model="createRepoBranchHead"
          placeholder="develop"
          size="11"
          style="text-align:left"
        />
        <div align="right">
          <b-button @click="createRepository()" size="md" variant="info"
            >add repo</b-button
          >
        </div>
      </b-container>
    </b-sidebar>
    <div>
      <b-card-group
        deck
        v-for="(repo, index) in resultQuery"
        :key="repo.repo_name"
      >
        <b-card
          align="left"
          no-body
          border-variant="secondary"
          footer-border-variant="secondary"
          class="overflow-hidden; mt-4"
          style="max-width: 1080;"
          card-columns-gap:="1.25rem"
        >
          <b-card-body>
            <b-row align-h="center">
              <b-col md="1" align-self="center">
                <b-img
                  v-if="repo.repo_provider == 'github.com'"
                  width="50"
                  height="50"
                  src="@/assets/images/github.png"
                ></b-img>
              </b-col>
              <b-col md="10" align-self="center">
                <h3>{{ repo.repo_name }}</h3>
              </b-col>
              <b-col md="1">
                <b-form-checkbox
                  v-model="repo.selected"
                  value="selected"
                  unchecked-value="not_selected"
                  @change="enableDeleteButton($event)"
                ></b-form-checkbox>
              </b-col>
            </b-row>
          </b-card-body>
          <b-row>
            <b-col md="3">
              <b-card-body>
                <b
                  ><b-card-text>
                    Branch Config:
                  </b-card-text></b
                >
                <b-card-text
                  >{{ repo.branch_base }} «
                  {{ repo.branch_head }}
                </b-card-text>
                <b
                  ><b-card-text v-if="repo.current_version != ''">
                    Current Version:
                  </b-card-text></b
                >
                <b-card-text v-if="repo.current_version != ''">
                  {{ repo.current_version }}
                </b-card-text>
              </b-card-body>
            </b-col>
            <b-col md="9">
              <b-card-body>
                <textarea
                  v-model="repo.release_notes"
                  placeholder="Insert notes"
                  rows="4"
                ></textarea>
              </b-card-body>
            </b-col>
          </b-row>
          <b-card-footer>
            <b-input-group>
              <b-form-input
                v-model="repo.version"
                placeholder="Version - e.g. v0.11.0"
              ></b-form-input>
              <b-input-group-append>
                <b-button
                  variant="info"
                  @click="createRelease(index)"
                  :disabled="false"
                  >deploy</b-button
                >
              </b-input-group-append>
            </b-input-group>
          </b-card-footer>
        </b-card>
      </b-card-group>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    resultQuery() {
      if (this.searchQuery) {
        return this.repositories.filter(item => {
          return this.searchQuery
            .toLowerCase()
            .split(" ")
            .every(v => item.repo_name.toLowerCase().includes(v));
        });
      } else {
        return this.repositories;
      }
    }
  },

  name: "repository-table",
  data() {
    return {
      submitting: "",
      error: "",
      success: "",
      selected: false,
      selectedCount: 0,
      disableButton: true,
      disableDeployButton: true,
      github_owner: "",
      github_repo: "",
      branch_base: "",
      branch_head: "",
      release_version: "",
      release_body: "",
      searchQuery: null,
      createRepoProvider: "",
      createRepoOrganization: "",
      createRepoName: "",
      createRepoBranchBase: "",
      createRepoBranchHead: ""
    };
  },
  props: {
    repositories: {
      type: Array
    }
  },

  methods: {
    enableDeleteButton(selectedStatus) {
      if (selectedStatus == "selected") {
        this.selectedCount += 1;
      } else if (selectedStatus == "not_selected") {
        this.selectedCount -= 1;
      }

      if (this.selectedCount > 0) {
        this.disableButton = false;
      } else if (this.selectedCount == 0) {
        this.disableButton = true;
      }
    },

    // enableDeployButton(index) {
    //   if (this.repositories[index].version == undefined) {
    //     this.repositories[index].deployable = true;
    //   } else {
    //     this.repositories[index].deployable = false;
    //   }
    // },

    confirmTag(index) {
      if (this.repositories[index].version == undefined) {
        return true;
      } else {
        return false;
      }
    },

    clearStatus(index) {
      this.repositories[index].success = false;
      this.repositories[index].error = false;
    },

    triggerForceRerender() {
      this.$emit("trigger:forceRerender");
    },

    createRelease(index) {
      console.log("testing createRelease...");
      this.repositories[index].submitting = true;
      this.clearStatus(index);

      this.repositories[index].error = this.confirmTag(index);

      if (this.repositories[index].error) {
        return;
      }

      const releaseEvent = {
        github_owner: process.env.VUE_APP_GITHUB_OWNER,
        github_repo: this.repositories[index].repo_name,
        branch_base: this.repositories[index].branch_base,
        branch_head: this.repositories[index].branch_head,
        release_body: this.repositories[index].release_notes,
        release_version: this.repositories[index].version
      };
      this.$emit("create:release", releaseEvent);
      this.repositories[index].error = false;
      this.repositories[index].success = true;
      this.repositories[index].submitting = false;
    },

    createRepository() {
      console.log("testing createRepository");
      const createRepositoryEvent = {
        repo_provider: this.createRepoProvider,
        repo_owner: this.createRepoOrganization,
        repo_name: this.createRepoName,
        branch_base: this.createRepoBranchBase,
        branch_head: this.createRepoBranchHead
      };
      this.$emit("create:repository", createRepositoryEvent);
    },

    deleteRepositories() {
      console.log("testing deleteRepo...");
      var deleteRepositories = this.repositories.reduce(function(
        filtered,
        repo
      ) {
        if (repo.selected) {
          var deleteRepo = {
            repo_name: repo.repo_name,
            repo_owner: repo.repo_owner
          };
          filtered.push(deleteRepo);
        }
        return filtered;
      },
      []);
      const deleteRepositoriesEvent = {
        repositories: deleteRepositories
      };
      this.$emit("delete:repository", deleteRepositoriesEvent);
    }
  }
};
</script>
