// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   user: null,
//   token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     // Set user & token after login or register
//     setCredentials: (state, action) => {
//       const { user, token } = action.payload;
//       state.user = user;
//       state.token = token;
//       localStorage.setItem("token", token);
//     },
//     // Logout user
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       localStorage.removeItem("token");
//     },
//   },
// });

// export const { setCredentials, logout } = authSlice.actions;
// export default authSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";

// // Load from localStorage on init
// const storedUser =
//   typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;
// const storedToken =
//   typeof window !== "undefined" ? localStorage.getItem("token") : null;

// const initialState = {
//   user: storedUser,
//   token: storedToken,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     // Save user + token after login/register
//     setCredentials: (state, action) => {
//       const { user, token } = action.payload;
//       state.user = user;
//       state.token = token;
//       if (typeof window !== "undefined") {
//         localStorage.setItem("token", token);
//         localStorage.setItem("user", JSON.stringify(user));
//       }
//     },
//     // Clear everything on logout
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       if (typeof window !== "undefined") {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//       }
//     },
//   },
// });

// export const { setCredentials, logout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isHydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Save user + token after login/register
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }
    },

    // Clear everything on logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },

    // Rehydrate state from localStorage after client mounts
    rehydrateAuth: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        state.token = token;
        state.user = user ? JSON.parse(user) : null;
        state.isHydrated = true;
      }
    },
  },
});

export const { setCredentials, logout, rehydrateAuth } = authSlice.actions;
export default authSlice.reducer;
