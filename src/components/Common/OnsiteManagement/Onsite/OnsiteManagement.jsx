import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Table, notification } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';

import AddOnsiteInfo from './AddOnsiteInfo';
import ViewOnsiteInfo from './ViewOnsiteInfo';
import UpdateOnsiteInfo from './UpdateOnsiteInfo';
import SearchInputCus from '../../Layout/Input/SearchInputCus';
import {
    deleteOnsiteInfo,
    getOnsiteInfo,
    getOnsiteInfoByName,
    getSugOnsiteInfoByName,
} from '../../../../services/common.service';

const OnsiteManagement = ({ year, month }) => {
    const [loading, setLoading] = useState(false);
    const [onsiteData, setOnsiteData] = useState([]);
    const [openAddOnsiteInfo, setOpenAddOnsiteInfo] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedView, setSelectedView] = useState();
    const [selectedOnsiteInfo, setSelectedOnsiteInfo] = useState();
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getOnsiteInfo(year, month);
            if (res.data && Array.isArray(res.data)) {
                setOnsiteData(res.data);
            } else {
                setOnsiteData([]);
            }
        } catch (error) {
            console.error('Failed to fetch', error);
            setOnsiteData([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [year, month]);

    const handleDelete = async (deleteId) => {
        try {
            const res = await deleteOnsiteInfo(deleteId);
            if (res.data) {
                const updatedOnsiteInfo = onsiteData.filter((item) => item.id !== deleteId);
                setOnsiteData(updatedOnsiteInfo);
                notification.success({
                    message: '削除が成功しました。',
                    style: {
                        width: 270,
                    },
                });
            } else {
                notification.error({
                    message: '削除が失敗しました。',
                    style: {
                        width: 270,
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearch = async (name) => {
        try {
            const res = await getOnsiteInfoByName(year, month, name);
            if (res?.data) {
                setOnsiteData(res.data);
            } else {
                setOnsiteData([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const [options, setOptions] = useState([]);
    const onSearch = async (searchText) => {
        if (!searchText) {
            setOptions([]);
            return;
        }
        const res = await getSugOnsiteInfoByName(year, month, searchText);
        if (res.data) {
            setOptions(
                res.data.map((item) => ({
                    value: item.technicianName,
                })),
            );
        } else {
            console.log('データが取得できません。');
            setOptions([]);
        }
    };

    const columns = [
        {
            title: '社員番号',
            dataIndex: 'number',
            align: 'center',
            width: 90,
        },
        {
            title: <span className="flex items-center justify-center">技術者名</span>,
            render: (record) => {
                return (
                    <a
                        className="text-blue-700"
                        href="#"
                        onClick={() => {
                            setOpenViewModal(true);
                            setSelectedView(record);
                        }}
                    >
                        {record.technicianName}
                    </a>
                );
            },
        },
        {
            title: '入場日期',
            align: 'center',
            dataIndex: 'admissionDate',
            render: (text) => <span className="whitespace-nowrap">{text}</span>,
        },
        {
            title: <span className="flex items-center justify-center">案件名前</span>,
            dataIndex: 'projectName',
        },
        {
            title: <span className="flex items-center justify-center">上位顧客名</span>,
            dataIndex: 'customerNames',
        },
        {
            title: '書類確認担当',
            dataIndex: 'docVeriOfficer',
            align: 'center',
        },
        {
            title: <span className="flex items-center justify-center">入場担当</span>,
            dataIndex: 'admissionOfficer',
        },
        {
            title: '単価(月/H)',
            align: 'center',
            dataIndex: 'unitPrice',
        },
        {
            title: '精算(140~200)H',
            align: 'center',
            dataIndex: 'payOff',
        },
        {
            title: '',
            align: 'center',
            key: 'action',
            width: 50,
            render: (record) => {
                return (
                    <div className="flex space-x-3">
                        <EditOutlined
                            onClick={() => {
                                setIsInfoOpen(true), setSelectedOnsiteInfo(record);
                            }}
                            className="text-blue-700"
                        />
                        <Popconfirm
                            title="確認"
                            description={` ${record.technicianName} を削除してもよろしいですか？`}
                            okText="削除"
                            cancelText="キャンセル"
                            placement="bottom"
                            onConfirm={() => handleDelete(record.id)}
                        >
                            <DeleteOutlined className="text-red-500" />
                        </Popconfirm>
                    </div>
                );
            },
        },
    ];
    return (
        <div className="px-10 py-16">
            <div className="flex justify-between">
                <span>
                    <SearchInputCus
                        placeholder={'技術者名を入力してください'}
                        handleSearch={handleSearch}
                        onSearch={onSearch}
                        options={options}
                    />
                </span>
                <span className="space-x-1">
                    <Button type="primary" onClick={() => setOpenAddOnsiteInfo(true)}>
                        <PlusOutlined />
                        新規登録
                    </Button>
                    <Button type="primary">
                        <ReloadOutlined onClick={fetchData} />
                    </Button>
                </span>
            </div>
            <Table
                rowKey={'id'}
                columns={columns}
                dataSource={onsiteData}
                loading={loading}
                locale={{
                    emptyText: 'データがありません。',
                }}
            />
            <AddOnsiteInfo
                setOpenAddOnsiteInfo={setOpenAddOnsiteInfo}
                openAddOnsiteInfo={openAddOnsiteInfo}
                fetchData={fetchData}
            />
            <ViewOnsiteInfo
                setOpenViewModal={setOpenViewModal}
                openViewModal={openViewModal}
                selectedView={selectedView}
            />
            <UpdateOnsiteInfo
                setIsInfoOpen={setIsInfoOpen}
                isInfoOpen={isInfoOpen}
                selectedOnsiteInfo={selectedOnsiteInfo}
                fetchData={fetchData}
            />
        </div>
    );
};

export default OnsiteManagement;
