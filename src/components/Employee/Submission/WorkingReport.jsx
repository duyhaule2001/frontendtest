import React, { useState, useEffect } from 'react';
import YearMonthSelector from '../../Common/Layout/Input/YearMonthSelector';
import { Button, Input, notification, Spin, TimePicker } from 'antd';
import { getHolidaysAPI } from '../../../services/common.service';
import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useSelector } from 'react-redux';
import { getWorkingReport, submitWorkingReport } from '../../../services/employee.service';

const WorkingReports = () => {
    const user = useSelector((state) => state.account.user);
    const [isLoading, setIsLoading] = useState(true);
    const [totalWorkingHours, setTotalWorkingHours] = useState('00:00');
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const format = 'HH:mm';

    const handleChangeYear = (direction) => {
        setYear(year + direction);
    };

    const [holidays, setHolidays] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const response = await getHolidaysAPI();
                setHolidays(response.data);
            } catch (error) {
                console.error('Failed to fetch holidays', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHolidays();
    }, []);

    const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

    const getDayOfWeek = (year, month, day) => {
        const date = new Date(year, month - 1, day);
        const days = ['日', '月', '火', '水', '木', '金', '土'];
        return days[date.getDay()];
    };

    const isHoliday = (year, month, day) => {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return holidays[dateStr] !== undefined;
    };

    const initializeEditableRows = (days) => {
        return days.reduce((acc, day) => {
            const dayOfWeek = getDayOfWeek(year, month, day);
            const isWeekend = dayOfWeek === '土' || dayOfWeek === '日';
            const isHolidayDay = isHoliday(year, month, day);

            acc[day] = !isWeekend && !isHolidayDay;
            return acc;
        }, {});
    };

    const initializeAttendance = (days, editableRows) => {
        return days.map((day) => ({
            day: day,
            record_id: null,
            checked: editableRows[day] || false,
            start: dayjs('00:00', format),
            end: dayjs('00:00', format),
            break: dayjs('00:00', format),
            workDetails: '',
        }));
    };

    useEffect(() => {
        const initializeEmptyData = () => {
            const daysInMonth = getDaysInMonth(year, month);
            const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
            const updatedEditableRows = initializeEditableRows(days);

            setEditableRows(updatedEditableRows);
            setSiteName('');
            setAttendance(initializeAttendance(days, updatedEditableRows));
            setTotalWorkingHours('00:00');
            setLoading(false);
        };

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await getWorkingReport(year, month);
                if (response.data) {
                    setSiteName(response.data.siteName);
                    setTotalWorkingHours(response.data.total);
                    setAttendance(
                        response.data.attendance.map((item) => ({
                            ...item,
                            start: dayjs(item.start, format),
                            end: dayjs(item.end, format),
                            break: dayjs(item.break, format),
                        })),
                    );
                } else {
                    initializeEmptyData();
                }
            } catch (error) {
                console.error('Failed to fetch WorkingReport', error);
                initializeEmptyData();
            }
            setIsLoading(false);
        };

        fetchData();
    }, [loading, holidays, year, month]);

    const [attendance, setAttendance] = useState([]);
    const [siteName, setSiteName] = useState('');
    const [editableRows, setEditableRows] = useState({});

    const handleChange = (day, field, value) => {
        setAttendance((prev) => prev.map((item) => (item.day === day ? { ...item, [field]: value } : item)));
    };

    const handleCheckboxChange = (day) => {
        setEditableRows((prev) => ({
            ...prev,
            [day]: !prev[day],
        }));

        setAttendance((prevAttendance) =>
            prevAttendance.map((item) =>
                item.day === day
                    ? {
                          ...item,
                          checked: !item.checked,
                          start: !item.checked ? dayjs('00:00', format) : item.start,
                          end: !item.checked ? dayjs('00:00', format) : item.end,
                          break: !item.checked ? dayjs('00:00', format) : item.break,
                          workDetails: !item.checked ? '' : item.workDetails,
                      }
                    : item,
            ),
        );
    };

    const calculateWorkingHours = (start, end, breakTime) => {
        start = dayjs.isDayjs(start) ? start : dayjs(start, 'HH:mm');
        end = dayjs.isDayjs(end) ? end : dayjs(end, 'HH:mm');
        breakTime = dayjs.isDayjs(breakTime) ? breakTime : dayjs(breakTime, 'HH:mm');

        const startTotalMinutes = start.hour() * 60 + start.minute();
        const endTotalMinutes = end.hour() * 60 + end.minute();
        const breakTotalMinutes = breakTime.hour() * 60 + breakTime.minute();

        const workingMinutes = endTotalMinutes - startTotalMinutes - breakTotalMinutes;

        const hours = Math.floor(workingMinutes / 60);
        const minutes = workingMinutes % 60;

        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    };

    const saveData = async () => {
        const dataToSend = {
            siteName,
            year,
            month,
            attendance: attendance.map((data) => {
                const start = dayjs.isDayjs(data.start) ? data.start : dayjs(data.start, format);
                const end = dayjs.isDayjs(data.end) ? data.end : dayjs(data.end, format);
                const breakTime = dayjs.isDayjs(data.break) ? data.break : dayjs(data.break, format);

                const workingHours = calculateWorkingHours(start, end, breakTime);
                return {
                    record_id: data.record_id,
                    day: data.day,
                    checked: data.checked,
                    start: start.format(format),
                    end: end.format(format),
                    break: breakTime.format(format),
                    workDetails: data.workDetails,
                    workingHours,
                };
            }),
        };

        console.log('Save data to server', dataToSend);
        const response = await submitWorkingReport(dataToSend);
        if (response.data) {
            notification.success({
                message: '保存が成功しました。',
                style: {
                    width: 270,
                },
            });
        } else {
            notification.error({
                message: '保存が失敗しました',
                style: {
                    width: 270,
                },
            });
        }
    };

    const handleTimeChange = (field, value) => {
        setAttendance((prevAttendance) =>
            prevAttendance.map((item) => (item.checked ? { ...item, [field]: value } : item)),
        );
    };

    const formatMonthRange = (year, month) => {
        const daysInMonth = getDaysInMonth(year, month);
        return `${month}月01日〜${month}月${String(daysInMonth).padStart(2, '0')}日`;
    };

    const formatTotalWorkingHours = (totalTime) => {
        const [hours, minutes] = totalTime.split(':');
        return `${parseInt(hours)}時${parseInt(minutes).toString().padStart(2, '0')}分`;
    };
    const countWorkingDays = (attendance) => {
        return attendance.reduce((count, row) => {
            if (row.workingHours !== '0:00') {
                return count + 1;
            }
            return count;
        }, 0);
    };

    const handleDownload = async () => {
        const response = await fetch('/templates/working_report_template.xlsx');
        const arrayBuffer = await response.arrayBuffer();

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        const worksheet = workbook.worksheets[0];

        attendance.forEach((row, index) => {
            const dayOfWeek = getDayOfWeek(year, month, row.day);
            const excelRow = index + 11;
            worksheet.getCell(`A${excelRow}`).value = `${month}月${row.day}日 (${dayOfWeek})`;
            worksheet.getCell(`B${excelRow}`).value = dayjs(row.start).format('HH:mm');
            worksheet.getCell(`C${excelRow}`).value = dayjs(row.end).format('HH:mm');
            worksheet.getCell(`D${excelRow}`).value = dayjs(row.break).format('HH:mm');
            worksheet.getCell(`E${excelRow}`).value = row.workingHours;
            worksheet.getCell(`F${excelRow}`).value = row.workDetails;
        });

        worksheet.getCell('B7').value = `${countWorkingDays(attendance)}日`;
        worksheet.getCell('B8').value = `${formatTotalWorkingHours(totalWorkingHours)}`;
        worksheet.getCell('B5').value = `${user.name}`;
        worksheet.getCell('B4').value = `${siteName}`;
        worksheet.getCell('B6').value = `${formatMonthRange(year, month)}`;
        worksheet.getCell('A1').value = `${year} 年 ${month} 月 作業報告書`;

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(
            new Blob([buffer], { type: 'application/octet-stream' }),
            `${user.name}_${year}_${month}_作業報告書.xlsx`,
        );
    };

    return (
        <Spin spinning={isLoading}>
            <div className="mt-10 w-full">
                <YearMonthSelector year={year} onChangeYear={handleChangeYear} month={month} setMonth={setMonth} />
                <div className="overflow-x-auto">
                    <div className="mx-auto w-full max-w-6xl px-4 py-10">
                        <div className="flex items-center justify-start">
                            <label className="mr-5 whitespace-nowrap font-bold text-gray-900">現場名:</label>
                            <Input
                                type="text"
                                id="first_name"
                                value={siteName}
                                onChange={(e) => setSiteName(e.target.value)}
                                required
                                className="w-[125px]"
                            />
                        </div>
                        <div className="my-3 flex flex-col justify-between md:flex-row">
                            {['出勤時間', '退勤時間', '休憩時間'].map((label, index) => (
                                <div key={index} className="mb-3 flex items-center md:mb-0">
                                    <label htmlFor={`time_${index}`} className="block pr-3 font-bold text-gray-900">
                                        {label}
                                    </label>
                                    <TimePicker
                                        defaultValue={dayjs('00:00', format)}
                                        format={format}
                                        onChange={(time, timeString) =>
                                            handleTimeChange(
                                                label === '出勤時間' ? 'start' : label === '退勤時間' ? 'end' : 'break',
                                                timeString,
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                        <table className="min-w-full rounded-lg border border-gray-300 bg-white shadow-md">
                            <thead className="bg-sky-200">
                                <tr>
                                    <th className="border-b border-gray-300 px-2 py-2"> </th>
                                    <th className="border-b border-gray-300 px-2 py-2">日付</th>
                                    <th className="border-b border-gray-300 px-2 py-2">出勤</th>
                                    <th className="border-b border-gray-300 px-2 py-2">退勤</th>
                                    <th className="border-b border-gray-300 px-2 py-2">休憩</th>
                                    <th className="border-b border-gray-300 px-2 py-2">稼働時間</th>
                                    <th className="border-b border-gray-300 px-2 py-2">作業内容、保業事項</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.map((item) => {
                                    const dayOfWeek = getDayOfWeek(year, month, item.day);

                                    return (
                                        <tr key={item.day} className="opacity-100">
                                            <td className="pointer-events-auto border border-gray-300 px-2 py-2 text-center">
                                                <input
                                                    type="checkbox"
                                                    onChange={() => handleCheckboxChange(item.day)}
                                                    checked={item.checked}
                                                />
                                            </td>
                                            <td
                                                className={`border border-gray-300 px-2 py-2 text-center ${
                                                    isHoliday(year, month, item.day) ? 'text-red-500' : ''
                                                }`}
                                            >
                                                {month}月{item.day}日 ({dayOfWeek})
                                            </td>
                                            <td className="border border-gray-300 px-2 py-2 text-center">
                                                <TimePicker
                                                    value={dayjs(item.start, format)}
                                                    format={format}
                                                    onChange={(time, timeString) =>
                                                        handleChange(item.day, 'start', timeString)
                                                    }
                                                    disabled={!item.checked}
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-2 py-2 text-center">
                                                <TimePicker
                                                    value={dayjs(item.end, format)}
                                                    format={format}
                                                    onChange={(time, timeString) =>
                                                        handleChange(item.day, 'end', timeString)
                                                    }
                                                    disabled={!item.checked}
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-2 py-2 text-center">
                                                <TimePicker
                                                    value={dayjs(item.break, format)}
                                                    format={format}
                                                    onChange={(time, timeString) =>
                                                        handleChange(item.day, 'break', timeString)
                                                    }
                                                    disabled={!item.checked}
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-2 py-2 text-center">
                                                {calculateWorkingHours(item.start, item.end, item.break)}
                                            </td>
                                            <td className="border border-gray-300 px-2 py-2 text-center">
                                                <input
                                                    type="text"
                                                    value={item.workDetails}
                                                    onChange={(e) =>
                                                        handleChange(item.day, 'workDetails', e.target.value)
                                                    }
                                                    className="w-full rounded border p-1"
                                                    disabled={!item.checked}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                                <tr>
                                    <td colSpan="7" className="border-t border-gray-300 text-center">
                                        <div className="mt-4 flex flex-col items-center justify-between px-4 py-2 md:flex-row">
                                            <div className="text-lg">月範囲: {formatMonthRange(year, month)}</div>
                                            <div className="text-lg">
                                                合計稼働時間: {formatTotalWorkingHours(totalWorkingHours)}
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center">
                                                <Button
                                                    className="mb-2 bg-blue-500 text-white md:mb-0 md:mr-5"
                                                    onClick={handleDownload}
                                                >
                                                    ダウンロード
                                                </Button>
                                                <Button className="bg-blue-500 text-white" onClick={saveData}>
                                                    保存
                                                </Button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Spin>
    );
};

export default WorkingReports;
