import { Button, message, Table, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { EditOutlined, FileAddOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import SearchInputCus from '../Layout/Input/SearchInputCus.jsx';
import UpdateWorking from './UpdateWorking.jsx';
import CreateScorpion from './CreateScorpion.jsx';
import TitleCus from '../Layout/TitleCus.jsx';
import { searchTimeWorkingHours, suggestionWorkingUser } from '../../../services/common.service.js';
import ViewWorkDayLog from './ViewWorkDayLog.jsx';
import DatePickerYearMonth from '../Layout/Input/DatePickerYearMonth.jsx';

const WorkingHoursManagement = () => {
    const [workingData, setWorkingData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentMonth, setCurrentMonth] = useState();
    const [options, setOptions] = useState([]);

    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [itemUpdate, setItemUpdate] = useState(null);

    const [selectedRow, setSelectedRow] = useState([]);
    const [showTooltip, setShowTooltip] = useState(false);
    const [openModalCreateFile, setOpenModalCreateFile] = useState(false);

    const [showWorkDayLog, setShowWorkDayLog] = useState(false);
    const [selectedView, setSelectedView] = useState(null);

    useEffect(() => {
        const currentMonth = dayjs().format('YYYY-MM');
        setCurrentMonth(currentMonth);
        fetchWorkingData(currentMonth);
    }, []);

    const fetchWorkingData = async (selectedDate) => {
        setCurrentMonth(selectedDate);
        setLoading(true);
        try {
            const res = await searchTimeWorkingHours(selectedDate);

            if (res && res.data) {
                setWorkingData(res.data);
            }
        } catch (error) {
            console.log('APIに問題があります。');
        } finally {
            setLoading(false);
        }
    };

    //名前検索提案
    const onSearch = async (searchText) => {
        if (!searchText) {
            setOptions([]);
            return;
        }
        try {
            const res = await suggestionWorkingUser(searchText);
            if (res.data) {
                const optionsList = res.data.map((item) => ({ value: item.name }));
                setOptions(optionsList);
            } else {
                setOptions([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    //名前検索
    const handleSearchWorking = (name) => {
        const filteredData = workingData.filter((item) => item.name.includes(name));

        setWorkingData(filteredData);

        if (filteredData.length === 0) {
            message.warning({
                content: `入力されたお名前のデータは${currentMonth}には存在しません。もう一度年月を選択してからお名前を検索してください。`,
                duration: 5,
                style: {
                    marginTop: '80px',
                },
            });
        }
    };

    //RowSelection の構成
    const rowSelection = {
        onChange: (selectedRows) => {
            setSelectedRow(selectedRows);
        },
        getCheckboxProps: (record) => ({
            name: record.name,
        }),
    };

    //請求書制作
    const handleCreateFile = () => {
        if (selectedRow.length === 0) {
            setShowTooltip(true);
        } else {
            setShowTooltip(false);
            setOpenModalCreateFile(true);
        }
    };

    const columns = [
        {
            title: '社員番号',
            dataIndex: 'employeeNumber',
            align: 'center',
        },
        {
            title: <span className="flex items-center justify-center">氏名</span>,
            dataIndex: 'name',
        },
        {
            title: <span className="flex items-center justify-center">現場</span>,
            dataIndex: 'site_name',
        },
        {
            title: '合計稼時間',
            dataIndex: 'total_uptime',
            align: 'center',
        },
        {
            title: '精算範囲',
            dataIndex: 'calculation_range',
            align: 'center',
        },
        {
            title: '精算月日',
            dataIndex: 'settlement_date',
            align: 'center',
        },
        {
            title: '精算金額',
            dataIndex: 'settlement_amount',
            align: 'center',
        },
        {
            title: '控除精算',
            dataIndex: 'deduction_settlement',
            align: 'center',
        },

        {
            title: '合計通勤日数',
            dataIndex: 'total_commute_day',
            align: 'center',

            render: (text, record) => {
                return (
                    <span
                        onClick={() => {
                            setShowWorkDayLog(true);
                            setSelectedView(record);
                        }}
                        className="block w-full cursor-pointer text-center text-blue-500"
                    >
                        {text}
                    </span>
                );
            },
        },
        {
            title: '合計交通費',
            dataIndex: 'total_travel_expenses',
            align: 'center',

            render: (value) => {
                const formattedValue = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(
                    value,
                );
                return <span>{formattedValue}</span>;
            },
        },
        {
            title: '',
            align: 'center',
            render: (record) => {
                return (
                    <>
                        <EditOutlined
                            onClick={() => {
                                setOpenUpdateModal(true);
                                setItemUpdate(record);
                            }}
                            className="text-blue-500"
                        />
                    </>
                );
            },
        },
    ];

    return (
        <>
            <>
                <TitleCus title={'稼働時間管理'} />
                <div className="mt-9 px-10">
                    <DatePickerYearMonth onSearch={fetchWorkingData} />

                    <div className="flex">
                        <SearchInputCus
                            label={<span className="font-sans text-xl">氏名</span>}
                            placeholder={'お名前を入力してください'}
                            options={options}
                            onSearch={onSearch}
                            handleSearch={handleSearchWorking}
                            loading={loading}
                        />
                    </div>
                    <div className="mb-2 mt-4 flex justify-between">
                        <span className="font-bold text-red-500">
                            氏名検索機能は{currentMonth}の期間のみ使用できます。
                        </span>
                        <div className="space-x-2">
                            <Tooltip
                                title="先に社員を選択してください。"
                                color="red"
                                open={showTooltip}
                                onOpenChange={(open) => {
                                    if (!open) setShowTooltip(false);
                                }}
                            >
                                <Button type="primary" onClick={handleCreateFile}>
                                    <FileAddOutlined /> 請求書作成
                                </Button>
                            </Tooltip>
                            <Button onClick={() => fetchWorkingData(currentMonth)} type="primary">
                                <ReloadOutlined />
                            </Button>
                        </div>
                    </div>

                    <Table
                        dataSource={workingData}
                        columns={columns}
                        loading={loading}
                        rowKey={'id'}
                        locale={{
                            emptyText: 'データはありません。',
                        }}
                        rowSelection={rowSelection}
                    />
                    <UpdateWorking
                        openUpdateModal={openUpdateModal}
                        setOpenUpdateModal={setOpenUpdateModal}
                        itemUpdate={itemUpdate}
                        currentMonth={currentMonth}
                        fetchWorkingData={fetchWorkingData}
                    />
                    <CreateScorpion
                        openModalCreateFile={openModalCreateFile}
                        setOpenModalCreateFile={setOpenModalCreateFile}
                        selectedRow={selectedRow}
                    />
                    <ViewWorkDayLog
                        showWorkDayLog={showWorkDayLog}
                        setShowWorkDayLog={setShowWorkDayLog}
                        selectedView={selectedView}
                        currentMonth={currentMonth}
                    />
                </div>
            </>
        </>
    );
};

export default WorkingHoursManagement;
