export default {
  data() {
    return {
      notification: ""
    };
  },

  methods: {
    notificationHandler(message) {
      this.notification = "";

      this.$nextTick(() => {
        this.notification = message;
      });
    }
  }
};
