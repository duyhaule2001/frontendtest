import React from 'react';
import MaternityLeaveList from '../Common/MaternityLeaveList';

const MaternityLeaveSap = ({ maternityLeaveList, fetchData, date }) => {
    return <MaternityLeaveList maternityLeaveList={maternityLeaveList} fetchData={fetchData} date={date} />;
};

export default MaternityLeaveSap;
