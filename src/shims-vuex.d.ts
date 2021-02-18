import { ComponentCustomProperties } from "vue";
import { Store } from "vuex";

import DictionaryListState from "@/models/DictionaryListState";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store<DictionaryListState>;
  }
}
