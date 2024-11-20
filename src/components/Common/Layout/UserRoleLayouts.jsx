import { Outlet, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import SalePageNavbar from './Navbar/SalePageNavbar';
import GeneralAffairsDepartmentNavbar from './Navbar/GeneralAffairsDepartmentNavbar';
import HumanResourcesNavbar from './Navbar/HumanResourcesNavbar';
import RecommendationDepartmentNavbar from './Navbar/RecommendationDepartmentNavbar';
import PresidentNavbar from './Navbar/PresidentNavbar';
import VicePresidentNavbar from './Navbar/VicePresidentNavbar';
import BoardMemberNavbar from './Navbar/BoardMemberNavbar';
import { Button, Result } from 'antd';
import Loading from './Loading';
import EmployeePageNavbar from './Navbar/EmployeePageNavbar';
import TeacherPageNavbar from './Navbar/TeacherPageNavbar';

export const useAuthorization = (routePrefix, requiredPermissions) => {
    const navigate = useNavigate();
    const isAdminRoute = window.location.pathname.startsWith(routePrefix);
    const user = useSelector((state) => state.account.user);
    const isAuthorized = isAdminRoute && requiredPermissions.includes(user?.permissions);
    const isLoading = useSelector((state) => state.account.isLoading);

    if (isLoading) {
        return <Loading />;
    }

    if (!user || !isAuthorized) {
        return (
            <Result
                status="403"
                title="403"
                subTitle="申し訳ありませんが、このページにアクセスする権限がありません。"
                extra={
                    <Button type="primary" onClick={() => navigate('/')}>
                        ログインページへ
                    </Button>
                }
            />
        );
    }

    return null;
};

//社員
export const LayoutEmployee = () => {
    const authCheck = useAuthorization('/employee', [6, 7, 8, 9]);
    if (authCheck) {
        return authCheck;
    }

    return (
        <div className="mt-16">
            <EmployeePageNavbar />
            <Outlet />
        </div>
    );
};

//先生
export const LayoutTeacher = () => {
    const authCheck = useAuthorization('/teacher', [20]);
    if (authCheck) {
        return authCheck;
    }

    return (
        <div>
            <TeacherPageNavbar />
            <Outlet />
        </div>
    );
};

//営業
export const LayoutSale = () => {
    const authCheck = useAuthorization('/sale', [4, 5]);
    if (authCheck) {
        return authCheck;
    }

    return (
        <div className="mt-16">
            <SalePageNavbar />
            <Outlet />
        </div>
    );
};

//総務
export const LayoutGAD = () => {
    const authCheck = useAuthorization('/generalAffairs', [3]);
    if (authCheck) {
        return authCheck;
    }

    return (
        <div className="mt-16">
            <GeneralAffairsDepartmentNavbar />
            <Outlet />
        </div>
    );
};

//人事
export const LayoutHumanResources = () => {
    const authCheck = useAuthorization('/humanResources', [2]);
    if (authCheck) {
        return authCheck;
    }

    return (
        <div className="mt-16">
            <HumanResourcesNavbar />
            <Outlet />
        </div>
    );
};

//社長
export const LayoutPresident = () => {
    const authCheck = useAuthorization('/president', [100]);
    if (authCheck) {
        return authCheck;
    }

    return (
        <div className="mt-16">
            <PresidentNavbar />
            <Outlet />
        </div>
    );
};

//副社長
export const LayoutVicePresident = () => {
    const authCheck = useAuthorization('/vicePresident', [50]);
    if (authCheck) {
        return authCheck;
    }

    return (
        <div className="mt-16">
            <VicePresidentNavbar />
            <Outlet />
        </div>
    );
};

//役員
export const LayoutBoardMember = () => {
    const authCheck = useAuthorization('/board', [0]);
    if (authCheck) {
        return authCheck;
    }

    return (
        <div className="mt-16">
            <BoardMemberNavbar />
            <Outlet />
        </div>
    );
};

//BP推薦
export const LayoutRecommendationDepartment = () => {
    const authCheck = useAuthorization('/recommendation', [1]);
    if (authCheck) {
        return authCheck;
    }

    return (
        <div className="mt-16">
            <RecommendationDepartmentNavbar />
            <Outlet />
        </div>
    );
};
