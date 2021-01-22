<template>
  <div class="users">
    <h1>Users</h1>
    <users-table
      :users="users"
      @delete:user="deleteUser($event)"
      @create:user="createUser($event)"
    />
  </div>
</template>

<script>
import UsersTable from "@/components/UsersTable.vue";

export default {
  name: "Users",
  components: {
    UsersTable
  },
  data() {
    return {
      users: []
    };
  },
  methods: {
    async createUser(createUserEvent) {
      try {
        const response = await fetch(
          process.env.VUE_APP_API_GATEWAY_ENDPOINT + "/create/user",
          {
            method: "POST",
            body: JSON.stringify(createUserEvent),
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
    },

    async deleteUser(deleteUserEvent) {
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
    }
  }
};
</script>
