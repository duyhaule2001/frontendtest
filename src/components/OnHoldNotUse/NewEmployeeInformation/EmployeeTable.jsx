import { Button, notification, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import ViewEmployeeDetail from './ViewEmployeeDetail';
import { getNewEmployee } from '../../../services/testapi';
//dbjson NewEmployeeInformation1

const EmployeeTable = () => {
    const [listEmployee, setListEmployee] = useState([]);

    const [openModalViewDetail, setOpenModalViewDetail] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState();

    useEffect(() => {
        fetchEmployee();
    }, []);

    const fetchEmployee = async () => {
        try {
            const res = await getNewEmployee();
            if (res.data) {
                setListEmployee(res.data);
            } else {
                setListEmployee([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            title: '氏名',
            render: (record) => {
                return (
                    <a
                        href="#"
                        onClick={() => {
                            setOpenModalViewDetail(true);
                            setSelectedEmployee(record);
                        }}
                        className="text-blue-700"
                    >
                        {record.Name}
                    </a>
                );
            },
        },
        {
            title: 'フリガナ',
            dataIndex: 'Furigana',
        },
        {
            title: '契約形態',
            dataIndex: 'ContractType',
        },
        {
            title: '所属',
            dataIndex: 'Department',
        },
        {
            title: '性別',
            dataIndex: 'Gender',
        },
        {
            title: '生年月日',
            dataIndex: 'DateOfBirth',
        },
        {
            title: '年齢',
            dataIndex: 'Age',
        },
        {
            title: '国籍',
            dataIndex: 'Nationality',
        },
        {
            title: '入社日',
            dataIndex: 'DateOfJoining',
        },
        {
            title: '',
            render: (record) => {
                return (
                    <div className="flex justify-between">
                        <EditOutlined className="text-blue-700" />
                        <DeleteOutlined className="text-red-500" />
                    </div>
                );
            },
        },
    ];
    return (
        <div className="p-10">
            <div className="mb-3 flex justify-end space-x-3">
                <div className="space-x-2">
                    <Button type="primary">
                        <PlusOutlined />
                        新規登録
                    </Button>
                    <Button type="primary">
                        <ReloadOutlined />
                    </Button>
                </div>
            </div>
            <Table
                dataSource={listEmployee}
                columns={columns}
                rowKey={'id'}
                locale={{
                    emptyText: 'データがありません。',
                }}
            />
            <ViewEmployeeDetail
                setOpenModalViewDetail={setOpenModalViewDetail}
                openModalViewDetail={openModalViewDetail}
                selectedEmployee={selectedEmployee}
            />
        </div>
    );
};

export default EmployeeTable;
