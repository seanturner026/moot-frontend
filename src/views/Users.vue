<template>
  <div class="users">
    <users-table
      :users="users"
      :key="usersTableComponentKey"
      @create:user="createUser($event)"
      @delete:user="deleteUser($event)"
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
      usersTableComponentKey: 0
    };
  },
  props: {
    users: {
      type: Array
    }
  },
  methods: {
    forceRerender() {
      this.usersTableComponentKey += 1;
    },

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
        this.users.push({ name: createUserEvent.email_address });
        this.forceRerender();
      } catch (error) {
        console.error(error);
      }
    },

    async deleteUser(deleteuserEvent) {
      try {
        const response = await fetch(
          process.env.VUE_APP_API_GATEWAY_ENDPOINT + "/delete/user",
          {
            method: "POST",
            body: JSON.stringify(deleteuserEvent),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              Authorization: this.$cookies.get("Authorization")
            }
          }
        );
        const data = await response.json();
        console.log(response);
        console.log(data);
        this.users.splice(
          0,
          this.users.length,
          ...this.users.filter(
            item => item.name != deleteuserEvent.email_address
          )
        );
        this.forceRerender();
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>
