<template>
  <div id="repository-table">
    <b-container fluid="false">
      <b-input-group class="mt-3">
        <b-button class="button-margin-right" v-b-modal.modal-lg variant="info"
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
            :disabled="disableDeleteRepositoriesButton"
            variant="danger"
            >Delete Repository(ies)</b-button
          >
        </b-input-group-append>
      </b-input-group>
    </b-container>
    <b-modal
      id="modal-lg"
      v-bind:hide-footer="true"
      v-on:hidden="triggerForceRerender"
      size="lg"
      title="Add Repository"
    >
      <b-container fluid>
        <h6 style="text-align:left">Provider:</h6>
        <b-form-select v-model="createRepoProvider" class="mb-3">
          <template #first>
            <b-form-select-option :value="null" disabled
              >-- Please select an option --</b-form-select-option
            >
          </template>
          <b-form-select-option value="github">Github</b-form-select-option>
          <b-form-select-option value="gitlab">Gitlab</b-form-select-option>
        </b-form-select>
        <h6 style="text-align:left" v-if="createRepoProvider == 'gitlab.com'">
          Gitlab Project ID:
        </h6>
        <b-form-input
          v-if="createRepoProvider == 'gitlab.com'"
          v-model="createRepoGitlabProjectID"
          placeholder="12345678"
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
            >Create</b-button
          >
        </div>
      </b-container>
    </b-modal>
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
          <b-card-body class="card-body-no-margin-bottom">
            <b-row align-h="center">
              <b-col md="1" align-self="center">
                <b-img
                  v-if="repo.repo_provider == 'github'"
                  width="50"
                  height="50"
                  src="@/assets/images/github.png"
                ></b-img>
                <b-img
                  v-if="repo.repo_provider == 'gitlab'"
                  width="50"
                  height="50"
                  src="@/assets/images/gitlab.png"
                ></b-img>
              </b-col>
              <b-col md="10" align-self="center">
                <h4>
                  <a v-bind:href="generateRepositoryLink(index)"
                    ><div class="text-no-link">
                      {{ repo.repo_owner }}/{{ repo.repo_name }}
                    </div></a
                  >
                </h4>
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
                  >{{ repo.branch_base }} <strong>«</strong>
                  {{ repo.branch_head }}
                </b-card-text>
                <b
                  ><b-card-text v-if="repo.current_version != null">
                    Current Version:
                  </b-card-text></b
                >
                <b-card-text v-if="repo.current_version != null">
                  {{ repo.current_version }}
                </b-card-text>
              </b-card-body>
            </b-col>
            <b-col md="9">
              <b-card-body>
                <b-textarea
                  v-model="repo.release_notes"
                  placeholder="Insert notes"
                  rows="4"
                  max-rows="10"
                ></b-textarea>
              </b-card-body>
            </b-col>
          </b-row>
          <b-card-footer>
            <b-row no-gutters>
              <b-col md="2">
                <b-form-checkbox
                  v-model="repo.hotfix"
                  v-bind:value="true"
                  v-bind:unchecked-value="false"
                  >hotfix</b-form-checkbox
                ></b-col
              >
              <b-col>
                <b-input-group>
                  <b-form-input
                    size="small"
                    v-model="repo.version"
                    placeholder="Version - e.g. v0.11.0"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button variant="info" @click="createRelease(index)"
                      >Deploy</b-button
                    >
                  </b-input-group-append>
                </b-input-group>
              </b-col>
            </b-row>
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
      disableDeleteRepositoriesButton: true,
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
      createRepoBranchHead: "",
      createRepoGitlabProjectID: ""
    };
  },
  props: {
    repositories: {
      type: Array
    }
  },

  methods: {
    generateRepositoryLink(index) {
      return (
        "https://" +
        this.repositories[index].repo_provider +
        "/" +
        this.repositories[index].repo_owner +
        "/" +
        this.repositories[index].repo_name
      );
      // const provider_route = this.repositories[index].repo_provider.split(
      //   ".com"
      // )[0];
      // return (
      //   "/repositories/" +
      //   provider_route +
      //   "/" +
      //   this.repositories[index].repo_owner +
      //   "/" +
      //   this.repositories[index].repo_name
      // );
    },

    enableDeleteButton(selectedStatus) {
      if (selectedStatus == "selected") {
        this.selectedCount += 1;
      } else if (selectedStatus == "not_selected") {
        this.selectedCount -= 1;
      }

      if (this.selectedCount > 0) {
        this.disableDeleteRepositoriesButton = false;
      } else if (this.selectedCount == 0) {
        this.disableDeleteRepositoriesButton = true;
      }
    },

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
      if (!("version" in this.repositories[index])) {
        this.$bvToast.toast("Deploys require a version.", {
          title: "Error",
          variant: "danger",
          autoHideDelay: 3000
        });
      }

      this.repositories[index].submitting = true;
      this.clearStatus(index);

      this.repositories[index].error = this.confirmTag(index);

      if (this.repositories[index].error) {
        return;
      }

      const releaseEvent = {
        repo_owner: process.env.VUE_APP_GITHUB_OWNER,
        repo_name: this.repositories[index].repo_name,
        repo_provider: this.repositories[index].repo_provider,
        branch_base: this.repositories[index].branch_base,
        branch_head: this.repositories[index].branch_head,
        release_body: this.repositories[index].release_notes,
        release_version: this.repositories[index].version,
        gitlab_project_id: this.repositories[index].gitlab_repo_id,
        hotfix: this.repositories[index].hotfix
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
        repo_name: this.createRepoName,
        repo_owner: this.createRepoOrganization,
        branch_base: this.createRepoBranchBase,
        branch_head: this.createRepoBranchHead,
        gitlab_repo_id: this.createRepoGitlabProjectID
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
            repo_provider: repo.repo_provider
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

<style>
.text-no-link {
  color: #007d9c;
}

.button-margin-right {
  margin-right: 10px;
}

.card-body-no-margin-bottom {
  padding-bottom: 0px;
}
</style>
