import { useEffect, useState } from 'react';
import { Table, Button, notification, Popconfirm } from 'antd';
import { ArrowDownOutlined, DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import {
    deleteUserManager,
    deleteUserTech,
    getManagerPaiLeaveAPI,
    getTechPaiLeaveAPI,
    searchManagerUserAPI,
    searchTechUserAPI,
    suggestionManagerUserAPI,
    suggestionTechUserAPI,
} from '../../../services/hr.service.js';
import PaidLeaveDetailManager from './Manager/PaidLeaveDetailManager.jsx';
import PaidLeaveDetailTech from './Tech/PaidLeaveDetailTech.jsx';
import CreateUserTech from './Tech/CreateUserTech.jsx';
import UpdateUserManager from './Manager/UpdateUserManager.jsx';
import CreateUserManager from './Manager/CreateUserManager.jsx';
import TitleCus from '../../Common/Layout/TitleCus.jsx';
import SearchInputCus from '../../Common/Layout/Input/SearchInputCus.jsx';
import UpdateUserTech from './Tech/UpdateUserTech.jsx';

const UserList = () => {
    const [managerData, setManagerData] = useState([]);
    const [techData, setTechData] = useState([]);

    const [selectedJobType, setSelectedJobType] = useState('manager');

    const [openManagerView, setOpenManagerView] = useState(false);
    const [openTechView, setOpenTechView] = useState(false);

    const [selectedManager, setSelectedManager] = useState();
    const [selectedTech, setSelectedTech] = useState();

    const [loading, setLoading] = useState(false);

    const [openCreateUserManager, setOpenCreateUserManager] = useState(false);
    const [openCreateUserTech, setOpenCreateUserTech] = useState(false);

    const [openUpdateManager, setOpenUpdateManager] = useState(null);
    const [updateManager, setUpdateManager] = useState();

    const [openUpdateTech, setOpenUpdateTech] = useState(null);
    const [updateTech, setUpdateTech] = useState();

    const [optionsTech, setOptionsTech] = useState([]);
    const [optionsManage, setOptionsManage] = useState([]);

    useEffect(() => {
        fetchPaidLeaveManagement();
    }, [selectedJobType]);

    const fetchPaidLeaveManagement = async () => {
        setLoading(true);
        if (selectedJobType === 'manager') {
            try {
                const res = await getManagerPaiLeaveAPI();
                if (res.data) {
                    setManagerData(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        } else if (selectedJobType === 'engineer') {
            try {
                const res = await getTechPaiLeaveAPI();
                if (res.data) {
                    setTechData(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        setLoading(false);
    };

    const handleSearchManager = async (name) => {
        setLoading(true);
        try {
            const res = await searchManagerUserAPI(name);
            if (res.data) {
                setManagerData(res.data);
            } else {
                setManagerData([]);
            }
        } catch (error) {
            console.log(error);
            setManagerData([]);
        }
        setLoading(false);
    };

    const handleSearchTech = async (name) => {
        setLoading(true);
        try {
            const res = await searchTechUserAPI(name);
            if (res.data) {
                setTechData(res.data);
            } else {
                setTechData([]);
            }
        } catch (error) {
            console.log(error);
            setTechData([]);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        setLoading(true);
        if (selectedJobType === 'manager') {
            try {
                const res = await deleteUserManager(id);
                if (res.data) {
                    const updateUserManager = managerData.filter((item) => item.id !== id);
                    notification.success({
                        message: '削除が成功しました。',
                        style: {
                            width: 270,
                        },
                    });
                    setManagerData(updateUserManager);
                } else {
                    notification.error({
                        message: '削除が失敗しました。',
                    });
                }
            } catch (error) {
                console.log(error);
            }
        } else if (selectedJobType === 'engineer') {
            try {
                const res = await deleteUserTech(id);
                if (res.data) {
                    const updateUserTech = techData.filter((item) => item.id !== id);
                    notification.success({
                        message: '削除が成功しました。',
                        style: {
                            width: 270,
                        },
                    });
                    setTechData(updateUserTech);
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
        }
        setLoading(false);
    };

    const handleExportExcel = () => {
        const dataToExport = selectedJobType === 'manager' ? managerData : techData;

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `${selectedJobType === 'manager' ? '管理者有給休暇管理' : '技術者有給休暇管理'}.xlsx`);
    };

    const onManagerSearch = async (searchText) => {
        if (!searchText) {
            setOptionsManage([]);
            return;
        }
        try {
            const res = await suggestionManagerUserAPI(searchText);
            if (res.data) {
                setOptionsManage(
                    res.data.map((item) => ({
                        value: item.name,
                    })),
                );
            } else {
                setOptionsManage([]);
            }
        } catch (error) {
            console.log(error);
            setOptionsManage([]);
        }
    };

    const onTechSearch = async (searchText) => {
        if (!searchText) {
            setOptionsTech([]);
            return;
        }
        try {
            const res = await suggestionTechUserAPI(searchText);
            if (res.data) {
                setOptionsTech(
                    res.data.map((item) => ({
                        value: item.name,
                    })),
                );
            } else {
                setOptionsTech([]);
            }
        } catch (error) {
            console.log(error);
            setOptionsTech([]);
        }
    };

    const columns = [
        {
            title: '氏名',
            align: 'center',
            width: 100,
            render: (record) => {
                return (
                    <span
                        onClick={() => {
                            if (selectedJobType === 'manager') {
                                setOpenManagerView(true);
                                setSelectedManager(record);
                            } else {
                                setOpenTechView(true);
                                setSelectedTech(record);
                            }
                        }}
                        className="text-blue-700 hover:cursor-pointer"
                    >
                        {record.name}
                    </span>
                );
            },
        },
        {
            title: '社員番号',
            dataIndex: 'employeeNumber',
            align: 'center',
            width: 85,
        },
        {
            title: '入社日',
            dataIndex: 'joiningDate',
            align: 'center',
            width: 120,
        },
        {
            title: '前年度付予日',
            dataIndex: 'previousYearGrantDate',
            align: 'center',
            width: 120,
        },
        {
            title: (
                <span>
                    前年度
                    <br />
                    付予
                </span>
            ),
            align: 'center',
            dataIndex: 'previousYearDays',
            width: 100,
        },
        {
            title: (
                <span>
                    前年度付予
                    <br />
                    有効期間
                </span>
            ),
            align: 'center',
            dataIndex: 'previousYearExpiryDate',
            width: 120,
        },
        {
            title: (
                <span>
                    前年度
                    <br />
                    残り日
                </span>
            ),
            width: 80,
            align: 'center',
            dataIndex: 'previousYearRemainingDays',
            render: (text) => <span style={{ color: 'red', fontWeight: 'bold' }}>{text}</span>,
        },
        {
            title: '付予日',
            align: 'center',
            dataIndex: 'currentYearGrantDate',
            width: 120,
        },
        {
            title: '年度付予',
            width: 90,
            align: 'center',
            dataIndex: 'currentYearDays',
        },
        {
            title: '有効期間',
            align: 'center',
            dataIndex: 'currentYearExpiryDate',
            width: 120,
        },
        {
            title: '残り日',
            align: 'center',
            width: 80,
            dataIndex: 'remainingDays',
            render: (text) => <span style={{ color: 'red', fontWeight: 'bold' }}>{text}</span>,
        },
        {
            title: (
                <span>
                    合計
                    <br />
                    残り日
                </span>
            ),
            align: 'center',
            width: 110,
            dataIndex: 'totalRemainingDays',
            render: (text) => <span style={{ color: 'green', fontWeight: 'bold' }}>{text}</span>,
        },
        {
            title: '割合',
            align: 'center',
            width: 60,
            dataIndex: 'proportional',
        },
        {
            title: '',
            align: 'center',
            render: (record) => {
                return (
                    <div className="flex space-x-3">
                        <EditOutlined
                            onClick={() => {
                                if (selectedJobType === 'manager') {
                                    setUpdateManager(record);
                                    setOpenUpdateManager(true);
                                } else {
                                    setUpdateTech(record);
                                    setOpenUpdateTech(true);
                                }
                            }}
                            className="text-blue-700"
                        />
                        <Popconfirm
                            title="確認"
                            placement="bottomRight"
                            description={` ${record.name}を削除してもよろしいですか？`}
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
        <>
            <TitleCus title={'有給休暇一覧'} />
            <div className="p-5">
                <div className="space-x-2">
                    <span className="text-[0.88rem]">職種区別: </span>
                    <span>
                        <Button
                            type={selectedJobType === 'manager' ? 'primary' : 'default'}
                            onClick={() => setSelectedJobType('manager')}
                        >
                            管理職
                        </Button>
                    </span>
                    <span>
                        <Button
                            type={selectedJobType === 'engineer' ? 'primary' : 'default'}
                            onClick={() => setSelectedJobType('engineer')}
                        >
                            技術者
                        </Button>
                    </span>
                </div>
                {selectedJobType && (
                    <>
                        <div className="-mb-2 mt-5 flex justify-between">
                            <div>
                                {selectedJobType === 'manager' ? (
                                    <SearchInputCus
                                        label="社員検索"
                                        placeholder="お名前を入力してください"
                                        handleSearch={handleSearchManager}
                                        onSearch={onManagerSearch}
                                        options={optionsManage}
                                    />
                                ) : (
                                    <SearchInputCus
                                        label="社員検索"
                                        placeholder="お名前を入力してください"
                                        handleSearch={handleSearchTech}
                                        onSearch={onTechSearch}
                                        options={optionsTech}
                                    />
                                )}
                            </div>
                            <div className="space-x-2">
                                <Button
                                    onClick={() => {
                                        if (selectedJobType === 'manager') {
                                            setOpenCreateUserManager(true);
                                        } else {
                                            setOpenCreateUserTech(true);
                                        }
                                    }}
                                    type="primary"
                                >
                                    <PlusOutlined />
                                    新規登録
                                </Button>
                                <Button onClick={handleExportExcel} type="primary">
                                    <ArrowDownOutlined />
                                    ダウンロード
                                </Button>
                                <Button onClick={() => fetchPaidLeaveManagement()} type="primary">
                                    <ReloadOutlined />
                                </Button>
                            </div>
                        </div>
                        <Table
                            className="border"
                            rowKey="employeeNumber"
                            locale={{
                                emptyText: 'データがありません。',
                            }}
                            columns={columns}
                            loading={loading}
                            dataSource={selectedJobType === 'manager' ? managerData : techData}
                        />
                    </>
                )}
                <PaidLeaveDetailManager
                    setOpenManagerView={setOpenManagerView}
                    openManagerView={openManagerView}
                    selectedManager={selectedManager}
                    setSelectedManager={setSelectedManager}
                    fetchPaidLeaveManagement={fetchPaidLeaveManagement}
                />
                <PaidLeaveDetailTech
                    setSelectedTech={setSelectedTech}
                    selectedTech={selectedTech}
                    setOpenTechView={setOpenTechView}
                    openTechView={openTechView}
                    fetchPaidLeaveManagement={fetchPaidLeaveManagement}
                />
                <CreateUserManager
                    setOpenCreateUserManager={setOpenCreateUserManager}
                    openCreateUserManager={openCreateUserManager}
                    fetchPaidLeaveManagement={fetchPaidLeaveManagement}
                />
                <CreateUserTech
                    setOpenCreateUserTech={setOpenCreateUserTech}
                    openCreateUserTech={openCreateUserTech}
                    fetchPaidLeaveManagement={fetchPaidLeaveManagement}
                />
                <UpdateUserManager
                    updateManager={updateManager}
                    fetchPaidLeaveManagement={fetchPaidLeaveManagement}
                    setOpenUpdateManager={setOpenUpdateManager}
                    openUpdateManager={openUpdateManager}
                />
                <UpdateUserTech
                    updateTech={updateTech}
                    fetchPaidLeaveManagement={fetchPaidLeaveManagement}
                    setOpenUpdateTech={setOpenUpdateTech}
                    openUpdateTech={openUpdateTech}
                />
            </div>
        </>
    );
};

export default UserList;
