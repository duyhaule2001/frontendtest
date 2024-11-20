import { Drawer, Table } from 'antd';
import React, { useEffect, useState } from 'react';

import { getUseHistory } from '../../../services/common.service';

const UseHistory = ({ openUseHistory, setOpenUseHistory, selectedViewHistory }) => {
    const [listHistory, setListHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedViewHistory) return;

            setLoading(true);
            try {
                const res = await getUseHistory(selectedViewHistory.record_id);
                if (res.data) {
                    setListHistory(res.data);
                }
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        };
        fetchData();
    }, [selectedViewHistory, openUseHistory]);

    const columns = [
        {
            title: <span className="flex justify-center">日付</span>,
            dataIndex: 'used_date',
            width: 120,
            onCell: () => ({ style: { whiteSpace: 'nowrap' } }),
        },
        {
            title: <span className="flex items-center justify-center">備品名</span>,
            dataIndex: 'equipment_name',
            width: 120,
        },
        {
            title: <span className="flex items-center justify-center">利用数量</span>,
            dataIndex: 'stock_quantity',
            width: 120,
        },
        {
            title: <span className="flex items-center justify-center">利用者</span>,
            dataIndex: 'user_name',
            width: 120,
        },
        {
            title: <span className="flex items-center justify-center">備考</span>,
            dataIndex: 'contant',
            width: 120,
        },
    ];
    return (
        <>
            <Drawer title="利用履歴" onClose={() => setOpenUseHistory(false)} open={openUseHistory} width={'50vw'}>
                <Table dataSource={listHistory} columns={columns} loading={loading} rowKey={'record_id'} />
            </Drawer>
        </>
    );
};

export default UseHistory;
