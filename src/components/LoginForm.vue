<template>
  <div id="login-form">
    <h1>Serverless Release Dashboard</h1>
    <form>
      <label for="email_address">Email Address:</label><br />
      <input
        v-model="login_details.email_address"
        type="text"
        id="email_address"
        name="email_address"
      /><br />
      <label for="password">Password:</label><br />
      <input
        v-model="login_details.password"
        type="password"
        id="password"
        name="password"
      />
      <label v-if="new_password_required" for="new_password"
        >New Password:</label
      ><br />
      <input
        v-if="new_password_required"
        v-model="login_details.new_password"
        type="password"
        id="new_password"
        name="new_password"
      />
    </form>
    <button v-if="!new_password_required" @click="loginUser($event)">
      Login
    </button>
    <button v-if="new_password_required" @click="resetPassword($event)">
      Reset Password
    </button>
  </div>
</template>

<script>
export default {
  name: "LoginForm",
  props: {
    session_id: String,
    new_password_required: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      login_details: {
        email_address: "",
        password: ""
      }
    };
  },

  methods: {
    loginUser() {
      console.log("testing loginUser...");
      const loginEvent = {
        email_address: this.login_details.email_address,
        password: this.login_details.password
      };
      this.$emit("login:user", loginEvent);
    },

    resetPassword() {
      console.log("testing resetPassword...");

      const loginEvent = {
        email_address: this.login_details.email_address,
        password: this.login_details.password,
        new_password: this.login_details.new_password,
        session_id: this.session_id
      };
      this.$emit("reset:password", loginEvent);
    }
  }
};
</script>
