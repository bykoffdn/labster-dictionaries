import { defineComponent, nextTick } from "vue";
export default defineComponent({
    data() {
        return {
            notification: ""
        };
    },
    methods: {
        async notificationHandler(message) {
            this.notification = "";
            await nextTick(() => {
                this.notification = message;
            });
        }
    }
});
//# sourceMappingURL=notificationHandler.js.map