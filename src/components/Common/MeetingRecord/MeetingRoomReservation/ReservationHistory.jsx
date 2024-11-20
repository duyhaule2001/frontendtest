import { Button, Modal, notification, Popconfirm, Popover, Table } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { deleteReservation } from '../../../../services/common.service';

const ReservationHistory = ({ openHistory, setOpenHistory, reservationList, fetchData, selectedDate }) => {
    const handleDelete = async (id) => {
        try {
            const res = await deleteReservation(id);
            if (res.data) {
                notification.success({
                    message: 'キャンセルが成功しました。',
                    style: {
                        width: 310,
                    },
                });
                fetchData(selectedDate);
            }
        } catch (error) {
            console.log(error);
        }
    };

    //当日
    const sortedReservationList = reservationList
        ? [...reservationList].sort((a, b) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);

              if (dateA - dateB !== 0) {
                  return dateA - dateB;
              }

              const timeA = dayjs(a.start_time, 'HH:mm');
              const timeB = dayjs(b.start_time, 'HH:mm');
              return timeA - timeB;
          })
        : [];

    const columns = [
        {
            title: '日付',
            dataIndex: 'date',
            key: 'date',
            align: 'center',
            render: (text) => <span className="whitespace-nowrap">{text}</span>,
        },
        {
            title: <span className="whitespace-nowrap">予約時間</span>,
            align: 'center',
            render: (record) => (
                <span className="whitespace-nowrap">
                    {record.start_time} - {record.end_time}
                </span>
            ),
        },
        {
            title: <span className="whitespace-nowrap">ルーム</span>,
            dataIndex: 'meeting_room_no',
            key: 'meeting_room_no',
            align: 'center',
            render: (meeting_room_no) => {
                switch (meeting_room_no) {
                    case '1':
                        return '5F 会議室';
                    case '2':
                        return '5F 応接室';
                    case '3':
                        return '2F 右ルーム';
                    case '4':
                        return '2F 左ルーム';
                    default:
                        return `ルーム ${meeting_room_no}`;
                }
            },
        },
        {
            title: <span className="flex items-center justify-center whitespace-nowrap">タイトル</span>,
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: <span className="flex items-center justify-center whitespace-normal">内容</span>,
            dataIndex: 'content',
            key: 'content',
            render: (text) => (
                <Popover content={text} title="内容" placement="topLeft">
                    <span
                        className="block overflow-hidden text-ellipsis whitespace-nowrap"
                        style={{ maxWidth: '130px' }}
                    >
                        {text}
                    </span>
                </Popover>
            ),
        },
        {
            title: <span className="flex items-center justify-center whitespace-nowrap">備考</span>,
            dataIndex: 'other',
            key: 'other',
            render: (text) => (
                <Popover content={text} title="備考" placement="topLeft">
                    <span
                        className="block overflow-hidden text-ellipsis whitespace-nowrap"
                        style={{ maxWidth: '150px' }}
                    >
                        {text}
                    </span>
                </Popover>
            ),
        },
        {
            title: <span className="whitespace-nowrap">利用者</span>,
            dataIndex: 'appointments_name',
            key: 'appointments_name',
            align: 'center',
        },
        {
            title: <span className="whitespace-nowrap">種別</span>,
            dataIndex: 'type',
            key: 'type',
            align: 'center',
        },
        {
            title: '',
            align: 'center',
            render: (record) => (
                <Popconfirm
                    title="確認"
                    description={'予約をキャンセルでよろしいでしょうか'}
                    okText="はい"
                    cancelText="キャンセル"
                    onConfirm={() => handleDelete(record.id)}
                    placement="bottom"
                >
                    <Button danger>キャンセル</Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <>
            <Modal
                title="予約履歴"
                width={'75vw'}
                onCancel={() => setOpenHistory(false)}
                open={openHistory}
                footer={false}
            >
                <Table
                    dataSource={sortedReservationList}
                    columns={columns}
                    rowKey={'id'}
                    style={{ width: '100%' }}
                    className="w-full"
                    scroll={{ x: '100%' }}
                />
            </Modal>
        </>
    );
};

export default ReservationHistory;
