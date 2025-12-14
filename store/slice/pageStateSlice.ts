// store/pageStateSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const STORAGE_KEY = "pageState";

function loadPageState(): PageStateMap | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const serialized = window.localStorage.getItem(STORAGE_KEY);
    if (!serialized) return undefined;
    return JSON.parse(serialized) as PageStateMap;
  } catch {
    return undefined;
  }
}

function savePageState(state: PageStateMap) {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(state);
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // ignore write errors
  }
}


export type PageStateMap = {
  [key in string]?: unknown;
};


const initialState: PageStateMap = {
  login: {
    "email": "",
    "password": ""
  },
  signup: {
    "name": "",
    "email": "",
    "password": "",
    "confirmPassword": ""
  },
  apisListPage: {
    "page": 1,
    "limit": 10,
    "sort": "asc",
    "order": "asc",
    "orderBy": "name",
    "showFilters": false,
    "activeFilters": {
      "name": "",
      "version": "",
      "method": "",
      "path": "",
      "status": "",
      "requests": "",
      "errorRatePercent": "",
      "p95LatencyMs": "",
      "ownerTeam": ""
    }
  }
};

const pageStateSlice = createSlice({
  name: "pageState",
  initialState,
  reducers: {
    initPageState(state) {
      const pageState = loadPageState();
      if (pageState) {
        return pageState;
      }
      return initialState;
    },
    setPageState(
      state,
      action: PayloadAction<{ page: string; data: unknown }>
    ) {

      const { page, data } = action.payload;
      state[page] = data;
      savePageState(state);

    },
    resetPageState(state, action: PayloadAction<string>) {
      const page = action.payload;
      state[page] = initialState[page];
      savePageState(state);
    },
    resetAllPages(state) {
      state = initialState;
      savePageState(state);
      return state;
    },
  },
});

export const { setPageState, resetPageState, resetAllPages, initPageState } =
  pageStateSlice.actions;
export default pageStateSlice.reducer;
