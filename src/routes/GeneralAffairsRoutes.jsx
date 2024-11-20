import React from 'react';
import { Navigate } from 'react-router';

import EngineerOnSiteGAD from '../pages/GeneralAffairs/TechnicianManagementGAD/EngineerOnSiteGAD';
import WorkingHoursManagementGAD from '../pages/GeneralAffairs/TechnicianManagementGAD/WorkingHoursManagementGAD';
import AttendanceGAD from '../pages/GeneralAffairs/AttendanceGAD';
import EquipmentApplicationApprovalGAD from '../pages/GeneralAffairs/EquipmentApplicationApprovalGAD';
import CreateNoticeGAD from '../pages/GeneralAffairs/CreateNoticeGAD';
import WaitingStatusGAD from '../pages/GeneralAffairs/TechnicianManagementGAD/WaitingStatusGAD';
import CustomerGiftGAD from '../pages/GeneralAffairs/CustomerGiftGAD';
import EmployeeDetailsReport from '../pages/HumanResources/TechnicianManagementHR/EmployeeDetailsReport';
import NewEmployeeInfoGAD from '../pages/GeneralAffairs/TechnicianManagementGAD/NewEmployeeInfoGAD';
import InternalSharingGAD from '../pages/GeneralAffairs/InternalSharingGAD';
import GadAccRegister from '../pages/GeneralAffairs/EmployeeInformationGAD/GadAccRegister';
import RetirementManagementGAD from '../pages/GeneralAffairs/EmployeeInformationGAD/RetirementManagementGAD';
import DailyReportGAD from '../pages/GeneralAffairs/DailyReportGAD';
import MeetingRoomReservationGAD from '../pages/GeneralAffairs/MeetingRoomReservationGAD';
import EquipmentManagementGAD from '../pages/GeneralAffairs/EquipmentManagementGAD';
import RetirementApproval from '../components/Common/RetirementApproval/RetirementApproval';
import GeneralInformationGAD from '../pages/GeneralAffairs/GeneralInformationGAD';
import ReportApprovalGAD from '../pages/GeneralAffairs/ReportApprovalGAD';
import PaidLeaveManagementGAD from '../pages/GeneralAffairs/EmployeeInformationGAD/PaidLeaveManagementGAD';
import PcManagementGAD from '../pages/GeneralAffairs/PcManagementGAD';
import CompanyActivitiesGAD from '../pages/GeneralAffairs/CompanyActivitiesGAD';

const GeneralAffairsRoutes = [
    { index: true, element: <Navigate to="internalSharing" /> },

    {
        path: 'pcManagement',
        element: <PcManagementGAD />,
    },
    {
        path: 'paidLeaveManagement',
        element: <PaidLeaveManagementGAD />,
    },
    {
        path: 'generalInformation',
        element: <GeneralInformationGAD />,
    },
    {
        path: 'equipmentManagement',
        element: <EquipmentManagementGAD />,
    },
    {
        path: 'internalSharing',
        element: <InternalSharingGAD />,
    },
    {
        path: 'internalSharing/event',
        element: <CompanyActivitiesGAD />,
    },
    {
        path: 'attendance',
        element: <AttendanceGAD />,
    },
    {
        path: 'dailyReport',
        element: <DailyReportGAD />,
    },
    {
        path: 'reportApproval',
        element: <ReportApprovalGAD />,
    },
    {
        path: 'equipmentApplicationApproval',
        element: <EquipmentApplicationApprovalGAD />,
    },

    {
        path: 'retirementManagement',
        element: <RetirementManagementGAD />,
    },
    {
        path: 'retirementApproval',
        element: <RetirementApproval />,
    },

    {
        path: 'accRegister',
        element: <GadAccRegister />,
    },
    {
        path: 'engineerOnSite',
        element: <EngineerOnSiteGAD />,
    },
    {
        path: 'workingHoursManagement',
        element: <WorkingHoursManagementGAD />,
    },
    {
        path: 'newEmployeeInfo',
        element: <NewEmployeeInfoGAD />,
    },
    {
        path: 'waitingStatus',
        element: <WaitingStatusGAD />,
    },
    {
        path: 'employeeDetailsReport',
        element: <EmployeeDetailsReport />,
    },
    {
        path: 'customerGift',
        element: <CustomerGiftGAD />,
    },
    {
        path: 'noticeCreate',
        element: <CreateNoticeGAD />,
    },
    {
        path: 'meetingRoomReservation',
        element: <MeetingRoomReservationGAD />,
    },
];

export default GeneralAffairsRoutes;
