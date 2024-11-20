import React, { useEffect, useState } from 'react';
import TitleCus from '../Layout/TitleCus';
import { DatePicker, Table } from 'antd';
import dayjs from 'dayjs';
import AttendanceModal from './AttendanceModal';
import { getListAttendanceApi } from '../../../services/common.service';

const AttendanceManagement = (type) => {
    const [yearMonth, setYearMonth] = useState(dayjs());
    const [listAttendanceData, setListAttendanceData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedData, setSelectedData] = useState();
    const [loading, setLoading] = useState(false);

    const fetchData = async (year, month) => {
        setLoading(true);
        try {
            const res = await getListAttendanceApi(year, month, type.type);
            if (res.data && Array.isArray(res.data)) {
                setListAttendanceData(res.data);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (yearMonth) {
            const year = yearMonth.year();
            const month = yearMonth.month() + 1;
            fetchData(year, month);
        }
    }, [yearMonth]);

    const columns = [
        {
            title: '社員番号',
            dataIndex: 'emp_no',
            align: 'center',
            render: (text, record) => (
                <span
                    className="cursor-pointer text-blue-600"
                    onClick={() => {
                        setIsModalVisible(true);
                        setSelectedData(record);
                    }}
                >
                    {text}
                </span>
            ),
        },
        {
            title: '氏名',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '部門',
            dataIndex: 'department',
            align: 'center',
        },
        {
            title: '合計稼働時間',
            dataIndex: 'totalWorkTime',
            align: 'center',
            render: (text) => {
                if (!text) return '';
                const [hours, minutes] = text.split(':');
                return `${hours}時間${minutes}分`;
            },
        },
        {
            title: '合計残業時間',
            dataIndex: 'totalOvertime',
            align: 'center',
            render: (text) => {
                if (!text) return '';
                const [hours, minutes] = text.split(':');
                return `${hours}時間${minutes}分`;
            },
        },
    ];

    return (
        <div>
            <TitleCus title={'勤怠管理'} />
            <div className="p-10">
                <div className="flex w-full justify-start">
                    <DatePicker
                        picker="month"
                        placeholder="年月"
                        format="YYYY-MM"
                        value={yearMonth}
                        onChange={(date) => {
                            setYearMonth(date);
                        }}
                        className="mb-3"
                    />
                </div>
                <div>
                    <Table
                        rowKey={'id'}
                        columns={columns}
                        loading={loading}
                        dataSource={listAttendanceData}
                        locale={{
                            emptyText: 'データがありません。',
                        }}
                    />
                </div>
            </div>
            <AttendanceModal
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                selectedData={selectedData}
                yearMonth={yearMonth}
            />
        </div>
    );
};

export default AttendanceManagement;
