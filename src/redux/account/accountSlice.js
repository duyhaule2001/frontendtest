import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading: true,

    user: {
        id: '',
        mail: '',
        username: '',
        name: '',
        emp_no: '',
        remaining_paid_leave_days: '',
        tenure_period: '',
        permissions: '',
        department: '',
        managerial_position: '',
        is_share_cus: null,
        is_share_view_participation: null,
        image: '',
        paid_holiday: '',
        reason: '',
    },
};

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        doGetAccountAction: (state, action) => {
            state.isLoading = false;
            if (action.payload) {
                state.user = action.payload;
            } else {
                state.user = initialState.user;
            }
        },
    },
    extraReducers: (builder) => {},
});

export const { doGetAccountAction } = accountSlice.actions;

export default accountSlice.reducer;
