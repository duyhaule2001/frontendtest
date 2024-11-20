import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import TitleCus from '../Common/Layout/TitleCus';
import { getNoticeAPI } from '../../services/employee.service';
import { Button, Col, DatePicker, Row, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const Notice = () => {
    const [data, setData] = useState([]);
    const [yearMonth, setYearMonth] = useState(dayjs());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (yearMonth) {
            const year = yearMonth.year();
            const month = yearMonth.month() + 1;
            fetchData(year, month);
        }
    }, [yearMonth]);

    const fetchData = async (year, month) => {
        setLoading(true);
        try {
            const res = await getNoticeAPI(year, month);
            if (res.data) {
                const sortedEvents = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setData(sortedEvents);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (data.length > 0) {
            data.forEach((event, index) => {
                const elements = document.getElementsByClassName(`event-${event.id}`);
                if (elements.length > 0) {
                    elements[0].classList.remove('animate-fadeInUp');
                }
                setTimeout(() => {
                    if (elements.length > 0) {
                        elements[0].classList.add('animate-fadeInUp');
                    }
                }, index * 200);
            });
        }
    }, [data]);

    return (
        <>
            <TitleCus title={'お知らせ'} />
            <div className="flex w-full flex-col items-center justify-center">
                <Row className="w-full items-center justify-center">
                    <Col sm={16} xs={22}>
                        <div className="mb-5 mt-10 flex items-center justify-between">
                            <DatePicker
                                picker="month"
                                placeholder="年月"
                                format="YYYY-MM"
                                value={yearMonth}
                                onChange={(date) => {
                                    setYearMonth(date);
                                }}
                            />
                            <Button type="primary" onClick={() => setYearMonth(dayjs())}>
                                <ReloadOutlined />
                            </Button>
                        </div>
                        <Spin spinning={loading}>
                            {data.map((notice) => (
                                <div
                                    key={notice.id}
                                    className={`mb-7 rounded-lg p-4 shadow-md event-${notice.id} bg-white`}
                                >
                                    <div className="mb-2 flex items-center">
                                        <span className="text-gray-500">{notice.date}</span>
                                    </div>
                                    <span
                                        className="mb-2 mt-4 whitespace-pre-wrap"
                                        dangerouslySetInnerHTML={{
                                            __html: notice.content.replace(
                                                /(https?:\/\/[^\s]+)/g,
                                                '<a href="$1" class="text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer">$1</a>',
                                            ),
                                        }}
                                    />
                                </div>
                            ))}
                        </Spin>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default Notice;
