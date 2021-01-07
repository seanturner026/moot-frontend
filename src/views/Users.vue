<template>
  <div class="users">
    <h1>Users</h1>
    <users-table :users="users" @delete:user="deleteUser($event)" />
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
    async deleteUser(deleteUserEvent) {
      try {
        const response = await fetch(
          process.env.VUE_APP_API_GATEWAY_ENDPOINT + "/delete/user",
          {
            method: "POST",
            body: JSON.stringify(deleteUserEvent),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
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
