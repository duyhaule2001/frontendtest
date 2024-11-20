import React, { useEffect, useState } from 'react';
import { Button, Col, DatePicker, notification, Popconfirm, Row, Spin } from 'antd';
import dayjs from 'dayjs';
import { getCompanyActivities, submitApplyActivate } from '../../services/employee.service';
import TitleCus from '../Common/Layout/TitleCus';
import { ReloadOutlined } from '@ant-design/icons';

const CompanyActivitie = () => {
    const [events, setEvents] = useState([]);
    const [yearMonth, setYearMonth] = useState(dayjs());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getEvents(yearMonth);
    }, [yearMonth]);

    const getEvents = async (yearMonth) => {
        setLoading(true);
        try {
            const year = yearMonth.year();
            const month = yearMonth.month() + 1;
            const res = await getCompanyActivities(year, month);
            if (res.data) {
                // Thêm trạng thái animation ban đầu
                const sortedEvents = res.data
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((event) => ({ ...event, animationClass: '' }));
                setEvents(sortedEvents);

                // Áp dụng hiệu ứng animation tuần tự
                sortedEvents.forEach((event, index) => {
                    setTimeout(() => {
                        setEvents((prev) =>
                            prev.map((e) => (e.id === event.id ? { ...e, animationClass: 'animate-fadeInUp' } : e)),
                        );
                    }, index * 200); // Độ trễ giữa các mục
                });
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleApply = async (id) => {
        try {
            const res = await submitApplyActivate(id);
            if (res.data) {
                notification.success({
                    message: res.data.message,
                    style: {
                        width: 300,
                    },
                });
                getEvents(yearMonth);
            } else {
                notification.error({
                    message: res.error,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex h-full w-full flex-col items-center">
            <TitleCus title={'社内活動'} />
            <Row className="w-full justify-center">
                <Col sm={16} xs={20}>
                    <div className="flex items-center justify-between">
                        <DatePicker
                            picker="month"
                            placeholder="年月"
                            format="YYYY-MM"
                            value={yearMonth}
                            onChange={(date) => {
                                setYearMonth(date);
                            }}
                            className="mb-5 mt-10"
                        />
                        <Button type="primary" onClick={() => setYearMonth(dayjs())}>
                            <ReloadOutlined />
                        </Button>
                    </div>
                    <Spin spinning={loading}>
                        {events.map((event) => {
                            const isPastEvent = dayjs(event.date).isBefore(dayjs(), 'day');
                            return (
                                <div key={event.id} className={`mb-7 rounded-lg p-4 shadow-md ${event.animationClass}`}>
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-gray-500">{event.date}</span>
                                        {event.status || isPastEvent ? (
                                            <Button
                                                disabled
                                                type="default"
                                                style={{
                                                    backgroundColor: isPastEvent ? '#f0f0f0' : undefined,
                                                    color: isPastEvent ? '#bfbfbf' : undefined,
                                                }}
                                            >
                                                {isPastEvent ? '受付終了' : '申込完了'}
                                            </Button>
                                        ) : (
                                            <Popconfirm
                                                title="確認"
                                                description={
                                                    <span>
                                                        このイベントへの参加を申し込みますか？
                                                        <br />
                                                        申し込み後のキャンセルはできませんので、ご了承ください。
                                                    </span>
                                                }
                                                okText="削除"
                                                placement="bottomRight"
                                                cancelText="キャンセル"
                                                onConfirm={() => handleApply(event.id)}
                                            >
                                                <Button type="primary">申し込み</Button>
                                            </Popconfirm>
                                        )}
                                    </div>
                                    <span
                                        className="mt-2 whitespace-pre-wrap"
                                        dangerouslySetInnerHTML={{
                                            __html: event.content.replace(
                                                /(https?:\/\/[^\s]+)/g,
                                                '<a href="$1" class="text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer">$1</a>',
                                            ),
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </Spin>
                </Col>
            </Row>
        </div>
    );
};

export default CompanyActivitie;
