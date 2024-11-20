import { Navigate } from 'react-router';

import CompanyTraining from '../pages/Employee/CompanyTraining';
import IdeaSubmission from '../pages/Employee/TheCompany/IdeaSubmission';
import ProjectStaffingExpansion from '../pages/Employee/TheCompany/ProjectStaffingExpansion';
import Recommendations from '../pages/Employee/TheCompany/Recommendations';
import ConsultationForConcerns from '../pages/Employee/TheCompany/ConsultationForConcerns';
import WorkingReports from '../pages/Employee/MonthlyReport/WorkingReport';
import TransportationExpenseReport from '../pages/Employee/MonthlyReport/TransportationExpenseReport';
import DailyReport from '../pages/Employee/MonthlyReport/DailyReport';
import Notice from '../components/Employee/Notice';
import CompanyActivities from '../pages/Employee/CompanyActivities';
import AnnualSchedule from '../pages/Employee/AnnualSchedule';
import GroupStatusReport from '../pages/Employee/GroupStatusReport';

const EmployeeRoutes = [
    { index: true, element: <Navigate to="annualSchedule" /> },
    {
        path: 'annualSchedule',
        element: <AnnualSchedule />,
    },
    {
        path: 'companyActivities',
        element: <CompanyActivities />,
    },
    {
        path: 'notice',
        element: <Notice />,
    },
    {
        path: 'companyTraining',
        element: <CompanyTraining />,
    },
    {
        path: 'ideaSubmission',
        element: <IdeaSubmission />,
    },
    {
        path: 'projectStaffingExpansion',
        element: <ProjectStaffingExpansion />,
    },
    {
        path: 'consultationForConcerns',
        element: <ConsultationForConcerns />,
    },
    {
        path: 'workingReport',
        element: <WorkingReports />,
    },
    {
        path: 'dailyReport',
        element: <DailyReport />,
    },
    {
        path: 'recommendations',
        element: <Recommendations />,
    },
    {
        path: 'transportationExpenseReport',
        element: <TransportationExpenseReport />,
    },
    {
        path: 'groupStatusReport',
        element: <GroupStatusReport />,
    },
];

export default EmployeeRoutes;
