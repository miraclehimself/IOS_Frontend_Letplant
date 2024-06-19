import { createSlice } from "@reduxjs/toolkit";
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

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
  name: "authentication",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      storage.set('token', action.payload);
    },
    clearToken: (state) => {
      state.token = "";
      storage.delete('token');
    },
    setIsloadingTrue: (state) => {
      state.isloading = true;
    },
    setIsloadingFalse: (state) => {
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
    logout: (state) => {
      state.token = "";
      state.password = "";
      state.email = "";
      state.item = {};
      storage.delete('token');
    },
  },
});

export const {
  setToken,
  clearToken,
  setIsloadingTrue,
  setIsloadingFalse,
  setLocationAction,
  setPasswordAction,
  setEmailAction,
  setItem,
  logout,
} = authenticationSlice.actions;
export default authenticationSlice.reducer;
