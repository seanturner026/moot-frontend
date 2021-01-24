<template>
  <div class="users">
    <h1>Users</h1>
    <users-table :users="users" @create:user="createUser($event)" />
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
    return {};
  },
  props: {
    users: {
      type: Array
    }
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
    }
  }
};
</script>
