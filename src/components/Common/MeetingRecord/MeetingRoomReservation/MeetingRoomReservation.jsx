import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { getReservation } from '../../../../services/common.service';
import TitleCus from '../../Layout/TitleCus';
import { Button, DatePicker, Spin, Descriptions, Popover } from 'antd';
import ReservationForm from './ReservationForm';
import { FileDoneOutlined, HistoryOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import ReservationHistory from './ReservationHistory';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(advancedFormat);

const MeetingRoomReservation = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [openHistory, setOpenHistory] = useState(false);
    const [reservationList, setReservationList] = useState([]);

    useEffect(() => {
        fetchData(selectedDate);
    }, [selectedDate]);

    const fetchData = async (date) => {
        setLoading(true);
        try {
            const res = await getReservation(dayjs(date).format('YYYY-MM-DD'));
            if (res?.data) {
                if (Array.isArray(res.data.appointmentsTable)) {
                    setAppointments(res.data.appointmentsTable);
                } else {
                    setAppointments([]);
                }

                if (Array.isArray(res.data.history)) {
                    setReservationList(res.data.history);
                } else {
                    setReservationList([]);
                }
            } else {
                setAppointments([]);
            }
        } catch (error) {
            console.log('データの取得に失敗しました。', error);
            setAppointments([]);
        }
        setLoading(false);
    };

    const onChange = (date) => {
        setSelectedDate(date);
    };

    const getRoomName = (roomNo) => {
        switch (roomNo) {
            case 1:
                return '5F 会議室';
            case 2:
                return '5F 応接室';
            case 3:
                return '2F 右ルーム';
            case 4:
                return '2F 左ルーム';
            default:
                return `ルーム ${roomNo}`;
        }
    };

    const renderBookingSlot = (startTime, endTime, name, type, title, content, create_by, other) => {
        const start = dayjs(startTime, 'HH:mm');
        const end = dayjs(endTime, 'HH:mm');
        const durationInMinutes = end.diff(start, 'minute');

        const widthPercentage = (durationInMinutes / 60) * 100;
        const startOfHour = start.startOf('hour');
        const minutesFromStartOfHour = start.diff(startOfHour, 'minute');
        const leftPercentage = (minutesFromStartOfHour / 60) * 100;

        let bgColor;
        switch (type) {
            case '来客':
                bgColor = 'bg-red-500';
                break;
            case '社内':
                bgColor = 'bg-yellow-400';
                break;
            case 'オンライン':
                bgColor = 'bg-cyan-500';
                break;
            default:
                bgColor = 'bg-blue-500';
        }

        const tooltipContent = (
            <Descriptions
                labelStyle={{
                    width: '90px',
                }}
                column={2}
                size="small"
                className="w-[400px]"
                bordered
            >
                <Descriptions.Item label="利用者">{name}</Descriptions.Item>
                <Descriptions.Item label="タイトル">{title}</Descriptions.Item>
                <Descriptions.Item label="内容">{content}</Descriptions.Item>
                <Descriptions.Item label="種別">{type}</Descriptions.Item>
                <Descriptions.Item label="作成者">{create_by}</Descriptions.Item>
                <Descriptions.Item label="備考">{other}</Descriptions.Item>
                <Descriptions.Item label="開始時間">{startTime}</Descriptions.Item>
                <Descriptions.Item label={<span>終了時間</span>}>{endTime}</Descriptions.Item>
            </Descriptions>
        );

        return (
            <Popover content={tooltipContent} title="予約詳細" trigger="hover">
                <div
                    className={`absolute top-1/2 flex -translate-y-1/2 transform items-center justify-center rounded p-2 text-xs font-semibold text-white ${bgColor}`}
                    style={{
                        width: `${widthPercentage}%`,
                        minWidth: '20px',
                        left: `${leftPercentage}%`,
                        height: '60%',
                        zIndex: 1,
                    }}
                >
                    <span className="text-center">
                        {name.length <= 3 ? '...' : `${name}`} <br /> {startTime}-{endTime}
                    </span>
                </div>
            </Popover>
        );
    };

    return (
        <>
            <TitleCus title={'会議室予約'} />

            <div className="p-5">
                <div className="flex items-center justify-between">
                    <div className="my-5 flex space-x-2">
                        <LeftOutlined
                            className="text-[1.25rem]"
                            onClick={() => setSelectedDate(dayjs(selectedDate).subtract(1, 'day'))}
                        />
                        <DatePicker onChange={onChange} value={selectedDate} />
                        <RightOutlined
                            className="text-[1.25rem]"
                            onClick={() => setSelectedDate(dayjs(selectedDate).add(1, 'day'))}
                        />
                    </div>
                    <div className="space-x-3">
                        {(selectedDate.isSame(dayjs(), 'day') || selectedDate.isAfter(dayjs())) && (
                            <Button
                                type="primary"
                                onClick={() => {
                                    setIsModalVisible(true);
                                }}
                            >
                                <FileDoneOutlined />
                                予約登録
                            </Button>
                        )}
                        <Button onClick={() => setOpenHistory(true)}>
                            <HistoryOutlined />
                            予約履歴
                        </Button>
                    </div>
                </div>
                <Spin spinning={loading}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border bg-gray-100 p-2 text-center">ルーム</th>
                                    {[...Array(12).keys()].map((i) => (
                                        <th key={i} className="border bg-gray-100 p-2 text-center">
                                            {`${9 + i}:00`}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((room, index) => (
                                    <tr key={index}>
                                        <td className="border p-2 text-center">{getRoomName(room.meeting_room_no)}</td>
                                        {[...Array(12).keys()].map((hourIndex) => {
                                            const booking = room.bookings.find(
                                                (booking) =>
                                                    dayjs(booking.start_time, 'HH:mm').hour() === 9 + hourIndex,
                                            );

                                            if (
                                                booking &&
                                                dayjs(booking.start_time, 'HH:mm').hour() === 9 + hourIndex
                                            ) {
                                                return (
                                                    <td key={hourIndex} className="relative h-16 border p-0">
                                                        {renderBookingSlot(
                                                            booking.start_time,
                                                            booking.end_time,
                                                            booking.appointments_name,
                                                            booking.type,
                                                            booking.title,
                                                            booking.content,
                                                            booking.create_by,
                                                            booking.other,
                                                        )}
                                                    </td>
                                                );
                                            } else {
                                                return <td key={hourIndex} className="relative h-16 border p-0"></td>;
                                            }
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Spin>
            </div>

            <ReservationForm
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                fetchData={fetchData}
                selectedDate={selectedDate}
            />
            <ReservationHistory
                openHistory={openHistory}
                setOpenHistory={setOpenHistory}
                reservationList={reservationList}
                fetchData={fetchData}
                selectedDate={selectedDate}
            />
        </>
    );
};

export default MeetingRoomReservation;
