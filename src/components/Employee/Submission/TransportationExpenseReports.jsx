import React, { useEffect, useRef, useState } from 'react';
import { Button, notification, Select, Spin } from 'antd';
import { getHolidaysAPI } from '../../../services/common.service';
import {
    deleteFileTrainAPI,
    getFileTrainAPI,
    getTrainReport,
    submitTrainReport,
    uploadFileTrainAPI,
} from '../../../services/employee.service';
import YearMonthSelector from '../../Common/Layout/Input/YearMonthSelector';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useSelector } from 'react-redux';

const TransportationExpenseReports = () => {
    const user = useSelector((state) => state.account.user);
    const [loading, setLoading] = useState(false);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);

    const handleChangeYear = (direction) => {
        setYear(year + direction);
    };

    const getDayOfWeek = (year, month, day) => {
        const date = new Date(year, month - 1, day);
        const days = ['日', '月', '火', '水', '木', '金', '土'];
        return days[date.getDay()];
    };

    const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

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

    const daysInMonth = getDaysInMonth(year, month);
    const defaultData = [
        ...Array.from({ length: daysInMonth }, (_, i) => ({
            id: null,
            date: String(i + 1).padStart(2, '0'),
            departure: '',
            destination: '',
            amount: 0,
            type: null,
            notes: '',
            isNew: false,
        })),
        {
            id: null,
            date: '定期券',
            departure: '',
            destination: '',
            amount: 0,
            type: null,
            notes: '',
            isNew: false,
        },
    ];
    const [rows, setRows] = useState([]);

    const [totalAmount, setTotalAmount] = useState();
    const fetchData = async () => {
        setLoading(true);
        setRows([]);
        try {
            const response = await getTrainReport(year, month);
            if (response.data) {
                const sortedData = response.data.expenses.sort((a, b) => {
                    if (a.date === '定期券') return 1;
                    if (b.date === '定期券') return -1;
                    return a.date - b.date;
                });
                setRows(sortedData);
                setTotalAmount(response.data.totalAmount);
            } else {
                setRows(defaultData);
                setTotalAmount(0);
            }
        } catch (error) {
            setRows(defaultData);
            setTotalAmount(0);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [year, month]);

    const addRow = (index) => {
        const newRows = [...rows];
        const currentDate = newRows[index].date;
        const newRow = {
            id: null,
            date: currentDate,
            departure: '',
            destination: '',
            amount: 0,
            type: null,
            notes: '',
            isNew: true,
        };
        newRows.splice(index + 1, 0, newRow);
        setRows(newRows);
    };

    const deleteRow = (index) => {
        if (rows[index].isNew && rows.length > 1) {
            const newRows = rows.filter((_, i) => i !== index);
            setRows(newRows);
        }
    };

    const handleInputChange = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

    const handleSave = async () => {
        const dataToSend = {
            year: year,
            month: month,
            expenses: rows,
        };
        const response = await submitTrainReport(dataToSend);
        if (response.data) {
            notification.success({
                message: '保存が成功しました。',
                style: {
                    width: 270,
                },
            });
            fetchData();
        } else {
            notification.error({
                message: '保存が失敗しました。',
                style: {
                    width: 270,
                },
            });
        }
    };

    // upload file
    const [uploadedFile, setUploadedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleAttachClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleUploadFile = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                const response = await uploadFileTrainAPI(formData, year, month);
                if (response.data) {
                    setUploadedFile(response.data);
                    notification.success({
                        message: 'ファイルのアップロードが成功しました。',
                    });
                } else {
                    notification.error({
                        message: 'ファイルのアップロードが失敗しました',
                    });
                }
            } catch (error) {
                console.error('File upload failed', error);
            }
        }
    };

    const handleDeleteFile = async () => {
        if (uploadedFile) {
            try {
                await deleteFileTrainAPI(uploadedFile.id);
                setUploadedFile(null);
                notification.success({
                    message: '削除が成功しました。',
                    style: {
                        width: 270,
                    },
                });
            } catch (error) {
                console.error('File delete failed', error);
                notification.error({
                    message: 'ファイル削除が失敗しました',
                    style: {
                        width: 270,
                    },
                });
            }
        }
    };

    const fetchUploadedFile = async () => {
        try {
            const response = await getFileTrainAPI(year, month);
            if (response.data) {
                setUploadedFile(response.data);
            } else {
                setUploadedFile(null);
            }
        } catch (error) {
            setUploadedFile(null);
            console.error('Failed to fetch uploaded file', error);
        }
    };

    useEffect(() => {
        fetchUploadedFile();
    }, []);

    const handleDownload = async () => {
        const response = await fetch('/templates/train_report_template.xlsx');
        const arrayBuffer = await response.arrayBuffer();

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        const worksheet = workbook.worksheets[0];

        const templateRow11 = worksheet.getRow(11);

        const filteredData = rows.filter((row) => row.departure && row.destination && row.amount);

        const copyCellStyle = (sourceCell, targetCell) => {
            targetCell.font = { ...sourceCell.font };
            targetCell.border = { ...sourceCell.border };
            targetCell.fill = { ...sourceCell.fill };
            targetCell.alignment = { ...sourceCell.alignment };
            targetCell.numFmt = sourceCell.numFmt;
        };

        filteredData.forEach((row, index) => {
            const excelRow = worksheet.getRow(index + 11);
            const dayOfWeek = getDayOfWeek(year, month, row.date);
            templateRow11.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                const newCell = excelRow.getCell(colNumber);
                copyCellStyle(cell, newCell);
            });
            excelRow.getCell('A').value = row.date === '定期券' ? row.date : `${month}月${row.date}日 (${dayOfWeek})`;
            excelRow.getCell('B').value = row.departure;
            excelRow.getCell('C').value = row.destination;
            excelRow.getCell('D').value = row.amount;
            excelRow.getCell('E').value = row.type === 0 ? '片道' : '往復';
            excelRow.getCell('F').value = row.notes;
        });

        worksheet.getCell('B5').value = `${year} 年 ${month} 月`;
        worksheet.getCell('B8').value = `${totalAmount}円`;

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(
            new Blob([buffer], { type: 'application/octet-stream' }),
            `${user.name}_${year}_${month}_交通費精算書.xlsx`,
        );
    };

    return (
        <div className="mt-10">
            <YearMonthSelector year={year} onChangeYear={handleChangeYear} month={month} setMonth={setMonth} />
            <Spin spinning={loading}>
                <div className="mx-auto w-full max-w-4xl px-4">
                    <table className="min-w-full rounded-lg border border-gray-300 bg-white shadow-md">
                        <thead className="bg-sky-200">
                            <tr>
                                <th className="border-b border-gray-300 px-2 py-2 text-left"></th>
                                <th className="border-b border-gray-300 px-2 py-2">日付</th>
                                <th className="border-b border-gray-300 px-2 py-2">出発地</th>
                                <th className="border-b border-gray-300 px-2 py-2">目的地</th>
                                <th className="border-b border-gray-300 px-2 py-2">金額（円）</th>
                                <th className="border-b border-gray-300 px-2 py-2">片道・往復</th>
                                <th className="border-b border-gray-300 px-2 py-2">目的・備考</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => {
                                const dayOfWeek = getDayOfWeek(year, month, row.date);
                                return (
                                    <tr key={row.id}>
                                        <td className="border-b border-gray-300 text-center">
                                            {row.isNew ? (
                                                <button onClick={() => deleteRow(index)}>-</button>
                                            ) : (
                                                <button onClick={() => addRow(index)}>+</button>
                                            )}
                                        </td>
                                        <td
                                            className={`w-[150px] border-b border-gray-300 px-1 text-center ${isHoliday(year, month, row.date) ? 'text-red-500' : ''}`}
                                        >
                                            {row.date === '定期券'
                                                ? row.date
                                                : `${month}月${row.date}日 (${dayOfWeek})`}
                                        </td>
                                        <td className="border-b border-gray-300 text-center">
                                            <input
                                                type="text"
                                                className="w-full rounded border p-1 focus:outline-none"
                                                value={row.departure}
                                                onChange={(e) => handleInputChange(index, 'departure', e.target.value)}
                                            />
                                        </td>
                                        <td className="border-b border-gray-300 text-center">
                                            <input
                                                type="text"
                                                className="w-full rounded border p-1 focus:outline-none"
                                                value={row.destination}
                                                onChange={(e) =>
                                                    handleInputChange(index, 'destination', e.target.value)
                                                }
                                            />
                                        </td>
                                        <td className="border-b border-gray-300 text-center">
                                            <input
                                                type="number"
                                                className="w-full rounded border p-1 focus:outline-none"
                                                value={row.amount === 0 ? '' : row.amount}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        index,
                                                        'amount',
                                                        e.target.value === '' ? 0 : Number(e.target.value),
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="border-b border-gray-300 text-center">
                                            <Select
                                                value={row.type}
                                                onChange={(value) => handleInputChange(index, 'type', value)}
                                                className="w-full"
                                            >
                                                <Select.Option value={0}>片道</Select.Option>
                                                <Select.Option value={1}>往復</Select.Option>
                                            </Select>
                                        </td>
                                        <td className="border-b border-gray-300 text-center">
                                            <input
                                                type="text"
                                                className="w-full rounded border p-1 focus:outline-none"
                                                value={row.notes}
                                                onChange={(e) => handleInputChange(index, 'notes', e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                            <tr>
                                <td colSpan="7" className="border-t border-gray-300 text-center">
                                    <div className="mt-4 flex flex-col items-center px-4 py-2 md:flex-row md:justify-between">
                                        <div className="mb-2 text-lg md:mb-0">合計: {totalAmount} 円</div>
                                        <div className="flex flex-col md:flex-row md:items-center">
                                            {uploadedFile && uploadedFile.id && (
                                                <>
                                                    <span className="mr-5">添付ファイル</span>
                                                    <Button
                                                        className="mr-5 bg-red-400 text-white"
                                                        onClick={handleDeleteFile}
                                                    >
                                                        削除
                                                    </Button>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                onChange={handleUploadFile}
                                            />
                                            <Button className="mr-5 bg-blue-500 text-white" onClick={handleAttachClick}>
                                                添付
                                            </Button>
                                            <Button className="mr-5 bg-blue-500 text-white" onClick={handleDownload}>
                                                ダウンロード
                                            </Button>
                                            <Button className="mr-5 bg-blue-500 text-white" onClick={handleSave}>
                                                保存
                                            </Button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Spin>
        </div>
    );
};

export default TransportationExpenseReports;
