import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, notification, Popconfirm, Space, Table } from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { getPcAPI, handleDelete, returnStatusPc } from '../../../services/hr.service';
import AddPc from './AddPc';

import ViewPc from './ViewPc';
import UpdatePc from './UpdatePc';
import TitleCus from '../../Common/Layout/TitleCus';
import ImageCus from '../../Common/Layout/ImageCus';

const PcManagement = () => {
    const [dataPc, setDataPc] = useState([]);

    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [selectedPc, setSelectedPc] = useState();

    const [openAddPc, setOpenAddPc] = useState(false);

    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedView, setSelectedView] = useState();

    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getPcAPI();
            if (res.data.pc_management) {
                const sortedData = res.data.pc_management.sort((a, b) => {
                    if (a.returnStatus === '済み' && b.returnStatus !== '済み') {
                        return 1;
                    }
                    if (a.returnStatus !== '済み' && b.returnStatus === '済み') {
                        return -1;
                    }
                    return 0;
                });
                setDataPc(sortedData);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const handleOk = async (id) => {
        try {
            const res = await handleDelete(id);
            if (res?.data) {
                notification.success({
                    message: '削除が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                fetchData();
            }
            setIsModalOpen(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleTableChange = (newPagination) => {
        setPagination(newPagination);
    };

    //名前検索
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
                    placeholder="氏名検索"
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
                                <mark key={index} className="bg--200">
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

    //返却状態
    const handleReturn = async (id) => {
        try {
            const res = await returnStatusPc(id, { returnStatus: '済み' });
            if (res.data) {
                notification.success({
                    message: '登録が成功しました。',
                });
                fetchData();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            title: '',
            render: (text, record, index) => <span>{(pagination.current - 1) * pagination.pageSize + index + 1}</span>,
            width: 60,
            align: 'center',
        },
        {
            title: '貸出申請日',
            dataIndex: 'application_date',
            align: 'center',
        },
        {
            title: '管理番号',
            align: 'center',
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
                        {record.pc_num}
                    </a>
                );
            },
        },
        {
            title: '使用者',
            align: 'center',
            dataIndex: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: '場所',
            dataIndex: 'location',
            align: 'center',
        },
        {
            title: 'アカウント名',
            dataIndex: 'account',
            align: 'center',
        },
        {
            title: '管理者アカウント名',
            dataIndex: 'manager_account',
            align: 'center',
        },
        {
            title: <span className="align-middle">写真</span>,
            dataIndex: 'img_path',
            align: 'center',
            render: (img_path) => <ImageCus img_path={img_path} borderRadius={'50%'} />,
        },
        {
            title: <span className="flex items-center justify-center">返却状態</span>,
            dataIndex: 'returnStatus',
            render: (text) =>
                text === '済み' ? (
                    <CheckCircleOutlined className="text-green-500" />
                ) : (
                    <CloseCircleOutlined className="text-red-500" />
                ),
            align: 'center',
        },
        {
            title: '',
            key: 'action',
            render: (record) => {
                return (
                    <div className="flex items-center justify-center space-x-3">
                        <EditOutlined
                            onClick={() => {
                                setIsInfoOpen(true), setSelectedPc(record);
                            }}
                            className="text-blue-700"
                        />
                        <Popconfirm
                            placement="bottom"
                            title="確認"
                            description="削除してもよろしいですか？"
                            okText="削除"
                            cancelText="キャンセル"
                            onConfirm={() => handleOk(record.id)}
                        >
                            <DeleteOutlined className="text-red-500" />
                        </Popconfirm>
                    </div>
                );
            },
            width: 50,
        },
        {
            title: '',
            render: (record) => {
                const isDisable = record.returnStatus === '済み';
                return (
                    <>
                        <Popconfirm
                            placement="leftTop"
                            title="確認"
                            okText="送信"
                            cancelText="キャンセル"
                            description={`${record.pc_num} が返却されたことに間違いありませんか？`}
                            onConfirm={() => handleReturn(record.id)}
                            disabled={isDisable}
                        >
                            <Button type="primary" size="small" disabled={isDisable}>
                                返却
                            </Button>
                        </Popconfirm>
                    </>
                );
            },
            width: 50,
        },
    ];

    return (
        <>
            <TitleCus title={'パソコン一覧'} />
            <div className="p-10">
                <span className="mb-3 flex justify-end">
                    <span className="space-x-1">
                        <Button type="primary" onClick={() => setOpenAddPc(true)}>
                            <PlusOutlined />
                            新規登録
                        </Button>
                    </span>
                </span>
                <Table
                    columns={columns}
                    dataSource={dataPc}
                    rowKey="id"
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    size="small"
                />
                <AddPc setOpenAddPc={setOpenAddPc} openAddPc={openAddPc} fetchData={fetchData} />
                <UpdatePc
                    setIsInfoOpen={setIsInfoOpen}
                    isInfoOpen={isInfoOpen}
                    selectedPc={selectedPc}
                    setLoading={setLoading}
                    fetchData={fetchData}
                />
                <ViewPc setOpenViewModal={setOpenViewModal} openViewModal={openViewModal} selectedView={selectedView} />
            </div>
        </>
    );
};

export default PcManagement;
