import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Table, notification } from 'antd';
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';

import SearchInputCus from '../../Layout/Input/SearchInputCus';
import AddOutSiteInfo from './AddOutSiteInfo';
import UpdateOutSiteInfo from './UpdateOutSiteInfo';
import {
    deleteOutSiteInfo,
    getOutSiteInfo,
    getOutSiteInfoByName,
    getSugOutSiteInfoByName,
} from '../../../../services/common.service';
const OutSiteManagement = ({ year, month }) => {
    const [loading, setLoading] = useState(false);
    const [outSiteData, setOutSiteData] = useState([]);
    const [openAddOutSiteInfo, setOpenAddOutSiteInfo] = useState(false);
    const [selectedOutSiteInfo, setSelectedOutSiteInfo] = useState();
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getOutSiteInfo(year, month);
            if (res.data && Array.isArray(res.data)) {
                setOutSiteData(res.data);
            } else {
                setOutSiteData([]);
            }
        } catch (error) {
            console.log(error);
            setOutSiteData([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [year, month]);

    const handleDelete = async (deleteId) => {
        try {
            const res = await deleteOutSiteInfo(deleteId);
            if (res.data) {
                const updatedOutSiteInfo = outSiteData.filter((item) => item.id !== deleteId);
                setOutSiteData(updatedOutSiteInfo);
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
            const res = await getOutSiteInfoByName(year, month, name);
            if (res?.data) {
                setOutSiteData(res.data);
            } else {
                setOutSiteData([]);
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
        const res = await getSugOutSiteInfoByName(year, month, searchText);
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
            dataIndex: 'employeeNumber',
            align: 'center',
        },
        {
            title: <span className="flex items-center justify-center">技術者の名前</span>,
            dataIndex: 'technicianName',
        },
        {
            title: '退場日付',
            dataIndex: 'exitDate',
            align: 'center',
            render: (text) => <span className="whitespace-nowrap">{text}</span>,
        },
        {
            title: 'スキルシート更新',
            align: 'center',
            dataIndex: 'skillSheetUpdate',
            render: (value) => (value === 1 ? <CheckCircleOutlined className="font-bold text-green-500" /> : '✖️'),
        },
        {
            title: '単価調整',
            align: 'center',
            dataIndex: 'priceAdjustment',
            render: (value) => (value === 1 ? '◯' : '✖️'),
        },
        {
            title: <span className="flex items-center justify-center">前担当者名</span>,
            dataIndex: 'contactName',
        },
        {
            title: '参考単価',
            align: 'center',
            dataIndex: 'referenceUnitPrice',
            render: (value) => `¥ ${value.toLocaleString()}`,
        },
        {
            title: '',
            key: 'action',
            align: 'center',
            width: 50,
            render: (record) => {
                return (
                    <div className="flex space-x-5">
                        <EditOutlined
                            onClick={() => {
                                setIsInfoOpen(true), setSelectedOutSiteInfo(record);
                            }}
                            className="text-blue-700"
                        />
                        <Popconfirm
                            title="確認"
                            placement="bottom"
                            description={` ${record.technicianName} を削除してもよろしいですか？`}
                            okText="削除"
                            cancelText="キャンセル"
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
                    <Button type="primary" onClick={() => setOpenAddOutSiteInfo(true)}>
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
                loading={loading}
                dataSource={outSiteData}
                locale={{
                    emptyText: 'データがありません。',
                }}
            />
            <AddOutSiteInfo
                setOpenAddOutSiteInfo={setOpenAddOutSiteInfo}
                openAddOutSiteInfo={openAddOutSiteInfo}
                fetchData={fetchData}
            />
            <UpdateOutSiteInfo
                setIsInfoOpen={setIsInfoOpen}
                isInfoOpen={isInfoOpen}
                selectedOutSiteInfo={selectedOutSiteInfo}
                fetchData={fetchData}
            />
        </div>
    );
};

export default OutSiteManagement;
