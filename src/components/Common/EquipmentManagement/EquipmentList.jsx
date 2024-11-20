import { Button, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';

import TitleCus from '../Layout/TitleCus';
import { getEquipmentList } from '../../../services/common.service';
import CreateEquipment from './CreateEquipment';
import UseRegistration from './UseRegistration';
import UseHistory from './UseHistory';
import ImageCus from '../Layout/ImageCus';

const EquipmentList = () => {
    const [loading, setLoading] = useState(false);
    const [equipments, setEquipments] = useState([]);

    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openUseRegister, setOpenUseRegister] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedViewHistory, setSelectedViewHistory] = useState(null);
    const [openUseHistory, setOpenUseHistory] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getEquipmentList();
            if (res?.data) {
                // 在庫＝０＝>テーブルの最後にする
                const sortedEquipments = res.data.sort((a, b) => {
                    if (a.stock_quantity === 0 && b.stock_quantity !== 0) {
                        return 1;
                    } else if (a.stock_quantity !== 0 && b.stock_quantity === 0) {
                        return -1;
                    }
                    return 0;
                });
                setEquipments(sortedEquipments);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    // disable row
    const rowClassName = (record) => {
        return record.stock_quantity === 0 ? 'bg-gray-100 text-gray-400' : '';
    };

    const columns = [
        {
            title: '',
            render: (text, record, index) => <span key={index}>{index + 1}</span>,
            align: 'center',
            width: 50,
        },
        {
            title: <span className="flex items-center justify-center">備品名</span>,
            dataIndex: 'equipment_name',
            width: 130,
            render: (text, record) => (
                <span
                    className="text-blue-500 hover:cursor-pointer"
                    onClick={() => {
                        setOpenUseHistory(true);
                        setSelectedViewHistory(record);
                    }}
                >
                    {text}
                </span>
            ),
        },
        {
            title: '画像',
            dataIndex: 'img_path',
            align: 'center',
            width: 70,
            render: (img_path) => <ImageCus img_path={img_path} />,
        },
        {
            title: '在庫数量',
            dataIndex: 'stock_quantity',
            align: 'center',
            width: 90,
        },
        {
            title: '単位',
            dataIndex: 'unit',
            align: 'center',
            width: 60,
        },
        {
            title: <span className="flex items-baseline justify-center">金額</span>,
            dataIndex: 'amount',
            render: (price) => (
                <div>{new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(price)}</div>
            ),
            width: 100,
            align: 'center',
        },
        {
            title: <span className="flex items-baseline justify-center">管理場所</span>,
            dataIndex: 'management_location',
            width: 90,
        },
        {
            title: '購入日',
            align: 'center',
            dataIndex: 'purchase_date',
            width: 120,
            onCell: () => ({ style: { whiteSpace: 'nowrap' } }),
        },
        {
            title: <span className="flex items-baseline justify-center">購入先URL</span>,
            dataIndex: 'purchase_url',
            render: (text, record) => (
                <a
                    href={text}
                    target="_blank"
                    className={
                        record.stock_quantity === 0
                            ? 'text-gray-500 hover:cursor-pointer'
                            : 'text-blue-500 hover:cursor-pointer'
                    }
                >
                    {text}
                </a>
            ),
            width: 110,
            ellipsis: true,
        },
        {
            title: <span className="flex items-baseline justify-center">用途</span>,
            dataIndex: 'usefulness',
            width: 110,
        },
        {
            title: <span className="flex items-baseline justify-center">備考</span>,
            dataIndex: 'contant',
            width: 110,
        },
        {
            title: '',
            align: 'center',
            render: (text, record) => (
                <Button
                    className="text-blue-500"
                    onClick={() => {
                        setOpenUseRegister(true);
                        setSelectedItem(record);
                    }}
                    disabled={record.stock_quantity === 0}
                >
                    利用登録
                </Button>
            ),
            width: 100,
        },
    ];

    return (
        <>
            <TitleCus title={'在庫管理'} />
            <div className="p-10">
                <div className="mb-3 flex items-center justify-end">
                    <Button type="primary" onClick={() => setOpenModalCreate(true)}>
                        <PlusCircleOutlined />
                        備品登録
                    </Button>
                </div>
                <Table
                    dataSource={equipments}
                    columns={columns}
                    loading={loading}
                    rowClassName={rowClassName}
                    rowKey={'record_id'}
                    size="small"
                />
                <CreateEquipment
                    openModalCreate={openModalCreate}
                    setOpenModalCreate={setOpenModalCreate}
                    fetchData={fetchData}
                    equipments={equipments}
                />
                <UseRegistration
                    openUseRegister={openUseRegister}
                    setOpenUseRegister={setOpenUseRegister}
                    fetchData={fetchData}
                    selectedItem={selectedItem}
                />
                <UseHistory
                    openUseHistory={openUseHistory}
                    setOpenUseHistory={setOpenUseHistory}
                    selectedViewHistory={selectedViewHistory}
                />
            </div>
        </>
    );
};

export default EquipmentList;
