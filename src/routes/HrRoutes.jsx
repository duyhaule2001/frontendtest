import React from 'react';
import { Navigate } from 'react-router';

import PcManagementHR from '../pages/HumanResources/PcManagementHR';
import SendEmailHR from '../pages/HumanResources/SendEmailHR';
import NewEmployeeInfoHR from '../pages/HumanResources/TechnicianManagementHR/NewEmployeeInfoHR';
import CreateNoticeHR from '../pages/HumanResources/CreateNoticeHR';
import AttendanceHR from '../pages/HumanResources/AttendanceHR';
import AccRegisterHR from '../pages/HumanResources/EmployeeInformationHR/AccRegisterHR';
import InternalSharingHR from '../pages/HumanResources/InternalSharingHR';
import RetirementManagementHR from '../pages/HumanResources/EmployeeInformationHR/RetirementManagementHR';
import DailyReportHR from '../pages/HumanResources/DailyReportHR';
import ReportApprovalHR from '../pages/HumanResources/ReportApprovalHR';
import MeetingRoomReservationHR from '../pages/HumanResources/MeetingRoomReservationHR';
import EquipmentManagementHR from '../pages/HumanResources/EquipmentManagementHR';
import PaidLeaveManagementHR from '../pages/HumanResources/EmployeeInformationHR/PaidLeaveManagementHR';
import WorkingHoursManagementHR from '../pages/HumanResources/TechnicianManagementHR/WorkingHoursManagementHR';
import EngineerOnSiteHR from '../pages/HumanResources/TechnicianManagementHR/EngineerOnSiteHR';
import GeneralInformationHR from '../pages/HumanResources/GeneralInformationHR';
import CompanyActivitiesHR from '../pages/HumanResources/CompanyActivitiesHR';

const HrRoutes = [
    { index: true, element: <Navigate to="internalSharing" /> },

    {
        path: 'generalInformation',
        element: <GeneralInformationHR />,
    },
    {
        path: 'equipmentManagement',
        element: <EquipmentManagementHR />,
    },
    {
        path: 'internalSharing',
        element: <InternalSharingHR />,
    },
    {
        path: 'internalSharing/event',
        element: <CompanyActivitiesHR />,
    },
    {
        path: 'attendance',
        element: <AttendanceHR />,
    },
    {
        path: 'reportApproval',
        element: <ReportApprovalHR />,
    },
    {
        path: 'dailyReport',
        element: <DailyReportHR />,
    },
    {
        path: 'paidLeaveManagement',
        element: <PaidLeaveManagementHR />,
    },

    {
        path: 'retirementManagement',
        element: <RetirementManagementHR />,
    },
    {
        path: 'addAccount',
        element: <AccRegisterHR />,
    },

    {
        path: 'engineerOnSite',
        element: <EngineerOnSiteHR />,
    },
    {
        path: 'newEmployeeInfo',
        element: <NewEmployeeInfoHR />,
    },
    {
        path: 'workingHoursManagement',
        element: <WorkingHoursManagementHR />,
    },
    {
        path: 'pcManagement',
        element: <PcManagementHR />,
    },
    {
        path: 'sendEmail',
        element: <SendEmailHR />,
    },
    {
        path: 'noticeCreate',
        element: <CreateNoticeHR />,
    },
    {
        path: 'meetingRoomReservation',
        element: <MeetingRoomReservationHR />,
    },
];

export default HrRoutes;
