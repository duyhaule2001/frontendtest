import { Navigate } from 'react-router';
import InternalSharingBoard from '../pages/BoardMember/InternalSharingBoard';
import MeetingManagementBoard from '../pages/BoardMember/MeetingManagementBoard';
import CompanyActivitiesBoard from '../pages/BoardMember/CompanyActivitiesBoard';

const BoardMember = [
    { index: true, element: <Navigate to="internalSharing" /> },
    {
        path: 'internalSharing',
        element: <InternalSharingBoard />,
    },
    {
        path: 'internalSharing/event',
        element: <CompanyActivitiesBoard />,
    },
    {
        path: 'meeting',
        element: <MeetingManagementBoard />,
    },
];

export default BoardMember;
