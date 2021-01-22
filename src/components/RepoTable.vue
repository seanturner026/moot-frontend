<template>
  <div id="repository-table">
    <table border="0">
      <tr>
        <th style="text-align:left">Provider</th>
        <th style="text-align:left">Organization</th>
        <th style="text-align:left">Repository</th>
        <th style="text-align:left">Base Branch</th>
        <th style="text-align:left">Head Branch</th>
      </tr>
      <tbody>
        <tr>
          <td>
            <input
              v-model="createRepoProvider"
              placeholder="github.com"
              size="11"
            />
          </td>
          <td>
            <input
              v-model="createRepoOrganization"
              placeholder="seanturner026"
              size="11"
            />
          </td>
          <td>
            <input
              v-model="createRepoName"
              placeholder="serverless-release-dashboard"
              size="24"
            />
          </td>
          <td>
            <input
              v-model="createRepoBranchBase"
              placeholder="main"
              size="11"
            />
          </td>
          <td>
            <input
              v-model="createRepoBranchHead"
              placeholder="develop"
              size="11"
            />
          </td>
          <td><button @click="createRepository()">Add Repo</button></td>
        </tr>
      </tbody>
    </table>
    <table border="0">
      <tr>
        <th style="text-align:left">Repository</th>
        <th style="text-align:left">Base</th>
        <th style="text-align:left"></th>
        <th style="text-align:left">Head</th>
        <th style="text-align:left">Version</th>
        <th style="text-align:left">Release Notes</th>
        <th style="text-align:left">Deploy</th>
      </tr>
      <tbody>
        <tr v-for="(repo, index) in repositories" :key="repo.name">
          <td>
            <b>{{ repo.name }}</b>
          </td>
          <td>{{ repo.base }}</td>
          <td><b>««</b></td>
          <td>{{ repo.head }}</td>
          <td>
            <input
              v-model="repo.version"
              :class="{ 'has-error': repo.submitting && confirmTag(index) }"
              @focus="clearStatus(index)"
              @keypress="clearStatus(index)"
              size="9"
              placeholder="e.g. v0.11.0"
            />
            <p v-if="repo.error && repo.submitting" class="error-message">
              Please insert version
            </p>
          </td>
          <td>
            <textarea
              v-model="repo.releaseNotes"
              placeholder="Insert notes"
              rows="5"
            ></textarea>
          </td>
          <td><button @click="createRelease(index)">deploy</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "repository-table",
  data() {
    return {
      createRepoProvider: "",
      createRepoOrganization: "",
      createRepoName: "",
      createRepoBranchBase: "",
      createRepoBranchHead: "",
      submitting: "",
      error: "",
      success: "",
      github_owner: "",
      github_repo: "",
      branch_base: "",
      branch_head: "",
      release_version: "",
      release_body: ""
    };
  },
  props: {
    repositories: Array
  },

  methods: {
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

    confirmTag(index) {
      console.log(this.repositories[index].version);
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
        github_repo: this.repositories[index].name,
        branch_base: this.repositories[index].base,
        branch_head: this.repositories[index].head,
        release_version: this.repositories[index].version,
        release_body: this.repositories[index].releaseNotes,
        github_owner: process.env.VUE_APP_GITHUB_OWNER
      };
      this.$emit("create:release", releaseEvent);
      this.repositories[index].error = false;
      this.repositories[index].success = true;
      this.repositories[index].submitting = false;
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
