import { createStore } from "vuex";

/** types **/
import Dictionary from "@/models/Dictionary.ts";
import DictionaryListState from "@/models/DictionaryListState.ts";
import DictionaryRowPayload from "@/models/DictionaryRowPayload.ts";

/** static data **/
import interfaceCopyright from "@/interface-copyright/storeErrors.ts";

/** utils **/
// @ts-ignore
import { utils } from "@darwin-studio/ui-vue";

export default createStore({
  state(): DictionaryListState {
    return {
      dictionaryList: []
    };
  },

  mutations: {
    CREATE_DICTIONARY(
      state: DictionaryListState,
      payload: { id: string; name: string }
    ) {
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

    CREATE_DICTIONARY_ROW(
      state: DictionaryListState,
      payload: DictionaryRowPayload
    ) {
      // the mutation can be reached without the action, so perform consistency check here too
      checkDictionaryRowDataConsistency(state, payload);

      const dictionaryIndex = getDictionaryIndexById(state, payload.id);

      if (dictionaryIndex !== -1) {
        state.dictionaryList[dictionaryIndex].rowMap[payload.from] = payload.to;
      } else {
        throw new Error(interfaceCopyright.invalidDictionaryId);
      }
    },

    UPDATE_DICTIONARY_ROW(
      state: DictionaryListState,
      payload: DictionaryRowPayload
    ) {
      // don't checkForDuplicate here because it will be the row itself
      checkDictionaryRowDataConsistency(state, payload, true);

      const dictionaryIndex = getDictionaryIndexById(state, payload.id);

      if (dictionaryIndex !== -1) {
        // find out if there row with with 'prevFrom'
        const prevRowTo = getDictionaryRowToByRowFrom(
          state,
          payload.id,
          payload.prevFrom
        );

        if (prevRowTo) {
          if (payload.prevFrom && payload.prevFrom !== payload.from) {
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

    DELETE_DICTIONARY_ROW(
      state: DictionaryListState,
      payload: DictionaryRowPayload
    ) {
      const dictionaryIndex = getDictionaryIndexById(state, payload.id);

      if (dictionaryIndex !== -1) {
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

    DELETE_DICTIONARY(state: DictionaryListState, payload: { id: string }) {
      const dictionaryIndex = getDictionaryIndexById(state, payload.id);

      if (dictionaryIndex !== -1) {
        state.dictionaryList.splice(dictionaryIndex, 1);
      } else {
        throw new Error(interfaceCopyright.invalidDictionaryId);
      }
    }
  },

  actions: {
    /* async */ createDictionary({ commit, state }, payload: { name: string }) {
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

    /* async */ createDictionaryRow(
      { commit, state },
      payload: DictionaryRowPayload
    ) {
      // here we also need to do API request but omit this for simplicity
      checkDictionaryRowDataConsistency(state, payload);
      // /* await */ TODO: push new data to the API here
      commit("CREATE_DICTIONARY_ROW", payload);
    },

    /* async */ updateDictionaryRow(
      { commit, state },
      payload: DictionaryRowPayload
    ) {
      // here we also need to do API request but omit this for simplicity
      checkDictionaryRowDataConsistency(state, payload, true);
      // /* await */ TODO: push new data to the API here

      commit("UPDATE_DICTIONARY_ROW", payload);
    },

    /* async */ deleteDictionaryRow({ commit }, payload: DictionaryRowPayload) {
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

    /* async */ deleteDictionary({ commit }, payload: { id: string }) {
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

const checkDictionaryNameConsistency = (
  state: DictionaryListState,
  name: string
): void => {
  if (name) {
    const duplicateDictionary = state.dictionaryList.find(
      (dictionary: Dictionary) => dictionary.name === name
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
  state: DictionaryListState,
  payload: DictionaryRowPayload,
  excludeItself: boolean = false // from duplicate check
): void => {
  if (!payload.id || !payload.from || !payload.to) {
    throw new Error(interfaceCopyright.invalidRowData);
  } else {
    const dictionaryIndex = getDictionaryIndexById(state, payload.id);

    if (dictionaryIndex === -1) {
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

const getDictionaryIndexById = (
  state: DictionaryListState,
  id?: string
): number => {
  if (id) {
    return state.dictionaryList.findIndex(
      (dictionary: Dictionary) => dictionary.id === id
    );
  } else {
    return -1;
  }
};

const getDictionaryRowToByRowFrom = (
  state: DictionaryListState,
  id?: string,
  from?: string
): string | null => {
  if (id && from) {
    const dictionaryIndex = getDictionaryIndexById(state, id);

    return state.dictionaryList[dictionaryIndex].rowMap[from];
  } else {
    return null;
  }
};
