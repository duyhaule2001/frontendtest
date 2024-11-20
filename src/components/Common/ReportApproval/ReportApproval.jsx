import React, { useEffect, useState } from 'react';
import TitleCus from '../Layout/TitleCus';
import { Button, DatePicker, notification, Popconfirm, Table } from 'antd';
import dayjs from 'dayjs';
import { getAllReportApprovalByDate, updateReportApproval } from '../../../services/api.service';
import { useSelector } from 'react-redux';

const ReportApproval = ({ type }) => {
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const currentRole = useSelector((state) => state.account.user.managerial_position);

    useEffect(() => {
        fetchData();
    }, [date]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAllReportApprovalByDate(date, type);
            if (res.data) {
                // 最初に名前で並べ替え、次に時間で並べ替えます (午前が最初、午後が 2 番目)
                const sortedData = res.data.sort((a, b) => {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    // 名前が同じ場合は時間順にソート
                    if (a.time === 'AM' && b.time === 'PM') return -1;
                    if (a.time === 'PM' && b.time === 'AM') return 1;
                    return 0;
                });
                setReportData(sortedData);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleApprove = async (id) => {
        try {
            const res = await updateReportApproval(id);
            if (res && res.data) {
                notification.success({
                    message: '承認が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                fetchData();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const calculateRowSpan = (data, index, key, groupBy = null) => {
        let span = 1;
        if (
            index === 0 ||
            data[index][key] !== data[index - 1][key] ||
            (groupBy && data[index][groupBy] !== data[index - 1][groupBy])
        ) {
            for (let i = index + 1; i < data.length; i++) {
                if (data[i][key] === data[index][key] && (!groupBy || data[i][groupBy] === data[index][groupBy])) {
                    span++;
                } else {
                    break;
                }
            }
        } else {
            span = 0; // 前の行と同じ場合は行を非表示にします
        }
        return span;
    };

    const columns = [
        {
            title: '名前',
            dataIndex: 'name',
            width: 120,
            align: 'center',
            render: (value, row, index) => {
                const rowSpan = calculateRowSpan(reportData, index, 'name');
                return {
                    children: value,
                    props: {
                        rowSpan,
                    },
                };
            },
        },
        {
            title: '午前/午後',
            dataIndex: 'time',
            align: 'center',
            render: (value, row, index) => {
                const rowSpan = calculateRowSpan(reportData, index, 'time', 'name');
                return {
                    children: value,
                    props: {
                        rowSpan,
                    },
                };
            },
        },
        {
            title: '仕事内容',
            align: 'center',
            dataIndex: 'jobDescription',
        },
        {
            title: '何件(数/人)',
            align: 'center',
            dataIndex: 'quantity',
        },
        {
            title: '必要時間予定',
            align: 'center',
            dataIndex: 'timeSchedule',
        },
        {
            title: '完成できない理由',
            align: 'center',
            dataIndex: 'reason',
        },
        {
            title: '情報共有事項',
            align: 'center',
            dataIndex: 'informationSharing',
        },
        {
            title: '備考',
            align: 'center',
            dataIndex: 'other',
        },
        {
            title: '',
            dataIndex: 'leaderApproval',
            align: 'center',
            width: 60,
            render: (text, record) => {
                if (currentRole === '部長' && record.leaderApproval) {
                    return <></>;
                }

                if (currentRole === '部長' && !record.leaderApproval) {
                    return (
                        <Popconfirm
                            title="確認"
                            okText="承認"
                            cancelText="キャンセル"
                            placement="bottomRight"
                            description="この日報を承認してよろしいでしょうか？"
                            onConfirm={() => handleApprove(record.id)}
                        >
                            <Button type="primary">承認</Button>
                        </Popconfirm>
                    );
                }

                if (currentRole === '社長' && record.ceoApproval) {
                    return <></>;
                }

                if (currentRole === '社長' && !record.ceoApproval) {
                    return (
                        <Popconfirm
                            title="確認"
                            okText="承認"
                            cancelText="キャンセル"
                            placement="bottomRight"
                            description="この日報を承認してよろしいでしょうか？"
                            onConfirm={() => handleApprove(record.id)}
                        >
                            <Button type="primary">承認</Button>
                        </Popconfirm>
                    );
                }

                return null;
            },
        },
    ];
    return (
        <div>
            <TitleCus title={type === 'hr' ? '人事日報承認' : '総務日報承認'} />
            <div className="p-10">
                <div className="mb-3 flex items-center space-x-4">
                    <DatePicker
                        placeholder="日付を選択"
                        value={dayjs(date)}
                        onChange={(value) => {
                            if (value) {
                                setDate(value.format('YYYY-MM-DD'));
                            }
                        }}
                    />
                </div>
                <Table
                    rowKey={'id'}
                    columns={columns}
                    dataSource={reportData}
                    locale={{ emptyText: 'データがありません。' }}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default ReportApproval;
