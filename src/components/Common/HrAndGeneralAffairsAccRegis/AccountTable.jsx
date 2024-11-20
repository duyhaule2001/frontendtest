import React, { useEffect, useState } from 'react';
import TitleCus from '../Layout/TitleCus.jsx';
import SearchInputCus from '../Layout/Input/SearchInputCus.jsx';
import { Button, Popconfirm, Table, notification } from 'antd';
import { deleteAccount, getAccountList, searchAccountName } from '../../../services/generalAffairs.service.js';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { suggestionAccountName } from '../../../services/common.service.js';
import CreateForm from './CreateForm.jsx';
import UpdateAccGad from './UpdateAcc.jsx';
import ImageCus from '../Layout/ImageCus.jsx';

const permissionsMapping = {
    20: '先生',
    0: '役員',
    50: '副社長',
    2: '人事部',
    3: '総務部',
    1: 'BP推進部',
    10: 'DX事業部',
    4: '営業部(Sap)',
    5: '営業部(Open)',
    6: '正社員',
    7: '契約社員',
    8: 'ビジネスパートナー',
    9: '個人事業主',
};

const AccountTable = () => {
    const [listAccount, setListAccount] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [openModalCreate, setOpenModalCreate] = useState(false);

    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [selectedItemUpdate, setSelectedItemUpdate] = useState(null);
    const [optionsName, setOptionsName] = useState([]);

    useEffect(() => {
        fetchAccount();
    }, []);

    const fetchAccount = async () => {
        setIsLoading(true);
        try {
            const res = await getAccountList();
            if (res.data) {
                const sortedData = res.data.sort((a, b) => {
                    return a.enrollment_flg === b.enrollment_flg ? 0 : a.enrollment_flg ? 1 : -1;
                });
                setListAccount(sortedData);
            } else {
                setListAccount([]);
            }
        } catch (error) {
            console.log(error);
            setListAccount([]);
        }
        setIsLoading(false);
    };

    const handleDeleteAcc = async (id) => {
        try {
            const res = await deleteAccount(id);
            if (res.data) {
                fetchAccount();
                notification.success({
                    message: '削除が成功しました。',
                    style: {
                        width: 270,
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onSearch = async (searchText) => {
        if (!searchText) {
            setOptionsName([]);
            return;
        }
        const res = await suggestionAccountName(searchText);
        if (res.data) {
            setOptionsName(
                res.data.map((item) => ({
                    value: item.name,
                })),
            );
        } else {
            console.log('データが取得できません。');
            setOptionsName([]);
        }
    };

    const handleSearchName = async (name) => {
        const res = await searchAccountName(name);
        if (res.data) {
            setListAccount(res.data);
        } else {
            setListAccount([]);
        }
    };

    const resetSearch = async () => {
        setOptionsName([]);
        await fetchAccount();
    };

    const columns = [
        {
            title: <span className="flex items-center justify-center">氏名</span>,
            dataIndex: 'name',
        },
        {
            title: <span className="flex items-center justify-center">メールアドレス</span>,
            dataIndex: 'mail',
        },
        {
            title: <span className="align-middle">権限</span>,
            dataIndex: 'permissions',
            align: 'center',
            render: (permissions) => permissionsMapping[permissions] || permissions,
        },
        {
            title: <span className="align-middle">入社日</span>,
            dataIndex: 'date',
            align: 'center',
        },
        {
            title: <span className="align-middle">部門</span>,
            dataIndex: 'department',
            align: 'center',
        },
        {
            title: <span className="align-middle">役割</span>,
            dataIndex: 'role',
            align: 'center',
        },
        {
            title: <span className="align-middle">性別</span>,
            dataIndex: 'gender',
            render: (text) => (text === true ? '男' : text === false ? '女' : 'その他'),
            align: 'center',
        },
        {
            title: <span className="align-middle">写真</span>,
            dataIndex: 'img_path',
            align: 'center',
            render: (img_path) => <ImageCus img_path={img_path} borderRadius={'50%'} />,
        },
        {
            title: <span className="align-middle"></span>,
            render: (record) => {
                const isDisabled = record.enrollment_flg;

                return (
                    <div className="flex items-center justify-center space-x-3">
                        <EditOutlined
                            className={`text-blue-500 ${isDisabled ? 'cursor-not-allowed text-gray-300' : ''}`}
                            onClick={() => {
                                if (!isDisabled) {
                                    setOpenModalUpdate(true);
                                    setSelectedItemUpdate(record);
                                }
                            }}
                            style={isDisabled ? { pointerEvents: 'none' } : {}}
                        />
                        <Popconfirm
                            placement="bottom"
                            title="確認"
                            okText="削除"
                            cancelText="キャンセル"
                            description={`${record.name}を削除してもよろしいですか？`}
                            onConfirm={() => handleDeleteAcc(record.id)}
                            disabled={isDisabled}
                        >
                            <DeleteOutlined
                                className={`text-red-500 ${isDisabled ? 'cursor-not-allowed text-gray-300' : ''}`}
                            />
                        </Popconfirm>
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            <TitleCus title={'アカウント作成'} />
            <div className="mt-9 px-32">
                <div className="flex flex-col justify-center">
                    <div className="-mb-3 flex justify-between">
                        <SearchInputCus
                            label={'氏名'}
                            onSearch={onSearch}
                            options={optionsName}
                            handleSearch={handleSearchName}
                        />
                        <div className="space-x-1">
                            <Button type="primary" onClick={() => setOpenModalCreate(true)}>
                                <PlusOutlined />
                                新規登録
                            </Button>
                            <Button type="primary" onClick={resetSearch}>
                                <ReloadOutlined />
                            </Button>
                        </div>
                    </div>
                    <Table
                        rowKey={'id'}
                        dataSource={listAccount}
                        columns={columns}
                        loading={isLoading}
                        size="small"
                        rowClassName={(record) => (record.enrollment_flg ? 'opacity-50 pointer-events-none' : '')}
                    />
                    <CreateForm
                        openModalCreate={openModalCreate}
                        setOpenModalCreate={setOpenModalCreate}
                        fetchAccount={fetchAccount}
                    />
                    <UpdateAccGad
                        openModalUpdate={openModalUpdate}
                        setOpenModalUpdate={setOpenModalUpdate}
                        selectedItemUpdate={selectedItemUpdate}
                        fetchAccount={fetchAccount}
                    />
                </div>
            </div>
        </div>
    );
};

export default AccountTable;
