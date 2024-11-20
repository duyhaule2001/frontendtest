import React, { useState } from 'react';
import TitleCus from '../Layout/TitleCus';
import { DatePicker, Tabs } from 'antd';
import NewEnemployedResignations from './NewEnemployedResignations/NewEnemployedResignations';
import dayjs from 'dayjs';
import SapInformation from './SapInformation/SapInformation';
import OpenInformation from './OpenInformation/OpenInformation';
import CloudInfraInformation from './CloudeInfraInformation/CloudInfraInformation';
import WithinCompanyInformation from './WithinCompanyInfraInformation/WithinCompanyInformation';
import MonthlyReport from './MonthlyReport';

const GeneralInformation = () => {
    const [date, setDate] = useState(dayjs());
  

    const onChangeDate = (date) => {
        setDate(date);
    };

    const items = [
        {
            key: '1',
            label: 'SAP',
            children: <SapInformation date={date} />,
        },
        {
            key: '2',
            label: 'OPEN系',
            children: <OpenInformation date={date} />,
        },
        {
            key: '3',
            label: 'インフラ、クラウド系',
            children: <CloudInfraInformation date={date} />,
        },
        {
            key: '4',
            label: '社内（内勤、営業）',
            children: <WithinCompanyInformation date={date} />,
        },
        {
            key: '5',
            label: '新入社員・採用不可・離職',
            children: <NewEnemployedResignations date={date} />,
        },
        {
            key: '6',
            label: '月報',
            children: <MonthlyReport date={date}/>,
        },
    ];
    return (
        <>
            <TitleCus title={'一般情報'} />
            <div className="mt-5 px-10">
                <DatePicker className="mb-5 mt-2" picker="month" onChange={onChangeDate} value={date} />
                <div>
                    <Tabs defaultActiveKey="1" items={items}  type="card" />
                </div>
            </div>
        </>
    );
};

export default GeneralInformation;
