<template>
  <div id="admin-onboarding-form">
    <b-button
      v-if="this.sending == false"
      v-b-modal.modal-admin-lg
      variant="info"
      >Invite Organization
    </b-button>
    <b-modal
      id="modal-admin-lg"
      v-bind:hide-footer="true"
      size="lg"
      title="Add Organization"
    >
      <b-container fluid>
        <h6 style="text-align:left">Organization Name:</h6>
        <b-form-input
          v-model="createOrganization.name"
          placeholder="seanturner026"
          size="11"
          style="text-align:left"
        />
        <h6 style="text-align:left">Contact Email:</h6>
        <b-form-input
          v-model="createOrganization.contact_email"
          placeholder="you@example.com"
          size="11"
          style="text-align:left"
        />
        <h6 style="text-align:left">Purchased Seats:</h6>
        <b-form-input
          v-model="createOrganization.available_seats"
          placeholder="10"
          size="11"
          style="text-align:left"
        />
        <div align="right">
          <b-button size="md" variant="info" @click="onboardOrganization()"
            >Create</b-button
          >
        </div>
      </b-container></b-modal
    >
  </div>
</template>

<script>
export default {
  name: "admin-onboarding-form",
  data() {
    return {
      sending: false,
      createOrganization: {
        available_seats: 0,
        name: "",
        contact_email: ""
      }
    };
  },
  props: {},

  methods: {
    onboardOrganization() {
      console.log("testing onboardOrganization...");
      if (this.createOrganization.contact_email == "") {
        this.$bvToast.toast("User invite requires email address.", {
          title: "Error",
          variant: "danger",
          autoHideDelay: 3000
        });
        return;
      }
      this.sending = true;
      const createOrganization_event = {
        organization_name: this.createOrganization.name,
        available_seats: this.createOrganization.available_seats,
        contact_email: this.createOrganization.contact_email,
        status: "onboarding"
      };
      this.$emit("create:organization", createOrganization_event);
    }
  }
};
</script>
