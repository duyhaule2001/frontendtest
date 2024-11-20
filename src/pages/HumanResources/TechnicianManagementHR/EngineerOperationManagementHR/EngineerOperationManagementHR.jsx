import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, notification, Popconfirm, Table } from 'antd';
import CreateEngineer from './CreateEngineer';
import UpdateEngineer from './UpdateEngineer';
import SearchInputCus from '../../../../components/Common/Input/SearchInputCus/SearchInputCus';
import {
    deleteEngineer,
    getAllEngineers,
    getEngineerByName,
    getSugEngineerByName,
} from '../../../../services/hr.service';
import TitleCus from '../../../../components/Common/Layout/Title/TitleCus';

const EngineerOperationManagementHR = () => {
    const [technicianData, setTechnicianData] = useState([]);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [selectedDataUpdate, setSelectedDataUpdate] = useState();
    const [loading, setLoading] = useState(false);

    const [openCreateModal, setOpenCreateModal] = useState(false);

    useEffect(() => {
        loadTechnicianData();
    }, []);

    const loadTechnicianData = async () => {
        setLoading(true);
        try {
            const res = await getAllEngineers();
            if (res.data && Array.isArray(res.data)) {
                setTechnicianData(res.data);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            const res = await deleteEngineer(id);
            if (res.data) {
                notification.success({
                    message: '削除が成功しました。',
                });
                const updateData = technicianData.filter((item) => item.id !== id);
                setTechnicianData(updateData);
            } else {
                notification.error({
                    message: '削除が失敗しました。',
                });
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleSearch = async (name) => {
        try {
            const res = await getEngineerByName(name);
            if (res?.data) {
                setTechnicianData(res.data);
            } else {
                setTechnicianData([]);
            }
        } catch (error) {
            console.log(error);
            setTechnicianData([]);
        }
    };

    const [options, setOptions] = useState([]);
    const onSearch = async (searchText) => {
        if (!searchText) {
            setOptions([]);
            return;
        }
        try {
            const res = await getSugEngineerByName(searchText);
            if (res.data) {
                setOptions(
                    res.data.map((item) => ({
                        value: item.technician_name,
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
            title: '技術者名',
            dataIndex: 'technician_name',
            render: (text) => (
                <a href="#" className="align-middle text-[15px] text-blue-700">
                    {text}
                </a>
            ),
        },
        {
            title: '正/個/BP',
            dataIndex: 'occupational_classification',
        },
        {
            title: '入場日',
            dataIndex: 'admission_date',
            render: (text) => <span className="whitespace-nowrap">{text}</span>,
        },
        {
            title: '精算月日',
            dataIndex: 'settlement_date',
            sorter: (a, b) => {
                // Sắp xếp theo settlement_status (1 trước, 2 sau, còn lại cuối cùng)
                if (a.settlement_status === 1) return -1;
                if (b.settlement_status === 1) return 1;
                if (a.settlement_status === 2) return -1;
                if (b.settlement_status === 2) return 1;
                return 0;
            },
            render: (text, record) => {
                const status = record.settlement_status;
                let color;
                if (status === 1) {
                    color = 'text-red-500'; // Màu đỏ nếu settlement_status = 1
                } else if (status === 2) {
                    color = 'text-yellow-500'; // Màu vàng nếu settlement_status = 2
                } else {
                    color = 'text-black'; // Màu đen nếu settlement_status khác 1 và 2
                }

                return <span className={`whitespace-nowrap ${color}`}>{text}</span>;
            },
        },
        {
            title: '契約形態',
            dataIndex: 'contract_related',
        },
        {
            title: '人/月',
            dataIndex: 'person_month',
            render: (text) => {
                const value = parseFloat(text);
                return <span className={value < 1 ? 'font-bold text-red-500' : ''}>{text}</span>;
            },
        },
        {
            title: '単価',
            dataIndex: 'unit_price',
        },
        {
            title: '精算範囲',
            dataIndex: 'calculation_range',
        },
        {
            title: '精算金額',
            dataIndex: 'settlement_amount',
        },
        {
            title: '契約更新日',
            dataIndex: 'contract_renewal_date',
            render: (text) => <span className="whitespace-nowrap">{text}</span>,
        },
        {
            title: '',
            render: (_, record) => (
                <div className="flex items-center justify-center space-x-5">
                    <EditOutlined
                        onClick={() => {
                            setOpenUpdate(true), setSelectedDataUpdate(record);
                        }}
                        className="text-blue-700"
                    />
                    <Popconfirm
                        placement="leftTop"
                        title="確認"
                        okText="削除"
                        cancelText="キャンセル"
                        description={`${record.technician_name}を削除してもよろしいですか？`}
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <DeleteOutlined className="text-red-500" />
                    </Popconfirm>
                </div>
            ),
            onHeaderCell: () => ({
                style: { textAlign: 'center' },
            }),
        },
    ];

    return (
        <div className="w-full">
            <TitleCus title={'稼働リスト'} />
            <div className="px-32 py-16">
                <div className="flex justify-between">
                    <SearchInputCus
                        label={'技術者の名前'}
                        placeholder={''}
                        handleSearch={handleSearch}
                        onSearch={onSearch}
                        options={options}
                    />
                    <div className="space-x-2">
                        <Button onClick={() => setOpenCreateModal(true)} type="primary">
                            <PlusOutlined />
                            新規登録
                        </Button>
                        <Button type="primary">
                            <ReloadOutlined onClick={loadTechnicianData} />
                        </Button>
                    </div>
                </div>
                <Table
                    size="small"
                    rowKey={'id'}
                    columns={columns}
                    dataSource={technicianData}
                    loading={loading}
                    locale={{
                        emptyText: 'データがありません。',
                    }}
                />
                <CreateEngineer
                    setOpenCreateModal={setOpenCreateModal}
                    openCreateModal={openCreateModal}
                    loadTechnicianData={loadTechnicianData}
                />
                <UpdateEngineer
                    setOpenUpdate={setOpenUpdate}
                    openUpdate={openUpdate}
                    selectedDataUpdate={selectedDataUpdate}
                    loadTechnicianData={loadTechnicianData}
                />
            </div>
        </div>
    );
};

export default EngineerOperationManagementHR;
