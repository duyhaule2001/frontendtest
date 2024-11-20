import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, notification, Popconfirm, Table } from 'antd';
import CreateSpecialCustomer from './CreateSpecialCustomer';
import UpdateSpecialCustomer from './UpdateSpecialCustomer';
import { deleteSpecialCustomer, getAllSpecialCustomer } from '../../../../services/sale.service';
import GrantPermission from './GrantPermission';
import { useSelector } from 'react-redux';

const SpecialCustomer = () => {
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.account.user);
    const [specialCustomerData, setSpecialCustomerData] = useState([]);
    const [createCustomer, setCreateCustomer] = useState(false);
    const [updateSpecialCustomerOpen, setUpdateSpecialCustomerOpen] = useState(false);
    const [selectedSpecialCustomer, setSelectedSpecialCustomer] = useState();
    const [grantPermission, setGrantPermission] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAllSpecialCustomer();
            if (res.data) {
                setSpecialCustomerData(res.data);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (deleteId) => {
        try {
            const res = await deleteSpecialCustomer(deleteId);
            if (res.data) {
                const updatedData = specialCustomerData.filter((item) => item.id !== deleteId);
                setSpecialCustomerData(updatedData);
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

    const columns = [
        {
            title: '日付',
            align: 'center',
            dataIndex: 'date',
        },
        {
            title: <span className="flex items-center justify-center">担当者名</span>,
            dataIndex: 'contactName',
        },
        {
            title: <span className="flex items-center justify-center">会社名</span>,
            dataIndex: 'companyName',
        },
        {
            title: '肩名',
            align: 'center',
            dataIndex: 'jobTitle',
        },
        {
            title: <span className="flex items-center justify-center">氏名</span>,
            dataIndex: 'customerName',
        },
        {
            title: '郵便番号',
            align: 'center',
            dataIndex: 'postcode',
        },
        {
            title: <span className="flex items-center justify-center">住所</span>,
            dataIndex: 'address',
        },
        {
            title: <span className="flex items-center justify-center">商品名</span>,
            dataIndex: 'productName',
        },
        {
            title: '価格',
            align: 'center',
            dataIndex: 'price',
            render: (value) => {
                return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value);
            },
        },

        {
            title: '',
            key: 'action',
            align: 'center',
            render: (record) => {
                return (
                    <div className="flex justify-between">
                        <EditOutlined
                            onClick={() => {
                                setUpdateSpecialCustomerOpen(true);
                                setSelectedSpecialCustomer(record);
                            }}
                            className="text-blue-700"
                        />
                        <Popconfirm
                            title="確認"
                            placement="bottomRight"
                            description={`${record.companyName} を削除してもよろしいですか？`}
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
        <div className="px-8">
            <div className="flex justify-end">
                <span className="space-x-1">
                    {user.managerial_position == '社長' && (
                        <Button type="primary" onClick={() => setGrantPermission(true)}>
                            <SettingOutlined />
                            権限付与
                        </Button>
                    )}
                    <Button type="primary" onClick={() => setCreateCustomer(true)}>
                        <PlusOutlined />
                        新規登録
                    </Button>
                    <Button type="primary" onClick={fetchData}>
                        <ReloadOutlined />
                    </Button>
                </span>
            </div>
            <div className="mt-2">
                <Table
                    rowKey={'id'}
                    columns={columns}
                    loading={loading}
                    dataSource={specialCustomerData}
                    locale={{
                        emptyText: 'データがありません。',
                    }}
                />
            </div>
            <CreateSpecialCustomer
                setCreateCustomer={setCreateCustomer}
                createCustomer={createCustomer}
                fetchData={fetchData}
            />
            <UpdateSpecialCustomer
                setUpdateSpecialCustomerOpen={setUpdateSpecialCustomerOpen}
                updateSpecialCustomerOpen={updateSpecialCustomerOpen}
                fetchData={fetchData}
                selectedSpecialCustomer={selectedSpecialCustomer}
            />
            <GrantPermission grantPermission={grantPermission} setGrantPermission={setGrantPermission} />
        </div>
    );
};

export default SpecialCustomer;
