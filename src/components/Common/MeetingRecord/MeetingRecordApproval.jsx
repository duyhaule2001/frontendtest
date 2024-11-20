import { Button, DatePicker, Descriptions, notification, Popconfirm, Spin, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import TitleCus from '../Layout/TitleCus';
import { CheckOutlined, CloseOutlined, ReloadOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { approvalMeetingRecord, getMeetingRecord } from '../../../services/sale.service';

const MeetingRecordApproval = () => {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [listMeetings, setListMeetings] = useState([]);
    const [loading, setLoading] = useState(false);
    const currentRole = useSelector((state) => state.account.user.managerial_position);

    useEffect(() => {
        fetchListMeetings(selectedDate);
    }, [selectedDate]);

    const fetchListMeetings = async (selectedDate) => {
        setLoading(true);
        try {
            const year = selectedDate.format('YYYY');
            const month = selectedDate.format('MM');

            const res = await getMeetingRecord(year, month);
            if (res?.data) {
                setListMeetings(res?.data);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleApproval = async (id) => {
        try {
            const res = await approvalMeetingRecord(id);
            if (res.data) {
                notification.success({
                    message: '承認が成功しました。',
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

    const onChange = (date) => {
        setSelectedDate(date);
    };

    //button 表示するかの確認
    const shouldShowApprovalButton = (listMeeting) => {
        switch (currentRole) {
            case '役員':
                return !listMeeting.boardApproval;
            case '部長':
                return !listMeeting.managerApproval;
            case '副社長':
                return !listMeeting.vicePresidentApproval;
            case '社長':
                return !listMeeting.presidentApproval;
            default:
                return false;
        }
    };

    return (
        <>
            <TitleCus title={'会議記録承認'} />

            <div className="mt-10 px-28">
                <div className="flex items-center justify-between">
                    <DatePicker className="mb-5" onChange={onChange} picker="month" value={selectedDate} />
                    <Button type="primary" onClick={() => setSelectedDate(dayjs())}>
                        <ReloadOutlined />
                    </Button>
                </div>
                <Spin spinning={loading}>
                    {listMeetings.map((listMeeting) => (
                        <div className="mb-16 flex items-center space-x-5" key={listMeeting.id}>
                            <Descriptions style={{ width: '100%' }} labelStyle={{ width: '155px' }} bordered column={2}>
                                <Descriptions.Item label="日付" span={2}>
                                    <div className="flex items-center justify-between">
                                        {listMeeting.date}
                                        {shouldShowApprovalButton(listMeeting) && (
                                            <Popconfirm
                                                title="確認"
                                                okText="承認"
                                                cancelText="キャンセル"
                                                placement="bottom"
                                                description="この会議記録を承認しますか？"
                                                onConfirm={() => handleApproval(listMeeting.id)}
                                            >
                                                <Button type="primary">承認</Button>
                                            </Popconfirm>
                                        )}
                                    </div>
                                </Descriptions.Item>

                                <Descriptions.Item label="主義テーマ" span={1}>
                                    {listMeeting.topic}
                                </Descriptions.Item>
                                <Descriptions.Item label="会議場所" span={1}>
                                    {listMeeting.location}
                                </Descriptions.Item>

                                <Descriptions.Item label="会議主題" span={1}>
                                    {listMeeting.subject}
                                </Descriptions.Item>
                                <Descriptions.Item label="会議目的" span={1}>
                                    {listMeeting.reason}
                                </Descriptions.Item>

                                <Descriptions.Item label="参加人員" span={2}>
                                    {listMeeting.attendees?.map((name, index) => (
                                        <span key={index}>
                                            <Tag>{name}</Tag>
                                        </span>
                                    ))}
                                </Descriptions.Item>
                                <Descriptions.Item label="欠席人員" span={2}>
                                    {listMeeting.absentees?.map((name, index) => (
                                        <span key={index}>
                                            <Tag>{name}</Tag>
                                        </span>
                                    ))}
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label="会議内容"
                                    span={2}
                                    contentStyle={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                                >
                                    {listMeeting.content}
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label="部門向け共通事項"
                                    span={2}
                                    contentStyle={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                                >
                                    {listMeeting.departmentNotes}
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label="全社共通事項"
                                    span={2}
                                    contentStyle={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                                >
                                    {listMeeting.companyNotes}
                                </Descriptions.Item>
                                <Descriptions.Item label="承認状態" span={2}>
                                    <div className="flex space-x-10">
                                        <span className="flex items-center">
                                            役員&nbsp;
                                            {listMeeting.boardApproval ? (
                                                <CheckOutlined className="text-green-500 transition-transform duration-300 ease-in-out hover:scale-125" />
                                            ) : (
                                                <CloseOutlined className="text-red-500 transition-transform duration-300 ease-in-out hover:scale-125" />
                                            )}
                                        </span>
                                        <span className="flex items-center">
                                            部長&nbsp;
                                            {listMeeting.managerApproval ? (
                                                <CheckOutlined className="text-green-500 transition-transform duration-300 ease-in-out hover:scale-125" />
                                            ) : (
                                                <CloseOutlined className="text-red-500 transition-transform duration-300 ease-in-out hover:scale-125" />
                                            )}
                                        </span>

                                        <span className="flex items-center">
                                            副社長&nbsp;
                                            {listMeeting.vicePresidentApproval ? (
                                                <CheckOutlined className="text-green-500 transition-transform duration-300 ease-in-out hover:scale-125" />
                                            ) : (
                                                <CloseOutlined className="text-red-500 transition-transform duration-300 ease-in-out hover:scale-125" />
                                            )}
                                        </span>

                                        <span className="flex items-center">
                                            社長&nbsp;
                                            {listMeeting.presidentApproval ? (
                                                <CheckOutlined className="text-green-500 transition-transform duration-300 ease-in-out hover:scale-125" />
                                            ) : (
                                                <CloseOutlined className="text-red-500 transition-transform duration-300 ease-in-out hover:scale-125" />
                                            )}
                                        </span>
                                    </div>
                                </Descriptions.Item>
                            </Descriptions>
                        </div>
                    ))}
                </Spin>
            </div>
        </>
    );
};

export default MeetingRecordApproval;
