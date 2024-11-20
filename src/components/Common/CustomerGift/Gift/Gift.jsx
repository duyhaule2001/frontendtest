import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, notification, Popconfirm, Table } from 'antd';
import CreateGift from './CreateGift';
import UpdateGift from './UpdateGift';
import ShowGift from './ShowGift';
import { deleteGift, getAllGift } from '../../../../services/sale.service';
import ImageCus from '../../Layout/ImageCus';

const Gift = ({ type }) => {
    const [loading, setLoading] = useState(false);
    const [giftData, setGiftData] = useState([]);
    const [createGiftOpen, setCreateGiftOpen] = useState(false);
    const [updateGiftOpen, setUpdateGiftOpen] = useState(false);
    const [selectedGift, setSelectedGift] = useState();
    const [showGiftOpen, setShowGiftOpen] = useState(false);
    const [selectedShowGift, setSelectedShowGift] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAllGift(type);
            if (res.data) {
                setGiftData(res.data);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [type]);

    const handleDelete = async (deleteId) => {
        const res = await deleteGift(deleteId);
        if (res.data) {
            fetchData();
            notification.success({
                message: '削除が成功しました。',
                style: {
                    width: 270,
                },
            });
        } else {
            notification.error({
                message: '削除が失敗しました。',
                style: {
                    width: 270,
                },
            });
        }
    };

    const columns = [
        {
            title: '注文日',
            align: 'center',
            dataIndex: 'orderDate',
        },
        {
            title: '担当者',
            align: 'center',
            dataIndex: 'contactName',
        },
        {
            title: <span className="flex items-center justify-center">会社名及び持参先名</span>,
            dataIndex: 'companyName',
            render: (text, record) => (
                <span
                    className="cursor-pointer text-blue-600"
                    onClick={() => {
                        setShowGiftOpen(true);
                        setSelectedShowGift(record);
                    }}
                >
                    {text}
                </span>
            ),
        },
        {
            title: <span className="flex items-center justify-center">氏名</span>,
            dataIndex: 'name',
        },
        {
            title: '商品写真',
            align: 'center',
            dataIndex: 'imageUrl',
            render: (imageUrl) => <ImageCus img_path={imageUrl} borderRadius={'50%'} />,
        },
        {
            title: <span className="flex items-center justify-center">商品名</span>,
            dataIndex: 'productName',
        },
        {
            title: '個数',
            align: 'center',
            dataIndex: 'quantity',
        },
        {
            title: '金額',
            align: 'center',
            dataIndex: 'amount',
            render: (amount) =>
                new Intl.NumberFormat('ja-JP', {
                    style: 'currency',
                    currency: 'JPY',
                }).format(amount),
        },

        {
            title: <span className="flex items-center justify-center">注文番号</span>,
            dataIndex: 'orderNumber',
        },
        {
            title: <span className="flex items-center justify-center">持参先の反応等</span>,
            dataIndex: 'reaction',
        },
        {
            title: <span className="flex items-center justify-center">備考</span>,
            dataIndex: 'remarks',
        },
        {
            title: '',
            align: 'center',
            key: 'action',
            width: 50,
            render: (record) => {
                return (
                    <div className="flex space-x-5">
                        <EditOutlined
                            onClick={() => {
                                setUpdateGiftOpen(true), setSelectedGift(record);
                            }}
                            className="text-blue-700"
                        />
                        <Popconfirm
                            title="確認"
                            placement="bottomRight"
                            description={`${record.productName} を削除してもよろしいですか？`}
                            okText="削除"
                            cancelText="キャンセル"
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
        <div className="px-8">
            <div className="flex justify-end">
                <span className="space-x-1">
                    <Button type="primary" onClick={() => setCreateGiftOpen(true)}>
                        <PlusOutlined />
                        新規登録
                    </Button>
                    <Button type="primary" onClick={() => fetchData()}>
                        <ReloadOutlined />
                    </Button>
                </span>
            </div>
            <div className="mt-5">
                <Table rowKey={'id'} loading={loading} columns={columns} dataSource={giftData} size="small" />
            </div>
            <CreateGift createGiftOpen={createGiftOpen} setCreateGiftOpen={setCreateGiftOpen} fetchData={fetchData} />
            <UpdateGift
                updateGiftOpen={updateGiftOpen}
                setUpdateGiftOpen={setUpdateGiftOpen}
                fetchData={fetchData}
                selectedGift={selectedGift}
            />
            <ShowGift showGiftOpen={showGiftOpen} setShowGiftOpen={setShowGiftOpen} giftData={selectedShowGift} />
        </div>
    );
};

export default Gift;
