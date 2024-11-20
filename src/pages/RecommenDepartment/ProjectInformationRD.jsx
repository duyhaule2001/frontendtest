import React from 'react';

import SalesDailyReport from '../../components/Sale/ShareProjectsSale/SalesDailyReport';
import { exportToExcelForRecommendDepartment } from '../../components/Sale/ShareProjectsSale/ExcelExport';

const ProjectInformationRD = () => {
    return (
        <SalesDailyReport
            showCreateButton={false}
            visibleColumns={[
                'caseNumber',
                'conditionDetails',
                'urgency',
                'telework',
                'interviewCount',
                'otherDetails',
                'sales_or_proposal_department',
            ]}
            handleExport={exportToExcelForRecommendDepartment}
        />
    );
};

export default ProjectInformationRD;
