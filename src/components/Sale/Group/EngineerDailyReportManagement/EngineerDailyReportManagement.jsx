import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Table, Drawer, Descriptions } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import SearchInputCus from '../../../Common/Layout/Input/SearchInputCus';
import { getAllDailyReportByDate, getAllDailyReportByName } from '../../../../services/sale.service';
import TitleCus from '../../../Common/Layout/TitleCus';
import { suggestionAccountName } from '../../../../services/common.service';

const EngineerDailyReport = () => {
    const [dailyReportData, setDailyReportData] = useState([]);
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [openDrawer, setOpenDrawer] = useState(false);
    const [reportDetails, setReportDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAllDailyReportByDate({ dateReport: date });
            if (res.data) {
                setDailyReportData(res.data);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [date]);

    const handleReportClick = (record) => {
        setReportDetails(record);
        setOpenDrawer(true);
    };

    const closeDrawer = () => {
        setOpenDrawer(false);
        setReportDetails(null);
    };

    const handleSearch = async (name) => {
        try {
            const res = await getAllDailyReportByName({ technician_name: name });
            if (res?.data) {
                setDailyReportData(res.data);
            } else {
                setDailyReportData([]);
            }
        } catch (error) {
            console.log(error);
            setDailyReportData([]);
        }
    };

    const [options, setOptions] = useState([]);
    const onSearch = async (searchText) => {
        if (!searchText) {
            setOptions([]);
            return;
        }
        const res = await suggestionAccountName(searchText);
        try {
            if (res.data) {
                setOptions(
                    res.data.map((item) => ({
                        value: item.name,
                    })),
                );
            } else {
                setOptions([]);
            }
        } catch (error) {
            console.log(error);
            setOptions([]);
        }
    };

    const columns = [
        {
            title: '日付',
            align: 'center',
            dataIndex: 'dateReport',
            width: 120,
        },
        {
            title: <span className="flex items-center justify-center">技術者の名前</span>,
            width: 120,
            render: (text, record) => (
                <a className="cursor-pointer text-blue-700" onClick={() => handleReportClick(record)}>
                    {record.technician_name}
                </a>
            ),
        },
        {
            title: <span className="flex items-center justify-center">作業場所</span>,
            dataIndex: 'address',
            width: 120,
            ellipsis: true,
        },
        {
            title: <span className="flex items-center justify-center">本日の作業内容</span>,
            dataIndex: 'content',
            ellipsis: true,
        },
        {
            title: <span className="flex items-center justify-center">課題点とそれに向けての取り組み</span>,
            dataIndex: 'issues',
            ellipsis: true,
        },
        {
            title: <span className="flex items-center justify-center">参考</span>,
            dataIndex: 'reference',
            ellipsis: true,
        },
    ];

    return (
        <div className="mt-16 pb-5">
            <TitleCus title={'日報管理'} />
            <div className="px-16 py-10">
                <div className="mb-5 flex items-center">
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
                <div className="flex items-center justify-between">
                    <SearchInputCus
                        placeholder={'技術者名検索'}
                        handleSearch={handleSearch}
                        onSearch={onSearch}
                        options={options}
                    />
                    <Button
                        type="primary"
                        onClick={() => {
                            setDate(dayjs().format('YYYY-MM-DD'));
                        }}
                    >
                        <ReloadOutlined onClick={() => fetchData()} />
                    </Button>
                </div>
                <Table
                    rowKey={'id'}
                    columns={columns}
                    dataSource={dailyReportData}
                    locale={{ emptyText: 'データがありません。' }}
                    loading={loading}
                />
            </div>
            <Drawer title="日報詳細" width={'50%'} onClose={closeDrawer} open={openDrawer} placement="right">
                {reportDetails && (
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="日付" labelStyle={{ width: '30%' }} contentStyle={{ width: '70%' }}>
                            {dayjs(reportDetails.dateReport).format('YYYY-MM-DD')}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="技術者の名前"
                            labelStyle={{ width: '30%' }}
                            contentStyle={{ width: '70%', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                        >
                            {reportDetails.technician_name || ''}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="作業場所"
                            labelStyle={{ width: '30%' }}
                            contentStyle={{ width: '70%', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                        >
                            {reportDetails.address || ''}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="本日の作業内容"
                            labelStyle={{ width: '30%' }}
                            contentStyle={{ width: '70%', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                        >
                            {reportDetails.content || ''}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="課題点とそれに向けての取り組み"
                            labelStyle={{ width: '30%' }}
                            contentStyle={{ width: '70%', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                        >
                            {reportDetails.issues || ''}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="参考"
                            labelStyle={{ width: '30%' }}
                            contentStyle={{ width: '70%', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                        >
                            {reportDetails.reference || ''}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Drawer>
        </div>
    );
};

export default EngineerDailyReport;
