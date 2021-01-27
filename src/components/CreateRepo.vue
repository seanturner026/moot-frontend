<template>
  <div id="create-repository-table" class="mt-5">
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
          <td>
            <b-button @click="createRepository()" size="sm" variant="info"
              >add repo</b-button
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "create-repository-table",
  data() {
    return {
      repositories: [],
      createRepoProvider: "",
      createRepoOrganization: "",
      createRepoName: "",
      createRepoBranchBase: "",
      createRepoBranchHead: ""
    };
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
    }
  }
};
</script>

<style>
button {
  background: #009435;
  border: 1px solid #009435;
}
</style>
