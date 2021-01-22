<template>
  <div id="repository-table">
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
        <tr v-for="(repo, index) in repositories" :key="repo.repo_name">
          <td>
            <b>{{ repo.repo_name }}</b>
          </td>
          <td>{{ repo.branch_base }}</td>
          <td><b>««</b></td>
          <td>{{ repo.branch_head }}</td>
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
              v-model="repo.release_notes"
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
      repositories: [],
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

  created() {
    this.listRepositories();
  },

  watch: {
    $repositories: "listRepositories"
  },

  methods: {
    async listRepositories() {
      console.log("testing listRepositories...");
      try {
        const response = await fetch(
          process.env.VUE_APP_API_GATEWAY_ENDPOINT + "/list/repos",
          {
            method: "POST",
            body: '{"repo_owner": "seanturner026"}',
            headers: {
              Authorization: this.$cookies.get("Authorization")
            }
          }
        );
        const data = await response.json();
        this.repositories = data;
      } catch (error) {
        console.error(error);
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
