import { Button, DatePicker, notification, Popconfirm, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import TitleCus from '../Layout/TitleCus';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusCircleOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import CreateReport from './CreateReport';
import { deleteDailyReportRegis, getDailyReportRegis } from '../../../services/api.service';
import UpdateReport from './UpdateReport';

const monthsInJapanese = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

const ReportTable = () => {
    const [listReport, setListReport] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [loading, setLoading] = useState(false);
    const [openModalCreate, setOpenModalCreate] = useState(false);

    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    //custom 月
    const weekdaysInJapanese = ['日', '月', '火', '水', '木', '金', '土'];
    const monthCellRender = (date) => {
        const month = date.month();
        return <div>{monthsInJapanese[month]}</div>;
    };

    useEffect(() => {
        fetchRegisList(selectedDate);
    }, [selectedDate]);

    //日付を2日(水)みたいな形式に変換する関数
    const formatJapaneseDate = (dateString) => {
        const date = dayjs(dateString);
        const day = date.date();
        const weekday = weekdaysInJapanese[date.day()];
        return `${day}日(${weekday})`;
    };

    const fetchRegisList = async () => {
        setLoading(true);
        try {
            const formattedDate = selectedDate ? dayjs(selectedDate).format('YYYY-MM') : null;
            const res = await getDailyReportRegis(formattedDate);
            if (res?.data) {
                const sortedData = res?.data?.sort((a, b) => {
                    // 前の日付に基づいて比較し、次に午前/午後の時刻に基づいて比較します
                    if (a.date === b.date) {
                        if (a.time === 'AM' && b.time === 'PM') {
                            return -1;
                        }
                        if (a.time === 'PM' && b.time === 'AM') {
                            return 1;
                        }
                        return 0;
                    } else {
                        return dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1;
                    }
                });
                setListReport(sortedData);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            const res = await deleteDailyReportRegis(id);
            if (res.data) {
                notification.success({
                    message: '削除が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                fetchRegisList(selectedDate);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleSearch = (date) => {
        setSelectedDate(date);
    };

    const handleReload = () => {
        const currentDate = dayjs();
        setSelectedDate(currentDate);
    };
    const columns = [
        {
            title: <span className="flex items-center justify-center">日付</span>,
            dataIndex: 'date',
            key: 'date',
            width: 70,
            render: (value, row, index) => {
                const currentDate = row.date;
                const previousDate = index > 0 ? listReport[index - 1].date : null;

                const totalTimeForDay = listReport
                    .filter((item) => item.date === currentDate)
                    .reduce((acc, item) => acc + parseFloat(item.timeSchedule || 0), 0);

                const isBelowThreshold = totalTimeForDay < 6;

                const obj = {
                    children: (
                        <span style={{ color: isBelowThreshold ? 'red' : 'inherit' }}>
                            {formatJapaneseDate(currentDate)}
                        </span>
                    ),
                    props: {},
                };

                if (previousDate === currentDate) {
                    obj.props.rowSpan = 0;
                } else {
                    const sameDateItems = listReport.filter((item) => item.date === currentDate).length;
                    obj.props.rowSpan = sameDateItems;
                }

                return obj;
            },
        },

        {
            title: <span className="flex items-center justify-center">午前中 午後</span>,
            dataIndex: 'time',
            key: 'time',
            align: 'center',
            width: 60,
            render: (value, row, index) => {
                const currentDate = row.date;
                const previousTime = index > 0 ? listReport[index - 1].time : null;

                const totalTimeForDay = listReport
                    .filter((item) => item.date === currentDate)
                    .reduce((acc, item) => acc + parseFloat(item.timeSchedule || 0), 0);

                const isBelowThreshold = totalTimeForDay < 6;

                const sameTimeItems = listReport.filter((item) => item.date === row.date && item.time === value).length;

                const obj = {
                    children: <span style={{ color: isBelowThreshold ? 'red' : 'inherit' }}>{value}</span>,
                    props: {},
                };

                if (previousTime === value && listReport[index - 1].date === row.date) {
                    obj.props.rowSpan = 0;
                } else {
                    obj.props.rowSpan = sameTimeItems;
                }

                return obj;
            },
        },
        {
            title: <span className="flex items-center justify-center">仕事内容</span>,
            dataIndex: 'jobDescription',
            key: 'jobDescription',
            width: 150,
            render: (text, row) => {
                const currentDate = row.date;

                const totalTimeForDay = listReport
                    .filter((item) => item.date === currentDate)
                    .reduce((acc, item) => acc + parseFloat(item.timeSchedule || 0), 0);

                const isBelowThreshold = totalTimeForDay < 6;

                return (
                    <div
                        style={{
                            color: isBelowThreshold ? 'red' : 'inherit',
                            wordWrap: 'break-word',
                            whiteSpace: 'pre-wrap',
                        }}
                    >
                        {text}
                    </div>
                );
            },
        },
        {
            title: <span className="flex items-center justify-center">何件数/人</span>,
            dataIndex: 'quantity',
            key: 'quantity',
            width: 52,
            render: (text, row) => {
                const currentDate = row.date;

                const totalTimeForDay = listReport
                    .filter((item) => item.date === currentDate)
                    .reduce((acc, item) => acc + parseFloat(item.timeSchedule || 0), 0);

                const isBelowThreshold = totalTimeForDay < 6;

                return <span style={{ color: isBelowThreshold ? 'red' : 'inherit' }}>{text}</span>;
            },
        },
        {
            title: (
                <span className="flex items-center justify-center">
                    必要
                    <br />
                    時間予定
                </span>
            ),
            dataIndex: 'timeSchedule',
            key: 'timeSchedule',
            align: 'center',
            width: 70,
            render: (text, row) => {
                const currentDate = row.date;

                const totalTimeForDay = listReport
                    .filter((item) => item.date === currentDate)
                    .reduce((acc, item) => acc + parseFloat(item.timeSchedule || 0), 0);

                const isBelowThreshold = totalTimeForDay < 6;

                return <div style={{ color: isBelowThreshold ? 'red' : 'inherit' }}>{text}</div>;
            },
        },
        {
            title: <span className="flex items-center justify-center">承認状態</span>,
            width: 100,
            children: [
                {
                    title: <span className="flex items-center justify-center">リーダー</span>,
                    dataIndex: 'leaderApproval',
                    width: 70,
                    render: (text) =>
                        text === true ? (
                            <CheckCircleOutlined className="flex items-center justify-center text-green-500" />
                        ) : (
                            <CloseCircleOutlined className="flex items-center justify-center text-red-500" />
                        ),
                },
                {
                    title: <span className="flex items-center justify-center">社長</span>,
                    dataIndex: 'ceoApproval',
                    width: 60,
                    render: (text) =>
                        text === true ? (
                            <CheckCircleOutlined className="flex items-center justify-center text-green-500" />
                        ) : (
                            <CloseCircleOutlined className="flex items-center justify-center text-red-500" />
                        ),
                },
            ],
        },
        {
            title: (
                <span className="flex items-center justify-center">
                    実際
                    <br />
                    完成時間
                </span>
            ),
            dataIndex: 'actualCompletionTime',
            key: 'actualCompletionTime',
            align: 'center',
            width: 70,
            render: (text, row) => {
                const currentDate = row.date;

                const totalTimeForDay = listReport
                    .filter((item) => item.date === currentDate)
                    .reduce((acc, item) => acc + parseFloat(item.timeSchedule || 0), 0);

                const isBelowThreshold = totalTimeForDay < 6;

                return <div style={{ color: isBelowThreshold ? 'red' : 'inherit' }}>{text}</div>;
            },
        },
        {
            title: <span className="flex items-center justify-center">完成 できない理由</span>,
            dataIndex: 'reason',
            key: 'reason',
            align: 'center',
            width: 150,
            render: (text, row) => {
                const currentDate = row.date;

                const totalTimeForDay = listReport
                    .filter((item) => item.date === currentDate)
                    .reduce((acc, item) => acc + parseFloat(item.timeSchedule || 0), 0);

                const isBelowThreshold = totalTimeForDay < 6;

                return (
                    <div
                        style={{
                            color: isBelowThreshold ? 'red' : 'inherit',
                            wordWrap: 'break-word',
                            whiteSpace: 'pre-wrap',
                        }}
                    >
                        {text}
                    </div>
                );
            },
        },
        {
            title: <span className="flex items-center justify-center">情報共有事項</span>,
            dataIndex: 'informationSharing',
            key: 'informationSharing',
            width: 150,
            render: (text, row) => {
                const currentDate = row.date;

                const totalTimeForDay = listReport
                    .filter((item) => item.date === currentDate)
                    .reduce((acc, item) => acc + parseFloat(item.timeSchedule || 0), 0);

                const isBelowThreshold = totalTimeForDay < 6;

                return (
                    <div
                        style={{
                            color: isBelowThreshold ? 'red' : 'inherit',
                            wordWrap: 'break-word',
                            whiteSpace: 'pre-wrap',
                        }}
                    >
                        {text}
                    </div>
                );
            },
        },
        {
            title: <span className="flex items-center justify-center">備考</span>,
            dataIndex: 'other',
            key: 'other',
            width: 150,
            render: (text, row) => {
                const currentDate = row.date;

                const totalTimeForDay = listReport
                    .filter((item) => item.date === currentDate)
                    .reduce((acc, item) => acc + parseFloat(item.timeSchedule || 0), 0);

                const isBelowThreshold = totalTimeForDay < 6;

                return (
                    <div
                        style={{
                            color: isBelowThreshold ? 'red' : 'inherit',
                            wordWrap: 'break-word',
                            whiteSpace: 'pre-wrap',
                        }}
                    >
                        {text}
                    </div>
                );
            },
        },
        {
            title: '',
            width: 50,
            render: (record) => {
                const isApproval = record.ceoApproval || record.leaderApproval;
                return (
                    <div className="flex items-center justify-center space-x-5">
                        <EditOutlined
                            className={isApproval ? 'text-gray-400' : 'text-blue-700'}
                            onClick={() => {
                                if (!isApproval) {
                                    setOpenModalUpdate(true);
                                    setSelectedReport(record);
                                }
                            }}
                            style={{ cursor: isApproval ? 'not-allowed' : 'pointer' }}
                            disabled={isApproval}
                        />

                        <Popconfirm
                            title="確認"
                            okText="削除"
                            cancelText="キャンセル"
                            placement="bottomRight"
                            description={`${record.jobDescription}を削除してもよろしいですか？`}
                            onConfirm={() => handleDelete(record.id)}
                            disabled={isApproval}
                        >
                            <DeleteOutlined
                                className={isApproval ? 'text-gray-400' : 'text-red-500'}
                                style={{ cursor: isApproval ? 'not-allowed' : 'pointer' }}
                            />
                        </Popconfirm>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <TitleCus title={'日報登録'} />
            <div className="p-10">
                <div className="mb-3 flex items-center justify-between">
                    <DatePicker
                        value={selectedDate}
                        onChange={handleSearch}
                        picker="month"
                        cellRender={monthCellRender}
                    />

                    <div className="space-x-2">
                        <Button type="primary" onClick={() => setOpenModalCreate(true)}>
                            <PlusCircleOutlined />
                            登録
                        </Button>
                        <Button type="primary" onClick={handleReload}>
                            <ReloadOutlined />
                        </Button>
                    </div>
                </div>
                <Table
                    dataSource={listReport}
                    columns={columns}
                    rowKey={'id'}
                    loading={loading}
                    pagination={false}
                    scroll={{ y: window.innerHeight * 0.75 }}
                />
                <CreateReport
                    openModalCreate={openModalCreate}
                    setOpenModalCreate={setOpenModalCreate}
                    fetchRegisList={fetchRegisList}
                    selectedDate={selectedDate}
                />
                <UpdateReport
                    openModalUpdate={openModalUpdate}
                    setOpenModalUpdate={setOpenModalUpdate}
                    fetchRegisList={fetchRegisList}
                    selectedDate={selectedDate}
                    selectedReport={selectedReport}
                />
            </div>
        </>
    );
};

export default ReportTable;
