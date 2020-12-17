<template>
  <div id="repository-table">
    <table>
      <thead>
        <tr>
          <th style="text-align:left">Repository</th>
          <th style="text-align:left">Base</th>
          <th style="text-align:left"></th>
          <th style="text-align:left">Head</th>
          <th style="text-align:left">Version</th>
          <th style="text-align:left">Release Notes</th>
          <th style="text-align:left">Deploy</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(repo, index) in repositories" :key="repo.name">
          <td>
            <b>{{ repo.name }}</b>
          </td>
          <td>{{ repo.base }}</td>
          <td><b>«</b></td>
          <td>{{ repo.head }}</td>
          <td>
            <input v-model="version" size="6" placeholder="e.g. v0.11.0" />
          </td>
          <td>
            <textarea
              v-model="releaseNotes"
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
      github_repo: "",
      branch_base: "",
      branch_head: "",
      release_version: "",
      release_body: ""
    };
  },
  props: {
    releaseNotes: String,
    repositories: Array,
    version: String
  },
  methods: {
    createRelease(index) {
      console.log("testing createRelease...");
      const releaseEvent = {
        github_repo: this.repositories[index].name,
        branch_base: this.repositories[index].base,
        branch_head: this.repositories[index].head,
        version: this.version,
        release_notes: this.releaseNotes
      };
      this.$emit("create:release", releaseEvent);
    }
  }
};
</script>
<style scoped></style>
