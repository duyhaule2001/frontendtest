import { createBrowserRouter, Navigate } from 'react-router-dom';

import {
    LayoutEmployee,
    LayoutTeacher,
    LayoutSale,
    LayoutGAD,
    LayoutHumanResources,
    LayoutRecommendationDepartment,
    LayoutPresident,
    LayoutVicePresident,
    LayoutBoardMember,
} from '../components/Common/Layout/UserRoleLayouts';

import NotFound from '../components/Common/Layout/NotFound';
import EmployeeRoutes from './EmployeeRoutes';
import TeacherRoutes from './TeacherRoutes';
import SaleRoutes from './SaleRoutes';
import HrRoutes from './HrRoutes';
import GeneralAffairsRoutes from './GeneralAffairsRoutes';
import Login from '../pages/Login/Login';
import RecommendationDepartmentRoutes from './RecommendationDepartmentRoutes';
import President from './PresidentRoutes';
import VicePresident from './VicePresidentRoutes';
import BoardMember from './BoardMemberRoutes';

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <Navigate to="/login" />,
        },
        {
            path: '/login',
            element: <Login />,
        },

        //社員ページ
        {
            path: '/employee',
            element: <LayoutEmployee />,
            errorElement: <NotFound />,
            children: EmployeeRoutes,
        },

        //先生ページ
        {
            path: '/teacher',
            element: <LayoutTeacher />,
            errorElement: <NotFound />,
            children: TeacherRoutes,
        },

        //営業ページ
        {
            path: '/sale',
            element: <LayoutSale />,
            errorElement: <NotFound />,
            children: SaleRoutes,
        },

        //総務部
        {
            path: '/generalAffairs',
            element: <LayoutGAD />,
            errorElement: <NotFound />,
            children: GeneralAffairsRoutes,
        },

        //人事ページ
        {
            path: '/humanResources',
            element: <LayoutHumanResources />,
            errorElement: <NotFound />,
            children: HrRoutes,
        },

        //社長
        {
            path: '/president',
            element: <LayoutPresident />,
            errorElement: <NotFound />,
            children: President,
        },

        //副社長
        {
            path: '/vicePresident',
            element: <LayoutVicePresident />,
            errorElement: <NotFound />,
            children: VicePresident,
        },

        //役員
        {
            path: '/board',
            element: <LayoutBoardMember />,
            errorElement: <NotFound />,
            children: BoardMember,
        },

        //推薦部BP
        {
            path: '/recommendation',
            element: <LayoutRecommendationDepartment />,
            errorElement: <NotFound />,
            children: RecommendationDepartmentRoutes,
        },
    ],
    {
        future: {
            v7_startTransition: true,
        },
    },
);

export default router;
