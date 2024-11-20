import { Button, DatePicker, notification, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import TitleCus from '../Common/Layout/TitleCus';
import { CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { approvalReports, getReportsListApproval } from '../../services/sale.service';
import { useSelector } from 'react-redux';

const RegisterSalesReportApproval = () => {
    const user = useSelector((state) => state.account.user);
    const [listReport, setListReport] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRegisList(selectedDate);
    }, [selectedDate]);

    const fetchRegisList = async (selectedDate) => {
        setLoading(true);
        try {
            const res = await getReportsListApproval(dayjs(selectedDate).format('YYYY-MM-DD'));
            if (res?.data) {
                // 最初に名前で並べ替え、次に時間で並べ替えます (午前が最初、午後が 2 番目)
                const sortedData = res.data.sort((a, b) => {
                    if (a.create_user < b.create_user) return -1;
                    if (a.create_user > b.create_user) return 1;
                    // 名前が同じ場合は時間順にソート
                    if (a.time === 'AM' && b.time === 'PM') return -1;
                    if (a.time === 'PM' && b.time === 'AM') return 1;
                    return 0;
                });
                setListReport(sortedData);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    // 承認;
    const handleApproval = async (id, type) => {
        try {
            let payload;

            if (type === 'manager') {
                payload = { managerApproval: true };
            } else if (type === 'ceo') {
                payload = { ceoApproval: true };
            } else if (type === 'vice_ceo') {
                payload = { vice_ceoApproval: true };
            }

            const res = await approvalReports(id, payload);
            if (res.data) {
                notification.success({
                    message: '承認が成功しました。',
                    style: { width: 270 },
                });
                fetchRegisList(selectedDate);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeDate = (date) => {
        setSelectedDate(date);
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
            title: <span className="flex items-center justify-center">氏名</span>,
            dataIndex: 'create_user',
            key: 'create_user',
            fixed: 'left',
            width: 200,
            render: (value, row, index) => {
                const rowSpan = calculateRowSpan(listReport, index, 'create_user');
                return {
                    children: value,
                    props: {
                        rowSpan,
                    },
                };
            },
        },
        {
            title: <span className="flex items-center justify-center">午前午後</span>,
            dataIndex: 'time',
            key: 'time',
            align: 'center',
            width: 50,
            fixed: 'left',
            render: (value, row, index) => {
                const rowSpan = calculateRowSpan(listReport, index, 'time', 'name');
                return {
                    children: value,
                    props: {
                        rowSpan,
                    },
                };
            },
        },

        {
            title: '対応予定',
            dataIndex: 'jobDescription',
            key: 'jobDescription',
            width: 200,
            align: 'center',
        },
        {
            title: '必要時間',
            dataIndex: 'requiredTime',
            key: 'requiredTime',
            align: 'center',
            width: 50,
        },
        {
            title: (
                <span>
                    打合せ
                    <br />
                    メール数
                </span>
            ),
            dataIndex: 'emailCount',
            key: 'emailCount',
            align: 'center',
            width: 70,
        },
        {
            title: (
                <span>
                    お客様別の
                    <br />
                    電話掛け数
                </span>
            ),
            dataIndex: 'callsToCustomers',
            key: 'callsToCustomers',
            align: 'center',
            width: 85,
        },
        {
            title: '提案数',
            dataIndex: 'proposalCount',
            key: 'proposalCount',
            align: 'center',
            width: 60,
        },
        {
            title: '面談数',
            dataIndex: 'meetingCount',
            key: 'meetingCount',
            align: 'center',
            width: 60,
        },
        {
            title: (
                <span>
                    トラブル
                    <br />
                    対応数
                </span>
            ),
            dataIndex: 'troubleResponseCount',
            key: 'troubleResponseCount',
            align: 'center',
            width: 70,
        },
        {
            title: '決まり数',
            dataIndex: 'closedDealsCount',
            key: 'closedDealsCount',
            align: 'center',
            width: 70,
        },
        {
            title: <span>承認</span>,
            children: [
                {
                    title: '部長',
                    dataIndex: 'managerApproval',
                    key: 'managerApproval',
                    align: 'center',
                    width: 50,
                    render: (value) => {
                        return value ? (
                            <CheckCircleOutlined className="text-green-500" />
                        ) : (
                            <CloseCircleOutlined className="text-red-500" />
                        );
                    },
                },

                {
                    title: '副社長',
                    dataIndex: 'vice_ceoApproval',
                    key: 'vice_ceoApproval',
                    align: 'center',
                    width: 55,
                    render: (value) => {
                        return value ? (
                            <CheckCircleOutlined className="text-green-500" />
                        ) : (
                            <CloseCircleOutlined className="text-red-500" />
                        );
                    },
                },
                {
                    title: '社長',
                    dataIndex: 'ceoApproval',
                    key: 'ceoApproval',
                    align: 'center',
                    width: 50,
                    render: (value) => {
                        return value ? (
                            <CheckCircleOutlined className="text-green-500" />
                        ) : (
                            <CloseCircleOutlined className="text-red-500" />
                        );
                    },
                },
            ],
        },

        {
            title: <span>対応</span>,
            children: [
                {
                    title: '訪問会社名',
                    dataIndex: 'handledCompany',
                    key: 'handledCompany',
                    align: 'center',
                    width: 170,
                },
                {
                    title: '担当部署',
                    dataIndex: 'handledDepartment',
                    key: 'handledDepartment',
                    align: 'center',
                    width: 85,
                },
                {
                    title: '面談者名',
                    dataIndex: 'meetingPerson',
                    key: 'meetingPerson',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '業務内容',
                    dataIndex: 'details',
                    align: 'center',
                    key: 'details',
                    width: 235,
                },
            ],
        },
        {
            title: (
                <span>
                    今後の <br />
                    対応、アクション、 <br />
                    提案、リカバリ内容等
                </span>
            ),
            dataIndex: 'futureActions',
            align: 'center',
            key: 'futureActions',
            width: 180,
        },
        {
            title: <span>留意点や社内関係者への共有事項等</span>,
            dataIndex: 'notes',
            align: 'center',
            key: 'notes',
            width: 145,
        },
        {
            title: '承認',
            width: 100,
            align: 'center',
            fixed: 'right',
            render: (text, row) => {
                let isApproved = false;
                let onClickHandler = null;

                // 部長の場合
                if (user.managerial_position === '部長') {
                    isApproved = row.managerApproval;
                    onClickHandler = () => handleApproval(row.id, 'manager');
                }
                // 社長の場合
                else if (user.managerial_position === '社長') {
                    isApproved = row.ceoApproval;
                    onClickHandler = () => handleApproval(row.id, 'ceo');
                }
                // 副社長の場合
                else if (user.managerial_position === '副社長') {
                    isApproved = row.vice_ceoApproval;
                    onClickHandler = () => handleApproval(row.id, 'vice_ceo');
                }

                // Nếu chưa được phê duyệt, hiển thị nút 承認
                return !isApproved ? (
                    <Button type="primary" onClick={onClickHandler}>
                        承認
                    </Button>
                ) : (
                    ''
                );
            },
        },
    ];

    return (
        <>
            <TitleCus title="営業日報承認" />
            <div className="mt-4 p-5">
                <div className="mb-3 flex items-center justify-between">
                    <div className="flex space-x-4">
                        <DatePicker value={selectedDate} onChange={handleChangeDate} />
                    </div>

                    <div className="flex items-center justify-between">
                        <Button
                            className="ml-2"
                            type="primary"
                            onClick={() => fetchRegisList(setSelectedDate(dayjs()))}
                        >
                            <ReloadOutlined />
                        </Button>
                    </div>
                </div>
                <Table
                    dataSource={listReport}
                    columns={columns}
                    rowKey={'id'}
                    loading={loading}
                    size="small"
                    scroll={{ x: 1500 }}
                    pagination={false}
                />
            </div>
        </>
    );
};

export default RegisterSalesReportApproval;
