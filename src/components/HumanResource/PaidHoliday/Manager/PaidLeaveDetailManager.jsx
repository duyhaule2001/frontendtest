import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Drawer, notification, Popconfirm, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { deletePaidManagement, getPaidLeaveManagement } from '../../../../services/hr.service.js';
import ImageCus from '../../../Common/Layout/ImageCus.jsx';
import UpdatePaidLeaveManager from './UpdatePaidLeaveManager.jsx';
import CreatePaidLeaveManager from './CreatePaidLeaveManager.jsx';

const PaidLeaveDetailManager = ({ openManagerView, setOpenManagerView, selectedManager, fetchPaidLeaveManagement }) => {
    const [openCreate, setOpenCreate] = useState(false);
    const [updatePaidLeave, setUpdatePaidLeave] = useState();
    const [openModalUpdatePaidLeave, setOpenModalUpdatePaidLeave] = useState(false);
    const [paidLeaveData, setPaidLeaveData] = useState([]);

    useEffect(() => {
        if (selectedManager) {
            fetchData(selectedManager?.employeeNumber);
        }
    }, [selectedManager]);

    const fetchData = async (employeeNumber) => {
        const res = await getPaidLeaveManagement(employeeNumber);
        if (res?.data && Array.isArray(res.data)) {
            const sortedData = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setPaidLeaveData(sortedData);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await deletePaidManagement(id);
            if (res?.data) {
                notification.success({
                    message: '有給削除が成功しました。',
                    style: {
                        width: 310,
                    },
                });
                setOpenManagerView(false);
                fetchPaidLeaveManagement();
            } else {
                notification.error({
                    message: '有給削除が失敗しました。',
                    style: {
                        width: 310,
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            title: '日付',
            align: 'center',
            dataIndex: 'date',
        },
        {
            title: <span className="flex items-center justify-center">原因</span>,
            dataIndex: 'cause',
        },
        {
            title: '休暇時間',
            align: 'center',
            dataIndex: 'vacation_time',
        },
        {
            title: '添付ファイル',
            align: 'center',
            dataIndex: 'file',
            render: (file) => <ImageCus img_path={file} />,
        },

        {
            title: '',
            key: 'action',
            render: (record) => {
                return (
                    <div className="flex justify-center space-x-5">
                        <EditOutlined
                            onClick={() => {
                                setOpenModalUpdatePaidLeave(true);
                                setUpdatePaidLeave(record);
                            }}
                            className="text-blue-700"
                        />
                        <Popconfirm
                            placement="bottomRight"
                            title="確認"
                            okText="削除"
                            cancelText="キャンセル"
                            description={`${record.date}を削除してもよろしいですか？`}
                            onConfirm={() => handleDelete(record.id)}
                        >
                            <DeleteOutlined className="text-red-500" />
                        </Popconfirm>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <Drawer
                size="large"
                title={`管理者有給休暇情報: ${selectedManager?.name}`}
                maskClosable={true}
                onClose={() => setOpenManagerView(false)}
                open={openManagerView}
            >
                <>
                    <Button onClick={() => setOpenCreate(true)} type="primary" className="mb-3 flex">
                        <PlusOutlined />
                        新規登録
                    </Button>
                    <Table
                        pagination={false}
                        rowKey="id"
                        columns={columns}
                        dataSource={paidLeaveData}
                        locale={{
                            emptyText: 'データがありません。',
                        }}
                    />
                </>
                <CreatePaidLeaveManager
                    setOpenCreate={setOpenCreate}
                    openCreate={openCreate}
                    selectedManager={selectedManager}
                    fetchData={fetchData}
                    setOpenManagerView={setOpenManagerView}
                    fetchPaidLeaveManagement={fetchPaidLeaveManagement}
                />
                <UpdatePaidLeaveManager
                    setOpenModalUpdatePaidLeave={setOpenModalUpdatePaidLeave}
                    updatePaidLeave={updatePaidLeave}
                    openModalUpdatePaidLeave={openModalUpdatePaidLeave}
                    selectedManager={selectedManager}
                    fetchData={fetchData}
                    setOpenManagerView={setOpenManagerView}
                    fetchPaidLeaveManagement={fetchPaidLeaveManagement}
                />
            </Drawer>
        </>
    );
};

export default PaidLeaveDetailManager;
