import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Drawer, notification, Popconfirm, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import CreateTechPaidLeave from './CreateTechPaidLeave';
import UpdateTechPaidLeave from './UpdateTechPaidLeave';
import { deletePaidTech, getPaidLeaveTech } from '../../../../services/hr.service';
import ImageCus from '../../../Common/Layout/ImageCus';

const PaidLeaveDetailTech = ({ openTechView, setOpenTechView, selectedTech, fetchPaidLeaveManagement }) => {
    const [openCreateTechPaid, setOpenCreateTechPaid] = useState(false);

    const [openModalUpdateTechPaid, setOpenModalUpdateTechPaid] = useState(false);
    const [updateTechPaidLeave, setUpdateTechPaidLeave] = useState(null);
    const [paidLeaveData, setPaidLeaveData] = useState([]);

    useEffect(() => {
        if (selectedTech) {
            fetchData(selectedTech?.employeeNumber);
        }
    }, [selectedTech]);

    const fetchData = async (employeeNumber) => {
        const res = await getPaidLeaveTech(employeeNumber);
        if (res?.data) {
            const sortedData = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setPaidLeaveData(sortedData);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await deletePaidTech(id);
            if (res?.data) {
                notification.success({
                    message: '削除が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setOpenTechView(false);
                fetchPaidLeaveManagement();
            } else {
                notification.error({
                    message: '削除が失敗しました。',
                    style: {
                        width: 270,
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
                    <div className="flex space-x-5">
                        <EditOutlined
                            onClick={() => {
                                setOpenModalUpdateTechPaid(true);
                                setUpdateTechPaidLeave(record);
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
                title={`技術者有給休暇情報: ${selectedTech?.name}`}
                maskClosable={true}
                onClose={() => setOpenTechView(false)}
                open={openTechView}
            >
                <>
                    <Button onClick={() => setOpenCreateTechPaid(true)} type="primary" className="mb-3 flex">
                        <PlusOutlined />
                        新規登録
                    </Button>
                    <Table
                        columns={columns}
                        dataSource={paidLeaveData}
                        locale={{
                            emptyText: 'データがありません。',
                        }}
                        rowKey="id"
                    />

                    <CreateTechPaidLeave
                        setOpenCreateTechPaid={setOpenCreateTechPaid}
                        openCreateTechPaid={openCreateTechPaid}
                        selectedTech={selectedTech}
                        fetchData={fetchData}
                        setOpenTechView={setOpenTechView}
                        fetchPaidLeaveManagement={fetchPaidLeaveManagement}
                    />

                    <UpdateTechPaidLeave
                        setOpenModalUpdateTechPaid={setOpenModalUpdateTechPaid}
                        updateTechPaidLeave={updateTechPaidLeave}
                        openModalUpdateTechPaid={openModalUpdateTechPaid}
                        selectedTech={selectedTech}
                        fetchData={fetchData}
                        setOpenTechView={setOpenTechView}
                        fetchPaidLeaveManagement={fetchPaidLeaveManagement}
                    />
                </>
            </Drawer>
        </>
    );
};

export default PaidLeaveDetailTech;
