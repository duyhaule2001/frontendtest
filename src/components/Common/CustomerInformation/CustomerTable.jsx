import { EyeOutlined, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Image, Input, notification, Popconfirm, Space, Table } from 'antd';

import React, { useEffect, useState, useRef } from 'react';
import { deleteCustomer, getCustomerList } from '../../../services/common.service';
import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AddCustomer from './AddCustomer';
import UpdateCustomer from './UpdateCustomer';
import TitleCus from '../Layout/TitleCus';
import ImageCus from '../Layout/ImageCus';

const CustomerTable = () => {
    const [customerList, setCustomerList] = useState([]);
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getCustomerList();
            if (res?.data) {
                setCustomerList(res?.data);
            } else {
                setCustomerList([]);
            }
        } catch (error) {
            console.log(error);
        }

        setLoading(false);
    };

    const handleDelete = async (id) => {
        try {
            const res = await deleteCustomer(id);
            if (res.data) {
                notification.success({
                    message: '削除が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                fetchData();
            }
        } catch (error) {
            console.log(error);
        }
    };

    //社名検索
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder="会社検索"
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        検索
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        リセット
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        フィルター
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        キャンセル
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) => {
            if (searchedColumn === dataIndex && searchText) {
                const regex = new RegExp(`(${searchText})`, 'gi');
                const parts = text.split(regex);
                return (
                    <span>
                        {parts.map((part, index) =>
                            part.toLowerCase() === searchText.toLowerCase() ? (
                                <mark key={index} style={{ backgroundColor: '#ffc069' }}>
                                    {part}
                                </mark>
                            ) : (
                                part
                            ),
                        )}
                    </span>
                );
            }
            return text;
        },
    });

    const columns = [
        {
            title: <span className="flex items-center justify-center">会社名</span>,
            dataIndex: 'companyName',
            fixed: 'left',
            ...getColumnSearchProps('companyName'),
        },
        {
            title: <span className="flex items-center justify-center">所属部属</span>,
            dataIndex: 'department',
            align: 'center',
        },
        {
            title: <span className="flex items-center justify-center">部属</span>,
            dataIndex: 'subDepartment',
        },
        {
            title: <span>役職</span>,
            dataIndex: 'position',
            align: 'center',
        },
        {
            title: <span className="flex items-center justify-center">名前</span>,
            dataIndex: 'name',
        },
        {
            title: <span className="flex items-center justify-center">資本金</span>,
            align: 'center',
            dataIndex: 'capital',
            render: (value) => (value ? `¥ ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : '¥ 0'),
        },
        {
            title: <span className="flex items-center justify-center">売上(何年分)</span>,
            dataIndex: 'revenue',
            align: 'center',
        },
        {
            title: <span className="flex items-center justify-center">資本連携</span>,
            dataIndex: 'capitalPartnership',
            align: 'center',
        },
        {
            title: <span className="flex items-center justify-center">ホームページ</span>,
            dataIndex: 'homepage',
            render: (value) =>
                value ? (
                    <a href={value} target="_blank" rel="noopener noreferrer">
                        {value}
                    </a>
                ) : (
                    '-'
                ),
        },

        {
            title: '組織図',
            dataIndex: 'organizationChart',
            align: 'center',
            render: (organizationChart) => <ImageCus img_path={organizationChart} className={'p-[2px]'} />,
        },

        {
            title: <span className="flex items-center justify-center">連絡先</span>,
            align: 'center',
            dataIndex: 'contact',
        },
        {
            title: <span className="flex items-center justify-center">メール</span>,
            dataIndex: 'email',
        },
        {
            title: <span className="flex items-center justify-center">最新</span>,
            dataIndex: 'latest',
            align: 'center',
            render: (text) =>
                text ? (
                    <CheckCircleOutlined className="text-green-500" />
                ) : (
                    <CloseCircleOutlined className="text-red-500" />
                ),
        },
        {
            title: '',
            align: 'center',
            fixed: 'right',
            render: (record) => {
                return (
                    <div className="flex space-x-3">
                        <EditOutlined
                            onClick={() => {
                                setOpenModalUpdate(true);
                                setSelectedCustomer(record);
                            }}
                            className="text-blue-500"
                        />
                        <Popconfirm
                            placement="bottomRight"
                            title="確認"
                            description={`${record.companyName}を削除してもよろしいですか？`}
                            okText="削除"
                            cancelText="キャンセル"
                            onConfirm={() => handleDelete(record.id)}
                        >
                            <DeleteOutlined className="text-red-500" />
                        </Popconfirm>
                    </div>
                );
            },
            width: 10,
        },
    ];

    return (
        <>
            <TitleCus title={'お客様情報'} />
            <div className="p-10">
                <span className="mb-3 flex items-center justify-end space-x-2">
                    <Button
                        type="primary"
                        onClick={() => {
                            setOpenModalAdd(true);
                        }}
                    >
                        <PlusCircleOutlined />
                        新規登録
                    </Button>
                </span>
                <Table
                    scroll={{ x: 'max-content' }}
                    rowKey="id"
                    dataSource={customerList}
                    columns={columns}
                    size="small"
                    loading={loading}
                />
                <AddCustomer openModalAdd={openModalAdd} setOpenModalAdd={setOpenModalAdd} fetchData={fetchData} />
                <UpdateCustomer
                    openModalUpdate={openModalUpdate}
                    setOpenModalUpdate={setOpenModalUpdate}
                    selectedCustomer={selectedCustomer}
                    fetchData={fetchData}
                />
            </div>
        </>
    );
};

export default CustomerTable;
