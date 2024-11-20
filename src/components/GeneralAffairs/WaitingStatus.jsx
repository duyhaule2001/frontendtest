import { Divider, Spin, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import YearMonthSelector from '../Common/Layout/Input/YearMonthSelector';
import { getStandbyState } from '../../services/generalAffairs.service';

const WaitingStatus = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);

    const [sapList, setSapList] = useState([]);
    const [openList, setOpenList] = useState([]);
    const [totalSap, setTotalSap] = useState(0);
    const [totalScheduledAdmissionSap, setTotalScheduledAdmissionSap] = useState(0);
    const [totalScheduledAdmissionOpen, setTotalScheduledAdmissionOpen] = useState(0);
    const [totalOpen, setTotalOpen] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchState();
    }, [year, month]);

    const fetchState = async () => {
        setLoading(true);
        try {
            const res = await getStandbyState(year, month);
            if (res.data) {
                const sapWithKeys = res.data.sap.map((item, index) => ({ ...item, key: index }));
                const openWithKeys = res.data.open.map((item, index) => ({
                    ...item,
                    key: index + res.data.sap.length,
                }));

                setSapList(sapWithKeys);
                setOpenList(openWithKeys);
                setTotalSap(res.data.total_sap);
                setTotalScheduledAdmissionSap(res.data.sap_scheduledAdmission_total);
                setTotalScheduledAdmissionOpen(res.data.open_scheduledAdmission_total);
                setTotalOpen(res.data.total_open);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleChangeYear = (direction) => {
        setYear(year + direction);
    };

    const sapColumns = [
        {
            title: '',
            dataIndex: 'index',
            width: 50,
            render: (text, record, index) => <div className="text-center">{index + 1}</div>,
        },
        {
            title: <div className="text-center">待機人員</div>,
            dataIndex: 'emp_name',
            width: 90,
        },
        {
            title: <div className="text-center">待機開始日付</div>,
            dataIndex: 'exit_date',
            width: 115,
        },
        {
            title: <div className="text-center">入場予定日</div>,
            dataIndex: 'midway_date',
            width: 130,
            render: (text) => {
                return text ? <span style={{ color: 'blue' }}>{text}</span> : null;
            },
        },
        {
            title: <div className="text-center">人月</div>,
            dataIndex: 'midway_per',
        },
        {
            title: <div className="text-center">備考</div>,
            dataIndex: 'other',
        },
    ];

    const openColumns = [
        {
            title: '',
            dataIndex: 'index',
            width: 50,
            render: (text, record, index) => <div className="text-center">{index + 1}</div>,
        },
        {
            title: <div className="text-center">待機人員</div>,
            dataIndex: 'emp_name',
            width: 90,
        },
        {
            title: <div className="text-center">待機開始日付</div>,
            dataIndex: 'exit_date',
            width: 115,
        },
        {
            title: <div className="text-center">入場予定日</div>,
            dataIndex: 'midway_date',
            width: 130,
            render: (text) => {
                return text ? <span style={{ color: 'blue' }}>{text}</span> : null;
            },
        },
        {
            title: <div className="text-center">人月</div>,
            dataIndex: 'midway_per',
        },
        {
            title: <div className="text-center">備考</div>,
            dataIndex: 'other',
        },
    ];

    return (
        <>
            <YearMonthSelector year={year} onChangeYear={handleChangeYear} month={month} setMonth={setMonth} />
            <Divider />
            <Spin spinning={loading}>
                <div className="-mt-5 flex space-x-10 px-5">
                    <div className="w-1/2">
                        <Table
                            columns={sapColumns}
                            dataSource={sapList}
                            size="large"
                            title={() => (
                                <div className="flex justify-center">
                                    <Tag color="blue">
                                        <div className="text-[1rem] font-bold">SAP</div>
                                    </Tag>
                                </div>
                            )}
                            footer={() => (
                                <div className="flex justify-end space-x-10 text-center">
                                    <span>
                                        入場予定人数:
                                        <span className="ml-2 font-bold text-blue-500">
                                            {totalScheduledAdmissionSap ? totalScheduledAdmissionSap : null}
                                        </span>
                                    </span>

                                    <span>
                                        合計待機人数:
                                        <span className="ml-2 font-bold text-blue-500">
                                            {totalSap ? totalSap : null}
                                        </span>
                                    </span>
                                </div>
                            )}
                        />
                    </div>
                    <div className="w-1/2">
                        <Table
                            columns={openColumns}
                            dataSource={openList}
                            size="large"
                            title={() => (
                                <div className="flex justify-center">
                                    <Tag color="blue">
                                        <div className="text-[1rem] font-bold">OPEN系</div>
                                    </Tag>
                                </div>
                            )}
                            footer={() => (
                                <div className="flex justify-end space-x-10 text-center">
                                    <span>
                                        入場予定人数:
                                        <span className="ml-2 font-bold text-blue-500">
                                            {totalScheduledAdmissionOpen ? totalScheduledAdmissionOpen : null}
                                        </span>
                                    </span>

                                    <span>
                                        合計待機人数:
                                        <span className="ml-2 font-bold text-blue-500">
                                            {totalOpen ? totalOpen : null}
                                        </span>
                                    </span>
                                </div>
                            )}
                        />
                    </div>
                </div>
            </Spin>
        </>
    );
};

export default WaitingStatus;
