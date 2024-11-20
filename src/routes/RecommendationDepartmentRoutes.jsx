import { Navigate } from 'react-router';
import InternalSharingRD from '../pages/RecommenDepartment/InternalSharingRD';
import AttendanceRD from '../pages/RecommenDepartment/AttendanceRD';
import DailyReportRD from '../pages/RecommenDepartment/DailyReportRD';
import MeetingManagementRD from '../pages/RecommenDepartment/MeetingManagementRD';
import ProjectInformationRD from '../pages/RecommenDepartment/ProjectInformationRD';
import CompanyActivitiesRD from '../pages/RecommenDepartment/CompanyActivitiesRD';

const RecommendationDepartmentRoutes = [
    { index: true, element: <Navigate to="internalSharing" /> },
    {
        path: 'internalSharing',
        element: <InternalSharingRD />,
    },
    {
        path: 'internalSharing/event',
        element: <CompanyActivitiesRD />,
    },
    {
        path: 'attendance',
        element: <AttendanceRD />,
    },
    {
        path: 'dailyReport',
        element: <DailyReportRD />,
    },
    {
        path: 'meeting',
        element: <MeetingManagementRD />,
    },
    {
        path: 'projectInfo',
        element: <ProjectInformationRD />,
    },
];

export default RecommendationDepartmentRoutes;
