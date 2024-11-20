import InternalSharingPresident from '../pages/President/InternalSharingPresident';
import ExecutiveDailyReportPresident from '../pages/President/DailyReportApproval/ExecutiveDailyReportPresident';
import AttendanceStatusPresident from '../pages/President/OfficeWorkManagement/AttendanceStatusPresident';
import MeetingRecordManagement from '../pages/President/OfficeWorkManagement/MeetingRecordManagement';
import HrReportApproval from '../pages/President/DailyReportApproval/HrReportApproval';
import GadReportApproval from '../pages/President/DailyReportApproval/GadReportApproval';
import SaleReportApproval from '../pages/President/DailyReportApproval/SaleReportApproval';
import AccountCreatePresident from '../pages/President/OfficeWorkManagement/AccountCreatePresident';
import EntranceAndExitListPresident from '../pages/President/TechnicianManagement/EntranceAndExitListPresident';
import WorkingListPresident from '../pages/President/TechnicianManagement/WorkingListPresident';
import NewEmployeeInfoPresident from '../pages/President/TechnicianManagement/NewEmployeeInfoPresident';
import InternalTrainingAuthorityPresident from '../pages/President/TechnicianManagement/InternalTrainingAuthorityPresident';
import ParticipationStatusManagement from '../pages/President/TechnicianManagement/ParticipationStatusManagement';
import CustomerInformation from '../pages/President/Customer/CustomerInformation';
import CustomerGiftPresident from '../pages/President/Customer/CustomerGiftPresident';
import AttendanceManagementPresident from '../pages/President/OfficeWorkManagement/AttendanceManagementPresident';
import RetirementApprovalPresident from '../pages/President/RetirementApprovalPresident';
import GeneralInformationPresident from '../pages/President/GeneralInformationPresident';
import DetailCourse from '../components/President/CourseProduction/DetailCourse';
import HomePresident from '../pages/President/HomePresident';
import CompanyActivitiesPresident from '../pages/President/CompanyActivitiesPresident';

const President = [
    { index: true, element: <HomePresident /> },

    {
        path: 'generalInformation',
        element: <GeneralInformationPresident />,
    },
    {
        path: 'internalSharing',
        element: <InternalSharingPresident />,
    },
    {
        path: 'internalSharing/event',
        element: <CompanyActivitiesPresident />,
    },
    {
        path: 'retirementApproval',
        element: <RetirementApprovalPresident />,
    },
    {
        path: 'hrReportApproval',
        element: <HrReportApproval />,
    },
    {
        path: 'gadReportApproval',
        element: <GadReportApproval />,
    },
    {
        path: 'saleReportApproval',
        element: <SaleReportApproval />,
    },
    {
        path: 'executiveDailyReport',
        element: <ExecutiveDailyReportPresident />,
    },
    {
        path: 'attendance',
        element: <AttendanceStatusPresident />,
    },
    {
        path: 'saleAttendanceManagement',
        element: <AttendanceManagementPresident type={'sale'} />,
    },
    {
        path: 'hrAttendanceManagement',
        element: <AttendanceManagementPresident type={'hr'} />,
    },
    {
        path: 'gadAttendanceManagement',
        element: <AttendanceManagementPresident type={'gad'} />,
    },
    {
        path: 'meetingRecordManagement',
        element: <MeetingRecordManagement />,
    },
    {
        path: 'accountCreate',
        element: <AccountCreatePresident />,
    },
    {
        path: 'entranceAndExitList',
        element: <EntranceAndExitListPresident />,
    },
    {
        path: 'workingList',
        element: <WorkingListPresident />,
    },
    {
        path: 'newEmployeeInfo',
        element: <NewEmployeeInfoPresident />,
    },
    {
        path: 'participation',
        element: <ParticipationStatusManagement />,
    },

    {
        path: 'internalTrainingAuthority',
        element: <InternalTrainingAuthorityPresident />,
    },
    {
        path: 'internalTrainingAuthority/course/:id',
        element: <DetailCourse />,
    },

    {
        path: 'customerGift',
        element: <CustomerGiftPresident />,
    },
    {
        path: 'customerInformation',
        element: <CustomerInformation />,
    },
];

export default President;
