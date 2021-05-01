<template>
  <div id="app" class="small-container">
    <h1 style="margin-bottom: 50px">Serverless Release Dashboard</h1>
    <admin-onboarding-form @create:organization="createOrganization($event)" />
  </div>
</template>

<script>
import Vue from "vue";
import AdminOnboardingForm from "@/components/AdminOnboardingForm.vue";

export default {
  name: "Admin",
  components: {
    AdminOnboardingForm
  },
  data() {
    return {};
  },
  methods: {
    async createOrganization(create_organization_event) {
      try {
        console.log(create_organization_event);
        const response = await fetch(
          process.env.VUE_APP_API_GATEWAY_ENDPOINT + "/onboarding/create",
          {
            method: "POST",
            body: JSON.stringify(create_organization_event),
            headers: {
              Authorization: Vue.$cookies.get("Authorization"),
              "Content-type": "application/json; charset=UTF-8",
              "X-Identity-Token": Vue.$cookies.get("X-Identity-Token")
            }
          }
        );
        const data = await response.json();
        if (response.status != 200) {
          this.$bvToast.toast(response.message, {
            title: "Error",
            variant: "danger",
            autoHideDelay: 3000
          });
          return;
        }
        console.log(response);
        console.log(data);
        this.$bvToast.toast(response.message, {
          title: "Success",
          variant: "info",
          autoHideDelay: 3000
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>
