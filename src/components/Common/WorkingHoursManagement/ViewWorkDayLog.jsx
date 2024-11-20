import { Drawer, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { getWorkDayLog } from '../../../services/common.service';

const ViewWorkDayLog = ({ showWorkDayLog, setShowWorkDayLog, selectedView, currentMonth }) => {
    const [listWorkDay, setListWorkDay] = useState([]);

    useEffect(() => {
        if (selectedView && selectedView.employeeNumber) {
            fetchListWorkDay();
        }
    }, [selectedView]);

    const fetchListWorkDay = async () => {
        const data = {
            date: currentMonth,
            employeeNumber: selectedView.employeeNumber,
        };
        console.log('check submit data', data);
        try {
            const res = await getWorkDayLog(data);
            if (res.data) {
                setListWorkDay(res.data);
            } else {
                setListWorkDay([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            title: '日付',
            dataIndex: 'date',
        },
        {
            title: '出発日',
            dataIndex: 'departure',
        },
        {
            title: '目的地',
            dataIndex: 'destination',
        },
        {
            title: '金額',
            dataIndex: 'travel_price',
            render: (value) => {
                return new Intl.NumberFormat('ja-JP').format(value);
            },
        },
        {
            title: '片道・往復',
            dataIndex: 'ticket_type',
        },
        {
            title: '目的・備考',
            dataIndex: 'travle_details',
        },
    ];
    return (
        <>
            <Drawer title="交通費詳細" onClose={() => setShowWorkDayLog(false)} open={showWorkDayLog} width={'50vw'}>
                <Table dataSource={listWorkDay} columns={columns} rowKey={(record, index) => index} />
            </Drawer>
        </>
    );
};

export default ViewWorkDayLog;
