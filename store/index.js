import { createStore } from "vuex";

export default createStore({
  state() {
    return {
      dictionaryList: [
        // Expected format:
        /* {
          id: 'dictionary id',
          name: 'dictionary name',
          rowMap: {
            // use Object to prevent duplicates
            'from_1': 'to_1',
            'from_2': 'to_2',
          }
        } */
      ]
    };
  },

  mutations: {
    CREATE_DICTIONARY(state, payload = {}) {
      state.dictionaryList.push({ ...payload, rowMap: {} });
    },

    CREATE_DICTIONARY_ROW(state, payload = {}) {
      const dictionaryIndex = state.dictionaryList.findIndex(
        dictionary => dictionary.id === payload.id
      );

      if (dictionaryIndex !== undefined) {
        state.dictionaryList[dictionaryIndex].rowMap[payload.rowData.from] =
          payload.rowData.to;
      } else {
        console.warn("Can't find dictionary, payload:", payload);
      }
    },

    UPDATE_DICTIONARY_ROW(state, payload = {}) {
      console.log(state, payload);
    },

    DELETE_DICTIONARY_ROW(state, payload = {}) {
      console.log(state, payload);
    },

    DELETE_DICTIONARY(state, payload = {}) {
      console.log(payload);
      const dictionaryIndex = state.dictionaryList.findIndex(
        dictionary => dictionary.id === payload.id
      );

      if (dictionaryIndex !== undefined) {
        state.dictionaryList.splice(dictionaryIndex, 1);

        console.log(state.dictionaryList);
      } else {
        console.warn("Can't find dictionary, payload:", payload);
      }
    }
  },

  actions: {
    createDictionary({ commit }, payload = {}) {
      if (payload.id && payload.name) {
        // any dictionary has to have id and name
        commit("CREATE_DICTIONARY", payload);
      } else {
        console.warn(
          "Can't create dictionary without id or name, payload:",
          payload
        );
      }
    },

    createDictionaryRow({ commit }, payload = {}) {
      if (payload.id && payload.rowData) {
        // any dictionary row has to have id and rowData
        commit("CREATE_DICTIONARY_ROW", payload);
      } else {
        console.warn(
          "Can't create dictionary row without id or rowData, payload:",
          payload
        );
      }
    },

    deleteDictionary({ commit }, payload = {}) {
      if (payload.id) {
        // any dictionary row has to have id and rowData
        commit("DELETE_DICTIONARY", payload);
      } else {
        console.warn("Can't delete dictionary without id, payload:", payload);
      }
    }
  }
});
