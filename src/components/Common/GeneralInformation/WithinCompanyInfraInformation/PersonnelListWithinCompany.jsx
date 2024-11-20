import React from 'react';
import { Table } from 'antd';

const PersonnelListWithinCompany = ({ personnelList }) => {
    const columns = [
        {
            title: <span className="flex items-center justify-center">氏名</span>,
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '入社日',
            dataIndex: 'hire_date',
            key: 'hire_date',
            align: 'center',
        },
        {
            title: '部門',
            dataIndex: 'department',
            key: 'department',
            align: 'center',
        },
        {
            title: '役職',
            dataIndex: 'managerial_position',
            key: 'managerial_position',
            align: 'center',
        },
    ];
    return <Table dataSource={personnelList} columns={columns} rowKey="id" className="mt-5" />;
};

export default PersonnelListWithinCompany;
