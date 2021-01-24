<template>
  <div id="users-table">
    <input
      v-model="invitedUser"
      size="17"
      placeholder="e.g. email@example.com"
      position="absolute"
      right="0px"
    />
    <button @click="createUser(invitedUser)">Invite user</button>
    <table>
      <tr>
        <th style="text-align:left">User Name</th>
      </tr>
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

    async deleteUser(index) {
      console.log("testing deleteUser...");
      const deleteUserEvent = {
        email_address: this.users[index].name
      };
      try {
        const response = await fetch(
          process.env.VUE_APP_API_GATEWAY_ENDPOINT + "/delete/user",
          {
            method: "POST",
            body: JSON.stringify(deleteUserEvent),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              Authorization: this.$cookies.get("Authorization")
            }
          }
        );
        const data = await response.json();
        console.log(response);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
      this.users.splice(index, 1);
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
