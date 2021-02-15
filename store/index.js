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
      const dictionaryIndex = getDictionaryIndexById(state, payload.id);

      if (dictionaryIndex !== undefined) {
        state.dictionaryList[dictionaryIndex].rowMap[payload.from] = payload.to;
      } else {
        console.warn("Can't find dictionary, payload:", payload);
      }
    },

    UPDATE_DICTIONARY_ROW(state, payload = {}) {
      const dictionaryIndex = getDictionaryIndexById(state, payload.id);

      if (dictionaryIndex !== undefined) {
        // find out if there row with with 'prevFrom'
        const prevRowTo =
          state.dictionaryList[dictionaryIndex].rowMap[payload.prevFrom];

        if (prevRowTo) {
          if (payload.prevFrom !== payload.from) {
            // we need to insert new key to the rowMap object
            delete state.dictionaryList[dictionaryIndex].rowMap[
              payload.prevFrom
            ];
          }

          state.dictionaryList[dictionaryIndex].rowMap[payload.from] =
            payload.to;
        } else {
          console.warn(
            "Can't find dictionary row by 'prevFrom', payload:",
            payload
          );
        }
      } else {
        console.warn("Can't find dictionary by 'id', payload:", payload);
      }
    },

    DELETE_DICTIONARY_ROW(state, payload = {}) {
      const dictionaryIndex = getDictionaryIndexById(state, payload.id);

      if (dictionaryIndex !== undefined) {
        // find out if there row with with 'from'
        const rowTo =
          state.dictionaryList[dictionaryIndex].rowMap[payload.from];

        if (rowTo) {
          delete state.dictionaryList[dictionaryIndex].rowMap[payload.from];
        } else {
          console.warn(
            "Can't find dictionary row by 'from', payload:",
            payload
          );
        }
      } else {
        console.warn("Can't find dictionary by 'id', payload:", payload);
      }
    },

    DELETE_DICTIONARY(state, payload = {}) {
      const dictionaryIndex = getDictionaryIndexById(state, payload.id);

      if (dictionaryIndex !== undefined) {
        state.dictionaryList.splice(dictionaryIndex, 1);
      } else {
        console.warn("Can't find dictionary by 'id', payload:", payload);
      }
    }
  },

  actions: {
    createDictionary({ commit }, payload = {}) {
      if (payload.id && payload.name) {
        // any dictionary should have id and name
        commit("CREATE_DICTIONARY", payload);
      } else {
        console.warn(
          "Can't create dictionary without 'id' or 'name', payload:",
          payload
        );
      }
    },

    createDictionaryRow({ commit }, payload = {}) {
      if (payload.id && payload.from && payload.to) {
        commit("CREATE_DICTIONARY_ROW", payload);
      } else {
        console.warn(
          "Can't create dictionary row without 'id' or 'from' or 'to', payload:",
          payload
        );
      }
    },

    updateDictionaryRow({ commit }, payload = {}) {
      if (payload.id && payload.from && payload.to) {
        commit("UPDATE_DICTIONARY_ROW", payload);
      } else {
        console.warn(
          "Can't update dictionary row without 'id' or 'from' or 'to', payload:",
          payload
        );
      }
    },

    deleteDictionaryRow({ commit }, payload = {}) {
      if (payload.id && payload.from) {
        // use 'id' and 'from' to identify row
        commit("DELETE_DICTIONARY_ROW", payload);
      } else {
        console.warn(
          "Can't delete dictionary row without 'id' or 'from', payload:",
          payload
        );
      }
    },

    deleteDictionary({ commit }, payload = {}) {
      if (payload.id) {
        commit("DELETE_DICTIONARY", payload);
      } else {
        console.warn("Can't delete dictionary without 'id', payload:", payload);
      }
    }
  }
});

const getDictionaryIndexById = (state, id) => {
  return state.dictionaryList.findIndex(dictionary => dictionary.id === id);
};
