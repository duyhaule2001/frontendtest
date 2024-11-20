import { Button, DatePicker, notification, Popconfirm, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import TitleCus from '../../Common/Layout/TitleCus';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import CreateProgress from './CreateProgress';
import { deleteProgress, getProgressList } from '../../../services/sale.service';
import UpdateProgress from './UpdateProgress';
import ProgressDetail from './ProgressDetail';
import dayjs from 'dayjs';

const TableProgressManagement = () => {
    const [listProgress, setListProgress] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModalCreate, setOpenModalCreate] = useState(false);

    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [openModalDetail, setOpenModalDetail] = useState(false);
    const [itemDetail, setItemDetail] = useState(null);

    const [selectedDate, setSelectedDate] = useState(dayjs());

    useEffect(() => {
        fetchData(selectedDate);
    }, [selectedDate]);

    const fetchData = async (date) => {
        setLoading(true);
        try {
            const res = await getProgressList(dayjs(date).format('YYYY-MM'));
            if (res?.data) {
                setListProgress(res?.data);
            } else {
                setListProgress([]);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        try {
            const res = await deleteProgress(id);
            if (res.data) {
                notification.success({
                    message: '削除が成功しました。',
                    style: {
                        width: 270,
                    },
                });
            }
            await fetchData(selectedDate);
        } catch (error) {
            console.log(error);
        }
    };

    const onChange = (date) => {
        setSelectedDate(date);
    };

    const columns = [
        {
            title: '日付',
            dataIndex: 'register_date',
            align: 'center',
            render: (text) => <span className="whitespace-nowrap">{text}</span>,
        },
        {
            title: <span className="flex items-center justify-center">商談名</span>,
            dataIndex: 'negotiation_name',
        },
        {
            title: <span className="flex items-center justify-center">会社名</span>,
            dataIndex: 'company_name',
        },
        {
            title: <span className="flex items-center justify-center">相談金額</span>,
            dataIndex: 'negotiation_amount',
            align: 'center',
            render: (text) => (
                <span>{text ? text.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' }) : '-'}</span>
            ),
        },
        {
            title: <span className="flex items-center justify-center">受注見込期間</span>,
            dataIndex: 'expected_order_period',
            align: 'center',
        },
        {
            title: <span className="flex items-center justify-center">商談状況</span>,
            dataIndex: 'negotiation_status',
            align: 'center',
        },
        {
            title: '',
            render: (text, record) => (
                <span
                    className="flex items-center justify-center text-blue-500 hover:cursor-pointer"
                    onClick={() => {
                        setOpenModalDetail(true);
                        setItemDetail(record);
                    }}
                >
                    詳細
                </span>
            ),
        },
        {
            title: '',
            render: (record) => {
                return (
                    <div className="flex items-center justify-center space-x-3">
                        <EditOutlined
                            className="text-blue-700"
                            onClick={() => {
                                setOpenModalUpdate(true);
                                setSelectedItem(record);
                            }}
                        />
                        <Popconfirm
                            title="確認"
                            description="削除してもよろしいですか？"
                            okText="削除"
                            cancelText="キャンセル"
                            placement="bottomRight"
                            onConfirm={() => handleDelete(record.id)}
                        >
                            <DeleteOutlined className="text-red-500" />
                        </Popconfirm>
                    </div>
                );
            },
            width: 70,
        },
    ];

    return (
        <>
            <TitleCus title={'進捗管理'} />
            <div className="p-10">
                <div className="mb-3 flex justify-between">
                    <DatePicker onChange={onChange} picker="month" value={selectedDate} />
                    <Button type="primary" onClick={() => setOpenModalCreate(true)}>
                        <PlusCircleOutlined />
                        新規登録
                    </Button>
                </div>
                <Table dataSource={listProgress} columns={columns} size="small" loading={loading} rowKey={'id'} />
            </div>
            <CreateProgress
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                selectedDate={selectedDate}
                fetchData={fetchData}
            />
            <UpdateProgress
                selectedDate={selectedDate}
                fetchData={fetchData}
                selectedItem={selectedItem}
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
            />
            <ProgressDetail
                openModalDetail={openModalDetail}
                setOpenModalDetail={setOpenModalDetail}
                itemDetail={itemDetail}
            />
        </>
    );
};

export default TableProgressManagement;
