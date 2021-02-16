export default {
  data() {
    return {
      notification: ""
    };
  },

  methods: {
    errorHandler(errorMessage) {
      this.notification = "";

      this.$nextTick(() => {
        this.notification = errorMessage;
      });
    }
  }
};
