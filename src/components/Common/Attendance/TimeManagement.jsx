import React, { useState, useEffect } from 'react';
import { Button, Input, notification, Popover, Spin } from 'antd';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useSelector } from 'react-redux';

import {
    getAttendance,
    submitCheckinTime,
    submitCheckoutTime,
    submitBreakStartTime,
    submitBreakEndTime,
    getHolidaysAPI,
    submitDirect,
    submitBounce,
} from '../../../services/common.service';
import YearMonthSelector from '../Layout/Input/YearMonthSelector';
import ReportSaleCheckout from './ReportSaleCheckout';

const TimeManagement = () => {
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.account.user);
    const [dailyReportSaleOpen, setDailyReportSaleOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [attendanceData, setAttendanceData] = useState([]);
    const [totalWorkTime, setTotalWorkTime] = useState('');
    const [totalOvertime, setTotalOvertime] = useState('');

    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [isBreakStarted, setIsBreakStarted] = useState(false);
    const [isBreakFinished, setIsBreakFinished] = useState(false);
    const [isCheckOut, setIsCheckOut] = useState(false);

    const handleChangeYear = (direction) => {
        setYear(year + direction);
    };

    const getDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };

    const daysInMonth = getDaysInMonth(year, month);

    const getDayOfWeek = (year, month, day) => {
        const date = new Date(year, month - 1, day);
        const days = ['日', '月', '火', '水', '木', '金', '土'];
        return days[date.getDay()];
    };

    //現在の時間を取得
    const getCurrentTime = () => {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        return { currentHour, currentMinute };
    };

    const [holidays, setHolidays] = useState({});
    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const response = await getHolidaysAPI();
                setHolidays(response.data);
            } catch (error) {
                console.error('Failed to fetch holidays', error);
            }
        };
        fetchHolidays();
    }, []);

    const isHoliday = (year, month, day) => {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return holidays[dateStr] !== undefined;
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const time = new Date(timeString);
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    useEffect(() => {
        fetchAttendanceList();
    }, [year, month]);

    const fetchAttendanceList = async () => {
        setLoading(true);
        const data = { year, month };
        const allDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const attendanceMap = {};

        const createEmptyRecord = (day) => ({
            year: year.toString(),
            month: month.toString(),
            date: formatDate(year, month, day),
            start_time: '',
            break_start_time: '',
            break_end_time: '',
            end_time: '',
            totalWorkMinutes: '',
            remarks: '',
        });

        const fillAttendanceData = () =>
            allDays.map((day) => ({
                records: attendanceMap[day] || [],
                ...createEmptyRecord(day),
            }));

        try {
            const res = await getAttendance(data);
            console.log(res.data);

            if (res.data) {
                res.data.report_list.forEach((record) => {
                    const day = new Date(record.date).getDate();
                    if (!attendanceMap[day]) {
                        attendanceMap[day] = [];
                    }
                    attendanceMap[day].push({
                        ...record,
                        start_time: formatTime(record.start_time),
                        break_start_time: formatTime(record.break_start_time),
                        break_end_time: formatTime(record.break_end_time),
                        end_time: formatTime(record.end_time),
                        remarks: record.remarks || '',
                    });
                });

                const today = new Date().getDate();
                const todayRecord = attendanceMap[today] || [];
                setIsCheckedIn(todayRecord.some((record) => record.start_time));
                setIsBreakStarted(todayRecord.some((record) => record.break_start_time));
                setIsBreakFinished(todayRecord.some((record) => record.break_end_time));
                setIsCheckOut(todayRecord.some((record) => record.end_time));

                setTotalWorkTime(res.data.total);
                setTotalOvertime(res.data.totalOvertime);
            } else {
                setTotalWorkTime('');
                setTotalOvertime('');
            }
        } catch (error) {
            console.error('Failed to fetch attendance', error);
            setTotalWorkTime('');
            setTotalOvertime('');
        } finally {
            setAttendanceData(fillAttendanceData());
            setLoading(false);
        }
    };

    const formatDate = (year, month, day) => {
        const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedDay = day < 10 ? `0${day}` : day;
        return `${year}-${formattedMonth}-${formattedDay}`;
    };

    //出勤
    const handleCheckin = async () => {
        if (isCheckedIn) return;

        try {
            const data = {
                year: year,
                month: month,
                date: formatDate(year, month, new Date().getDate()),
            };
            const res = await submitCheckinTime(data);
            if (res.data.success === true) {
                notification.success({
                    message: '出勤登録が成功しました。',
                    style: {
                        width: 290,
                    },
                });
                setIsCheckedIn(true);
                fetchAttendanceList();
            } else {
                notification.error({
                    message: '出勤登録が失敗しました。',
                });
            }
        } catch (error) {
            console.error('Check-in failed', error);
        }
    };

    //退勤
    const [remarks, setRemarks] = useState('');
    const handleCheckout = async () => {
        const today = formatDate(year, month, new Date().getDate());
        const todayAttendance = attendanceData.find((dayData) => dayData.date === today);

        if (!todayAttendance || !todayAttendance.records.some((record) => record.start_time)) {
            notification.error({
                message: '出勤時間がありません。',
                style: {
                    width: 290,
                },
            });
            return;
        }

        if (!remarks || remarks.trim() === '') {
            notification.error({
                message: '先に備考を入力してください。',
            });
            return;
        }

        if ((user.permissions === 4 || user.permissions === 5) && !isSubmitted) {
            setDailyReportSaleOpen(true);
        } else {
            await performCheckout();
        }
    };

    //退勤
    const performCheckout = async () => {
        try {
            const data = {
                year: year,
                month: month,
                date: formatDate(year, month, new Date().getDate()),
                remarks: remarks,
            };
            const res = await submitCheckoutTime(data);
            if (res.data.success === true) {
                notification.success({
                    message: '退勤登録が成功しました。',
                });
                setRemarks('');
                fetchAttendanceList();
                setIsCheckOut(true);
            } else {
                notification.error({
                    message: '退勤が失敗しました。',
                });
            }
        } catch (error) {
            console.error('Check-out failed', error);
        }
    };

    //休憩開始
    const handleBreakStart = async () => {
        if (!isCheckedIn) {
            notification.error({
                message: '出勤時間がありません。',
                style: {
                    width: 320,
                },
            });
            return;
        }

        try {
            const data = {
                year: year,
                month: month,
                date: formatDate(year, month, new Date().getDate()),
            };
            const res = await submitBreakStartTime(data);
            if (res.data.success === true) {
                notification.success({
                    message: '休憩開始登録が成功しました。',
                    style: {
                        width: 320,
                    },
                });
                fetchAttendanceList();
            } else {
                notification.error({
                    message: '休憩開始登録が失敗しました。',
                });
            }
        } catch (error) {
            console.error('Break start failed', error);
        }
    };

    //休憩終了
    const handleBreakEnd = async () => {
        // 当日の出勤登録がされたのかチェック
        const today = formatDate(year, month, new Date().getDate());
        const todayAttendance = attendanceData.find((dayData) => dayData.date === today);

        if (!todayAttendance || !todayAttendance.records.some((record) => record.break_start_time)) {
            notification.error({
                message: '休憩開始時間がありません。',
                style: {
                    width: 320,
                },
            });
            return;
        }

        try {
            const data = {
                year: year,
                month: month,
                date: formatDate(year, month, new Date().getDate()),
            };
            const res = await submitBreakEndTime(data);
            if (res.data.success === true) {
                notification.success({
                    message: '休憩終了登録が成功しました。',
                    style: {
                        width: 320,
                    },
                });
                fetchAttendanceList();
            } else {
                notification.error({
                    message: '休憩終了登録が失敗しました。',
                    style: {
                        width: 320,
                    },
                });
            }
        } catch (error) {
            console.error('Break end failed', error);
        }
    };

    //直行
    const handleDirect = async () => {
        const { currentHour, currentMinute } = getCurrentTime();

        // 9:30の前をチェック
        if (currentHour < 9 || (currentHour === 9 && currentMinute <= 30)) {
            try {
                const data = {
                    year: year,
                    month: month,
                    date: formatDate(year, month, currentTime.getDate()),
                    time: `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`, // Lấy thời gian hiện tại
                };
                const res = await submitDirect(data);
                if (res.data.success === true) {
                    notification.success({
                        message: '直行登録が成功しました。',
                    });
                    fetchAttendanceList();
                } else {
                    notification.error({
                        message: '直行登録が失敗しました。',
                    });
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            notification.info({
                message: '9時30分以降に出勤時間を記録するには[出勤] をクリックしてください。',
                style: {
                    width: 375,
                },
            });
        }
    };

    //直帰
    const handleBounce = async () => {
        const { currentHour, currentMinute } = getCurrentTime();

        // 18:30の後をチェック
        if (currentHour > 18 || (currentHour === 18 && currentMinute >= 30)) {
            try {
                const data = {
                    year: year,
                    month: month,
                    date: formatDate(year, month, currentTime.getDate()),
                    time: `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`, // Lấy thời gian hiện tại
                };
                const res = await submitBounce(data);
                if (res.data.success === true) {
                    notification.success({
                        message: '直帰登録が成功しました。',
                    });
                    fetchAttendanceList();
                    isCheckOut(true);
                } else {
                    notification.error({
                        message: '直帰登録が失敗しました。',
                    });
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            notification.info({
                message: '18時30分前に退勤時間を記録するには[退勤] をクリックしてください。',
                style: {
                    width: 375,
                },
            });
        }
    };

    const countWorkingDays = (attendanceData) => {
        return attendanceData.reduce((count, dayData) => {
            if (dayData.records && dayData.records.length > 0) {
                const hasWorkTime = dayData.records.some(
                    (record) => record.totalWorkMinutes && record.totalWorkMinutes !== '0:00',
                );
                if (hasWorkTime) {
                    return count + 1;
                }
            }
            return count;
        }, 0);
    };
    const handleDownload = async () => {
        try {
            const response = await fetch('/templates/attendance_template.xlsx');
            const arrayBuffer = await response.arrayBuffer();

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);

            const worksheet = workbook.worksheets[0];

            let excelRow = 11;

            attendanceData.forEach((dayData) => {
                const day = dayData.date.split('-')[2];
                const dayOfWeek = getDayOfWeek(year, month, day);

                if (dayData.records && dayData.records.length > 0) {
                    dayData.records.forEach((record) => {
                        worksheet.getCell(`A${excelRow}`).value = `${month}月${day}日(${dayOfWeek})`;
                        worksheet.getCell(`B${excelRow}`).value = record.start_time;
                        worksheet.getCell(`C${excelRow}`).value = record.end_time;
                        worksheet.getCell(`D${excelRow}`).value = record.break_start_time;
                        worksheet.getCell(`E${excelRow}`).value = record.break_end_time;
                        worksheet.getCell(`F${excelRow}`).value = record.totalWorkMinutes;

                        excelRow++;
                    });
                } else {
                    worksheet.getCell(`A${excelRow}`).value = `${month}月${day}日(${dayOfWeek})`;
                    worksheet.getCell(`B${excelRow}`).value = '';
                    worksheet.getCell(`C${excelRow}`).value = '';
                    worksheet.getCell(`D${excelRow}`).value = '';
                    worksheet.getCell(`E${excelRow}`).value = '';
                    worksheet.getCell(`F${excelRow}`).value = '';

                    excelRow++;
                }
            });

            worksheet.getCell('B4').value = `${user.department}`;
            worksheet.getCell('B5').value = `${user.emp_no}`;
            worksheet.getCell('B6').value = `${user.name}`;
            worksheet.getCell('B7').value = `${countWorkingDays(attendanceData)}`;
            worksheet.getCell('B8').value = `${totalWorkTime}`;
            worksheet.getCell('A1').value = `${year} 年 ${month} 月 作業報告書`;

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(
                new Blob([buffer], { type: 'application/octet-stream' }),
                `${user.name}_${year}_${month}_作業報告書.xlsx`,
            );
        } catch (error) {
            console.error('Error generating Excel file:', error);
        }
    };
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    return (
        <div className="h-screen w-full">
            <YearMonthSelector year={year} onChangeYear={handleChangeYear} month={month} setMonth={setMonth} />
            <Spin spinning={loading}>
                <div className="mx-auto w-3/4">
                    {year === currentYear && month === currentMonth && (
                        <div className="my-3 flex w-full justify-between">
                            <div className="flex w-full flex-wrap gap-5">
                                <Button
                                    className="min-w-[80px] flex-grow bg-blue-500 py-5 text-lg text-white"
                                    onClick={handleCheckin}
                                    disabled={isCheckedIn}
                                >
                                    出勤
                                </Button>
                                <Button
                                    className="min-w-[80px] flex-grow bg-blue-500 py-5 text-lg text-white"
                                    onClick={handleBreakStart}
                                    disabled={isBreakStarted}
                                >
                                    休憩開始
                                </Button>
                                <Button
                                    className="min-w-[80px] flex-grow bg-blue-500 py-5 text-lg text-white"
                                    onClick={handleBreakEnd}
                                    disabled={isBreakFinished}
                                >
                                    休憩終了
                                </Button>
                                <Button
                                    className="min-w-[80px] flex-grow bg-blue-500 py-5 text-lg text-white"
                                    onClick={handleDirect}
                                    disabled={isCheckedIn}
                                >
                                    直行
                                </Button>
                                <Button
                                    className="min-w-[80px] flex-grow bg-blue-500 py-5 text-lg text-white"
                                    onClick={handleBounce}
                                    disabled={isCheckOut}
                                >
                                    直帰
                                </Button>

                                <Button
                                    className="min-w-[80px] flex-grow bg-blue-500 py-5 text-lg text-white"
                                    onClick={handleCheckout}
                                    disabled={isCheckOut}
                                >
                                    退勤
                                </Button>
                            </div>
                        </div>
                    )}
                    <div className="mb-3 mt-8 flex items-center justify-between">
                        <div className="flex space-x-8">
                            <div className="text-lg">合計稼働時間: {totalWorkTime}</div>
                            <div className="text-lg">合計残業時間: {totalOvertime}</div>
                        </div>
                        {year === currentYear && month === currentMonth && (
                            <Input
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                className="min-w-[80px] max-w-[300px] flex-grow"
                                placeholder="備考"
                            />
                        )}
                    </div>
                    <table className="min-w-full rounded-lg border border-gray-300 bg-white shadow-md">
                        <thead className="bg-sky-200">
                            <tr>
                                <th className="border-b border-gray-300 px-4 py-2">日付</th>
                                <th className="border-b border-gray-300 px-4 py-2">出勤</th>
                                <th className="border-b border-gray-300 px-4 py-2">退勤</th>
                                <th className="border-b border-gray-300 px-4 py-2">休憩開始</th>
                                <th className="border-b border-gray-300 px-4 py-2">休憩終了</th>
                                <th className="border-b border-gray-300 px-4 py-2">稼働時間</th>
                                <th className="border-b border-gray-300 px-4 py-2">備考</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData?.map((dayData, index) => {
                                const dayOfWeek = getDayOfWeek(year, month, dayData.date.split('-')[2]);
                                return (
                                    <React.Fragment key={index}>
                                        {dayData.records && dayData.records.length > 0 ? (
                                            dayData.records.map((record, idx) => (
                                                <tr key={idx}>
                                                    <td
                                                        className={`border-b border-gray-300 px-4 py-2 text-center ${isHoliday(year, month, dayData.date.split('-')[2]) ? 'text-red-500' : ''}`}
                                                    >
                                                        {`${month}月${dayData.date.split('-')[2]}日(${dayOfWeek})`}
                                                    </td>
                                                    <td className="border-b border-gray-300 px-4 py-2 text-center">
                                                        {record.start_time || ''}
                                                    </td>
                                                    <td className="border-b border-gray-300 px-4 py-2 text-center">
                                                        {record.end_time || ''}
                                                    </td>
                                                    <td className="border-b border-gray-300 px-4 py-2 text-center">
                                                        {record.break_start_time || ''}
                                                    </td>
                                                    <td className="border-b border-gray-300 px-4 py-2 text-center">
                                                        {record.break_end_time || ''}
                                                    </td>
                                                    <td className="border-b border-gray-300 px-4 py-2 text-center">
                                                        {record.totalWorkMinutes || ''}
                                                    </td>
                                                    <td className="border-b border-gray-300 px-4 py-2 text-center">
                                                        <Popover content={record.remarks || ''}>
                                                            <div className="max-w-[60px] truncate">
                                                                {record.remarks || ''}
                                                            </div>
                                                        </Popover>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    className={`border-b border-gray-300 px-4 py-2 text-center ${isHoliday(year, month, dayData.date.split('-')[2]) ? 'text-red-500' : ''}`}
                                                >
                                                    {`${month}月${dayData.date.split('-')[2]}日(${dayOfWeek})`}
                                                </td>
                                                <td className="border-b border-gray-300 px-4 py-2 text-center">
                                                    {dayData.start_time || ''}
                                                </td>
                                                <td className="border-b border-gray-300 px-4 py-2 text-center">
                                                    {dayData.end_time || ''}
                                                </td>
                                                <td className="border-b border-gray-300 px-4 py-2 text-center">
                                                    {dayData.break_start_time || ''}
                                                </td>
                                                <td className="border-b border-gray-300 px-4 py-2 text-center">
                                                    {dayData.break_end_time || ''}
                                                </td>
                                                <td className="border-b border-gray-300 px-4 py-2 text-center">
                                                    {dayData.totalWorkMinutes || ''}
                                                </td>
                                                <td className="border-b border-gray-300 px-4 py-2 text-center">
                                                    {dayData.remarks || ''}
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}

                            <tr>
                                <td colSpan="7" className="border-t border-gray-300 text-center">
                                    <div className="mt-4 flex items-center justify-end px-4 py-2">
                                        <Button type="primary" onClick={handleDownload}>
                                            ダウンロード
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Spin>
            <ReportSaleCheckout
                dailyReportSaleOpen={dailyReportSaleOpen}
                setDailyReportSaleOpen={setDailyReportSaleOpen}
                setIsSubmitted={setIsSubmitted}
                performCheckout={performCheckout}
            />
        </div>
    );
};

export default TimeManagement;
