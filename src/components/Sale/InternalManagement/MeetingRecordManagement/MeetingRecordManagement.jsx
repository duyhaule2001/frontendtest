import { Button, DatePicker, Descriptions, Spin, Tag, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import TitleCus from '../../../Common/Layout/TitleCus';
import { CheckOutlined, CloseOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { getMeetingRecord } from '../../../../services/sale.service';
import CreateMeeting from './CreateMeeting';
import UpdateMeeting from './UpdateMeeting';
import dayjs from 'dayjs';

const MeetingRecord = () => {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [listMeetings, setListMeetings] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openCreateModal, setOpenCreateModal] = useState(false);

    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

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
    const onChange = (date) => {
        setSelectedDate(date);
    };
    return (
        <>
            <TitleCus title={'会議記録'} />

            <div className="mt-10 px-28">
                <div className="flex items-center justify-between">
                    <DatePicker className="mb-5" onChange={onChange} value={selectedDate} picker="month" />
                    <div className="flex space-x-2">
                        <Button type="primary" onClick={() => setOpenCreateModal(true)}>
                            <PlusOutlined />
                            新規登録
                        </Button>
                        <Button type="primary" onClick={() => setSelectedDate(dayjs())}>
                            <ReloadOutlined />
                        </Button>
                    </div>
                </div>
                <Spin spinning={loading}>
                    {listMeetings.map((listMeeting) => (
                        <div className="mb-16 flex items-center space-x-5" key={listMeeting.id}>
                            <Descriptions style={{ width: '100%' }} labelStyle={{ width: '155px' }} bordered column={2}>
                                <Descriptions.Item label="日付" span={2}>
                                    <div className="flex items-center justify-between">
                                        {listMeeting.date}

                                        {listMeeting.managerApproval ||
                                        listMeeting.boardApproval ||
                                        listMeeting.vicePresidentApproval ||
                                        listMeeting.presidentApproval ? (
                                            <Tooltip
                                                placement="left"
                                                title={
                                                    <span className="whitespace-nowrap">
                                                        既に承認者がいるため、編集できません。
                                                    </span>
                                                }
                                            >
                                                <EditOutlined className="cursor-not-allowed text-blue-500 opacity-50" />
                                            </Tooltip>
                                        ) : (
                                            <EditOutlined
                                                onClick={() => {
                                                    setSelectedItem(listMeeting);
                                                    setOpenUpdateModal(true);
                                                }}
                                                className="text-[1rem] text-blue-500 hover:cursor-pointer"
                                            />
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
                                            部長&nbsp;
                                            {listMeeting.managerApproval ? (
                                                <CheckOutlined className="text-green-500 transition-transform duration-300 ease-in-out hover:scale-125" />
                                            ) : (
                                                <CloseOutlined className="text-red-500 transition-transform duration-300 ease-in-out hover:scale-125" />
                                            )}
                                        </span>
                                        <span className="flex items-center">
                                            役員&nbsp;
                                            {listMeeting.boardApproval ? (
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
                <CreateMeeting
                    openCreateModal={openCreateModal}
                    setOpenCreateModal={setOpenCreateModal}
                    selectedDate={selectedDate}
                    fetchListMeetings={fetchListMeetings}
                />
                <UpdateMeeting
                    openUpdateModal={openUpdateModal}
                    setOpenUpdateModal={setOpenUpdateModal}
                    selectedItem={selectedItem}
                    fetchListMeetings={fetchListMeetings}
                    selectedDate={selectedDate}
                />
            </div>
        </>
    );
};

export default MeetingRecord;
