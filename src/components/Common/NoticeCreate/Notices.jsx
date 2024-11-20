import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, DatePicker, notification, Popconfirm, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import CreateNotice from './CreateNotice';
import UpdateNotice from './UpdateNotice';
import TitleCus from '../Layout/TitleCus';
import { getAllNoticesAPI, deleteNoticeAPI } from '../../../services/hr.service';
import ListParticipationActivate from './ListParticipationActivate';

const Notices = () => {
    const [data, setData] = useState([]);
    const [createNotice, setCreateNotice] = useState(false);
    const [updateNotice, setUpdateNotice] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState();
    const [showList, setShowList] = useState(false);
    const [selectActivate, setSelectActivate] = useState();
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const fetchData = async (selectedDate) => {
        try {
            const year = dayjs(selectedDate).format('YYYY');
            const month = dayjs(selectedDate).format('MM');
            const res = await getAllNoticesAPI(year, month);
            if (res.data) {
                const sortedData = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setData(sortedData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData(selectedDate);
    }, [selectedDate]);

    const handleDelete = async (record) => {
        try {
            const res = await deleteNoticeAPI(record.id, record.type);
            if (res.data) {
                notification.success({
                    message: '削除が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                fetchData(selectedDate);
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

    const onChange = (date) => {
        setSelectedDate(date);
    };

    const mapTypeToText = (type) => {
        switch (type) {
            case 'activate':
                return '社内活動';
            case 'notice':
                return 'お知らせ';
            default:
                return '';
        }
    };

    const columns = [
        {
            title: '区分',
            dataIndex: 'type',
            width: 150,
            align: 'center',
            render: (text) => mapTypeToText(text),
            filters: [
                {
                    text: '社内活動',
                    value: 'activate',
                },
                {
                    text: 'お知らせ',
                    value: 'notice',
                },
            ],
            onFilter: (value, record) => record.type === value,
        },
        {
            title: '日付',
            dataIndex: 'date',
            align: 'center',
            width: 150,
        },
        {
            title: <span className="flex items-center justify-center">内容</span>,
            dataIndex: 'content',
            render: (text) => {
                return <span className="whitespace-pre-wrap">{text}</span>;
            },
        },
        {
            title: '',
            align: 'center',
            key: 'actionButton',
            width: 80,
            render: (record) => {
                return (
                    <>
                        {record.type === 'activate' && (
                            <Button
                                onClick={() => {
                                    setShowList(true), setSelectActivate(record);
                                }}
                            >
                                参加者リスト
                            </Button>
                        )}
                    </>
                );
            },
        },
        {
            title: '',
            key: 'action',
            width: 40,
            align: 'center',

            render: (record) => {
                return (
                    <div className="flex space-x-5">
                        <EditOutlined
                            onClick={() => {
                                setUpdateNotice(true), setSelectedNotice(record);
                            }}
                            className="text-blue-700"
                        />
                        <Popconfirm
                            title="確認"
                            placement="bottomRight"
                            description={`${record.date} を削除してもよろしいですか？`}
                            okText="削除"
                            cancelText="キャンセル"
                            onConfirm={() => handleDelete(record)}
                        >
                            <DeleteOutlined className="text-red-500" />
                        </Popconfirm>
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            <TitleCus title={'お知らせリスト'} />
            <div className="px-16 py-10">
                <div className="flex justify-between">
                    <span className="space-x-1">
                        <DatePicker picker="month" onChange={onChange} value={selectedDate} />
                    </span>
                    <span className="space-x-1">
                        <Button type="primary" onClick={() => setCreateNotice(true)}>
                            <PlusOutlined />
                            新規登録
                        </Button>
                        <Button type="primary" onClick={() => setSelectedDate(dayjs())}>
                            <ReloadOutlined />
                        </Button>
                    </span>
                </div>
                <div className="mt-5">
                    <Table
                        rowKey={'id'}
                        columns={columns}
                        dataSource={data}
                        locale={{
                            emptyText: 'データがありません。',
                        }}
                    />
                </div>
            </div>

            <CreateNotice
                setCreateNotice={setCreateNotice}
                createNotice={createNotice}
                fetchData={fetchData}
                selectedDate={selectedDate}
            />
            <UpdateNotice
                setUpdateNotice={setUpdateNotice}
                updateNotice={updateNotice}
                selectedNotice={selectedNotice}
                fetchData={fetchData}
            />
            <ListParticipationActivate showList={showList} setShowList={setShowList} selectActivate={selectActivate} />
        </div>
    );
};

export default Notices;
