import React, { useEffect, useState } from 'react';
import { Spin, Tabs } from 'antd';
import dayjs from 'dayjs';
import { getWithinCompanyInformation } from '../../../../services/common.service';

import PersonnelListWithinCompany from './PersonnelListWithinCompany';

import RetirementInfoWithinCompany from './RetirementInfoWithinCompany';
import MaternityLeaveWithinCompany from './MaternityLeaveWithinCompany';
import PersonnelSituationOverviewWithinCompany from './PersonnelSituationOverviewWithinCompany';
import NotHiredWithinCompany from './NotHiredWithinCompany';

const WithinCompanyInformation = ({ date }) => {
    const [personnelList, setPersonnelList] = useState([]);
    const [notHired, setNotHired] = useState([]);
    const [retirementInfo, setRetirementInfo] = useState([]);
    const [maternityLeaveList, setMaternityLeaveList] = useState([]);
    const [personnelSituationOverview, setPersonnelSituationOverview] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async (date) => {
            setLoading(true);
            try {
                const res = await getWithinCompanyInformation(dayjs(date).format('YYYY-MM'));
                if (res.data) {
                    setPersonnelList(
                        Array.isArray(res.data.personnel_list?.fullTimeEmployee)
                            ? res.data.personnel_list.fullTimeEmployee
                            : [],
                    );
                    setRetirementInfo(Array.isArray(res.data.retirement_info) ? res.data.retirement_info : []);
                    setMaternityLeaveList(
                        Array.isArray(res.data.maternity_leave_list) ? res.data.maternity_leave_list : [],
                    );
                    setPersonnelSituationOverview(res.data.personnelSituationOverview || null);
                    setNotHired(Array.isArray(res.data.notHired) ? res.data.notHired : []);
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
            children: <PersonnelListWithinCompany personnelList={personnelList} />,
        },
        {
            key: '2',
            label: '採用不可',
            children: <NotHiredWithinCompany notHired={notHired} />,
        },
        {
            key: '3',
            label: '離職リスト',
            children: <RetirementInfoWithinCompany retirementInfo={retirementInfo} />,
        },
        {
            key: '4',
            label: '産休リスト',
            children: <MaternityLeaveWithinCompany maternityLeaveList={maternityLeaveList} />,
        },
        {
            key: '5',
            label: '人員数と状況の概要',
            children: (
                <PersonnelSituationOverviewWithinCompany personnelSituationOverview={personnelSituationOverview} />
            ),
        },
    ];
    return (
        <Spin spinning={loading}>
            <Tabs defaultActiveKey="1" items={items} />
        </Spin>
    );
};

export default WithinCompanyInformation;
