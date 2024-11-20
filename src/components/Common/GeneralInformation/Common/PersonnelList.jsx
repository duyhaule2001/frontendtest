import { Table } from 'antd';
import React from 'react';

const PersonnelList = ({ personnelList }) => {
    const columns = [
        {
            title: '正社員',
            children: [
                {
                    title: '氏名',
                    dataIndex: ['fullTimeEmployee', 'name'],
                    key: 'fullTime-name',
                    align: 'center',
                    render: (_, record) => record.fullTimeEmployee?.name || null,
                },
                {
                    title: '入社日',
                    dataIndex: ['fullTimeEmployee', 'hire_date'],
                    key: 'fullTime-hireDate',
                    align: 'center',
                    render: (_, record) => record.fullTimeEmployee?.hire_date || null,
                },
            ],
        },
        {
            title: '個人',
            children: [
                {
                    title: '氏名',
                    dataIndex: ['individual', 'name'],
                    key: 'individual-name',
                    align: 'center',
                    render: (_, record) => record.individual?.name || null,
                },
                {
                    title: '入社日',
                    dataIndex: ['individual', 'hire_date'],
                    key: 'individual-hireDate',
                    align: 'center',
                    render: (_, record) => record.individual?.hire_date || null,
                },
            ],
        },
        {
            title: 'BP',
            children: [
                {
                    title: '氏名',
                    dataIndex: ['BP', 'name'],
                    key: 'bp-name',
                    align: 'center',
                    render: (_, record) => record.BP?.name || null,
                },
                {
                    title: '入社日',
                    dataIndex: ['BP', 'hire_date'],
                    key: 'bp-hireDate',
                    align: 'center',
                    render: (_, record) => record.BP?.hire_date || null,
                },
            ],
        },
    ];

    // テーブルのデータを単一の配列にフラット化する
    const transformedData = (personnelList.fullTimeEmployee || []).map((fullTimeEmp, index) => ({
        key: `fullTime-${index}`,
        fullTimeEmployee: fullTimeEmp,
        individual: personnelList.individual[index] || {},
        BP: personnelList.BP[index] || {},
    }));

    return <Table dataSource={transformedData} columns={columns} pagination className="mt-5" bordered />;
};

export default PersonnelList;
