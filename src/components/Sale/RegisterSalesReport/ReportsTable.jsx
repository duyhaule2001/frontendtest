import { Button, DatePicker, notification, Popconfirm, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import TitleCus from '../../Common/Layout/TitleCus';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusCircleOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { approvalReports, deleteReports, getReportsList } from '../../../services/sale.service';
import CreateReport from './CreateReport';
import UpdateReports from './UpdateReports';
import { useSelector } from 'react-redux';

const ReportsTable = () => {
    const user = useSelector((state) => state.account.user);
    const [listReport, setListReport] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [loading, setLoading] = useState(false);
    const [openModalCreate, setOpenModalCreate] = useState(false);

    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        fetchRegisList(selectedDate);
    }, [selectedDate]);

    const fetchRegisList = async (selectedDate) => {
        setLoading(true);
        try {
            const formattedDate = selectedDate ? dayjs(selectedDate).format('YYYY-MM') : null;
            const res = await getReportsList(formattedDate);
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
            const res = await deleteReports(id);
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

    const handleChangeDate = (date) => {
        setSelectedDate(date);
    };

    const columns = [
        {
            title: '日付',
            dataIndex: 'date',
            key: 'date',
            width: 70,
            align: 'center',
            render: (value, row, index) => {
                const currentDate = row.date;
                const previousDate = index > 0 ? listReport[index - 1].date : null;

                const obj = {
                    children: <span>{dayjs(currentDate).format('DD')}日</span>,
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
            title: (
                <span className="flex items-center justify-center">
                    午前
                    <br />
                    午後
                </span>
            ),
            dataIndex: 'time',
            key: 'time',
            align: 'center',
            width: 60,
            render: (value, row, index) => {
                const currentDate = row.date;
                const previousTime = index > 0 ? listReport[index - 1].time : null;

                const sameTimeItems = listReport.filter((item) => item.date === row.date && item.time === value).length;

                const obj = {
                    children: <span>{value}</span>,
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

                ...(user.permissions === 4
                    ? [
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
                      ]
                    : []),

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
            title: '',
            width: 80,
            fixed: 'right',
            align: 'center',
            render: (value, row, index) => {
                const isApproval = row.managerApproval || row.ceoApproval;
                const isCreated = row.emp_no === user.emp_no ? true : false;
                // 社長も部長もない場合、修正と削除イコン表示
                return (
                    <div className="flex space-x-5">
                        <EditOutlined
                            className={isApproval || !isCreated ? 'text-gray-400' : 'text-blue-700'}
                            onClick={() => {
                                if (!(isApproval || !isCreated)) {
                                    // Only open modal if not disabled
                                    setOpenModalUpdate(true);
                                    setSelectedReport(row);
                                }
                            }}
                            style={{ cursor: isApproval || !isCreated ? 'not-allowed' : 'pointer' }}
                        />

                        <Popconfirm
                            title="確認"
                            okText="削除"
                            cancelText="キャンセル"
                            placement="bottomRight"
                            description={`${row.jobDescription}を削除してもよろしいですか？`}
                            onConfirm={() => handleDelete(row.id)}
                            disabled={isApproval || !isCreated}
                        >
                            <DeleteOutlined
                                className={isApproval || !isCreated ? 'text-gray-400' : 'text-red-500'}
                                style={{ cursor: isApproval || !isCreated ? 'not-allowed' : 'pointer' }}
                            />
                        </Popconfirm>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <TitleCus title="日報登録" />
            <div className="mt-4 p-5">
                <div className="mb-3 flex items-center justify-between">
                    <div className="flex space-x-4">
                        <DatePicker value={selectedDate} onChange={handleChangeDate} picker="month" />
                    </div>

                    <div className="flex items-center justify-between">
                        <Button type="primary" onClick={() => setOpenModalCreate(true)}>
                            <PlusCircleOutlined />
                            登録
                        </Button>

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
                />
                <CreateReport
                    openModalCreate={openModalCreate}
                    setOpenModalCreate={setOpenModalCreate}
                    fetchRegisList={fetchRegisList}
                    selectedDate={selectedDate}
                />
                <UpdateReports
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

export default ReportsTable;
