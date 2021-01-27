<template>
  <div id="users-table">
    <b-input-group class="mt-3">
      <b-form-input
        v-model="invitedUser"
        size="17"
        placeholder="e.g. email@example.com"
      ></b-form-input>
      <b-input-group-append>
        <b-button variant="info" @click="createUser(invitedUser)"
          >Invite user</b-button
        >
      </b-input-group-append>
    </b-input-group>
    <table>
      <tr>
        <th style="text-align:left">User Name</th>
      </tr>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.name">
          <td>{{ user.name }}</td>
          <td>
            <b-button
              size="md"
              variant="outline-danger"
              @click="deleteUser(index)"
              >Delete</b-button
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "users-table",
  data() {
    return {
      invitedUser: ""
    };
  },
  props: {
    users: {
      type: Array
    }
  },

  methods: {
    createUser() {
      console.log("testing createUser...");
      const createUserEvent = {
        email_address: this.invitedUser
      };
      this.$emit("create:user", createUserEvent);
    },

    deleteUser(index) {
      console.log("testing deleteUser...");
      const deleteUserEvent = {
        email_address: this.users[index].name
      };
      this.$emit("delete:user", deleteUserEvent);
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
