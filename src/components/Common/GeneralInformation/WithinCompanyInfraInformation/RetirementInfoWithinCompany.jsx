import React from 'react';
import RetirementInfo from '../Common/RetirementInfo';

const RetirementInfoWithinCompany = ({ retirementInfo }) => {
    return (
        <div className="mt-5">
            <RetirementInfo retirementInfo={retirementInfo} showButton={false} />
        </div>
    );
};

export default RetirementInfoWithinCompany;
