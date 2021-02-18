export default {
  data() {
    return {
      notification: ""
    };
  },

  methods: {
    async notificationHandler(message) {
      this.notification = "";

      await this.$nextTick(() => {
        this.notification = message;
      });
    }
  }
};
