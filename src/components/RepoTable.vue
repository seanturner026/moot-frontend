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
            <input
              v-model="repo.version"
              :class="{ 'has-error': submitting && confirmTag }"
              @focus="clearStatus"
              @keypress="clearStatus"
              size="9"
              placeholder="e.g. v0.11.0"
            />
            <p v-if="error && submitting" class="error-message">
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
      submitting: false,
      error: false,
      success: false,
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
    confirmTag(index) {
      if (this.repositories[index].version == undefined) {
        return true;
      } else {
        return false;
      }
    },

    clearStatus() {
      this.success = false;
      this.error = false;
    },

    createRelease(index) {
      console.log("testing createRelease...");
      this.submitting = true;
      this.clearStatus();

      this.error = this.confirmTag(index);

      if (this.error) {
        return;
      }

      const releaseEvent = {
        github_repo: this.repositories[index].name,
        branch_base: this.repositories[index].base,
        branch_head: this.repositories[index].head,
        version: this.repositories[index].version,
        release_notes: this.repositories[index].releaseNotes
      };
      this.$emit("create:release", releaseEvent);
      this.error = false;
      this.success = true;
      this.submitting = false;
    }
  }
};
</script>
<style scoped>
form {
  margin-bottom: 2rem;
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
