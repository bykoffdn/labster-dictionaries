import { createStore } from "vuex";

/** static data **/
import interfaceCopyright from "../interface-copyright/storeErrors";

/** utils **/
import { utils } from "@darwin-studio/ui-vue";

export default createStore({
  state() {
    return {
      lastError: "",
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
      // the mutation can be reached without the action, so perform consistency check here
      if (payload.name || payload.id) {
        const duplicateDictionary = state.dictionaryList.find(
          dictionary => dictionary.name === payload.name
        );

        if (duplicateDictionary) {
          // console.log(payload);
          throw new Error(interfaceCopyright.duplicateDictionaryName);
        }

        // create new dictionary
        state.dictionaryList.push({ ...payload, rowMap: {} });
      } else if (payload.name) {
        // console.log(payload);
        throw new Error(interfaceCopyright.emptyDictionaryName);
      } else if (payload.id) {
        // console.log(payload);
        throw new Error(interfaceCopyright.emptyDictionaryId);
      }
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
    /* async */ createDictionary({ commit }, payload = {}) {
      // any dictionary should have an id and a name
      // name is given by user, id we should get from backend API
      // /* await */ TODO: push new dictionary to the API here
      // server response should contain new dictionary id, mock it using uuid()
      const serverResponse = { id: utils.uuid() };

      commit("CREATE_DICTIONARY", {
        ...payload,
        ...serverResponse
      });
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
