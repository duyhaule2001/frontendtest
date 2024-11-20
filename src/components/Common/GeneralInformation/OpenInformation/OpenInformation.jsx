import React, { useEffect, useState } from 'react';
import { Spin, Tabs } from 'antd';
import dayjs from 'dayjs';
import { getOpenInformation } from '../../../../services/common.service';

import PersonnelSituationOverviewOpen from './PersonnelSituationOverviewOpen';
import PersonnelListOpen from './PersonnelListOpen';
import WaitingListOpen from './WaitingListOpen';
import NewEmployeeListOpen from './NewEmployeeListOpen';
import RetirementInfoOpen from './RetirementInfoOpen';
import MaternityLeaveOpen from './MaternityLeaveOpen';

const OpenInformation = ({ date }) => {
    const [personnelList, setPersonnelList] = useState([]);
    const [waitingList, setWaitingList] = useState([]);
    const [newEmployee, setNewEmployee] = useState([]);
    const [retirementInfo, setRetirementInfo] = useState([]);
    const [maternityLeaveList, setMaternityLeaveList] = useState([]);
    const [personnelSituationOverview, setPersonnelSituationOverview] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async (date) => {
            setLoading(true);
            try {
                const res = await getOpenInformation(dayjs(date).format('YYYY-MM'));
                if (res.data) {
                    setPersonnelList(res.data.personnel_list);
                    setWaitingList(res.data.waiting_info);
                    setNewEmployee(res.data.new_emp_lis);
                    setRetirementInfo(res.data.retirement_info);
                    setMaternityLeaveList(res.data.maternity_leave_list);
                    setPersonnelSituationOverview(res.data.personnelSituationOverview);
                }
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        };
        fetchData(date);
    }, [date]);

    const items = [
        {
            key: '1',
            label: '人員リスト',
            children: <PersonnelListOpen personnelList={personnelList} />,
        },
        {
            key: '2',
            label: '待機リスト',
            children: <WaitingListOpen waitingList={waitingList} />,
        },
        {
            key: '3',
            label: '新入社員リスト',
            children: <NewEmployeeListOpen newEmployee={newEmployee} />,
        },
        {
            key: '4',
            label: '離職リスト',
            children: <RetirementInfoOpen retirementInfo={retirementInfo} />,
        },
        {
            key: '5',
            label: '産休リスト',
            children: <MaternityLeaveOpen maternityLeaveList={maternityLeaveList} />,
        },
        {
            key: '6',
            label: '人員数と状況の概要',
            children: <PersonnelSituationOverviewOpen personnelSituationOverview={personnelSituationOverview} />,
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

export default OpenInformation;
