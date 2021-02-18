import { defineComponent, nextTick } from "vue";

export default defineComponent({
  data() {
    return {
      notification: ""
    };
  },

  methods: {
    async notificationHandler(message: string) {
      this.notification = "";

      await nextTick(() => {
        this.notification = message;
      });
    }
  }
});
