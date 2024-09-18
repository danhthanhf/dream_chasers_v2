import { createSlice } from "@reduxjs/toolkit";

const adminMenuSlice = createSlice({
    name: "adminMenu",
    initialState: {
        show: false,
    },
    reducers: {
        toggleMenu: (state) => {
            state.show = !state.show;
        },
    },
});

export default adminMenuSlice;
