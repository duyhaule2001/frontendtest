import React, { useEffect } from 'react';
import { Table, Checkbox } from 'antd';

const UserTable = ({ users, selectedRowKeys, setSelectedRowKeys }) => {
    // Log selectedRowKeys whenever it changes
    useEffect(() => {}, [selectedRowKeys]);

    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        const newSelectedKeys = checked ? users.map((user) => user.employee_number) : [];
        setSelectedRowKeys(newSelectedKeys);
    };

    const handleSelectRow = (employee_number, checked) => {
        const newSelectedKeys = checked
            ? [...selectedRowKeys, employee_number]
            : selectedRowKeys.filter((key) => key !== employee_number);
        setSelectedRowKeys(newSelectedKeys);
    };

    const columns = [
        {
            title: (
                <Checkbox
                    indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < users.length}
                    checked={selectedRowKeys.length === users.length && users.length > 0}
                    onChange={handleSelectAll}
                />
            ),
            dataIndex: 'checkbox',
            key: 'checkbox',
            render: (_, record) => {
                return (
                    <Checkbox
                        checked={selectedRowKeys.includes(record.employee_number)}
                        onChange={(e) => handleSelectRow(record.employee_number, e.target.checked)}
                    />
                );
            },
        },
        {
            title: '社員番号',
            dataIndex: 'employee_number',
            key: 'employee_number',
        },
        {
            title: 'メール',
            dataIndex: 'mail',
            key: 'mail',
        },
        {
            title: '名前',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '性別',
            dataIndex: 'sex',
            key: 'sex',
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={users}
            rowKey="employee_number"
            locale={{
                emptyText: 'データがありません。',
            }}
        />
    );
};

export default UserTable;
