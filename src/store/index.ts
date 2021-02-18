import { createStore } from "vuex";

/** static data **/
import interfaceCopyright from "../interface-copyright/storeErrors";

/** utils **/
// @ts-ignore
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
      // the mutation can be reached without the action, so perform consistency check here too
      if (payload.id) {
        checkDictionaryNameConsistency(state, payload.name);

        // create new dictionary
        state.dictionaryList.push({ ...payload, rowMap: {} });
      } else {
        // console.log(payload);
        throw new Error(interfaceCopyright.emptyDictionaryId);
      }
    },

    CREATE_DICTIONARY_ROW(state, payload = {}) {
      // the mutation can be reached without the action, so perform consistency check here too
      checkDictionaryRowDataConsistency(state, payload);

      const dictionaryIndex = getDictionaryIndexById(state, payload.id);

      if (typeof dictionaryIndex === "number") {
        state.dictionaryList[dictionaryIndex].rowMap[payload.from] = payload.to;
      } else {
        throw new Error(interfaceCopyright.invalidDictionaryId);
      }
    },

    UPDATE_DICTIONARY_ROW(state, payload = {}) {
      // don't checkForDuplicate here because it will be the row itself
      checkDictionaryRowDataConsistency(state, payload, true);

      const dictionaryIndex = getDictionaryIndexById(state, payload.id);

      if (typeof dictionaryIndex === "number") {
        // find out if there row with with 'prevFrom'
        const prevRowTo = getDictionaryRowToByRowFrom(
          state,
          payload.id,
          payload.prevFrom
        );

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
          throw new Error(interfaceCopyright.invalidDictionaryRowId);
        }
      } else {
        throw new Error(interfaceCopyright.invalidDictionaryId);
      }
    },

    DELETE_DICTIONARY_ROW(state, payload = {}) {
      const dictionaryIndex = getDictionaryIndexById(state, payload.id);

      if (dictionaryIndex !== undefined) {
        // find out if there row with with 'from'
        const rowTo = getDictionaryRowToByRowFrom(
          state,
          payload.id,
          payload.from
        );

        if (rowTo) {
          delete state.dictionaryList[dictionaryIndex].rowMap[payload.from];
        } else {
          throw new Error(interfaceCopyright.invalidDictionaryRowId);
        }
      } else {
        throw new Error(interfaceCopyright.invalidDictionaryId);
      }
    },

    DELETE_DICTIONARY(state, payload = {}) {
      const dictionaryIndex = getDictionaryIndexById(state, payload.id);

      if (dictionaryIndex !== undefined) {
        state.dictionaryList.splice(dictionaryIndex, 1);
      } else {
        throw new Error(interfaceCopyright.invalidDictionaryId);
      }
    }
  },

  actions: {
    /* async */ createDictionary({ commit, state }, payload = {}) {
      // we don't actually want to send inconsistent data to server,
      // so therefore we are forced to check consistency check twice, here and in the mutation

      checkDictionaryNameConsistency(state, payload.name);

      // any dictionary should have an id and a name
      // name is given by user, id we should get from backend API
      // /* await */ TODO: push new data to the API here
      // server response should contain new dictionary id, mock it using uuid()
      const serverResponse = { id: utils.uuid() };

      commit("CREATE_DICTIONARY", {
        ...payload,
        ...serverResponse
      });
    },

    /* async */ createDictionaryRow({ commit, state }, payload = {}) {
      // here we also need to do API request but omit this for simplicity
      checkDictionaryRowDataConsistency(state, payload);
      // /* await */ TODO: push new data to the API here

      commit("CREATE_DICTIONARY_ROW", payload);
    },

    /* async */ updateDictionaryRow({ commit, state }, payload = {}) {
      // here we also need to do API request but omit this for simplicity
      checkDictionaryRowDataConsistency(state, payload, true);
      // /* await */ TODO: push new data to the API here

      commit("UPDATE_DICTIONARY_ROW", payload);
    },

    /* async */ deleteDictionaryRow({ commit }, payload = {}) {
      // here we also need to do API request but omit this for simplicity
      if (payload.id && payload.from) {
        // use 'id' and 'from' to identify row
        // /* await */ TODO: push new data to the API here
        commit("DELETE_DICTIONARY_ROW", payload);
      } else if (!payload.id) {
        throw new Error(interfaceCopyright.invalidDictionaryId);
      } else if (!payload.from) {
        throw new Error(interfaceCopyright.invalidDictionaryRowId);
      }
    },

    /* async */ deleteDictionary({ commit }, payload = {}) {
      // here we also need to do API request but omit this for simplicity
      if (payload.id) {
        // /* await */ TODO: push new data to the API here
        commit("DELETE_DICTIONARY", payload);
      } else {
        throw new Error(interfaceCopyright.invalidDictionaryId);
      }
    }
  }
});

/** helpers **/

const checkDictionaryNameConsistency = (state, name) => {
  if (name) {
    const duplicateDictionary = state.dictionaryList.find(
      dictionary => dictionary.name === name
    );

    if (duplicateDictionary) {
      // console.log(payload);
      throw new Error(interfaceCopyright.duplicateDictionaryName);
    }
  } else {
    throw new Error(interfaceCopyright.emptyDictionaryName);
  }
};

const checkDictionaryRowDataConsistency = (
  state,
  payload,
  excludeItself = false // from duplicate check
) => {
  if (!payload.id || !payload.from || !payload.to) {
    throw new Error(interfaceCopyright.invalidRowData);
  } else {
    const dictionaryIndex = getDictionaryIndexById(state, payload.id);

    if (typeof dictionaryIndex !== "number") {
      throw new Error(interfaceCopyright.invalidDictionaryId);
    }

    if (excludeItself && payload.from === payload.prevFrom) {
      // for row update, we shouldn't take the row itself into account if from field isn't changed
    } else {
      const rowTo = getDictionaryRowToByRowFrom(
        state,
        payload.id,
        payload.from
      );

      if (rowTo) {
        // there is duplicate row
        throw new Error(interfaceCopyright.duplicateRowData);
      }
    }
  }
};

const getDictionaryIndexById = (state, id) => {
  return state.dictionaryList.findIndex(dictionary => dictionary.id === id);
};

const getDictionaryRowToByRowFrom = (state, id, from) => {
  const dictionaryIndex = getDictionaryIndexById(state, id);

  return state.dictionaryList[dictionaryIndex].rowMap[from];
};
