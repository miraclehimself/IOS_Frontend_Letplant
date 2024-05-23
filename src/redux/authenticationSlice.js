import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  token: "",
  isloading: true,
  location: {
    latitude: 0,
    longitude: 0,
  },
  password: "",
  email: "",
  item: {},
};

const authenticationSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = "";
    },
    setIsloadingTrue: (state) => {
      state.isloading = true;
    },
    setIsloadingfalse: (state) => {
      state.isloading = false;
    },
    setLocationAction: (state, { payload }) => {
      state.location = payload;
    },
    setPasswordAction: (state, { payload }) => {
      state.password = payload;
    },
    setEmailAction: (state, { payload }) => {
      state.email = payload;
    },
    setItem: (state, { payload }) => {
      state.item = payload;
    },
  },
});

export const {
  setToken,
  clearToken,
  setIsloadingTrue,
  setIsloadingfalse,
  setLocationAction,
  setPasswordAction,
  setEmailAction,
  setItem,
} = authenticationSlice.actions;
export default authenticationSlice.reducer;
