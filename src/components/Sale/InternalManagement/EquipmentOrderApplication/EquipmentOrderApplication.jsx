import React, { useEffect, useState } from 'react';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, notification, Popconfirm, Table } from 'antd';
import dayjs from 'dayjs';
import CreateEquipment from './CreateEquipment';
import UpdateEquipment from './UpdateEquipment';
import { deleteEquipmentOrder, getAllEquipmentOrders } from '../../../../services/common.service';
import TitleCus from '../../../Common/Layout/TitleCus';
import ViewEquipmentOrder from '../../../GeneralAffairs/EquipmentApplicationApprovalGAD/ViewEquipmentOrder';
import ImageCus from '../../../Common/Layout/ImageCus';

const EquipmentOrder = () => {
    const [equipmentData, setEquipmentData] = useState([]);
    const [createEquipment, setCreateEquipment] = useState(false);
    const [updateEquipmentOpen, setUpdateEquipmentOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState();
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedEquipmentOrder, setSelectedEquipmentOrder] = useState(null);
    const [date, setDate] = useState(dayjs());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData(date);
    }, [date]);

    const fetchData = async (date) => {
        setLoading(true);
        try {
            const year = dayjs(date).format('YYYY');
            const month = dayjs(date).format('MM');
            const res = await getAllEquipmentOrders(year, month);
            if (res.data) {
                setEquipmentData(res.data);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const onChange = (date) => {
        setDate(date);
    };

    const handleDelete = async (deleteId) => {
        try {
            const res = await deleteEquipmentOrder(deleteId);
            if (res.data) {
                const updatedData = equipmentData.filter((item) => item.id !== deleteId);
                setEquipmentData(updatedData);
                notification.success({
                    message: '削除が成功しました。',
                    style: {
                        width: 270,
                    },
                });
            } else {
                notification.error({
                    message: '削除が失敗しました。',
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            title: '申請日付',
            dataIndex: 'createdDate',
            width: 120,
            align: 'center',
            render: (createdDate) => dayjs(createdDate).format('YYYY-MM-DD'),
        },
        {
            title: <span className="flex items-center justify-center">申請備品</span>,
            dataIndex: 'equipmentName',
            render: (text, record) => {
                return (
                    <span
                        onClick={() => {
                            setOpenViewModal(true);
                            setSelectedEquipmentOrder(record);
                        }}
                        className="block w-full cursor-pointer text-blue-500"
                    >
                        {text}
                    </span>
                );
            },
        },
        {
            title: '数量',
            align: 'center',
            dataIndex: 'quantity',
        },
        {
            title: '単位',
            align: 'center',
            dataIndex: 'unit',
        },
        {
            title: <span className="flex items-center justify-center">申請者名</span>,
            dataIndex: 'applicantName',
        },
        {
            title: <span className="flex items-center justify-center">商品URL</span>,
            dataIndex: 'productURL',
            width: 300,
            ellipsis: true,
            render: (text) => (
                <a href={text} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                    {text}
                </a>
            ),
        },
        {
            title: '画像',
            align: 'center',
            dataIndex: 'imageUrl',
            render: (imageUrl) => <ImageCus img_path={imageUrl} borderRadius={'50%'} />,
        },
        {
            title: '価格',
            align: 'center',
            dataIndex: 'price',
            render: (price) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(price),
        },
        {
            title: '承認',
            align: 'center',
            dataIndex: 'approverStatus',
            render: (approverStatus) =>
                approverStatus ? (
                    <CheckCircleOutlined style={{ color: 'green' }} />
                ) : (
                    <CloseCircleOutlined style={{ color: 'red' }} />
                ),
        },
        {
            title: '注文',
            align: 'center',
            dataIndex: 'orderStatus',
            render: (orderStatus) =>
                orderStatus ? (
                    <CheckCircleOutlined style={{ color: 'green' }} />
                ) : (
                    <CloseCircleOutlined style={{ color: 'red' }} />
                ),
        },
        {
            title: '到着',
            align: 'center',
            dataIndex: 'deliveryStatus',
            render: (deliveryStatus) =>
                deliveryStatus ? (
                    <CheckCircleOutlined style={{ color: 'green' }} />
                ) : (
                    <CloseCircleOutlined style={{ color: 'red' }} />
                ),
        },
        {
            title: '',
            align: 'center',
            key: 'action',
            width: 80,
            render: (record) => {
                const isDisabled =
                    record.approverStatus === true || record.orderStatus === true || record.deliveryStatus === true;

                return (
                    <div className="flex space-x-4">
                        <EditOutlined
                            onClick={
                                !isDisabled
                                    ? () => {
                                          setUpdateEquipmentOpen(true);
                                          setSelectedEquipment(record);
                                      }
                                    : null
                            }
                            className={isDisabled ? 'cursor-not-allowed text-gray-400' : 'text-blue-700'}
                            style={{ pointerEvents: isDisabled ? 'none' : 'auto' }}
                        />
                        <Popconfirm
                            title="確認"
                            description={`${record.equipmentName} のご注文をキャンセルしてもよろしいですか？`}
                            placement="bottomRight"
                            okText="削除"
                            cancelText="キャンセル"
                            onConfirm={!isDisabled ? () => handleDelete(record.id) : null}
                            disabled={isDisabled}
                        >
                            <DeleteOutlined
                                className={isDisabled ? 'cursor-not-allowed text-gray-400' : 'text-red-500'}
                                style={{ pointerEvents: isDisabled ? 'none' : 'auto' }}
                            />
                        </Popconfirm>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <TitleCus title={'社用備品注文申請'} />
            <div className="px-8 py-10">
                <div className="mb-3 flex items-center justify-between">
                    <DatePicker picker="month" value={date} onChange={onChange} />
                    <span className="space-x-1">
                        <Button type="primary" onClick={() => setCreateEquipment(true)}>
                            <PlusOutlined />
                            新規登録
                        </Button>
                        <Button type="primary" onClick={() => setDate(dayjs())}>
                            <ReloadOutlined />
                        </Button>
                    </span>
                </div>
                <Table rowKey={'id'} loading={loading} columns={columns} dataSource={equipmentData} size="small" />
                <CreateEquipment
                    setCreateEquipment={setCreateEquipment}
                    createEquipment={createEquipment}
                    fetchData={fetchData}
                    date={date}
                />
                <UpdateEquipment
                    setUpdateEquipmentOpen={setUpdateEquipmentOpen}
                    updateEquipmentOpen={updateEquipmentOpen}
                    fetchData={fetchData}
                    selectedEquipment={selectedEquipment}
                    date={date}
                />
                <ViewEquipmentOrder
                    openViewModal={openViewModal}
                    setOpenViewModal={setOpenViewModal}
                    selectedOrder={selectedEquipmentOrder}
                />
            </div>
        </>
    );
};

export default EquipmentOrder;
