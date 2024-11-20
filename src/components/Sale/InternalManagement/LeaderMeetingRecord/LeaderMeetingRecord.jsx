import React, { useEffect, useState } from 'react';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Descriptions, notification, Popconfirm, Spin, Tag } from 'antd';
import dayjs from 'dayjs';

import CreateMeetingRecordLeader from './CreateMeetingRecordLeader';
import TitleCus from '../../../Common/Layout/TitleCus';
import { deleteLeaderMeetingRecord, getLeaderMeetingRecord } from '../../../../services/sale.service';

const monthsInJapanese = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

const LeaderMeetingRecords = () => {
    const [loading, setLoading] = useState(false);
    const [openModalCreate, setOpenModalCreate] = useState(false);

    const [selectedDate, setSelectedDate] = useState(dayjs());

    const [listMeetings, setListMeetings] = useState([]);

    useEffect(() => {
        fetchListMeetings(selectedDate);
    }, [selectedDate]);

    const fetchListMeetings = async (selectedDate) => {
        setLoading(true);
        try {
            const formattedDate = selectedDate ? dayjs(selectedDate).format('YYYY-MM') : null;
            const res = await getLeaderMeetingRecord(formattedDate);
            if (res.data && Array.isArray(res.data)) {
                setListMeetings(res.data);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const onChange = (date) => {
        setSelectedDate(date);
    };

    const monthCellRender = (date) => {
        const month = date.month();
        return <div>{monthsInJapanese[month]}</div>;
    };

    const handleDelete = async (data) => {
        try {
            const res = await deleteLeaderMeetingRecord(data.attendees, data.absentees, data.date);
            if (res.data) {
                notification.success({
                    message: '削除が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                fetchListMeetings(selectedDate);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <TitleCus title={'リーダー会議記録登録'} />
            <Spin spinning={loading}>
                <div className="relative mt-10 flex flex-col px-28">
                    <div className="mb-5 flex items-center justify-between">
                        <DatePicker
                            onChange={onChange}
                            defaultValue={selectedDate}
                            picker="month"
                            cellRender={monthCellRender}
                        />
                        <Button
                            onClick={() => {
                                setOpenModalCreate(true);
                            }}
                            type="primary"
                        >
                            <PlusOutlined />
                            新規登録
                        </Button>
                    </div>
                    {listMeetings &&
                        listMeetings.map((listMeeting) => (
                            <div className="mb-10" key={listMeeting.id}>
                                <div>
                                    <Descriptions
                                        labelStyle={{ width: '7.5rem' }}
                                        contentStyle={{ width: '25rem' }}
                                        bordered
                                        column={2}
                                    >
                                        <Descriptions.Item label="日付" span={2}>
                                            <div className="flex items-center justify-between">
                                                {listMeeting.date}
                                                <Popconfirm
                                                    title="確認"
                                                    placement="bottom"
                                                    description="削除してもよろしいですか？"
                                                    okText="削除"
                                                    cancelText="キャンセル"
                                                    onConfirm={() => handleDelete(listMeeting)}
                                                >
                                                    <DeleteOutlined className="text-[1rem] text-red-500" />
                                                </Popconfirm>
                                            </div>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="司会" span={2}>
                                            {listMeeting.chairmanship}
                                        </Descriptions.Item>

                                        <Descriptions.Item label="参加人員" span={1}>
                                            {listMeeting.attendees?.map((name, index) => (
                                                <span key={index}>
                                                    <Tag>{name}</Tag>
                                                </span>
                                            ))}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="欠席人員" span={1}>
                                            {listMeeting.absentees?.map((name, index) => (
                                                <span key={index}>
                                                    <Tag>{name}</Tag>
                                                </span>
                                            ))}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="内容" span={2}>
                                            <Descriptions
                                                labelStyle={{ width: '7.5rem' }}
                                                contentStyle={{ width: '25rem' }}
                                                bordered
                                                column={1}
                                            >
                                                {Array.isArray(listMeeting.leaderReports) &&
                                                    listMeeting.leaderReports.map((leaderReport, index) => (
                                                        <Descriptions.Item
                                                            label={leaderReport.leaderName}
                                                            span={1}
                                                            key={index}
                                                            labelStyle={{ width: '2rem' }}
                                                        >
                                                            <span className="whitespace-pre-line">
                                                                {leaderReport.content}
                                                            </span>
                                                        </Descriptions.Item>
                                                    ))}
                                            </Descriptions>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </div>
                            </div>
                        ))}
                </div>
            </Spin>

            <CreateMeetingRecordLeader
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                fetchListMeetings={fetchListMeetings}
                selectedDate={selectedDate}
            />
        </>
    );
};

export default LeaderMeetingRecords;
