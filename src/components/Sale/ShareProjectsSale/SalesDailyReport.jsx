import React, { useEffect, useState } from 'react';

import { Button, DatePicker, notification, Popconfirm, Table } from 'antd';
import { DeleteOutlined, DownCircleOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import CreateSalesReport from './CreateSalesReport.jsx';
import UpdateSalesReport from './UpdateSalesReport.jsx';
import TitleCus from '../../Common/Layout/TitleCus.jsx';
import { deleteReport, getReportList } from '../../../services/sale.service.js';
import { exportSalesReportToExcel } from './ExcelExport.js';
import ImageCus from '../../Common/Layout/ImageCus.jsx';

const SalesDailyReport = ({ showCreateButton = true, visibleColumns = [], handleExport }) => {
    const [reportList, setReportList] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);

    const [disabledRows, setDisabledRows] = useState([]); // 無効化された行の状態

    const [selectedDate, setSelectedDate] = useState(dayjs());

    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [itemUpdate, setItemUpdate] = useState(null);

    useEffect(() => {
        fetchReport(selectedDate);
    }, [selectedDate]);

    const fetchReport = async (selectedDate) => {
        try {
            const res = await getReportList(dayjs(selectedDate).format('YYYY-MM-DD'));
            if (res.data) {
                setReportList(res.data);

                // isDisabled に基づいて無効化された行をフィルタリング
                const disabledRows = res.data.filter((item) => item.isDisabled).map((item) => item.id);
                setDisabledRows(disabledRows);

                // 無効化された行を下にソート
                const sortedData = res.data.sort((a, b) => {
                    if (a.isDisabled && !b.isDisabled) return 1;
                    if (!a.isDisabled && b.isDisabled) return -1;
                    return 0;
                });

                setReportList(sortedData); // ソート後のレポートリストを更新
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeDate = (date) => {
        setSelectedDate(date);
    };

    const handleDelete = async (record) => {
        const res = await deleteReport(record.id, { isDisabled: true }); // サーバー上で isDisabled 状態を更新
        if (res.data) {
            notification.success({
                message: '削除が成功しました。',
                style: {
                    width: 270,
                },
            });
            const updatedList = reportList.map((item) => {
                if (item.id === record.id) {
                    return { ...item, isDisabled: true };
                }
                return item;
            });

            const sortedData = updatedList.sort((a, b) => {
                if (a.isDisabled && !b.isDisabled) return 1;
                if (!a.isDisabled && b.isDisabled) return -1;
                return 0;
            });

            setReportList(sortedData);
            setDisabledRows((prev) => [...prev, record.id]);
            fetchReport(selectedDate);
        } else {
            notification.error({
                message: '削除が失敗しました。',
            });
        }
    };

    //filters in column
    const generateFilters = (reportList, key) => {
        const uniqueValues = [...new Set(reportList.map((item) => item[key]))];

        return uniqueValues.map((value) => ({
            text: value,
            value: value,
        }));
    };

    const allColumns = [
        {
            title: '案件番号',
            dataIndex: 'caseNumber',
            align: 'center',
            width: 120,
            visible: visibleColumns.includes('caseNumber'),
        },
        {
            title: '条件内容',
            dataIndex: 'conditionDetails',
            align: 'center',
        },
        {
            title: '緊急度',
            dataIndex: 'urgency',
            align: 'center',
            render: (text) => {
                const style = text === '高' ? 'text-red-500 font-bold' : 'inherit';
                return <span className={style}>{text}</span>;
            },
            width: 100,
        },
        {
            title: (
                <span>
                    テレワーク
                    <br />
                    有/無
                    <br />
                    その他
                </span>
            ),
            dataIndex: 'telework',
            align: 'center',
            width: 98,
        },
        {
            title: '面談回数',
            dataIndex: 'interviewCount',
            align: 'center',
            width: 100,
        },
        {
            title: 'その他',
            dataIndex: 'otherDetails',
            align: 'center',
        },
        {
            title: (
                <span>
                    営業担当及び
                    <br />
                    提案先推薦部
                </span>
            ),
            dataIndex: 'sales_or_proposal_department',
            align: 'center',
            width: 120,
            visible: visibleColumns.includes('sales_or_proposal_department'),
        },
    ];

    const fullColumns = [
        {
            title: '会社名',
            dataIndex: 'companyName',
            align: 'center',
            width: 100,
            filters: generateFilters(reportList, 'companyName'),
            onFilter: (value, record) => record.companyName.indexOf(value) === 0,
        },
        {
            title: '部署',
            dataIndex: 'department',
            align: 'center',
            width: 80,
            filters: generateFilters(reportList, 'department'),
            onFilter: (value, record) => record.department.indexOf(value) === 0,
        },
        {
            title: '氏名',
            dataIndex: 'name',
            align: 'center',
            width: 100,
        },
        ...allColumns.filter((col) => col.visible !== false),
        {
            title: (
                <span>
                    社内対応方法
                    <br />
                    有/無
                </span>
            ),
            dataIndex: 'internalResponse',
            align: 'center',
        },
        {
            title: '注意点',
            dataIndex: 'notes',
            align: 'center',
        },
        {
            title: (
                <span>
                    部門と
                    <br />
                    組織図
                </span>
            ),
            dataIndex: 'departmentKnowledge',
            align: 'center',
            width: 80,
            render: (images) => <ImageCus img_path={images} />,
        },
        {
            title: '',
            width: 10,
            render: (record) => {
                const isDisabled = disabledRows.includes(record.id);
                return (
                    <div className="flex space-x-2">
                        <EditOutlined
                            onClick={() => {
                                setOpenModalUpdate(true);
                                setItemUpdate(record);
                            }}
                            className={isDisabled ? 'text-gray-400' : 'text-blue-500'}
                        />
                        <Popconfirm
                            placement="bottomRight"
                            title="確認"
                            okText="削除"
                            cancelText="キャンセル"
                            description={`${record.name}を削除してもよろしいですか？`}
                            onConfirm={() => handleDelete(record)}
                        >
                            <DeleteOutlined className="text-red-500" />
                        </Popconfirm>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="h-full w-full">
            <TitleCus title={'案件共有'} />
            <div className="mt-10 px-3">
                <div className="mb-3 flex justify-between">
                    <div className="flex space-x-3">
                        <DatePicker value={selectedDate} onChange={handleChangeDate} />
                        <Button type="primary" onClick={() => setSelectedDate(dayjs())}>
                            <ReloadOutlined />
                        </Button>
                    </div>
                    <div className="flex space-x-3">
                        <Button
                            type="primary"
                            onClick={() => {
                                if (handleExport) {
                                    handleExport(reportList, selectedDate);
                                } else {
                                    exportSalesReportToExcel(reportList, selectedDate);
                                }
                            }}
                        >
                            <DownCircleOutlined />
                            ダウンロード
                        </Button>
                        {showCreateButton && (
                            <Button onClick={() => setOpenModalCreate(true)} type="primary">
                                <PlusOutlined />
                                新規登録
                            </Button>
                        )}
                    </div>
                </div>
                <Table
                    dataSource={reportList}
                    columns={
                        visibleColumns.length > 0
                            ? allColumns.filter((col) => visibleColumns.includes(col.dataIndex))
                            : fullColumns
                    }
                    rowKey="id"
                    rowClassName={(record) =>
                        disabledRows.includes(record.id)
                            ? 'bg-gray-200 text-gray-500 pointer-events-none opacity-60'
                            : ''
                    }
                    size="small"
                />
                <CreateSalesReport
                    setOpenModalCreate={setOpenModalCreate}
                    openModalCreate={openModalCreate}
                    fetchReport={fetchReport}
                    selectedDate={selectedDate}
                />
                <UpdateSalesReport
                    openModalUpdate={openModalUpdate}
                    setOpenModalUpdate={setOpenModalUpdate}
                    itemUpdate={itemUpdate}
                    setItemUpdate={setItemUpdate}
                    fetchReport={fetchReport}
                    selectedDate={selectedDate}
                />
            </div>
        </div>
    );
};

export default SalesDailyReport;
