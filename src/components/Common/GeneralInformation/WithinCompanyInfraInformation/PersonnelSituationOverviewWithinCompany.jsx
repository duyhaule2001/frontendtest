import { Table } from 'antd';
import React from 'react';

const PersonnelSituationOverviewWithinCompany = ({ personnelSituationOverview }) => {
    //convert  object to array
    const dataSource = Array.isArray(personnelSituationOverview)
        ? personnelSituationOverview
        : [personnelSituationOverview];
    const columns = [
        {
            title: 'SAP営業',
            dataIndex: 'sap_sales',
            key: 'sap_sales',
            align: 'center',
        },
        {
            title: 'OPEN営業',
            dataIndex: 'open_sales',
            key: 'open_sales',
            align: 'center',
            render: (text) => <span className="font-bold text-red-500">{text}</span>,
        },
        {
            title: 'DX営業',
            dataIndex: 'dx_sales',
            key: 'dx_sales',
            align: 'center',
        },
        {
            title: '新規事業部',
            dataIndex: 'new_business_department',
            key: 'new_business_department',
            align: 'center',
        },
        {
            title: 'BP推進部',
            dataIndex: 'bp_promotion_department',
            key: 'bp_promotion_department',
            align: 'center',
        },
        {
            title: '総務部',
            dataIndex: 'general_affairs_department',
            key: 'general_affairs_department',
            align: 'center',
        },

        {
            title: '人事部',
            dataIndex: 'human_resources_department',
            key: 'human_resources_department',
            align: 'center',
        },
        {
            title: '副社長',
            dataIndex: 'vice_president',
            key: 'vice_president',
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

    return (
        <>
            <Table dataSource={dataSource} columns={columns} bordered pagination={false} className="mt-5" />
        </>
    );
};

export default PersonnelSituationOverviewWithinCompany;
