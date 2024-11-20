import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import dayjs from 'dayjs';
import { getMonthlyReportInformation } from '../../../services/common.service';

const MonthlyReport = ({ date }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async (date) => {
            setLoading(true);
            try {
                const response = await getMonthlyReportInformation(dayjs(date).format('YYYY'));
                setData(response.data);
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        };
        fetchData(date);
    }, [date]);

    // 赤、緑、青の背景色を条件付きで適用する行を定義
    const highlightRowsRed = ['Open待機合計', 'SAP待機合計', 'インフラ、クラウド系待機合計'];
    const highlightRowsGreen = ['Open稼働合計', 'SAP稼働合計', 'インフラ、クラウド系稼働合計'];
    const highlightRowsBlue = ['BP_SAP', 'BP_Open'];

    // セルがハイライトされるべきかを確認する関数
    const isIncreased = (currentValue, previousValue) => currentValue > previousValue;

    // 行の結合を処理する関数
    const handleRowSpan = (text, record, index) => {
        const sameCategory = data.filter((item) => item.category === text);
        if (index === data.findIndex((item) => item.category === text)) {
            return sameCategory.length;
        }
        return 0;
    };

    const staticColumns = [
        {
            title: '仕分け',
            dataIndex: 'category',
            key: 'category',
            align: 'center',
            fixed: 'left',
            width: 120,
            onCell: (record, index) => ({
                rowSpan: handleRowSpan(record.category, record, index),
            }),
        },
        {
            title: '技術者分け',
            dataIndex: 'technician_group',
            key: 'technician_group',
            align: 'center',
            fixed: 'left',
            width: 160,
            onCell: (record) => {
                // BP_SAPとBP_Open行全体に青い背景色を適用
                if (highlightRowsBlue.includes(record.technician_group)) {
                    return {
                        style: {
                            backgroundColor: '#60A5FA',
                            color: '#1E3A8A',
                        },
                    };
                }
                return { style: {} };
            },
        },
    ];

    const monthColumns = Array.from({ length: 12 }, (_, index) => {
        const month = index + 9 > 12 ? index - 3 : index + 9;
        const title = `${month}月`;
        return {
            title,
            dataIndex: `month_${month}`,
            key: `month_${month}`,
            align: 'center',
            onCell: (record) => {
                const previousMonth = `month_${month === 9 ? 8 : month - 1}`;
                const currentValue = record[`month_${month}`];
                const previousValue = record[previousMonth];

                // 値が増加している場合、highlightRowsRedにある行に赤い背景色を適用
                if (highlightRowsRed.includes(record.technician_group) && isIncreased(currentValue, previousValue)) {
                    return {
                        style: {
                            backgroundColor: '#F87171',
                            color: '#7F1D1D',
                            borderRadius: '0.375rem',
                        },
                    };
                }

                // 値が増加している場合、highlightRowsGreenにある行に緑の背景色を適用
                if (highlightRowsGreen.includes(record.technician_group) && isIncreased(currentValue, previousValue)) {
                    return {
                        style: {
                            backgroundColor: '#4ADE80',
                            color: '#065F46',
                            borderRadius: '0.375rem',
                        },
                    };
                }

                // BP_SAPとBP_Open行全体に青い背景色を適用
                if (highlightRowsBlue.includes(record.technician_group)) {
                    return {
                        style: {
                            backgroundColor: '#60A5FA', // Tailwindのbg-blue-400
                            color: '#1E3A8A', // Tailwindのtext-blue-800
                        },
                    };
                }

                return { style: {} }; // デフォルトでは背景色なし
            },
        };
    });

    const columns = [...staticColumns, ...monthColumns];

    return (
        <div className="mt-5 overflow-x-auto p-2">
            <Table
                dataSource={data}
                columns={columns}
                pagination={false}
                bordered
                loading={loading}
                rowKey="id"
                size="small"
                className="text-sm"
                scroll={{ y: '400px' }}
            />
        </div>
    );
};

export default MonthlyReport;
