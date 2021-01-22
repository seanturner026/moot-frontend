<template>
  <div id="users-table">
    <input
      v-model="invitedUser"
      size="17"
      placeholder="e.g. email@example.com"
    />
    <button @click="createUser(invitedUser)">Invite user</button>
    <table>
      <thead>
        <tr>
          <th style="text-align:left">User Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.name">
          <td>{{ user.name }}</td>
          <td>
            <button @click="deleteUser(index)">Delete</button>
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
      users: [],
      invitedUser: ""
    };
  },
  created() {
    this.listUsers();
  },

  watch: {
    $users: "listUsers"
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
    },

    async listUsers() {
      console.log("testing listUser...");
      try {
        const response = await fetch(
          process.env.VUE_APP_API_GATEWAY_ENDPOINT + "/list/users",
          {
            method: "GET",
            headers: {
              Authorization: this.$cookies.get("Authorization")
            }
          }
        );
        const data = await response.json();
        this.users = data;
        console.log(this.users);
      } catch (error) {
        console.error(error);
      }
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
