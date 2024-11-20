import { Table } from 'antd';
import React from 'react';

const PersonnelSituationOverview = ({ personnelSituationOverview, viewTruCol = true }) => {
    //convert  object to array
    const dataSource = Array.isArray(personnelSituationOverview)
        ? personnelSituationOverview
        : [personnelSituationOverview];
    const allColumns = [
        {
            title: '現場人数',
            dataIndex: 'on_site',
            key: 'on_site',
            align: 'center',
        },
        {
            title: '待機人数',
            dataIndex: 'people_waiting',
            key: 'people_waiting',
            align: 'center',
            render: (text) => <span className="font-bold text-red-500">{text}</span>,
        },
        {
            title: 'GPCP',
            dataIndex: 'GPCP',
            key: 'GPCP',
            align: 'center',
        },
        {
            title: 'OJT',
            dataIndex: 'OJT',
            key: 'OJT',
            align: 'center',
        },
        {
            title: '産休',
            dataIndex: 'maternity_leave',
            key: 'maternity_leave',
            align: 'center',
        },
        {
            title: '合計',
            dataIndex: 'total',
            key: 'total',
            align: 'center',
            render: (text) => <span className="font-bold text-green-500">{text}</span>,
        },
    ];

    const columns = viewTruCol
        ? allColumns.filter(
              (column) => column.key === 'on_site' || column.key === 'people_waiting' || column.key === 'total',
          )
        : allColumns;

    return (
        <>
            <Table dataSource={dataSource} columns={columns} bordered className="mt-5" pagination={false} />
        </>
    );
};

export default PersonnelSituationOverview;
