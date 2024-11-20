import { Button, Modal, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { getAttendanceByEmpNo, getHolidaysAPI } from '../../../services/common.service';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const AttendanceModal = ({ isModalVisible, setIsModalVisible, selectedData, yearMonth }) => {
    const [loading, setLoading] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);
    const getDayOfWeek = (year, month, day) => {
        const date = new Date(year, month - 1, day);
        const days = ['日', '月', '火', '水', '木', '金', '土'];
        return days[date.getDay()];
    };
    const formatDate = (year, month, day) => {
        const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedDay = day < 10 ? `0${day}` : day;
        return `${year}-${formattedMonth}-${formattedDay}`;
    };
    const formatTime = (timeString) => {
        if (!timeString) return '';
        const time = new Date(timeString);
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
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

    useEffect(() => {
        if (yearMonth && selectedData) {
            const year = yearMonth.year();
            const month = yearMonth.month() + 1;
            fetchAttendance(year, month, selectedData.emp_no);
        }
    }, [yearMonth, isModalVisible, selectedData]);

    const fetchAttendance = async (year, month, empNo) => {
        setLoading(true);
        const daysInMonth = yearMonth.daysInMonth();
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
            const res = await getAttendanceByEmpNo(year, month, empNo);
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
            }
        } catch (error) {
            console.error('Failed to fetch', error);
        } finally {
            setAttendanceData(fillAttendanceData());
            setLoading(false);
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
                const dayOfWeek = getDayOfWeek(yearMonth.year(), yearMonth.month() + 1, day);

                if (dayData.records && dayData.records.length > 0) {
                    dayData.records.forEach((record) => {
                        worksheet.getCell(`A${excelRow}`).value = `${yearMonth.month() + 1}月${day}日(${dayOfWeek})`;
                        worksheet.getCell(`B${excelRow}`).value = record.start_time;
                        worksheet.getCell(`C${excelRow}`).value = record.end_time;
                        worksheet.getCell(`D${excelRow}`).value = record.break_start_time;
                        worksheet.getCell(`E${excelRow}`).value = record.break_end_time;
                        worksheet.getCell(`F${excelRow}`).value = record.totalWorkMinutes;

                        excelRow++;
                    });
                } else {
                    worksheet.getCell(`A${excelRow}`).value = `${yearMonth.month() + 1}月${day}日(${dayOfWeek})`;
                    worksheet.getCell(`B${excelRow}`).value = '';
                    worksheet.getCell(`C${excelRow}`).value = '';
                    worksheet.getCell(`D${excelRow}`).value = '';
                    worksheet.getCell(`E${excelRow}`).value = '';
                    worksheet.getCell(`F${excelRow}`).value = '';

                    excelRow++;
                }
            });

            worksheet.getCell('B4').value = `${selectedData.department}`;
            worksheet.getCell('B5').value = `${selectedData.emp_no}`;
            worksheet.getCell('B6').value = `${selectedData.name}`;
            worksheet.getCell('B7').value = `${countWorkingDays(attendanceData)}`;
            worksheet.getCell('B8').value = `${selectedData.totalWorkTime}`;
            worksheet.getCell('A1').value = `${yearMonth.year()} 年 ${yearMonth.month() + 1} 月 作業報告書`;

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(
                new Blob([buffer], { type: 'application/octet-stream' }),
                `${selectedData.name}_${yearMonth.year()}_${yearMonth.month() + 1}_作業報告書.xlsx`,
            );
        } catch (error) {
            console.error('Error generating Excel file:', error);
        }
    };

    return (
        <Modal
            title={
                <div className="flex justify-between">
                    <span>社員番号：{selectedData?.emp_no}</span>
                    <span>氏名：{selectedData?.name}</span>
                    <Button type="primary" onClick={handleDownload}>
                        ダウンロード
                    </Button>
                </div>
            }
            open={isModalVisible}
            onCancel={() => {
                setIsModalVisible(false);
            }}
            width={'80%'}
            footer={null}
            style={{ body: { padding: 0 } }}
            closable={false}
        >
            <Spin spinning={loading}>
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
                            const dayOfWeek = getDayOfWeek(
                                yearMonth.year(),
                                yearMonth.month() + 1,
                                dayData.date.split('-')[2],
                            );
                            return (
                                <React.Fragment key={index}>
                                    {dayData.records && dayData.records.length > 0 ? (
                                        dayData.records.map((record, idx) => (
                                            <tr key={idx}>
                                                <td
                                                    className={`border-b border-gray-300 px-4 py-2 text-center ${isHoliday(yearMonth.year(), yearMonth.month() + 1, dayData.date.split('-')[2]) ? 'text-red-500' : ''}`}
                                                >
                                                    {`${yearMonth.month() + 1}月${dayData.date.split('-')[2]}日(${dayOfWeek})`}
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
                                                    {record.remarks || ''}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                className={`border-b border-gray-300 px-4 py-2 text-center ${isHoliday(yearMonth.year(), yearMonth.month() + 1, dayData.date.split('-')[2]) ? 'text-red-500' : ''}`}
                                            >
                                                {`${yearMonth.month() + 1}月${dayData.date.split('-')[2]}日(${dayOfWeek})`}
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
                    </tbody>
                </table>
            </Spin>
        </Modal>
    );
};

export default AttendanceModal;
