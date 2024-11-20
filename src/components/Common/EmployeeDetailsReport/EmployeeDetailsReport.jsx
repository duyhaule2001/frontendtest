import { DatePicker, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import TitleCus from '../Layout/TitleCus.jsx';
import { getEmployeeListWithDate } from '../../../services/generalAffairs.service.js';

const EmployeeDetailsReports = () => {
    const [employeeList, setEmployeeList] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchEmployeeList(selectedDate);
    }, [selectedDate]);

    const fetchEmployeeList = async (selectedDate) => {
        setLoading(true);
        try {
            const res = await getEmployeeListWithDate(dayjs(selectedDate).format('YYYY-MM'));
            if (res.data && Array.isArray(res.data)) {
                setEmployeeList(res.data);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const columns = [
        {
            title: '社員番号',
            align: 'center',
            dataIndex: 'employee_number',
        },
        {
            title: <span className="flex items-center justify-center">名前</span>,
            dataIndex: 'name',
        },
        {
            title: '部門',
            align: 'center',
            dataIndex: 'department',
        },
        {
            title: '性別',
            align: 'center',
            dataIndex: 'gender',
        },
        {
            title: <span className="flex items-center justify-center">メールアドレス</span>,
            dataIndex: 'email',
        },
        {
            title: '合計稼働時間',
            align: 'center',
            dataIndex: 'total_working_hours',
        },
        {
            title: '請求金額',
            align: 'center',
            dataIndex: 'billing_amount',
            render: (value) => value.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' }),
        },
        {
            title: '合計請求金額',
            align: 'center',
            dataIndex: 'total_billing_amount',
            render: (value) => value.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' }),
        },
        {
            title: '合計稼働日数',
            align: 'center',
            dataIndex: 'total_working_days',
        },
        {
            title: '合計交通費',
            align: 'center',
            dataIndex: 'total_transportation_expense',
            render: (value) => value.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' }),
        },
        {
            title: '合計給与',
            align: 'center',
            dataIndex: 'total_salary',
            render: (value) => value.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' }),
        },
    ];

    return (
        <div>
            <TitleCus title={'技術者管理'} />
            <div className="px-10 py-8">
                <DatePicker picker="month" onChange={handleDateChange} value={selectedDate} className="mb-3" />
                <Table dataSource={employeeList} columns={columns} rowKey={'employee_number'} loading={loading} />
            </div>
        </div>
    );
};
export default EmployeeDetailsReports;
