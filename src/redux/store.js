import { configureStore } from '@reduxjs/toolkit';
import accountReducer from '../redux/account/accountSlice';
import approvalSlice from './approval/approvalSlice';

const store = configureStore({
    reducer: {
        account: accountReducer,
        approvals: approvalSlice,
    },
});

export default store;
