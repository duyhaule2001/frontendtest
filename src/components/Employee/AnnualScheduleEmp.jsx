import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ja';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getHolidaysAPI } from '../../services/common.service';
import { getNoticeAPI } from '../../services/employee.service';
import { Modal, Divider, Spin } from 'antd';

moment.locale('ja');
const localizer = momentLocalizer(moment);

const messages = {
    allDay: '終日',
    previous: '前',
    next: '次',
    today: '今日',
    month: '月',
    week: '週',
    day: '日',
    agenda: 'イベントリスト',
    date: '日付',
    time: '時間',
    event: 'イベント',
    noEventsInRange: 'この範囲にイベントはありません。',
    showMore: (total) => `もっと見る (${total})`,
};

const formats = {
    dateFormat: 'D',
    dayFormat: (date, culture, localizer) => localizer.format(date, 'dd', culture),
    weekdayFormat: (date, culture, localizer) => {
        const days = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
        return days[date.getDay()];
    },
    monthHeaderFormat: (date, culture, localizer) =>
        `${localizer.format(date, 'YYYY')}年${localizer.format(date, 'M')}月`,
    monthFormat: (date, culture, localizer) => `${localizer.format(date, 'M')}月`,
    agendaDateFormat: (date, culture, localizer) => `${localizer.format(date, 'M月D日')}`,
    agendaTimeFormat: (date, culture, localizer) => localizer.format(date, 'HH:mm'),
    timeGutterFormat: (date, culture, localizer) => localizer.format(date, 'HH:mm'),
    dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
        `${localizer.format(start, 'M月D日')} - ${localizer.format(end, 'M月D日')}`,
};

const AnnualScheduleEmp = () => {
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [view, setView] = useState(Views.MONTH);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [year, setYear] = useState(moment().year());
    const [month, setMonth] = useState(moment().month() + 1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAllEvents = async () => {
            setLoading(true);
            try {
                const holidays = await fetchHolidays();
                const initialEvents = await fetchInitialEvents(year, month);

                setCalendarEvents([...initialEvents, ...holidays]);
            } catch (error) {
                console.error('データが取得できませんでした。', error);
            }
            setLoading(false);
        };
        fetchAllEvents();
    }, [year, month]);

    const fetchHolidays = async () => {
        try {
            const holidaysResponse = await getHolidaysAPI();
            const holidays = Object.entries(holidaysResponse.data).map(([date, name]) => ({
                title: name,
                start: new Date(date),
                end: new Date(date),
                allDay: true,
                type: 'holiday',
            }));
            return holidays;
        } catch (error) {
            console.error('祝日の取得が失敗しました。', error);
            return [];
        }
    };

    const fetchInitialEvents = async (year, month) => {
        try {
            const initialRes = await getNoticeAPI(year, month);
            const initial = initialRes.data.map((event) => ({
                title: event.content,
                start: new Date(event.date),
                end: new Date(event.date),
                type: 'company_event',
            }));
            return initial;
        } catch (error) {
            console.error('お知らせの取得が失敗しました。', error);
            return [];
        }
    };

    const eventPropGetter = (event) => {
        let backgroundColor;
        let color = 'white';

        if (event.type === 'paid_holiday') {
            backgroundColor = 'gray';
        } else if (event.type === 'reason') {
            backgroundColor = 'yellow';
            color = 'black';
        } else if (event.type === 'holiday') {
            backgroundColor = 'red';
        } else if (event.type === 'company_event') {
            backgroundColor = '#3174ad';
        } else {
            backgroundColor = 'blue';
        }
        return { style: { backgroundColor, color } };
    };

    const handleEventClick = (event) => {
        setSelectedEvent({ events: [event], date: event.start });
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleShowMore = (events, date) => {
        setSelectedEvent({ events, date });
        setIsModalVisible(true);
    };

    const handleViewChange = (newView) => {
        setView(newView);
    };

    const handleNavigate = (date, newView) => {
        if (newView === Views.MONTH) {
            setYear(moment(date).year());
            setMonth(moment(date).month() + 1);
        }
    };

    return (
        <div className="flex h-full flex-col items-center justify-center bg-gray-50 py-5">
            <div className="mb-4 w-full max-w-6xl rounded-lg bg-white p-4 shadow-lg">
                <Spin spinning={loading}>
                    <Calendar
                        localizer={localizer}
                        events={calendarEvents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '75vh' }}
                        className="bg-white"
                        messages={messages}
                        formats={formats}
                        view={view}
                        views={['month', 'agenda']}
                        onView={handleViewChange}
                        onNavigate={handleNavigate}
                        eventPropGetter={eventPropGetter}
                        onSelectEvent={handleEventClick}
                        onShowMore={handleShowMore}
                    />
                    <div className="mt-3 flex flex-wrap justify-center">
                        <div className="mr-4 flex items-center">
                            <div className="mr-2 h-4 w-4 bg-[#ff0000]"></div>
                            <span>祝日</span>
                        </div>
                        <div className="mr-4 flex items-center">
                            <div className="mr-2 h-4 w-4 bg-[#3175ad]"></div>
                            <span>お知らせ</span>
                        </div>
                    </div>
                </Spin>
            </div>

            <Modal
                title="詳細内容"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={'50%'}
                footer={false}
            >
                <div className="mt-5">
                    {selectedEvent?.events?.map((event, index) => (
                        <React.Fragment key={index}>
                            <li>
                                <span
                                    className="mb-1 whitespace-pre-wrap"
                                    dangerouslySetInnerHTML={{
                                        __html: event.title.replace(
                                            /(https?:\/\/[^\s]+)/g,
                                            '<a href="$1" class="text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer">$1</a>',
                                        ),
                                    }}
                                />
                            </li>
                            {selectedEvent?.events?.length > 1 && index !== selectedEvent.events.length - 1 && (
                                <Divider />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default AnnualScheduleEmp;
