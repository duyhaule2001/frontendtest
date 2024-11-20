import { BrowserRouter as Router, RouterProvider, createBrowserRouter, Outlet, Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { doGetAccountAction } from './redux/account/accountSlice';
import { getAccountAPI, getApplicationList } from './services/common.service';
import router from './routes/AppRouter';
import { setUnapprovedItems } from './redux/approval/approvalSlice';
import dayjs from 'dayjs';

const App = () => {
    const dispatch = useDispatch();

    const fetchApplicationList = async () => {
        try {
            const year = dayjs().format('YYYY');
            const month = dayjs().format('MM');
            const res = await getApplicationList(year, month);
            if (res.data && Array.isArray(res.data)) {
                dispatch(setUnapprovedItems(res.data)); // Reduxストアにデータを更新する
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getAccount = async () => {
        const res = await getAccountAPI();
        if (res.data) {
            dispatch(doGetAccountAction(res.data));
            if (res.data.permissions === 3) {
                fetchApplicationList();
            }
        }
    };

    useEffect(() => {
        if (window.location.pathname !== '/login') {
            getAccount();
        }
    }, []);

    return (
        <>
            {/* {window.location.pathname === '/' ? (
                <RouterProvider router={router} />
            ) : (
                <Loading />
            )} */}
            <RouterProvider router={router} />
        </>
    );
};

export default App;
