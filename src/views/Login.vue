<template>
  <div id="app" class="small-container">
    <login-form
      @login:user="loginUser($event)"
      @reset:password="resetPassword($event)"
      :new_password_required="new_password_required"
      :session_id="session_id"
    />
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue";

export default {
  name: "Login",
  components: {
    LoginForm
  },
  data() {
    return {
      session_id: "",
      new_password_required: false
    };
  },
  methods: {
    async loginUser(loginEvent) {
      try {
        const response = await fetch(
          process.env.VUE_APP_API_GATEWAY_ENDPOINT + "/auth/login",
          {
            method: "POST",
            body: JSON.stringify(loginEvent)
          }
        );
        const data = await response.json();
        console.log(data);
        if (data.headers["X-Session-Id"] != null) {
          this.session_id = data.headers["X-Session-Id"];
          this.new_password_required = true;
        }
        const token = data.headers["Authorization"];
        const identity_token = data.headers["X-Identity-Token"];
        this.$cookies.set("Authorization", token);
        this.$cookies.set("X-Identity-Token", identity_token);
        this.$router.push("/repositories");
      } catch (error) {
        console.error(error);
      }
    },

    async resetPassword(resetPasswordEvent) {
      try {
        const response = await fetch(
          process.env.VUE_APP_API_GATEWAY_ENDPOINT + "/auth/reset/password",
          {
            method: "POST",
            body: JSON.stringify(resetPasswordEvent)
          }
        );
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
      this.$router.push("/repositories");
    }
  }
};
</script>
