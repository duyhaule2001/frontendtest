import React, { useEffect, useState } from 'react';
import { Spin, Tabs } from 'antd';
import dayjs from 'dayjs';
import { getSapInformation } from '../../../../services/common.service';

import PersonnelSituationOverviewSap from './PersonnelSituationOverviewSap';
import PersonnelListSap from './PersonnelListSap';
import WaitingListSap from './WaitingListSap';
import NewEmployeeListSap from './NewEmployeeListSap';
import RetirementInfoSap from './RetirementInfoSap';
import MaternityLeaveSap from './MaternityLeaveSap';

const SapInformation = ({ date }) => {
    const [personnelList, setPersonnelList] = useState([]);
    const [waitingList, setWaitingList] = useState([]);
    const [newEmployee, setNewEmployee] = useState([]);
    const [retirementInfo, setRetirementInfo] = useState([]);
    const [maternityLeaveList, setMaternityLeaveList] = useState([]);
    const [personnelSituationOverview, setPersonnelSituationOverview] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData(date);
    }, [date]);

    const fetchData = async (date) => {
        setLoading(true);
        try {
            const res = await getSapInformation(dayjs(date).format('YYYY-MM'));
            if (res?.data) {
                setPersonnelList(res?.data?.personnel_list);
                setWaitingList(res?.data?.waiting_info);
                setNewEmployee(res?.data?.new_emp_lis);
                setRetirementInfo(res?.data?.retirement_info);
                setMaternityLeaveList(res?.data?.maternity_leave_list);
                setPersonnelSituationOverview(res?.data?.personnelSituationOverview);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const items = [
        {
            key: '1',
            label: '人員リスト',
            children: <PersonnelListSap personnelList={personnelList} />,
        },
        {
            key: '2',
            label: '待機リスト',
            children: <WaitingListSap waitingList={waitingList} />,
        },
        {
            key: '3',
            label: '新入社員リスト',
            children: <NewEmployeeListSap newEmployee={newEmployee} />,
        },
        {
            key: '4',
            label: '離職リスト',
            children: <RetirementInfoSap retirementInfo={retirementInfo} />,
        },
        {
            key: '5',
            label: '産休リスト',
            children: <MaternityLeaveSap maternityLeaveList={maternityLeaveList} fetchData={fetchData} date={date} />,
        },
        {
            key: '6',
            label: '人員数と状況の概要',
            children: <PersonnelSituationOverviewSap personnelSituationOverview={personnelSituationOverview} />,
        },
    ];
    return (
        <>
            <Spin spinning={loading}>
                <Tabs defaultActiveKey="1" items={items} />
            </Spin>
        </>
    );
};

export default SapInformation;
