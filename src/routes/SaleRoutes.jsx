import React from 'react';
import { Navigate } from 'react-router';

import EquipmentOrderApplication from '../pages/Sale/InternalManagement/EquipmentOrderApplication';
import MeetingRecordManagement from '../pages/Sale/InternalManagement/MeetingRecordManagement';
import EngineerDailyReportManagement from '../pages/Sale/Group/EngineerDailyReportManagement';
import GroupManagement from '../pages/Sale/Group/GroupManagement';
import PurchaseOrderRegis from '../pages/Sale/InternalManagement/PurchaseOrderRegis';
import InternalSharingSale from '../pages/Sale/InternalSharingSale';
import DailyReportRegistrationSale from '../pages/Sale/InternalManagement/DailyReportRegistrationSale';
import GroupCreate from '../pages/Sale/Group/GroupCreate';
import AttendanceSale from '../pages/Sale/AttendanceSale';
import EngineerOperationSale from '../pages/Sale/TechnicianManagement/EngineerOperationSale';
import MeetingRecordApproval from '../components/Common/MeetingRecord/MeetingRecordApproval';
import LeaderMeetingRecord from '../pages/Sale/InternalManagement/LeaderMeetingRecord';
import ParticipationStatus from '../pages/Sale/TechnicianManagement/ParticipationStatus';
import MeetingRoomReservationSale from '../pages/Sale/MeetingRoomReservationSale';
import DailyReportRegistrationApproval from '../pages/Sale/InternalManagement/DailyReportRegistrationApproval';
import ProgressManagementSale from '../pages/Sale/ProgressManagementSale';
import EngineerOnSiteSale from '../pages/Sale/TechnicianManagement/EngineerOnSiteSale';
import ContactTheLeader from '../pages/Sale/Group/ContactTheLeader';
import CustomerInformationSale from '../pages/Sale/Customer/CustomerInformation';
import Gift from '../pages/Sale/Customer/Gift';
import ShareProjects from '../pages/Sale/ShareProjects';
import CompanyActivitiesSale from '../pages/Sale/CompanyActivitiesSale';

const SaleRoutes = [
    { index: true, element: <Navigate to="internalSharing" /> },
    {
        path: 'progressManagement',
        element: <ProgressManagementSale />,
    },
    {
        path: 'meetingRecordApproval',
        element: <MeetingRecordApproval />,
    },
    {
        path: 'internalSharing',
        element: <InternalSharingSale />,
    },
    {
        path: 'internalSharing/event',
        element: <CompanyActivitiesSale />,
    },
    {
        path: 'attendance',
        element: <AttendanceSale />,
    },
    {
        path: 'dailyReportRegistration',
        element: <DailyReportRegistrationSale />,
    },
    {
        path: 'dailyReportRegistrationApproval',
        element: <DailyReportRegistrationApproval />,
    },
    {
        path: 'meetingRecordManagement',
        element: <MeetingRecordManagement />,
    },
    {
        path: 'leaderMeetingRecord',
        element: <LeaderMeetingRecord />,
    },

    {
        path: 'purchaseOrderRegis',
        element: <PurchaseOrderRegis />,
    },
    {
        path: 'equipmentOrderApplication',
        element: <EquipmentOrderApplication />,
    },
    {
        path: 'engineerOperation',
        element: <EngineerOperationSale />,
    },
    {
        path: 'engineerDailyReportManagement',
        element: <EngineerDailyReportManagement />,
    },
    {
        path: 'engineerOnSiteSale',
        element: <EngineerOnSiteSale />,
    },
    {
        path: 'groupManagement',
        element: <GroupManagement />,
    },
    {
        path: 'groupCreate',
        element: <GroupCreate />,
    },
    {
        path: 'contactTheLeader',
        element: <ContactTheLeader />,
    },
    {
        path: 'participationStatus',
        element: <ParticipationStatus />,
    },
    {
        path: 'customerGift',
        element: <Gift />,
    },
    {
        path: 'meetingRoomReservation',
        element: <MeetingRoomReservationSale />,
    },
    {
        path: 'customerInformation',
        element: <CustomerInformationSale />,
    },
    {
        path: 'shareProjects',
        element: <ShareProjects />,
    },
];

export default SaleRoutes;
