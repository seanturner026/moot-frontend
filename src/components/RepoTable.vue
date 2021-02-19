<template>
  <div id="repository-table">
    <div align="right">
      <b-input-group class="mt-3">
        <b-form-input
          v-model="searchQuery"
          class="form-control"
          type="text"
          placeholder="Search"
        ></b-form-input>
        <b-input-group-append>
          <b-button
            @click="deleteRepos()"
            :disabled="disableButton"
            variant="danger"
            >Delete repo(s)</b-button
          >
        </b-input-group-append>
      </b-input-group>
    </div>
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
                  align="right"
                  v-model="repo.selected"
                  value="selected"
                  unchecked-value="not_selected"
                  @change="enableDeleteButton($event)"
                ></b-form-checkbox>
              </b-col>
            </b-row>
          </b-card-body>
          <b-row>
            <b-col md="4">
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
                    Previous Version:
                  </b-card-text></b
                >
                <b-card-text v-if="repo.current_version != ''">
                  {{ repo.current_version }}
                </b-card-text>
              </b-card-body>
            </b-col>
            <b-col md="8">
              <b-card-body>
                <textarea
                  v-model="repo.release_notes"
                  placeholder="Insert notes"
                  rows="5"
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
      searchQuery: null
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

    deleteRepos() {
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

<style>
button {
  background: #009435;
  border: 1px solid #009435;
}

[class*="-message"] {
  font-weight: 500;
}

.error-message {
  color: #d33c40;
}

.success-message {
  color: #32a95d;
}
</style>
