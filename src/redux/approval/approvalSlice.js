import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    unapprovedItems: [], // 未承認の項目
};

const approvalSlice = createSlice({
    name: 'approvals',
    initialState,
    reducers: {
        // 未承認の項目リスト全体を更新する
        setUnapprovedItems: (state, action) => {
            state.unapprovedItems = action.payload;
        },

        // 承認済みの項目をunapprovedItemsリストから削除する
        approveItem: (state, action) => {
            state.unapprovedItems = state.unapprovedItems.filter((item) => item.id !== action.payload);
        },
    },
});

// status: falseの項目数を計算するためのセレクター
export const selectUnapprovedCount = (state) => {
    return state.approvals.unapprovedItems.filter((item) => item.approverStatus === false).length;
};

export const { setUnapprovedItems, approveItem } = approvalSlice.actions;

export default approvalSlice.reducer;
