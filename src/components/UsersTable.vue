<template>
  <div id="users-table">
    <b-input-group class="mt-3" style="margin-bottom: 20px">
      <b-form-input
        v-model="invitedUser"
        size="17"
        placeholder="e.g. email@example.com"
      ></b-form-input>
      <b-input-group-append>
        <b-button
          v-if="this.sending == false"
          variant="info"
          @click="createUser(invitedUser)"
          >Invite user
        </b-button>
        <b-button
          v-if="this.sending == true"
          variant="info"
          @click="createUser(invitedUser)"
          >Invite user
          <b-spinner v-if="this.sending == true" type="grow" small></b-spinner>
        </b-button>
      </b-input-group-append>
    </b-input-group>
    <b-table
      hover
      bordered
      borderless
      head-row-variant="info"
      :items="users"
      :fields="fields"
    >
      <template #cell(manage)="row">
        <b-button
          size="sm"
          variant="outline-danger"
          @click="deleteUser(row.index)"
          >Delete</b-button
        >
      </template></b-table
    >
  </div>
</template>

<script>
export default {
  name: "users-table",
  data() {
    return {
      sending: false,
      fields: ["name", "manage"],
      invitedUser: ""
    };
  },
  props: {
    users: {
      type: Array
    }
  },

  methods: {
    checkIfUserExists(email) {
      console.log("testing checkIfUserExists...");
      for (var i = 0; i < this.users.length; i++) {
        if (this.users[i].name == email) {
          return true;
        }
      }
      return false;
    },

    createUser() {
      console.log("testing createUser...");
      if (this.invitedUser == "") {
        this.$bvToast.toast("User invite requires email address.", {
          title: "Error",
          variant: "danger",
          autoHideDelay: 3000
        });
        return;
      } else if (this.checkIfUserExists(this.invitedUser)) {
        this.$bvToast.toast(`User ${this.invitedUser} already exists.`, {
          title: "Error",
          variant: "danger",
          autoHideDelay: 3000
        });
        return;
      }
      this.sending = true;
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
