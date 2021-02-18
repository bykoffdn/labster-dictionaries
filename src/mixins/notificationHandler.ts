import { defineComponent, nextTick } from "vue";

export default defineComponent({
  data() {
    return {
      notification: "" as string
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
