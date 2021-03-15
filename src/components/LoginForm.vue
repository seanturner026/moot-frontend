<template>
  <div id="login-form">
    <h1 style="margin-bottom: 50px">Serverless Release Dashboard</h1>
    <div id="description" class="small-container" style="text-align:left">
      <b>Clicking deploy will trigger the following actions:</b>
      <li style="text-align:left">
        Create a pull request of the specified "head" branch into the "base"
        branch, and merge the pull request
      </li>
      <li style="text-align:left">
        Create a release using the specified version and release notes on
        Github.com
      </li>
      <li style="text-align:left">
        Send a slack message containing the release notes.
      </li>
    </div>
    <form>
      <b><div align="left">Organization Name:</div></b>
      <br />
      <input
        v-model="login_details.tenant_name"
        type="text"
        id="tenant_name"
        name="tenant_name"
      /><br />
      <b><div align="left">Email Address:</div></b>
      <br />
      <input
        v-model="login_details.email_address"
        type="text"
        id="email_address"
        name="email_address"
      /><br />
      <b><div align="left">Password:</div></b><br />
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
    <b-button
      v-if="!new_password_required && login_details.sending == false"
      size="md"
      variant="info"
      @click="loginUser($event)"
    >
      Login
      <b-spinner
        v-if="login_details.sending == true"
        type="grow"
        small
      ></b-spinner
    ></b-button>
    <b-button
      v-if="
        (!new_password_required && login_details.sending == true) ||
          (new_password_required && login_details.sending == true)
      "
      size="md"
      variant="info"
      @click="loginUser($event)"
    >
      Logging in
      <b-spinner type="grow" small></b-spinner
    ></b-button>
    <b-button
      v-if="new_password_required"
      size="md"
      variant="info"
      @click="resetPassword($event)"
    >
      Reset Password
    </b-button>
  </div>
</template>

<script>
export default {
  name: "login-form",
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
        tenant_name: "",
        password: "",
        sending: false
      }
    };
  },

  methods: {
    loginUser() {
      console.log("testing loginUser...");
      this.login_details.sending = true;
      const loginEvent = {
        email_address: this.login_details.email_address,
        tenant_name: this.login_details.tenant_name,
        password: this.login_details.password
      };
      this.$emit("login:user", loginEvent);
    },

    resetPassword() {
      console.log("testing resetPassword...");
      this.login_details.sending = true;
      const loginEvent = {
        email_address: this.login_details.email_address,
        tenant_name: this.login_details.tenant_name,
        password: this.login_details.password,
        new_password: this.login_details.new_password,
        session_id: this.session_id
      };
      this.$emit("reset:password", loginEvent);
    }
  }
};
</script>
