import { Navigate } from 'react-router';
import InternalSharingVicePresident from '../pages/VicePresident/InternalSharingVicePresident';
import MeetingManagementVicePresident from '../pages/VicePresident/MeetingManagementVicePresident';
import ERPSaleReportApproval from '../pages/VicePresident/ERPSaleReportApproval';
import CompanyActivitiesVicePresident from '../pages/VicePresident/CompanyActivitiesVicePresident';

const VicePresident = [
    { index: true, element: <Navigate to="internalSharing" /> },
    {
        path: 'internalSharing',
        element: <InternalSharingVicePresident />,
    },
    {
        path: 'internalSharing/event',
        element: <CompanyActivitiesVicePresident />,
    },
    {
        path: 'saleReport',
        element: <ERPSaleReportApproval />,
    },
    {
        path: 'meeting',
        element: <MeetingManagementVicePresident />,
    },
];

export default VicePresident;
