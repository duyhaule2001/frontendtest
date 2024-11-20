import { Table } from 'antd';
import React from 'react';

const NotHiredWithinCompany = ({ notHired }) => {
    const columns = [
        {
            title: '氏名',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
        },
        {
            title: '社員番号',
            dataIndex: 'emp_no',
            key: 'emp_no',
            align: 'center',
        },
    ];
    return (
        <>
            <Table dataSource={notHired} columns={columns} pagination bordered className="mt-5" rowKey={'emp_no'} />
        </>
    );
};

export default NotHiredWithinCompany;
