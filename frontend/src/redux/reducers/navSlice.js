import { createSlice } from "@reduxjs/toolkit";

const NavComponent = createSlice({
    name: "nav",
    initialState: {
        adminShow: true,
        instructorShow: true,
    },
    reducers: {
        toggleAdminShow: (state) => {
            state.adminShow = !state.adminShow;
        },
        toggleInstructorShow: (state) => {
            state.instructorShow = !state.instructorShow;
        },
    },
});

export default NavComponent;
